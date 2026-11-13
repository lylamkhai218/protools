(() => {
  let state, scan = null, before = 0, wipBefore = 0;
  const pending = new Map();
  const notice = (message, error = false) => { const n = document.getElementById('notice'); n.textContent = message; n.className = error ? 'error' : 'success'; };
  window.addEventListener('production-scan-error',event=>notice(event.detail,true));
  const requestKey = () => Array.from(crypto.getRandomValues(new Uint8Array(24)), b => b.toString(16).padStart(2, '0')).join('');
  async function api(action, payload, parameters = {}) {
    const fingerprint = action + JSON.stringify(payload);
    let key = pending.get(fingerprint);
    if (!key) { key = requestKey(); pending.set(fingerprint, key); }
    const response = await fetch(`/office/api.php?${new URLSearchParams({action,...parameters})}`, payload === undefined ? {} : { method: 'POST', headers: { 'Content-Type': 'application/json', 'Idempotency-Key': key }, body: JSON.stringify(payload) });
    const result = await response.json();
    if (response.status === 401) { await TTVinaScanner.stop(); location.assign('/office/'); throw new Error('Phiên đã hết hạn. Đăng nhập lại.'); }
    if (!result.ok) { if(response.status < 500) pending.delete(fingerprint); throw new Error(result.error || 'Không thực hiện được yêu cầu.'); }
    pending.delete(fingerprint); return result;
  }
  const cell = (row, text, cls = '') => { const el = document.createElement('td'); el.textContent = text ?? '—'; el.className = cls; row.append(el); return el; };
  const option = (value, text) => { const o = document.createElement('option'); o.value=value; o.textContent=text; return o; };
  const locationLabel = value => ({WAREHOUSE:'Trong kho',CNC_SHOP:'Đang sử dụng',INSPECTION:'Chờ kiểm định',SCRAP_BIN:'Phế liệu',NEW:'Mới',USED_1X:'Me còn bén',OLD:'Dao cũ',SCRAPPED:'Đã hủy',ADVANCED_TO_FLOOR:'Đang thi công',RETURNED_REMNANT:'Cuộn lẻ trong kho',FULLY_CONSUMED:'Đã quyết toán'}[value]||value);
  function printLabel(code,description,remnant=false) {
    if(!window.qrcode){notice('Bộ tạo QR chưa sẵn sàng.',true);return;}
    const qr=qrcode(0,'M');qr.addData(remnant?new URL(`/office/san-xuat?remnant=${encodeURIComponent(code)}`,location.origin).href:code);qr.make();
    const host=document.getElementById('qr-content');host.replaceChildren();
    const image=document.createElement('div');image.innerHTML=qr.createSvgTag(4,8);host.append(image);
    const title=document.createElement('p');title.className='mono';title.textContent=code;host.append(title);
    const detail=document.createElement('p');detail.textContent=description;host.append(detail);
    document.getElementById('qr-dialog').showModal();
  }
  async function chooseRemnant(code) {
    const result=await api('production_remnant_resolve',undefined,{code});const r=result.remnant;
    const form=document.getElementById('wip-form');
    if(!Array.from(form.elements.stock_item_id.options).some(o=>o.value===String(r.stock_item_id)))form.elements.stock_item_id.append(option(r.stock_item_id,`${r.remnant_qr_code} / ${r.rack_location}`));
    form.elements.stock_item_id.value=r.stock_item_id;form.elements.parent_wip_id.value=r.id;
    document.getElementById('remnant-hint').textContent=`Đã tra cứu ${r.remnant_qr_code}: còn ${r.available_length_meters} m. Chưa cấp vật tư.`;
  }
  function actionButton(cell, text, action, payload, fields = []) {
    const b = document.createElement('button'); b.type='button'; b.textContent=text;
    b.onclick = () => openAction(text, action, payload, fields, b); cell.append(b);
  }
  function openAction(title, action, payload, fields, opener) {
    const dialog = document.getElementById('action-dialog');
    document.getElementById('action-title').textContent = title;
    const host = document.getElementById('action-fields'); host.replaceChildren();
    fields.forEach(f => {
      const label = document.createElement('label'); label.textContent=f.label;
      const input=document.createElement(f.options?'select':'input'); input.name=f.name; input.required=true;
      if(f.options) f.options.forEach(([v,t])=>input.append(option(v,t)));
      else {input.type=f.type||'text';if(f.type==='number'){input.min='0';input.step='.01';}}
      label.append(input);host.append(label);
    });
    const form=document.getElementById('action-form');
    form.onsubmit=async event=>{
      event.preventDefault();const button=form.querySelector('button');button.disabled=true;
      try { const result=await api(action,{...payload,...Object.fromEntries(new FormData(form))});dialog.close();notice(result.message||'Đã ghi nhận.');await load(); }
      catch(error){notice(error.message,true);} finally{button.disabled=false;}
    };
    dialog.onclose=()=>opener?.focus();dialog.showModal();host.querySelector('input,select')?.focus();
  }
  async function load() {
    state = await api('production_workbench',undefined,{before,wip_before:wipBefore});
    const warehouse=['ADMIN','WAREHOUSE'].includes(state.role), inspector=['ADMIN','INSPECTOR'].includes(state.role);
    document.getElementById('issue-section').hidden=!(warehouse||state.role==='CNC');
    document.getElementById('holder-label').hidden=!warehouse;
    document.getElementById('manual-entry').hidden=!warehouse;
    document.getElementById('wip-issue-section').hidden=!warehouse;
    document.getElementById('receive-selected').hidden=!warehouse;
    document.getElementById('catalog-section').hidden=!warehouse;
    document.getElementById('add-tool').hidden=state.role!=='ADMIN';
    const holder=document.querySelector('[name=holder_user_id]'), engineer=document.querySelector('[name=engineer_user_id]');
    const oldHolder=holder.value, oldEngineer=engineer.value;
    holder.replaceChildren(option('','Chọn nhân sự'));engineer.replaceChildren(option('','Chọn kỹ sư'));
    state.people.forEach(p=>{const name=`${p.full_name}${p.employee_code?' / '+p.employee_code:''}`;holder.append(option(p.id,name));engineer.append(option(p.id,name));});
    holder.value=oldHolder;engineer.value=oldEngineer;
    const stock=document.querySelector('[name=stock_item_id]');const oldStock=stock.value;stock.replaceChildren(option('','Chọn tồn theo vị trí'));
    state.stock.forEach(s=>stock.append(option(s.id,`${s.sku} / ${s.location_code} / ${s.qty_on_hand} m`)));stock.value=oldStock;
    const rows=document.getElementById('movements');rows.replaceChildren();
    state.movements.forEach(m=>{
      const row=document.createElement('tr');cell(row,m.tool_code,'mono');cell(row,`${m.drawing_code} / ${m.operator_name}`);cell(row,m.voided_at?'Đã đảo phiếu cấp nhầm':m.inspected_at?'Đã kiểm định':locationLabel(m.current_location));cell(row,m.issued_at,'mono');const actions=cell(row,'');
      if(!m.returned_at){
        if(Number(m.holder_user_id)===Number(state.user_id)&&!m.return_requested_at) actionButton(actions,'Đề nghị trả','production_return_request',{movement_id:m.id});
        if(warehouse) {
          const select=document.createElement('input');select.type='checkbox';select.value=m.id;select.name='receive-id';select.setAttribute('aria-label',`Chọn phiếu ${m.id} / ${m.tool_code}`);actions.append(select);
          actionButton(actions,'Nhận vào kiểm định','production_tool_checkin',{movement_id:m.id});
        }
      }else if(!m.inspected_at&&m.current_location==='INSPECTION'&&inspector){
        actionButton(actions,'Kiểm định','production_tool_inspect',{movement_id:m.id},[{name:'returned_status',label:'Phân loại',options:[['USED_1X','Me còn bén'],['OLD','Dao cũ'],['SCRAPPED','Phế liệu']]},{name:'flank_wear_vb_mm',label:'Độ mòn VB (mm)',type:'number'},{name:'note',label:'Ghi chú kiểm định / lý do hủy'}]);
      }
      if(warehouse&&Number(m.is_self_checkout)&&!m.reconciled_at)actionButton(actions,'Đối soát ca đêm','production_night_reconcile',{movement_id:m.id});
      if(state.role==='ADMIN'&&!m.returned_at)actionButton(actions,'Đảo phiếu cấp nhầm','production_tool_issue_reverse',{movement_id:m.id,physical_return_confirmed:true},[{name:'reason',label:'Xác nhận đã thấy đúng dao tại kho; ghi lý do đảo phiếu'}]);
      rows.append(row);
    });
    if(!state.movements.length){const row=document.createElement('tr');cell(row,'Chưa có phiếu trong phạm vi của bạn.').colSpan=5;rows.append(row);}
    const open=state.movements.filter(m=>!m.returned_at).length;
    const inspection=state.movements.filter(m=>m.returned_at&&!m.inspected_at&&m.current_location==='INSPECTION').length;
    document.getElementById('summary').textContent=`${open} phiếu đang mượn / ${inspection} phiếu chờ kiểm định trong danh sách.`;
    if(!document.getElementById('older-movements')){
      const navigation=document.createElement('div');navigation.className='actions';
      const first=document.createElement('button');first.type='button';first.textContent='Phiếu dao mới nhất';first.onclick=()=>{before=0;load().catch(e=>notice(e.message,true));};
      const older=document.createElement('button');older.id='older-movements';older.type='button';older.textContent='Phiếu dao cũ hơn';older.onclick=()=>{before=Math.min(...state.movements.map(m=>Number(m.id)));load().catch(e=>notice(e.message,true));};
      navigation.append(first,older);rows.closest('section').append(navigation);
    }
    document.getElementById('older-movements').disabled=state.movements.length<200;
    document.getElementById('older-wip').disabled=state.wip.length<200;
    const catalog=document.getElementById('tool-catalog');catalog.replaceChildren();
    if(warehouse)state.tools.forEach(t=>{const row=document.createElement('tr');cell(row,t.tool_code,'mono');cell(row,t.oem_specs||t.tool_name);cell(row,`${locationLabel(t.current_location)} / ${locationLabel(t.current_status)}`);cell(row,Number(t.self_checkout_enabled)?'Đã mở':'Đang khóa');const actions=cell(row,'');
      if(state.role==='ADMIN')actionButton(actions,Number(t.self_checkout_enabled)?'Khóa tự nhận':'Mở tự nhận','production_tool_eligibility',{tool_instance_id:t.id,enabled:Number(t.self_checkout_enabled)?0:1},[{name:'reason',label:'Lý do / xác nhận đã kiểm kê'}]);
      actionButton(actions,'Ghi cấp lại tem','production_tool_relabel',{tool_instance_id:t.id},[{name:'reason',label:'Lý do cấp lại và đối chiếu mã cán'}]);
      const print=document.createElement('button');print.type='button';print.textContent='In mã hiện có';print.onclick=()=>printLabel(t.tool_code,t.oem_specs||t.tool_name);actions.append(print);catalog.append(row);
    });
    const wip=document.getElementById('wip');wip.replaceChildren();
    state.wip.forEach(w=>{const row=document.createElement('tr');cell(row,`${w.advance_code} / ${w.project_code}`,'mono');cell(row,w.engineer_name);cell(row,w.advance_length_meters,'num');cell(row,w.available_length_meters,'num');const actions=cell(row,locationLabel(w.status));
      if(warehouse&&w.status==='ADVANCED_TO_FLOOR')actionButton(actions,'Nhận vật tư trả','production_wip_return',{wip_id:w.id},[{name:'returned_length_meters',label:'Số mét thực nhận',type:'number'},{name:'measurement_method',label:'Phương pháp đo',options:[['LASER_MARKING','Số mét trên ống'],['MANUAL_TAPE','Thước dây'],['WEIGHT_TARE','Cân trừ bì đã xác minh']]}]);
      if(warehouse&&w.remnant_qr_code){const print=document.createElement('button');print.type='button';print.textContent='In tem cuộn lẻ';print.onclick=()=>printLabel(w.remnant_qr_code,`${w.project_code} / còn ${w.available_length_meters} m / ${w.rack_location}`,true);actions.append(print);}
      if(state.role==='ENGINEER'&&w.status==='ADVANCED_TO_FLOOR')actionButton(actions,'Đề nghị hoàn trả','production_wip_return_request',{wip_id:w.id},[{name:'returned_length_meters',label:'Số mét dự kiến trả',type:'number'}]);
      const cost=document.createElement('p');cost.textContent=w.consumed_cost_vnd===null?'Chi phí: chưa đủ dữ liệu giá vốn':`Chi phí tiêu hao: ${Number(w.consumed_cost_vnd).toLocaleString('vi-VN')} đ`;actions.append(cost);
      wip.append(row);
    });
  }
  document.addEventListener('DOMContentLoaded',async()=>{
    document.getElementById('action-close').onclick=()=>document.getElementById('action-dialog').close();
    document.getElementById('qr-close').onclick=()=>document.getElementById('qr-dialog').close();
    document.getElementById('qr-print').onclick=()=>window.print();
    document.getElementById('first-wip').onclick=()=>{wipBefore=0;load().catch(e=>notice(e.message,true));};
    document.getElementById('older-wip').onclick=()=>{wipBefore=Math.min(...state.wip.map(w=>Number(w.id)));load().catch(e=>notice(e.message,true));};
    document.getElementById('scan-remnant').onclick=()=>TTVinaScanner.open(tool=>chooseRemnant(tool.tool_code),state.wip.filter(w=>w.remnant_qr_code&&Number(w.available_length_meters)>0).map(w=>({tool_code:w.remnant_qr_code}))).catch(e=>notice(e.message,true));
    document.getElementById('add-tool').onclick=event=>openAction('Thêm cá thể dao','production_tool_create',{},[{name:'tool_code',label:'Mã chung trên tem và cán'},{name:'tool_name',label:'Tên dao'},{name:'category_prefix',label:'Nhóm dao'},{name:'oem_specs',label:'Quy cách OEM'}],event.target);
    document.getElementById('receive-selected').onclick=event=>{
      const items=Array.from(document.querySelectorAll('[name=receive-id]:checked'),el=>({movement_id:Number(el.value)}));
      if(!items.length){notice('Chọn ít nhất một phiếu cần nhận.',true);return;}
      openAction(`Nhận ${items.length} phiếu vào kiểm định`,'production_tool_batch_checkin',{items},[],event.target);
    };
    document.getElementById('refresh').onclick=()=>load().then(()=>notice('Đã tải lại.')).catch(e=>notice(e.message,true));
    document.getElementById('logout').onclick=async()=>{await TTVinaScanner.stop();await fetch('/office/api.php?action=logout',{method:'POST'});location.assign('/office/');};
    document.getElementById('open-scanner').onclick=async()=>{
      const form=document.getElementById('issue-form'),drawing=form.elements.drawing_code.value.trim();
      if(!drawing){form.elements.drawing_code.focus();notice('Nhập bản vẽ trước khi quét.',true);return;}
      try{await TTVinaScanner.open(async (tool,evidence)=>{
        const result=await api('production_scan_create',{tool_code:tool.tool_code,drawing_code:drawing,evidence});
        scan={token:result.scan_token,code:tool.tool_code,drawing,expires:Date.now()+result.expires_in*1000};
        form.elements.tool_code.value=tool.tool_code;form.elements.tool_code.readOnly=true;
        form.elements.manual_reason.value='';document.getElementById('reason-label').hidden=true;
        document.getElementById('tool-detail').textContent=`${tool.tool_code} / ${tool.oem_specs||tool.tool_name}. Kiểm tra hộp trước khi xác nhận.`;
        notice('Đã đọc mã, chưa cấp dao. Kiểm tra và bấm xác nhận.');
      },state.tools);}catch(e){notice(e.message,true);}
    };
    document.getElementById('manual-entry').onclick=()=>{scan=null;const form=document.getElementById('issue-form');form.elements.tool_code.readOnly=false;document.getElementById('reason-label').hidden=false;form.elements.tool_code.focus();};
    document.getElementById('issue-form').onsubmit=async event=>{
      event.preventDefault();const form=event.target,button=document.getElementById('issue-submit');button.disabled=true;
      try{const p=Object.fromEntries(new FormData(form));
        if(scan){if(scan.code!==p.tool_code||scan.drawing!==p.drawing_code.trim()||Date.now()>=scan.expires)throw new Error('Phiên quét không còn khớp. Quét lại tem.');p.scan_token=scan.token;}
        const result=await api(state.role==='CNC'?'production_self_checkout':'production_tool_checkout',p);
        notice(result.message);scan=null;form.elements.tool_code.value='';await load();
      }catch(error){notice(error.message,true);}finally{button.disabled=false;}
    };
    document.getElementById('wip-form').onsubmit=async event=>{event.preventDefault();const form=event.target,button=form.querySelector('button');button.disabled=true;try{await api('production_wip_advance',Object.fromEntries(new FormData(form)));notice('Đã ghi nhận cấp vật tư.');await load();}catch(e){notice(e.message,true);}finally{button.disabled=false;}};
    document.getElementById('wip-form').addEventListener('input',event=>{
      if(!state||!['stock_item_id','advance_length_meters'].includes(event.target.name))return;
      const f=event.currentTarget,len=Number(f.elements.advance_length_meters.value),source=Number(f.elements.stock_item_id.value);
      const fit=state.wip.filter(w=>Number(w.stock_item_id)===source&&w.status==='RETURNED_REMNANT'&&Number(w.available_length_meters)>=len&&len>0).sort((a,b)=>Number(a.available_length_meters)-Number(b.available_length_meters)||Number(a.id)-Number(b.id))[0];
      f.elements.parent_wip_id.value=fit?fit.id:'';
      document.getElementById('remnant-hint').textContent=fit?`Gợi ý phiếu ${fit.id}: ${fit.available_length_meters} m, ${fit.remnant_qr_code}. Kiểm tra cuộn thực tế trước khi cấp.`:'Không có cuộn lẻ đủ dài trong danh sách đã tải.';
    });
    document.getElementById('password-form').onsubmit=async event=>{event.preventDefault();try{await api('production_change_password',Object.fromEntries(new FormData(event.target)));location.assign('/office/');}catch(e){notice(e.message,true);}};
    if(document.body.dataset.passwordChange==='1'){document.getElementById('password-section').hidden=false;notice('Đổi mật khẩu ban đầu để tiếp tục.');return;}
    try{await load();notice('Dữ liệu đã tải. Kiểm tra mã trước khi xác nhận.');const remnant=new URLSearchParams(location.search).get('remnant');if(remnant)await chooseRemnant(remnant);}catch(e){notice(e.message,true);}
  });
})();
