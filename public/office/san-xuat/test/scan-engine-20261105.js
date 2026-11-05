/* Local-only OCR. No fuzzy matching and no inventory writes from recognition. */
window.TTVinaScanner = (() => {
  let stream, worker, timer, busy = false, generation = 0, previous = '', hits = 0, done, resumeWait, lastCandidate = '';
  const dialog = () => document.getElementById('scanner-dialog');
  const status = text => { document.getElementById('scan-status').textContent = text; };
  const escape = text => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  async function stop() {
    generation++;
    clearTimeout(timer);
    if (resumeWait) { resumeWait(false); resumeWait = null; }
    document.getElementById('scan-resume').hidden = true;
    if (stream) stream.getTracks().forEach(track => track.stop());
    stream = null;
    const old = worker; worker = null;
    if (old) { try { await old.terminate(); } catch (_) { /* Worker may be terminating a recognition. */ } }
    busy = false;
    const video = document.getElementById('scan-video');
    if (video) video.srcObject = null;
    if (dialog().open) dialog().close();
    document.getElementById('open-scanner')?.focus();
  }
  async function open(callback, tools) {
    await stop();
    const session = generation;
    done = callback; previous = ''; hits = 0; lastCandidate = '';
    document.getElementById('scan-use-current').disabled = true;
    document.getElementById('ocr-output').hidden = true;
    document.getElementById('ocr-text').textContent = '';
    dialog().showModal(); status('Đang tải bộ đọc và mở camera…');
    try {
      if (!navigator.mediaDevices?.getUserMedia || !window.Tesseract) throw new Error('Camera hoặc bộ đọc chưa sẵn sàng. Kiểm tra HTTPS và tải lại trang.');
      const media = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: 'environment' }, width: { ideal: 1920 }, height: { ideal: 1080 } }, audio: false });
      if (session !== generation) { media.getTracks().forEach(t => t.stop()); return; }
      stream = media;
      const video = document.getElementById('scan-video');
      video.playsInline = true; video.muted = true;
      video.controls = false; video.disablePictureInPicture = true;
      video.setAttribute('playsinline', ''); video.setAttribute('webkit-playsinline', '');
      video.srcObject = stream;
      try { await video.play(); }
      catch (_) {
        const resume = document.getElementById('scan-resume');
        resume.hidden = false;
        status('Safari cần anh bấm Tiếp tục camera để hiện hình.');
        const resumed = await new Promise(resolve => {
          resumeWait = resolve;
          resume.onclick = async () => {
            try { await video.play(); resume.hidden = true; resumeWait = null; resolve(true); }
            catch (_) { status('Chưa mở được hình. Kiểm tra quyền Camera của Safari rồi thử lại.'); }
          };
        });
        if (!resumed || session !== generation) return;
      }
      status('Đã mở camera. Đang tải bộ đọc chữ, lần đầu có thể mất một lúc…');
      let timedOut = false, loadTimer;
      const loading = Tesseract.createWorker('eng', 1, { workerPath: '/office/san-xuat/test/vendor/ocr/worker.min.js', corePath: '/office/san-xuat/test/vendor/ocr/', langPath: '/office/san-xuat/test/vendor/ocr/', workerBlobURL: false, gzip: true,
        logger: info => { if (session === generation && !timedOut && !worker && info.status) status('Đang tải bộ đọc chữ: ' + info.status + (typeof info.progress === 'number' ? ' ' + Math.round(info.progress * 100) + '%' : '')); }
      });
      loading.then(instance => { if (timedOut || session !== generation) instance.terminate().catch(() => {}); }, () => {});
      const instance = await Promise.race([loading, new Promise((_, reject) => { loadTimer = setTimeout(() => { timedOut = true; reject(new Error('Tải bộ đọc quá lâu. Kiểm tra mạng, đóng cửa sổ và thử lại.')); }, 60000); })]).finally(() => clearTimeout(loadTimer));
      if (session !== generation) { await instance.terminate(); return; }
      worker = instance;
      await worker.setParameters({ tessedit_pageseg_mode: '7' });
      const canvas = document.createElement('canvas'); const ctx = canvas.getContext('2d', { willReadFrequently: true });
      let attempts = 0;
      async function finish(code) {
        if (session !== generation || !code) return;
        const callback = done;
        await stop();
        try { await callback({tool_code: code}); }
        catch (error) { window.dispatchEvent(new CustomEvent('production-scan-error', {detail:error.message || 'Không hiển thị được kết quả.'})); }
      }
      document.getElementById('scan-use-current').onclick = () => { if (lastCandidate) finish(lastCandidate); };
      async function read() {
        if (busy || session !== generation || !worker) return;
        busy = true;
        try {
          const width = video.videoWidth, height = video.videoHeight;
          if (!width || !height) throw new Error('Đang chờ hình camera.');
          const preview = video.parentElement;
          const displayWidth = preview.clientWidth, displayHeight = preview.clientHeight;
          if (!displayWidth || !displayHeight) throw new Error('Đang chờ khung camera.');
          const scale = Math.max(displayWidth / width, displayHeight / height);
          const left = (width * scale - displayWidth) / 2, top = (height * scale - displayHeight) / 2;
          const heightRatio = Number(document.getElementById('scan-frame-height').value) / 100;
          const sx = (left + displayWidth * .07) / scale, sy = (top + displayHeight * (1-heightRatio) / 2) / scale;
          const sw = displayWidth * .86 / scale, sh = displayHeight * heightRatio / scale;
          const enlargement = Math.min(4, 1800 / sw);
          canvas.width = Math.max(1, Math.round(sw * enlargement)); canvas.height = Math.max(1, Math.round(sh * enlargement));
          ctx.filter = 'none';
          ctx.drawImage(video, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);
          attempts++;
          if (attempts % 2 === 0) {
            const pixels=ctx.getImageData(0,0,canvas.width,canvas.height),d=pixels.data,histogram=new Uint32Array(256);
            for(let i=0;i<d.length;i+=4) histogram[Math.round(.299*d[i]+.587*d[i+1]+.114*d[i+2])]++;
            const total=canvas.width*canvas.height;let count=0,low=0,high=255;
            for(let k=0;k<256;k++){count+=histogram[k];if(count>=total*.02){low=k;break;}}
            count=0;for(let k=255;k>=0;k--){count+=histogram[k];if(count>=total*.02){high=k;break;}}
            for(let i=0;i<d.length;i+=4){const lum=.299*d[i]+.587*d[i+1]+.114*d[i+2];const v=Math.max(0,Math.min(255,(lum-low)*255/Math.max(30,high-low)));d[i]=d[i+1]=d[i+2]=v;}
            ctx.putImageData(pixels,0,0);
          }
          status('Đang đọc vùng tem, lượt '+attempts+'. Giữ dòng chữ trong khung…');
          const result = await worker.recognize(canvas);
          if (session !== generation) return;
          const text = result.data.text;
          if (tools.length && Number(result.data.confidence) < 55) {
            status('Chữ chưa rõ để nhận mã. Giữ yên, tránh lóa; có thể chụp ảnh và khoanh sát dòng tem.');
            previous = ''; hits = 0;
            return;
          }
          if (!tools.length) {
            if (text.trim()) {
              const raw = text.trim().slice(0, 300);
              lastCandidate = raw;
              document.getElementById('scan-use-current').disabled = false;
              const suggestion = raw.replace(/@/g, 'Ø').replace(/([xX])[0O](?=\d)/g, '$1Ø');
              document.getElementById('ocr-text').textContent = raw + (suggestion !== raw ? '\nGợi ý ký hiệu Ø, cần anh xác nhận: ' + suggestion : '');
              document.getElementById('ocr-output').hidden = false;
              status(Number(result.data.confidence) < 55 ? 'Chữ chưa rõ; đây là kết quả tạm thời, hãy đối chiếu với tem.' : 'OCR tạm thời, chưa xác nhận mã. Nếu chữ sai, giữ máy xa hơn một chút để lấy nét.');
              if (Number(result.data.confidence) >= 55 && /[0-9]/.test(raw) && raw.length >= 4) {
                hits = raw === previous ? hits + 1 : 1; previous = raw;
                if (hits >= 2) { await finish(raw); return; }
              } else { hits = 0; previous = ''; }
            } else {
              hits = 0; previous = '';
              status('Chưa đọc được chữ. Đưa tem vào khung, đủ sáng và giữ yên.');
            }
            return;
          }
          const matches = tools.filter(t => new RegExp(`(^|[^A-Za-z0-9_./-])${escape(t.tool_code)}($|[^A-Za-z0-9_./-])`).test(text));
          if (matches.length === 1) {
            const code = matches[0].tool_code;
            hits = code === previous ? hits + 1 : 1; previous = code;
            if (hits >= 2) {
              await finish(matches[0].tool_code);
              return;
            }
            status(`Đang kiểm tra lại mã ${code}. Giữ yên…`);
          } else {
            previous = ''; hits = 0;
            status(matches.length > 1 ? 'Có nhiều mã trong khung. Đưa riêng một hộp vào.' : 'Chưa khớp chính xác mã. Chỉnh ánh sáng hoặc đưa tem rõ hơn vào khung.');
          }
        } catch (error) { if (session === generation) status(error.message || 'Chưa đọc được tem.'); }
        finally { if (session === generation) { busy = false; timer = setTimeout(read, 700); } }
      }
      document.getElementById('scan-capture').onclick = () => { clearTimeout(timer); if (!busy) read(); };
      read();
    } catch (error) {
      if (session !== generation) return;
      if (stream) stream.getTracks().forEach(t => t.stop());
      stream = null;
      status(error.name === 'NotAllowedError' ? 'Chưa có quyền camera. Cho phép camera rồi mở lại.' : (error.message || 'Không mở được camera.'));
    }
  }
  document.addEventListener('DOMContentLoaded', () => {
    const frame = document.querySelector('.scan-frame'), frameHeight = document.getElementById('scan-frame-height');
    frameHeight.addEventListener('input', () => { const v = Number(frameHeight.value); frame.style.top = frame.style.bottom = ((100-v)/2)+'%'; document.getElementById('scan-frame-value').textContent = v+'%'; });
    const video = document.getElementById('scan-video');
    video.addEventListener('webkitendfullscreen', () => {
      const resume = document.getElementById('scan-resume');
      if (stream) { resume.hidden = false; status('Đã thoát trình phát. Bấm Tiếp tục camera; nếu hình đứng, dùng Chụp ảnh tem.'); resume.onclick = async () => { try { await video.play(); resume.hidden = true; } catch (_) { status('Không phát tiếp được. Đóng và dùng Chụp ảnh tem để đọc.'); } }; }
    });
    document.getElementById('scan-close').onclick = stop;
    dialog().addEventListener('cancel', event => { event.preventDefault(); stop(); });
    dialog().addEventListener('click', event => { if (event.target === dialog()) { const r=dialog().getBoundingClientRect(); if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom) stop(); } });
  });
  window.addEventListener('pagehide', stop);
  document.addEventListener('visibilitychange', () => { if (document.hidden && !document.getElementById('scan-video').webkitDisplayingFullscreen) stop(); });
  return { open, stop };
})();
