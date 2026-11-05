(function () {
  'use strict';
  const $ = id => document.getElementById(id);
  const video = $('scan-video'), dialog = $('scanner-dialog'), pageStatus = $('barcode-status');
  let stream, timer, session=0, running=false, readerPromise, last='', hits=0, busy=false;
  function reader() {
    if (!readerPromise) readerPromise = import('/office/san-xuat/test/vendor/barcode-v2/reader.js').then(async mod => {
      const response = await fetch('/office/san-xuat/test/vendor/barcode-v2/zxing_reader.wasm');
      if (!response.ok) throw new Error('Không tải được bộ đọc barcode.');
      await mod.prepareZXingModule({overrides:{wasmBinary:new Uint8Array(await response.arrayBuffer())},fireImmediately:true});
      return mod;
    }).catch(error => { readerPromise=null; throw error; });
    return readerPromise;
  }
  function stop() {
    session++; running=false; clearTimeout(timer);
    if(stream) stream.getTracks().forEach(track=>track.stop());
    stream=null;video.srcObject=null;busy=false;
    $('scan-use-current').hidden=false;
    if(dialog.open)dialog.close();
  }
  function show(code) {
    stop(); window.lastScanWasBarcode=true;
    pageStatus.textContent='Đã đọc barcode. Đối chiếu mã với tem và cán dao trước khi xác nhận.';
    window.dispatchEvent(new CustomEvent('barcode-candidate',{detail:{code:code}}));
  }
  async function decode(canvas) {
    const mod=await reader(),ctx=canvas.getContext('2d',{willReadFrequently:true});
    return mod.readBarcodes(ctx.getImageData(0,0,canvas.width,canvas.height),{formats:['Code128','QRCode','EAN13','EAN8','Code39'],tryHarder:true,maxNumberOfSymbols:4});
  }
  $('open-barcode').addEventListener('click', async () => {
    if(running)return;
    if(window.TTVinaScanner) await window.TTVinaScanner.stop();
    stop();const current=++session;window.lastScanWasBarcode=true;running=true;last='';hits=0;
    $('scan-confirm').hidden=true;$('scan-result').hidden=true;
    $('scanner-title').textContent='Quét barcode hoặc QR';
    $('scanner-description').textContent='Đưa một mã vạch hoặc QR vào giữa khung, giữ yên và tránh lóa.';
    $('scan-use-current').hidden=true;$('scan-resume').hidden=true;
    $('camera-waiting').hidden=false;$('scan-status').textContent='Đang mở camera và bộ đọc barcode…';dialog.showModal();
    try {
      if(!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia)throw new Error('Hãy mở trang HTTPS bằng Safari và cho phép Camera.');
      const media=await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:'environment'},width:{ideal:1920},height:{ideal:1080}},audio:false});
      if(current!==session){media.getTracks().forEach(t=>t.stop());return;}
      stream=media;video.playsInline=true;video.muted=true;video.controls=false;video.setAttribute('playsinline','');video.setAttribute('webkit-playsinline','');video.srcObject=stream;
      try{await video.play();}catch(e){$('scan-resume').hidden=false;$('scan-status').textContent='Bấm Tiếp tục camera để hiện hình.';await new Promise(resolve=>{$('scan-resume').onclick=async()=>{try{await video.play();$('scan-resume').hidden=true;resolve();}catch(_){$('scan-status').textContent='Chưa phát được camera; kiểm tra quyền Safari.';}};});}
      if(current!==session)return;
      $('camera-waiting').hidden=true;$('scan-status').textContent='Đang tải bộ đọc barcode…';await reader();
      if(current!==session)return;
      const canvas=document.createElement('canvas');
      async function scan() {
        if(!running || current!==session || busy)return;
        busy=true;
        try {
          const w=video.videoWidth,h=video.videoHeight;if(!w||!h)throw new Error('Đang chờ hình camera.');
          const scale=Math.min(1,1600/Math.max(w,h));canvas.width=Math.max(1,Math.round(w*scale));canvas.height=Math.max(1,Math.round(h*scale));
          canvas.getContext('2d',{willReadFrequently:true}).drawImage(video,0,0,canvas.width,canvas.height);
          const results=await decode(canvas);
          if(current!==session)return;
          if(results.length===1 && results[0].text){const code=results[0].text;hits=code===last?hits+1:1;last=code;if(hits>=2){show(code);return;}$('scan-status').textContent='Đã thấy barcode, giữ yên để kiểm tra lại…';}
          else {last='';hits=0;$('scan-status').textContent=results.length>1?'Có nhiều barcode; đưa riêng một tem vào.':'Đang tìm barcode. Giữ tem rõ, không lóa và cách camera khoảng 15-25 cm.';}
        }catch(e){if(current===session)$('scan-status').textContent=e.message||'Không đọc được barcode.';}
        finally {if(current===session && running){busy=false;timer=setTimeout(scan,350);}}
      }
      $('scan-capture').onclick=()=>{if(!busy){clearTimeout(timer);scan();}};scan();
    }catch(e){if(current===session){if(stream)stream.getTracks().forEach(t=>t.stop());stream=null;running=false;$('scan-status').textContent=e.message||'Không mở được camera hoặc bộ đọc.';}}
  });
  $('scan-close').addEventListener('click',()=>{if(running)stop();});
  dialog.addEventListener('cancel',()=>{if(running)stop();});
  document.addEventListener('visibilitychange',()=>{if(document.hidden && running && !video.webkitDisplayingFullscreen)stop();});
  window.addEventListener('pagehide',()=>{if(running)stop();});
  $('choose-barcode').addEventListener('click',()=>{$('barcode-photo').value='';$('barcode-photo').click();});
  $('barcode-photo').addEventListener('change',async event=>{
    const file=event.target.files[0];if(!file)return;
    pageStatus.textContent='Đang đọc ảnh barcode…';
    try{
      const url=await new Promise((resolve,reject)=>{const f=new FileReader();f.onload=()=>resolve(f.result);f.onerror=()=>reject(new Error('Không mở được ảnh.'));f.readAsDataURL(file);});
      const image=new Image();await new Promise((resolve,reject)=>{image.onload=resolve;image.onerror=()=>reject(new Error('Không mở được ảnh.'));image.src=url;});
      const canvas=document.createElement('canvas'),scale=Math.min(1,2000/Math.max(image.naturalWidth,image.naturalHeight));canvas.width=Math.round(image.naturalWidth*scale);canvas.height=Math.round(image.naturalHeight*scale);canvas.getContext('2d').drawImage(image,0,0,canvas.width,canvas.height);
      const results=await decode(canvas);
      if(results.length!==1 || !results[0].text){pageStatus.textContent=results.length>1?'Có nhiều barcode trong ảnh; chọn ảnh chỉ có một mã.':'Không thấy barcode trong ảnh; thử ảnh rõ hơn.';return;}
      show(results[0].text);
    }catch(e){pageStatus.textContent=e.message||'Không đọc được ảnh barcode.';}
  });
}());
