(function () {
  'use strict';
  const input = document.getElementById('label-photo');
  const button = document.getElementById('take-photo');
  const box = document.getElementById('photo-result');
  const status = document.getElementById('photo-status');
  const output = document.getElementById('photo-text');
  let busy = false;
  button.onclick = function () { if (!busy) { input.value = ''; input.click(); } };
  input.onchange = async function () {
    if (!input.files[0] || busy) return;
    busy = true; button.disabled = true; box.hidden = false; output.textContent = '';
    let worker, expired = false, timeout;
    const expected = document.getElementById('expected-code').value.trim();
    try {
      if (!window.Tesseract) throw new Error('Bộ đọc chưa tải. Tải lại trang rồi thử lại.');
      if (window.TTVinaScanner) await window.TTVinaScanner.stop();
      status.textContent = 'Đang mở ảnh tem…';
      const url = await new Promise((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(reader.result); reader.onerror = () => reject(new Error('Không mở được ảnh.')); reader.readAsDataURL(input.files[0]); });
      const image = new Image();
      await new Promise((resolve, reject) => { image.onload = resolve; image.onerror = () => reject(new Error('Ảnh chưa hỗ trợ. Chụp lại hoặc chọn ảnh JPEG.')); image.src = url; });
      document.getElementById('photo-preview').src = url;
      const canvas = document.createElement('canvas');
      const scale = Math.min(1, 2400 / Math.max(image.naturalWidth, image.naturalHeight));
      canvas.width = Math.round(image.naturalWidth * scale); canvas.height = Math.round(image.naturalHeight * scale);
      canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height);
      const work = async () => {
        status.textContent = 'Đang tải bộ đọc chữ…';
        worker = await Tesseract.createWorker('eng', 1, {
          workerPath: '/office/san-xuat/test/vendor/ocr/worker.min.js', corePath: '/office/san-xuat/test/vendor/ocr/', langPath: '/office/san-xuat/test/vendor/ocr/', workerBlobURL: false, gzip: true,
          logger: info => { if (!expired && info.status) status.textContent = 'Đang xử lý ảnh: ' + info.status + (typeof info.progress === 'number' ? ' ' + Math.round(info.progress * 100) + '%' : ''); }
        });
        if (expired) { await worker.terminate(); return; }
        await worker.setParameters({ tessedit_pageseg_mode: '11' });
        const result = await worker.recognize(canvas);
        if (expired) return;
        const text = result.data.text.trim();
        output.textContent = text;
        status.textContent = !text ? 'Chưa đọc được chữ. Chụp gần hơn, giữ nét và tránh lóa.' : (expected ? 'Đã đọc chữ. Đối chiếu với mã mẫu: ' + expected + '. Kết quả chưa tự xác nhận cá thể.' : 'Đã đọc chữ. Anh đối chiếu kết quả với tem và cán dao; OCR có thể đọc sai.');
      };
      await Promise.race([work(), new Promise((_, reject) => { timeout = setTimeout(() => { expired = true; reject(new Error('Xử lý quá lâu. Kiểm tra mạng và thử lại bằng ảnh chỉ có một tem.')); }, 90000); })]);
    } catch (error) { status.textContent = error.message || 'Không đọc được ảnh. Thử lại.'; }
    finally { clearTimeout(timeout); expired = true; if (worker) await worker.terminate().catch(() => {}); busy = false; button.disabled = false; }
  };
}());
