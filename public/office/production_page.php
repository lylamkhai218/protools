<?php
require_once __DIR__.'/config.php';
$user=get_auth_user();
if (!$user) { header('Location: /office/'); exit; }
$role=$user['role']==='ADMIN'?'ADMIN':(!empty($user['workshop_role'])?$user['workshop_role']:$user['role']);
if (!in_array($role,array('ADMIN','WAREHOUSE','CNC','ENGINEER','INSPECTOR','SUPERVISOR','ACCOUNTANT'),true)) {http_response_code(403);exit('Không có quyền truy cập Sản xuất');}
apply_security_headers();
header('Permissions-Policy: camera=(self), microphone=(), geolocation=()');
header('Cache-Control: no-store');
?>
<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="office-csrf" content="<?=htmlspecialchars($_SESSION['tt_csrf'],ENT_QUOTES,'UTF-8')?>">
<title>Kho Sản xuất | TTVina Office</title>
<link rel="stylesheet" href="/office/production.css">
<script src="/office/production-client.js" defer></script><script src="/office/vendor/ocr/tesseract.min.js" defer></script><script src="/office/vendor/qr/qrcode.js" defer></script><script src="/office/tool-scanner.js" defer></script><script src="/office/production-workbench.js" defer></script>
</head><body data-role="<?=htmlspecialchars($role,ENT_QUOTES,'UTF-8')?>" data-password-change="<?=!empty($user['must_change_password'])?'1':'0'?>">
<header><a href="/office/">TTVINA OFFICE</a><div><h1>Kho Sản xuất</h1><span>Dao CNC / Vật tư dở dang</span></div><span><?=htmlspecialchars($user['name'],ENT_QUOTES,'UTF-8')?></span><button id="logout" type="button">Đăng xuất</button></header>
<main><p id="notice" role="status" aria-live="polite">Đang tải dữ liệu…</p>
<section id="password-section" hidden><h2>Đổi mật khẩu ban đầu</h2><form id="password-form"><label>Mật khẩu hiện tại<input name="current_password" type="password" autocomplete="current-password" required></label><label>Mật khẩu mới, ít nhất 12 ký tự<input name="new_password" type="password" autocomplete="new-password" minlength="12" required></label><button>Đổi mật khẩu</button></form></section>
<section id="issue-section" hidden><h2>Nhận dao theo bản vẽ</h2><form id="issue-form">
<label>Mã bản vẽ<input name="drawing_code" required maxlength="100" autocomplete="off"></label>
<label id="holder-label">Người nhận<select name="holder_user_id"></select></label>
<label>Mã trên tem hộp<input name="tool_code" required maxlength="50" readonly></label>
<div class="actions"><button type="button" id="open-scanner">Quét tem hộp</button><button type="button" id="manual-entry">Nhập ngoại lệ</button></div>
<label id="reason-label" hidden>Lý do nhập ngoại lệ<input name="manual_reason" maxlength="500"></label>
<p id="tool-detail">Đưa riêng một hộp vào khung quét. Mã tem phải giống mã trên cán.</p>
<button id="issue-submit">Xác nhận nhận dao</button></form></section>
<section><div class="section-heading"><h2>Dao đang giữ và hàng chờ kiểm định</h2><button id="refresh" type="button">Tải lại</button></div><p id="summary"></p><button id="receive-selected" type="button" hidden>Nhận các phiếu đã chọn vào kiểm định</button><div class="table-scroll"><table><thead><tr><th>Mã dao</th><th>Bản vẽ / người nhận</th><th>Vị trí</th><th>Ngày cấp</th><th>Thao tác</th></tr></thead><tbody id="movements"></tbody></table></div><p>Hiển thị tối đa 200 giao dịch gần nhất. Phiếu cũ cần đối soát được giữ nguyên.</p></section>
<section id="catalog-section" hidden><div class="section-heading"><h2>Danh mục cá thể dao</h2><button id="add-tool" type="button">Thêm cá thể</button></div><div class="table-scroll"><table><thead><tr><th>Mã cá thể</th><th>Quy cách</th><th>Tình trạng</th><th>Tự nhận</th><th>Thao tác</th></tr></thead><tbody id="tool-catalog"></tbody></table></div></section>
<section id="wip-issue-section" hidden><h2>Cấp vật tư dở dang</h2><button id="scan-remnant" type="button">Quét chữ trên tem cuộn lẻ</button><form id="wip-form"><label>Nguồn tồn<select name="stock_item_id" required></select></label><label>Mã dự án<input name="project_code" required maxlength="100"></label><label>Kỹ sư nhận<select name="engineer_user_id" required></select></label><label>Chiều dài cấp (m)<input name="advance_length_meters" type="number" min="0.01" step="0.01" required></label><label>Phiếu cuộn lẻ nguồn, nếu có<input name="parent_wip_id" type="number" min="1"></label><label>Lý do bỏ qua cuộn lẻ phù hợp<input name="remnant_override_reason" maxlength="500"></label><p id="remnant-hint">Chọn nguồn và chiều dài để tìm cuộn lẻ phù hợp.</p><button>Cấp vật tư</button></form></section>
<section><h2>Vật tư dở dang và cuộn lẻ</h2><div class="table-scroll"><table><thead><tr><th>Phiếu / dự án</th><th>Người nhận</th><th>Cấp (m)</th><th>Còn lại (m)</th><th>Trạng thái / thao tác</th></tr></thead><tbody id="wip"></tbody></table></div><div class="actions"><button id="first-wip" type="button">Phiếu vật tư mới nhất</button><button id="older-wip" type="button">Phiếu vật tư cũ hơn</button></div></section>
</main>
<dialog id="scanner-dialog" aria-labelledby="scanner-title"><h2 id="scanner-title">Quét mã trên tem hộp</h2><p>Chỉ đưa một hộp vào khung. Giữ yên, tránh bóng đèn phản chiếu.</p><div class="camera"><video id="scan-video" autoplay muted playsinline></video><div class="scan-frame" aria-hidden="true"></div></div><p id="scan-status" role="status">Đang mở camera…</p><div class="actions"><button type="button" id="scan-capture">Chụp đọc lại</button><button type="button" id="scan-close" aria-label="Đóng cửa sổ">Đóng</button></div></dialog>
<dialog id="action-dialog" aria-labelledby="action-title"><h2 id="action-title">Xác nhận thao tác</h2><form id="action-form"><div id="action-fields"></div><div class="actions"><button>Xác nhận</button><button type="button" id="action-close">Hủy bỏ</button></div></form></dialog>
<dialog id="qr-dialog" aria-labelledby="qr-title"><h2 id="qr-title">Tem định danh</h2><div id="qr-content"></div><p>Đối chiếu mã và số dư hiện tại trước khi sử dụng.</p><button type="button" id="qr-print">In tem</button><button type="button" id="qr-close">Đóng</button></dialog>
</body></html>
