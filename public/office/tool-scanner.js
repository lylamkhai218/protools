/* Local-only OCR. No fuzzy matching and no inventory writes from recognition. */
window.TTVinaScanner = (() => {
  let stream, worker, timer, busy = false, generation = 0, previous = '', hits = 0, done;
  const dialog = () => document.getElementById('scanner-dialog');
  const status = text => { document.getElementById('scan-status').textContent = text; };
  const escape = text => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  async function stop() {
    generation++;
    clearTimeout(timer);
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
    done = callback; previous = ''; hits = 0;
    dialog().showModal(); status('Đang tải bộ đọc và mở camera…');
    try {
      if (!navigator.mediaDevices?.getUserMedia || !window.Tesseract) throw new Error('Camera hoặc bộ đọc chưa sẵn sàng. Kiểm tra HTTPS và tải lại trang.');
      const media = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: 'environment' }, width: { ideal: 1920 }, height: { ideal: 1080 } }, audio: false });
      if (session !== generation) { media.getTracks().forEach(t => t.stop()); return; }
      stream = media;
      const video = document.getElementById('scan-video'); video.srcObject = stream;
      await video.play();
      if (video.videoWidth) video.parentElement.style.aspectRatio = `${video.videoWidth}/${video.videoHeight}`;
      const instance = await Tesseract.createWorker('eng', 1, { workerPath: '/office/vendor/ocr/worker.min.js', corePath: '/office/vendor/ocr/', langPath: '/office/vendor/ocr/', workerBlobURL: false, gzip: true });
      if (session !== generation) { await instance.terminate(); return; }
      worker = instance;
      const canvas = document.createElement('canvas'); const ctx = canvas.getContext('2d', { willReadFrequently: true });
      async function read() {
        if (busy || session !== generation || !worker) return;
        busy = true;
        try {
          const width = video.videoWidth, height = video.videoHeight;
          if (!width || !height) throw new Error('Đang chờ hình camera.');
          canvas.width = Math.round(width * .8); canvas.height = Math.round(height * .3);
          ctx.drawImage(video, width * .1, height * .35, width * .8, height * .3, 0, 0, canvas.width, canvas.height);
          status('Đang đọc vùng tem. Giữ riêng một hộp trong khung…');
          const result = await worker.recognize(canvas);
          if (session !== generation) return;
          const text = result.data.text;
          const matches = tools.filter(t => new RegExp(`(^|[^A-Za-z0-9_./-])${escape(t.tool_code)}($|[^A-Za-z0-9_./-])`).test(text));
          if (matches.length === 1) {
            const code = matches[0].tool_code;
            hits = code === previous ? hits + 1 : 1; previous = code;
            if (hits >= 2) {
              const callback = done;
              const evidence=canvas.toDataURL('image/jpeg',.8);
              await stop();
              try { await callback(matches[0],evidence); }
              catch(error) { window.dispatchEvent(new CustomEvent('production-scan-error',{detail:error.message||'Không xác nhận được mã đã đọc.'})); }
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
    document.getElementById('scan-close').onclick = stop;
    dialog().addEventListener('cancel', event => { event.preventDefault(); stop(); });
    dialog().addEventListener('click', event => { if (event.target === dialog()) { const r=dialog().getBoundingClientRect(); if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom) stop(); } });
  });
  window.addEventListener('pagehide', stop);
  document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); });
  return { open, stop };
})();
