(function () {
  'use strict';

  var expected = document.getElementById('expected-code');
  var openButton = document.getElementById('open-scanner');
  var deviceStatus = document.getElementById('device-status');
  var secureBadge = document.getElementById('secure-badge');
  var result = document.getElementById('scan-result');
  var video = document.getElementById('scan-video');
  var waiting = document.getElementById('camera-waiting');
  var scanStatus = document.getElementById('scan-status');
  var confirmPanel = document.getElementById('scan-confirm');
  var confirmCode = document.getElementById('confirm-code');
  var suggestionButton = document.getElementById('confirm-suggestion');
  var supported = false;

  function setDeviceState(message, state) {
    deviceStatus.textContent = message;
    deviceStatus.className = 'device-status' + (state === 'error' ? ' is-error' : '');
    secureBadge.className = 'state-badge ' + (state === 'ready' ? 'state-ready' : (state === 'error' ? 'state-error' : 'state-pending'));
    secureBadge.textContent = state === 'ready' ? 'Camera sẵn sàng' : (state === 'error' ? 'Cần kiểm tra' : 'Đang kiểm tra thiết bị');
  }

  function preflight() {
    var secure = window.isSecureContext === true;
    var cameraApi = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
    var ocr = !!window.Tesseract;
    supported = secure && cameraApi && ocr;
    openButton.disabled = false;

    if (!secure) {
      setDeviceState('Trang này chưa chạy trong ngữ cảnh HTTPS an toàn. Hãy mở địa chỉ HTTPS của TTVina Office trên iPhone.', 'error');
    } else if (!cameraApi) {
      setDeviceState('Trình duyệt chưa cung cấp quyền truy cập camera. Hãy mở bằng Safari mới nhất và tải lại trang.', 'error');
    } else if (!ocr) {
      setDeviceState('Bộ đọc OCR chưa tải xong. Kiểm tra kết nối rồi tải lại trang.', 'error');
    } else {
      setDeviceState('Thiết bị đáp ứng yêu cầu. Bấm quét để mở camera.', 'ready');
    }
  }

  function showResult(success, scannedCode) {
    result.hidden = false;
    result.className = 'scan-result' + (success ? '' : ' is-failure');
    document.getElementById('result-icon').textContent = success ? '' : '!';
    document.getElementById('result-title').textContent = success ? 'Đã ghi nhận mã trong phiên thử' : 'Mã đọc được chưa khớp';
    document.getElementById('result-code').textContent = scannedCode || '';
    document.getElementById('result-detail').textContent = success
      ? 'Anh đã xác nhận mã. Trang thử chỉ giữ kết quả trên màn hình, không ghi kho.'
      : 'Kiểm tra lại tem và mã mẫu. Trang không tự sửa chữ hoặc số để tránh nhận nhầm.';
    if (!success) {
      result.style.borderColor = 'var(--warn-border)';
      result.style.background = 'var(--warn-bg)';
    } else {
      result.style.borderColor = '';
      result.style.background = '';
    }
  }

  expected.addEventListener('input', function () {
    result.hidden = true;
    confirmPanel.hidden = true;
  });

  function presentCandidate(raw) {
      var suggested = raw.replace(/@/g, 'Ø').replace(/([xX])[0O](?=\d)/g, '$1Ø');
      confirmCode.value = raw;
      document.getElementById('confirm-error').textContent = '';
      suggestionButton.hidden = window.lastScanWasBarcode || suggested === raw;
      suggestionButton.textContent = 'Dùng gợi ý Ø: ' + suggested;
      suggestionButton.onclick = function () { confirmCode.value = suggested; suggestionButton.hidden = true; confirmCode.focus(); };
      confirmPanel.hidden = false;
      confirmPanel.scrollIntoView({behavior:'smooth',block:'center'});
      confirmCode.focus({preventScroll:true});
  }
  window.addEventListener('barcode-candidate', function (event) {
    result.hidden = true;
    presentCandidate(event.detail.code);
  });
  openButton.addEventListener('click', function () {
    window.lastScanWasBarcode = false;
    var code = expected.value.trim();
    if (!supported || !window.TTVinaScanner) { preflight(); return; }
    result.hidden = true;
    confirmPanel.hidden = true;
    document.getElementById('scanner-title').textContent = 'Quét tem hộp';
    document.getElementById('scanner-description').textContent = 'Chỉ đưa một hộp vào khung. Đặt tem phẳng, đủ sáng và tránh bóng phản chiếu.';
    document.getElementById('scan-use-current').hidden = false;
    waiting.hidden = false;
    waiting.querySelector('strong').textContent = 'Đang chờ hình camera…';
    scanStatus.textContent = 'Đang yêu cầu quyền camera…';
    window.TTVinaScanner.open(function (tool) {
      presentCandidate(tool.tool_code);
      setDeviceState('Camera và OCR hoạt động trên thiết bị này.', 'ready');
    }, code ? [{ tool_code: code }] : []);
  });

  document.getElementById('scan-again').addEventListener('click', function () { confirmPanel.hidden = true; (window.lastScanWasBarcode ? document.getElementById('open-barcode') : openButton).click(); });
  document.getElementById('confirm-scan').addEventListener('click', function () {
    var code = confirmCode.value.trim();
    if (!code) { document.getElementById('confirm-error').textContent = 'Anh nhập mã trước khi xác nhận.'; confirmCode.focus(); return; }
    confirmPanel.hidden = true;
    showResult(true, code);
    result.scrollIntoView({behavior:'smooth',block:'center'});
  });

  video.addEventListener('playing', function () {
    waiting.hidden = true;
  });
  video.addEventListener('error', function () {
    waiting.hidden = false;
    waiting.querySelector('strong').textContent = 'Không hiển thị được hình camera.';
  });
  window.addEventListener('production-scan-error', function (event) {
    setDeviceState(event.detail || 'Không hoàn tất được bước đọc mã.', 'error');
  });

  document.getElementById('scan-close').addEventListener('click', function () {
    if (window.TTVinaScanner) window.TTVinaScanner.stop();
    waiting.hidden = false;
    waiting.querySelector('strong').textContent = 'Đang chờ hình camera…';
  });

  preflight();
}());
