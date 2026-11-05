(function () {
  'use strict';
  const get = id => document.getElementById(id);
  const input = get('label-photo'), choose = get('take-photo'), read = get('read-photo-region');
  const view = get('photo-crop'), preview = get('photo-region-preview');
  const status = get('photo-status'), output = get('photo-text');
  let image, selection, origin, busy = false;
  const controls = ['x','y','w','h'].map(key => get('crop-' + key));
  function cropCanvas(enhance) {
    const c = document.createElement('canvas'), s = selection;
    const scale = Math.min(4, 2000 / s.w);
    c.width = Math.max(1, Math.round(s.w * scale)); c.height = Math.max(1, Math.round(s.h * scale));
    const ctx = c.getContext('2d', {willReadFrequently:true});
    ctx.fillStyle = '#fff'; ctx.fillRect(0,0,c.width,c.height);
    ctx.drawImage(image,s.x,s.y,s.w,s.h,0,0,c.width,c.height);
    if (enhance) {
      const pixels = ctx.getImageData(0,0,c.width,c.height), d = pixels.data;
      const histogram = new Uint32Array(256);
      for (let i=0;i<d.length;i+=4) histogram[Math.round(.299*d[i]+.587*d[i+1]+.114*d[i+2])]++;
      const total=c.width*c.height; let count=0,low=0,high=255;
      for(let k=0;k<256;k++){count+=histogram[k];if(count>=total*.02){low=k;break;}}
      count=0;for(let k=255;k>=0;k--){count+=histogram[k];if(count>=total*.02){high=k;break;}}
      for(let i=0;i<d.length;i+=4){const lum=.299*d[i]+.587*d[i+1]+.114*d[i+2];const v=Math.max(0,Math.min(255,(lum-low)*255/Math.max(30,high-low)));d[i]=d[i+1]=d[i+2]=v;}
      ctx.putImageData(pixels,0,0);
    }
    return c;
  }
  function paint() {
    const ctx=view.getContext('2d');ctx.drawImage(image,0,0,view.width,view.height);
    const sx=view.width/image.naturalWidth,sy=view.height/image.naturalHeight,s=selection;
    ctx.strokeStyle='#0066cc';ctx.lineWidth=3;ctx.strokeRect(s.x*sx,s.y*sy,s.w*sx,s.h*sy);
    const cropped=cropCanvas(false);preview.width=cropped.width;preview.height=cropped.height;preview.getContext('2d').drawImage(cropped,0,0);
    read.disabled=busy||s.w<20||s.h<8;
  }
  function point(event){const r=view.getBoundingClientRect();return {x:Math.max(0,Math.min(image.naturalWidth,(event.clientX-r.left)/r.width*image.naturalWidth)),y:Math.max(0,Math.min(image.naturalHeight,(event.clientY-r.top)/r.height*image.naturalHeight))};}
  view.onpointerdown=e=>{if(!image||busy)return;origin=point(e);view.setPointerCapture(e.pointerId);};
  view.onpointermove=e=>{if(!origin)return;const p=point(e);selection={x:Math.min(origin.x,p.x),y:Math.min(origin.y,p.y),w:Math.max(1,Math.abs(origin.x-p.x)),h:Math.max(1,Math.abs(origin.y-p.y))};paint();};
  view.onpointerup=view.onpointercancel=()=>{if(!origin)return;origin=null;status.textContent='Kiểm tra vùng phóng to bên dưới, rồi bấm Đọc vùng tem đã khoanh.';controls.forEach((el,i)=>el.value=100*selection[['x','y','w','h'][i]]/(i%2?image.naturalHeight:image.naturalWidth));};
  controls.forEach(el=>el.oninput=()=>{if(!image||busy)return;const v=controls.map(el=>Number(el.value)/100);selection={x:v[0]*image.naturalWidth,y:v[1]*image.naturalHeight,w:Math.min(v[2],1-v[0])*image.naturalWidth,h:Math.min(v[3],1-v[1])*image.naturalHeight};paint();});
  choose.onclick=()=>{if(!busy){input.value='';input.click();}};
  input.onchange=async()=>{
    if(!input.files[0]||busy)return;
    get('photo-result').hidden=false;status.textContent='Đang mở ảnh…';output.textContent='';read.disabled=true;
    try{
      if(window.TTVinaScanner)await window.TTVinaScanner.stop();
      const url=await new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(r.result);r.onerror=()=>reject(new Error('Không mở được ảnh.'));r.readAsDataURL(input.files[0]);});
      image=new Image();await new Promise((resolve,reject)=>{image.onload=resolve;image.onerror=()=>reject(new Error('Chụp lại ảnh JPEG rõ tem.'));image.src=url;});
      view.width=Math.min(700,image.naturalWidth);view.height=Math.round(view.width*image.naturalHeight/image.naturalWidth);
      selection={x:image.naturalWidth*.1,y:image.naturalHeight*.4,w:image.naturalWidth*.8,h:image.naturalHeight*.2};paint();
      status.textContent='Khoanh sát dòng mã trên tem. Bỏ bàn phím, tay và mặt bàn khỏi vùng chọn.';
    }catch(e){status.textContent=e.message;}
  };
  read.onclick=async()=>{
    if(busy||!image||read.disabled)return;
    busy=true;read.disabled=true;choose.disabled=true;controls.forEach(el=>el.disabled=true);output.textContent='';
    let worker,expired=false,timer;
    try{
      const work=async()=>{
        status.textContent='Đang tải bộ đọc…';
        worker=await Tesseract.createWorker('eng',1,{workerPath:'/office/san-xuat/test/vendor/ocr/worker.min.js',corePath:'/office/san-xuat/test/vendor/ocr/',langPath:'/office/san-xuat/test/vendor/ocr/',workerBlobURL:false,gzip:true,logger:info=>{if(!expired&&info.status)status.textContent='Đang đọc vùng tem: '+info.status+(typeof info.progress==='number'?' '+Math.round(info.progress*100)+'%':'');}});
        if(expired){await worker.terminate();return;}
        await worker.setParameters({tessedit_pageseg_mode:'7'});
        const a=await worker.recognize(cropCanvas(false));
        if(expired)return;
        const b=await worker.recognize(cropCanvas(true));
        if(expired)return;
        const candidates=[a.data,b.data].filter(r=>r.text.trim()).sort((a,b)=>b.confidence-a.confidence);
        const raw=Array.from(new Set(candidates.map(r=>r.text.trim())));
        const suggestions=raw.map(s=>s.replace(/@/g,'Ø').replace(/([xX])[0O](?=\d)/g,'$1Ø')).filter((s,i)=>s!==raw[i]);
        output.textContent=raw.join('\nPhương án OCR khác: ')+(suggestions.length?'\nGợi ý ký hiệu Ø (anh cần đối chiếu): '+Array.from(new Set(suggestions)).join(' / '):'');
        status.textContent=candidates.length?'Kết quả OCR cần đối chiếu. Không tự sửa U/0, 1/I hay số thứ tự. Nếu chữ sai, khoanh sát hơn hoặc chụp nét hơn.':'Chưa đọc được chữ trong vùng chọn. Khoanh lại sát dòng tem và thử lại.';
      };
      await Promise.race([work(),new Promise((_,reject)=>{timer=setTimeout(()=>{expired=true;reject(new Error('Đọc quá lâu. Kiểm tra mạng và thử lại.'));},90000);})]);
    }catch(e){status.textContent=e.message||'Chưa đọc được ảnh.';}
    finally{clearTimeout(timer);expired=true;if(worker)await worker.terminate().catch(()=>{});busy=false;choose.disabled=false;controls.forEach(el=>el.disabled=false);paint();}
  };
}());
