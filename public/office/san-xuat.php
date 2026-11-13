<?php
// New workbench retains this route; legacy implementation below is kept for audit/rollback.
require __DIR__ . '/production_page.php';
exit;
/**
 * TTVINA OFFICE - INDUSTRIAL MANUFACTURING & TOOL CRIB MANAGEMENT
 * Phân Hệ Quản Lý Cấp Phát Sản Xuất: Dao Cụ CNC & Vật Tư Tự Động Hóa (WIP)
 * Architecture: Clean URLs (Pretty URLs) with Zero Information Disclosure
 * Standards: ECC AgentShield / OWASP Secure Frontend / design-taste-frontend Anti-Slop
 * Author: Senior Frontend Engineer & Senior Backend Engineer / ERP-CORE-AGENT
 */

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/auth.php';

$user = get_auth_user();
if (!$user) { header('Location: /office/'); exit; }
apply_security_headers();

// Determine Initial Clean URL Route (Rewrite or query parameter)
$route = isset($_GET['route']) ? trim((string)$_GET['route'], '/') : '';
if (empty($route) && isset($_GET['tab'])) {
    $route = trim((string)$_GET['tab']);
}
$validRoutes = array('dao-cnc', 'tu-dong-hoa', 'kiem-dinh', 'no-treo');
if (!in_array($route, $validRoutes, true)) {
    $route = 'dao-cnc';
}

$currentUserRole = $user ? $user['role'] : 'GUEST';
$currentUserName = $user ? $user['name'] : 'Khách vãng lai';
?>
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="robots" content="noindex, nofollow, noarchive" />
  <title>Kho Sản Xuất & Dao Cụ CNC | TTVina Office</title>
  <link rel="icon" type="image/svg+xml" href="/logos/TTV_LOGO_Color_Master.svg" />

  <!-- High-Precision Technical Typography -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet">

  <style>
    :root {
      --bg: #f8fafc;
      --surface: #ffffff;
      --surface-subtle: #f1f5f9;
      --border: #e2e8f0;
      --border-dark: #cbd5e1;
      --text: #0f172a;
      --text-muted: #64748b;
      --brand: #00478d;
      --brand-dark: #003366;
      --brand-bg: #eff6ff;
      --brand-border: #bfdbfe;
      --ok: #059669;
      --ok-bg: #ecfdf5;
      --ok-border: #a7f3d0;
      --warn: #d97706;
      --warn-bg: #fffbeb;
      --warn-border: #fde68a;
      --danger: #dc2626;
      --danger-bg: #fef2f2;
      --danger-border: #fecaca;
      --radius: 6px;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }

    body {
      background: var(--bg);
      color: var(--text);
      line-height: 1.5;
      font-size: 13px;
      -webkit-font-smoothing: antialiased;
      padding-bottom: 40px;
    }

    .font-mono {
      font-family: 'JetBrains Mono', ui-monospace, monospace;
    }

    .tabular-num {
      font-variant-numeric: tabular-nums;
    }

    /* TOP BAR */
    .header-bar {
      background: #ffffff;
      border-bottom: 1px solid var(--border);
      padding: 10px 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: sticky;
      top: 0;
      z-index: 40;
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .back-office-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      color: var(--brand);
      text-decoration: none;
      font-weight: 600;
      font-size: 12px;
      padding: 6px 10px;
      border-radius: var(--radius);
      border: 1px solid var(--brand-border);
      background: var(--brand-bg);
      transition: all 0.15s ease;
    }
    .back-office-btn:hover {
      background: #dbeafe;
    }

    .header-title-wrap {
      display: flex;
      flex-direction: column;
    }

    .header-title {
      font-size: 15px;
      font-weight: 800;
      color: var(--text);
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .badge-module {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      background: #0f172a;
      color: #ffffff;
      padding: 2px 7px;
      border-radius: 4px;
      letter-spacing: 0.5px;
    }

    .header-desc {
      font-size: 12px;
      color: var(--text-muted);
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 14px;
    }

    .shortcut-legend {
      display: flex;
      gap: 6px;
      font-size: 11px;
      color: var(--text-muted);
      background: var(--surface-subtle);
      padding: 4px 8px;
      border-radius: 4px;
      border: 1px solid var(--border);
    }

    kbd {
      background: #ffffff;
      border: 1px solid var(--border-dark);
      border-radius: 3px;
      box-shadow: 0 1px 0 rgba(0,0,0,0.1);
      font-size: 10px;
      padding: 1px 4px;
      font-family: 'JetBrains Mono', monospace;
      color: var(--text);
      font-weight: 600;
    }

    .user-pill {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 12px;
      font-weight: 600;
      padding: 4px 10px;
      border-radius: 20px;
      background: var(--surface-subtle);
      border: 1px solid var(--border);
    }

    /* NAVIGATION TABS (CLEAN URLS) */
    .nav-bar {
      background: #ffffff;
      border-bottom: 1px solid var(--border);
      padding: 0 24px;
      display: flex;
      gap: 2px;
    }

    .nav-item {
      padding: 12px 18px;
      font-size: 13px;
      font-weight: 600;
      color: var(--text-muted);
      cursor: pointer;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      border-bottom: 2px solid transparent;
      transition: all 0.15s ease;
    }

    .nav-item:hover {
      color: var(--brand);
      background: #f8fafc;
    }

    .nav-item.active {
      color: var(--brand);
      border-bottom-color: var(--brand);
      background: var(--brand-bg);
    }

    .nav-pill-count {
      font-size: 11px;
      font-weight: 700;
      padding: 1px 6px;
      border-radius: 10px;
      background: var(--border);
      color: var(--text-muted);
    }

    .nav-item.active .nav-pill-count {
      background: var(--brand);
      color: #ffffff;
    }

    .nav-pill-danger {
      background: var(--danger-bg) !important;
      color: var(--danger) !important;
      border: 1px solid var(--danger-border);
    }

    /* MAIN CONTAINER */
    .container {
      max-width: 1440px;
      margin: 20px auto;
      padding: 0 24px;
    }

    /* KPI METRICS BAR */
    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
      margin-bottom: 20px;
    }

    .kpi-card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 14px 16px;
      position: relative;
    }

    .kpi-title {
      font-size: 11px;
      font-weight: 700;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 6px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .kpi-value {
      font-size: 22px;
      font-weight: 800;
      color: var(--text);
      font-family: 'JetBrains Mono', monospace;
    }

    .kpi-sub {
      font-size: 11px;
      color: var(--text-muted);
      margin-top: 4px;
    }

    /* LAYOUT SPLIT (2-COLUMN FOR FAST ENTRY) */
    .grid-split {
      display: grid;
      grid-template-columns: 360px 1fr;
      gap: 20px;
    }

    /* CARD WRAPPER */
    .card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 16px;
      margin-bottom: 20px;
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 12px;
      margin-bottom: 14px;
      border-bottom: 1px solid var(--border);
    }

    .card-title {
      font-size: 14px;
      font-weight: 700;
      color: var(--text);
      display: flex;
      align-items: center;
      gap: 8px;
    }

    /* FORMS */
    .form-group {
      margin-bottom: 12px;
    }

    .form-label {
      display: block;
      font-size: 11px;
      font-weight: 600;
      color: var(--text-muted);
      margin-bottom: 4px;
    }

    .form-control {
      width: 100%;
      padding: 8px 10px;
      font-size: 13px;
      border: 1px solid var(--border);
      border-radius: var(--radius);
      outline: none;
      background: #ffffff;
      color: var(--text);
      transition: border 0.15s ease;
    }

    .form-control:focus {
      border-color: var(--brand);
      box-shadow: 0 0 0 2px var(--brand-border);
    }

    select.form-control {
      cursor: pointer;
    }

    .form-hint {
      font-size: 11px;
      color: var(--text-muted);
      margin-top: 3px;
    }

    /* BUTTONS */
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      padding: 8px 14px;
      font-size: 12px;
      font-weight: 600;
      border-radius: var(--radius);
      border: 1px solid transparent;
      cursor: pointer;
      text-decoration: none;
      transition: all 0.15s ease;
    }

    .btn-brand {
      background: var(--brand);
      color: #ffffff;
    }
    .btn-brand:hover {
      background: var(--brand-dark);
    }

    .btn-ok {
      background: var(--ok);
      color: #ffffff;
    }
    .btn-ok:hover {
      background: #047857;
    }

    .btn-outline {
      background: #ffffff;
      border-color: var(--border-dark);
      color: var(--text);
    }
    .btn-outline:hover {
      background: var(--surface-subtle);
    }

    .btn-sm {
      padding: 5px 10px;
      font-size: 11px;
    }

    .btn-block {
      width: 100%;
    }

    /* DATA TABLES */
    .table-container {
      overflow-x: auto;
      border: 1px solid var(--border);
      border-radius: var(--radius);
      background: #ffffff;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
      font-size: 12px;
    }

    th {
      background: var(--surface-subtle);
      color: var(--text-muted);
      font-weight: 700;
      font-size: 11px;
      text-transform: uppercase;
      padding: 8px 12px;
      border-bottom: 1px solid var(--border);
      white-space: nowrap;
    }

    td {
      padding: 8px 12px;
      border-bottom: 1px solid var(--border);
      color: var(--text);
      vertical-align: middle;
    }

    tr:last-child td {
      border-bottom: none;
    }

    tr:hover td {
      background: #f8fafc;
    }

    /* BADGES */
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 2px 7px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 600;
      white-space: nowrap;
    }

    .badge-new { background: #dbeafe; color: #1e40af; border: 1px solid #bfdbfe; }
    .badge-used1x { background: #dcfce7; color: #15803d; border: 1px solid #bbf7d0; }
    .badge-old { background: #fef3c7; color: #b45309; border: 1px solid #fde68a; }
    .badge-scrapped { background: #fee2e2; color: #b91c1c; border: 1px solid #fca5a5; }

    .badge-overdue {
      background: #fef2f2;
      color: #dc2626;
      font-weight: 700;
      border: 1px solid #fecaca;
      animation: pulse-border 2s infinite;
    }

    @keyframes pulse-border {
      0% { border-color: #fecaca; }
      50% { border-color: #dc2626; }
      100% { border-color: #fecaca; }
    }

    /* MODAL */
    .modal-overlay {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(15, 23, 42, 0.5);
      backdrop-filter: blur(2px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 100;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.2s ease;
    }

    .modal-overlay.active {
      opacity: 1;
      pointer-events: auto;
    }

    .modal-card {
      background: #ffffff;
      border: 1px solid var(--border);
      border-radius: var(--radius);
      width: 95%;
      max-width: 550px;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
      overflow: hidden;
      transform: translateY(10px);
      transition: transform 0.2s ease;
    }

    .modal-overlay.active .modal-card {
      transform: translateY(0);
    }

    .modal-header {
      padding: 14px 18px;
      border-bottom: 1px solid var(--border);
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: var(--surface-subtle);
    }

    .modal-title {
      font-size: 14px;
      font-weight: 700;
      color: var(--text);
    }

    .modal-close {
      background: transparent;
      border: none;
      font-size: 18px;
      cursor: pointer;
      color: var(--text-muted);
    }
    .modal-close:hover { color: var(--text); }

    .modal-body {
      padding: 18px;
    }

    .modal-footer {
      padding: 12px 18px;
      border-top: 1px solid var(--border);
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      background: var(--surface-subtle);
    }

    /* TAB PANES */
    .tab-pane {
      display: none;
    }
    .tab-pane.active {
      display: block;
    }

    /* ICONS (SVG Technical Monograms) */
    .icon {
      width: 14px;
      height: 14px;
      vertical-align: middle;
      display: inline-block;
      fill: currentColor;
    }

    /* RADIO WEAR TILES */
    .wear-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 10px;
      margin: 10px 0;
    }

    .wear-option {
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 12px 10px;
      text-align: center;
      cursor: pointer;
      transition: all 0.15s ease;
      background: #ffffff;
    }

    .wear-option:hover {
      border-color: var(--brand);
      background: #f8fafc;
    }

    .wear-option.selected {
      border-color: var(--brand);
      background: var(--brand-bg);
      outline: 2px solid var(--brand);
    }

    .wear-option-badge {
      font-size: 11px;
      font-weight: 700;
      padding: 2px 6px;
      border-radius: 4px;
      display: inline-block;
      margin-bottom: 6px;
    }

    .wear-option-desc {
      font-size: 11px;
      color: var(--text-muted);
    }

    .toast {
      position: fixed;
      bottom: 24px;
      right: 24px;
      background: #0f172a;
      color: #ffffff;
      padding: 10px 18px;
      border-radius: var(--radius);
      font-size: 13px;
      font-weight: 600;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      transform: translateY(100px);
      transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
      z-index: 1000;
    }
    .toast.show {
      transform: translateY(0);
    }
  </style>
<meta name="office-csrf" content="<?php echo htmlspecialchars($_SESSION['tt_csrf'], ENT_QUOTES, 'UTF-8'); ?>" />
<script src="/office/production-client.js" defer></script>
</head>
<body>

  <!-- TOP HEADER BAR -->
  <header class="header-bar">
    <div class="header-left">
      <a href="/office/#wms" class="back-office-btn" title="Quay lại Kho Thương Mại B2B & Điều Hành">
        <svg class="icon" viewBox="0 0 16 16"><path d="M11 2L5 8l6 6"/></svg>
        Kho B2B / WMS
      </a>
      <div class="header-title-wrap">
        <div class="header-title">
          <span>Kho Sản Xuất & Dao Cụ CNC</span>
          <span class="badge-module">Nội Bộ TTPC & T&T Vina</span>
        </div>
        <div class="header-desc">Hệ thống cấp phát, thu hồi dao phay CNC (SOP-02) và quản lý dở dang Tự Động Hóa (SOP-01 FFRF)</div>
      </div>
    </div>

    <div class="header-right">
      <div class="shortcut-legend">
        <span>Phím tắt:</span>
        <kbd>Alt+1..4</kbd> Chuyển Tab |
        <kbd>Enter</kbd> Xác nhận |
        <kbd>1,2,3</kbd> Đánh giá mòn
      </div>
      <div class="user-pill">
        <svg class="icon" style="color: var(--ok);" viewBox="0 0 16 16"><circle cx="8" cy="8" r="4"/></svg>
        <span><?php echo htmlspecialchars($currentUserName, ENT_QUOTES, 'UTF-8'); ?></span>
      </div>
    </div>
  </header>

  <!-- NAVIGATION TABS (CLEAN URLS) -->
  <nav class="nav-bar">
    <a href="/office/san-xuat/dao-cnc" class="nav-item <?php echo $route === 'dao-cnc' ? 'active' : ''; ?>" data-route="dao-cnc" onclick="navigateTab('dao-cnc', event)">
      <span>1. Cấp Phát & Thu Hồi Dao CNC</span>
      <span class="nav-pill-count font-mono" id="nav-badge-cnc">0</span>
    </a>
    <a href="/office/san-xuat/tu-dong-hoa" class="nav-item <?php echo $route === 'tu-dong-hoa' ? 'active' : ''; ?>" data-route="tu-dong-hoa" onclick="navigateTab('tu-dong-hoa', event)">
      <span>2. Vật Tư Tự Động Hóa (Remnant)</span>
      <span class="nav-pill-count font-mono" id="nav-badge-wip">0</span>
    </a>
    <a href="/office/san-xuat/kiem-dinh" class="nav-item <?php echo $route === 'kiem-dinh' ? 'active' : ''; ?>" data-route="kiem-dinh" onclick="navigateTab('kiem-dinh', event)">
      <span>3. Bàn Soi Kính Lúp (Cô Huyền)</span>
      <span class="nav-pill-count font-mono" id="nav-badge-inspect">0</span>
    </a>
    <a href="/office/san-xuat/no-treo" class="nav-item <?php echo $route === 'no-treo' ? 'active' : ''; ?>" data-route="no-treo" onclick="navigateTab('no-treo', event)">
      <span>4. Giám Sát Nợ Treo (Chị Nhung PGĐ)</span>
      <span class="nav-pill-count nav-pill-danger font-mono" id="nav-badge-overdue">0</span>
    </a>
  </nav>

  <main class="container">
    <!-- METRICS OVERVIEW -->
    <section class="kpi-grid">
      <div class="kpi-card">
        <div class="kpi-title">
          <span>Dao Trên Máy CNC</span>
          <svg class="icon" style="color: var(--brand);" viewBox="0 0 16 16"><path d="M2 3h12v10H2z"/></svg>
        </div>
        <div class="kpi-value" id="kpi-in-shop">--</div>
        <div class="kpi-sub">Số cây dao thợ đang cầm gia công</div>
      </div>

      <div class="kpi-card">
        <div class="kpi-title">
          <span>Nợ Quá Hạn (>15 Ngày)</span>
          <svg class="icon" style="color: var(--danger);" viewBox="0 0 16 16"><circle cx="8" cy="8" r="7"/><path d="M8 4v4l3 3"/></svg>
        </div>
        <div class="kpi-value" style="color: var(--danger);" id="kpi-overdue">--</div>
        <div class="kpi-sub">Cần nhắc thợ mang về hoàn kho</div>
      </div>

      <div class="kpi-card">
        <div class="kpi-title">
          <span>Cuộn Lẻ Remnant TĐH</span>
          <svg class="icon" style="color: var(--ok);" viewBox="0 0 16 16"><path d="M3 3h10v10H3z"/></svg>
        </div>
        <div class="kpi-value" style="color: var(--ok);" id="kpi-remnants">--</div>
        <div class="kpi-sub"><span id="kpi-remnant-meters">0</span>m ống đã bảo toàn không lãng phí</div>
      </div>

      <div class="kpi-card">
        <div class="kpi-title">
          <span>Tỷ Lệ Mòn / Hủy</span>
          <svg class="icon" style="color: var(--warn);" viewBox="0 0 16 16"><path d="M1 14h14L8 2z"/></svg>
        </div>
        <div class="kpi-value" id="kpi-scrapped">--</div>
        <div class="kpi-sub">Đã chuyển thùng phế liệu hợp kim</div>
      </div>
    </section>

    <!-- ===================================================================== -->
    <!-- TAB 1: CAP PHAT & THU HOI DAO CNC (SOP-02) -->
    <!-- ===================================================================== -->
    <div id="pane-dao-cnc" class="tab-pane <?php echo $route === 'dao-cnc' ? 'active' : ''; ?>">
      <div class="grid-split">
        <!-- FORM CAP PHAT NHANH (QUAY KHO) -->
        <div class="card">
          <div class="card-header">
            <span class="card-title">
              <svg class="icon" viewBox="0 0 16 16"><path d="M8 2v12M2 8h12"/></svg>
              Cấp Dao Mới Cho Thợ CNC
            </span>
            <span class="badge badge-new">SOP-02</span>
          </div>

          <form id="form-tool-checkout" onsubmit="handleToolCheckout(event)">
            <div class="form-group">
              <label class="form-label">Mã Bản Vẽ Gia Công *</label>
              <input type="text" id="co-drawing" class="form-control font-mono" placeholder="VD: CN2610-PRO-817" required />
              <div class="form-hint">Nhìn trên phiếu giấy thợ đưa (QT-14-BM01)</div>
            </div>

            <div class="form-group">
              <label class="form-label">Kỹ Thuật Viên Gá Máy (Người Lấy) *</label>
              <select id="co-operator" class="form-control" required>
                <option value="">-- Chọn kỹ thuật viên CNC --</option>
                <option value="Thức">Thức (Máy phay)</option>
                <option value="Kiên">Kiên (Máy phay)</option>
                <option value="Dũng">Dũng</option>
                <option value="Ngọc">Ngọc</option>
                <option value="Nguyên">Nguyên</option>
                <option value="Thắng">Thắng</option>
                <option value="Tiến">Tiến</option>
                <option value="Tú">Tú</option>
                <option value="Duy Anh">Duy Anh</option>
                <option value="Phi">Phi</option>
                <option value="Hà">Hà</option>
                <option value="Đào Dũng">Đào Dũng</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Kỹ Sư Lập Trình (CAM)</label>
              <input type="text" id="co-programmer" class="form-control" value="Tính" placeholder="VD: Tính" />
            </div>

            <div class="form-group">
              <label class="form-label">Mã Laser Trên Cán Dao *</label>
              <input type="text" id="co-tool-code" class="form-control font-mono" placeholder="VD: NN-D12-011 hoặc MK-D04-005" required />
              <div class="form-hint">Mã định danh laser khắc ở thân dao</div>
            </div>

            <div class="form-group">
              <label class="form-label">Tình Trạng Cấp Ra</label>
              <select id="co-issued-status" class="form-control">
                <option value="NEW">Dao Mới (100% nguyên hộp)</option>
                <option value="USED_1X" selected>Dao 1 Lần (Me bên còn bén)</option>
                <option value="OLD">Dao Cũ (Dùng gia công thô/vát mép)</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Thủ Kho Cấp Phát</label>
              <input type="text" id="co-warehouse-staff" class="form-control" value="<?php echo htmlspecialchars($currentUserName, ENT_QUOTES, 'UTF-8'); ?>" />
            </div>

            <button type="submit" class="btn btn-brand btn-block" style="margin-top: 16px;">
              <span>Xác Nhận Cấp Dao Cho Thợ</span>
              <kbd>Enter</kbd>
            </button>
          </form>
        </div>

        <!-- BANG DANH SACH DAO CHUA TRA NGOAI XUONG -->
        <div class="card">
          <div class="card-header">
            <span class="card-title">
              <span>Danh Sách Dao Đang Mượn Ngoài Máy CNC (Chưa Hoàn Kho)</span>
            </span>
            <div style="display: flex; gap: 8px;">
              <select id="filter-unreturned-operator" class="form-control" style="width: 180px; padding: 4px 8px;" onchange="loadUnreturnedTools()">
                <option value="ALL">Tất cả kỹ thuật viên</option>
                <option value="Thức">Thức</option>
                <option value="Kiên">Kiên</option>
                <option value="Dũng">Dũng</option>
                <option value="Ngọc">Ngọc</option>
                <option value="Nguyên">Nguyên</option>
              </select>
              <button class="btn btn-outline btn-sm" onclick="openBatchCheckinModal()">
                <span>Thu Hồi Cả Lô</span>
              </button>
            </div>
          </div>

          <div class="table-container">
            <table>
              <thead>
                <tr>
                  <th style="width: 30px;"><input type="checkbox" id="check-all-tools" onclick="toggleSelectAllTools(this)" /></th>
                  <th>Mã Bản Vẽ</th>
                  <th>Mã Dao Laser</th>
                  <th>Quy Cách Gốc (OEM)</th>
                  <th>Thợ Giữ</th>
                  <th>Ngày Cấp</th>
                  <th>Thời Gian Giữ</th>
                  <th>Tình Trạng</th>
                  <th>Thao Tác</th>
                </tr>
              </thead>
              <tbody id="tbody-unreturned-tools">
                <tr><td colspan="9" style="text-align: center; color: var(--text-muted); padding: 24px;">Đang tải danh sách dao đang mượn...</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- ===================================================================== -->
    <!-- TAB 2: VAT TU TU DONG HOA (SOP-01 FFRF & REMNANT) -->
    <!-- ===================================================================== -->
    <div id="pane-tu-dong-hoa" class="tab-pane <?php echo $route === 'tu-dong-hoa' ? 'active' : ''; ?>">
      <div class="grid-split">
        <!-- FORM TAM UNG CUON NGUYEN -->
        <div class="card">
          <div class="card-header">
            <span class="card-title">Tạm Ứng Cuộn Ống TĐH</span>
            <span class="badge badge-used1x">SOP-01 FFRF</span>
          </div>

          <form id="form-wip-advance" onsubmit="handleWipAdvance(event)">
            <div class="form-group">
              <label class="form-label">Mã Dự Án Tự Động Hóa *</label>
              <input type="text" id="wip-project" class="form-control font-mono" placeholder="VD: PRJ-VINFAST-ROBOT-01" required />
            </div>

            <div class="form-group">
              <label class="form-label">Kỹ Sư Nhận Thi Công *</label>
              <input type="text" id="wip-engineer" class="form-control" value="Anh Phong" placeholder="VD: Anh Phong" required />
            </div>

            <div class="form-group">
              <label class="form-label">Loại Ống / Dây Cáp *</label>
              <select id="wip-product" class="form-control" required>
                <option value="1">Ống luồn bảo vệ Murrplastik EW-PA M25/P21 (Đức)</option>
                <option value="2">Ống luồn Murrplastik EW-PRF M32/P29 chịu robot</option>
                <option value="3">Cáp điều khiển lõi đồng nhiều sợi</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Chiều Dài Tạm Ứng (Mét) *</label>
              <input type="number" step="0.1" id="wip-advance-length" class="form-control font-mono" value="25.0" required />
              <div class="form-hint">Mặc định nguyên cuộn 25.0m. Sau khi hoàn thành trả lại số mét thừa.</div>
            </div>

            <button type="submit" class="btn btn-brand btn-block" style="margin-top: 16px;">
              <span>Xuất Tạm Ứng Cho Dự Án</span>
            </button>
          </form>
        </div>

        <!-- DANH SACH TAM UNG & HOAN KHO REMNANT -->
        <div class="card">
          <div class="card-header">
            <span class="card-title">Theo Dõi Cuộn Dở Dang & Kệ Remnant TĐH</span>
            <button class="btn btn-outline btn-sm" onclick="loadWipList()">Tải lại dữ liệu</button>
          </div>

          <div class="table-container">
            <table>
              <thead>
                <tr>
                  <th>Mã Phiếu</th>
                  <th>Mã Dự Án</th>
                  <th>Kỹ Sư</th>
                  <th>Quy Cách Vật Tư</th>
                  <th>Xuất (m)</th>
                  <th>Trả (m)</th>
                  <th>Thực Dùng (m)</th>
                  <th>Trạng Thái</th>
                  <th>Mã Tem Remnant</th>
                  <th>Thao Tác</th>
                </tr>
              </thead>
              <tbody id="tbody-wip-list">
                <tr><td colspan="10" style="text-align: center; color: var(--text-muted); padding: 24px;">Đang tải danh sách vật tư dở dang...</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- ===================================================================== -->
    <!-- TAB 3: BAN KIEM DINH KINH LUP (CO HUYEN) -->
    <!-- ===================================================================== -->
    <div id="pane-kiem-dinh" class="tab-pane <?php echo $route === 'kiem-dinh' ? 'active' : ''; ?>">
      <div class="card">
        <div class="card-header">
          <span class="card-title">
            <span>Bàn Kiểm Định & Đánh Giá Mòn Me Cắt (Cô Huyền)</span>
          </span>
          <span class="badge badge-old">Kính Lúp 20x Flank Wear VB</span>
        </div>

        <div style="background: var(--surface-subtle); padding: 12px 16px; border-radius: var(--radius); margin-bottom: 16px; border: 1px solid var(--border);">
          <div style="font-weight: 700; margin-bottom: 4px;">Quy chuẩn soi kính lúp 20x đánh giá độ mòn me cắt (SOP-02):</div>
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; font-size: 12px;">
            <div><strong>1. Dao 1 Lần:</strong> Vết mòn me $VB &lt; 0.15\text{ mm}$, me bên còn bén, không mẻ đỉnh. Giữ lại chạy tinh tiếp.</div>
            <div><strong>2. Dao Cũ:</strong> Vết mòn $VB \in [0.15, 0.35]\text{ mm}$, mòn đều. Phân loại chạy thô hoặc vát mép.</div>
            <div><strong>3. Dao Hủy:</strong> Vết mòn $VB &gt; 0.35\text{ mm}$, mẻ lưỡi nặng, nứt gãy. Chuyển thùng phế liệu hợp kim Carbide Scrap.</div>
          </div>
        </div>

        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>Mã Dao Laser</th>
                <th>Tên Dao Cụ</th>
                <th>Thợ Vừa Trả</th>
                <th>Mã Bản Vẽ Đã Chạy</th>
                <th>Số Lần Đã Mượn</th>
                <th>Đánh Giá Me Cắt (Cô Huyền)</th>
                <th>Ghi Chú Kỹ Thuật</th>
                <th>Xác Nhận</th>
              </tr>
            </thead>
            <tbody id="tbody-inspection-list">
              <tr><td colspan="8" style="text-align: center; color: var(--text-muted); padding: 24px;">Đang tải danh sách dao cần kiểm định...</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- ===================================================================== -->
    <!-- TAB 4: GIAM SAT NO TREO (CHI NHUNG PGD) -->
    <!-- ===================================================================== -->
    <div id="pane-no-treo" class="tab-pane <?php echo $route === 'no-treo' ? 'active' : ''; ?>">
      <div class="card">
        <div class="card-header">
          <span class="card-title" style="color: var(--danger);">
            <span>Báo Cáo Giám Sát Dao Cụ Quá Hạn (>15 Ngày Chưa Trả)</span>
          </span>
          <div style="display: flex; gap: 8px;">
            <button class="btn btn-outline btn-sm" onclick="exportOverdueCsv()">Xuất Báo Cáo CSV</button>
            <button class="btn btn-brand btn-sm" onclick="showToast('Đã sao chép danh sách nợ dao để gửi giao ban sản xuất')">Gửi Nhắc Nhở Giao Ban</button>
          </div>
        </div>

        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>Mã Bản Vẽ</th>
                <th>Mã Dao Laser</th>
                <th>Quy Cách Kỹ Thuật</th>
                <th>Kỹ Thuật Viên CNC</th>
                <th>Ngày Cấp</th>
                <th>Số Ngày Đã Cầm</th>
                <th>Cảnh Báo Nợ</th>
                <th>Hành Động Khẩn</th>
              </tr>
            </thead>
            <tbody id="tbody-overdue-list">
              <tr><td colspan="8" style="text-align: center; color: var(--text-muted); padding: 24px;">Đang kiểm tra dữ liệu nợ treo...</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </main>

  <!-- MODAL THU HOI & KIEM DINH DAO DON LE -->
  <div id="modal-single-return" class="modal-overlay">
    <div class="modal-card">
      <div class="modal-header">
        <span class="modal-title">Thu Hồi & Kiểm Định Me Dao</span>
        <button class="modal-close" onclick="closeModal('modal-single-return')">&times;</button>
      </div>
      <div class="modal-body">
        <input type="hidden" id="ret-movement-id" />
        <div style="background: var(--surface-subtle); padding: 10px 14px; border-radius: var(--radius); margin-bottom: 14px;">
          <div style="font-weight: 700;" id="ret-modal-tool-code">--</div>
          <div style="font-size: 12px; color: var(--text-muted);" id="ret-modal-tool-desc">--</div>
          <div style="font-size: 12px; color: var(--text-muted); margin-top: 4px;" id="ret-modal-operator">--</div>
        </div>

        <div class="form-group">
          <label class="form-label">Chọn Phân Loại Sau Khi Soi Kính Lúp (Bấm phím 1, 2, 3)</label>
          <div class="wear-grid">
            <div class="wear-option selected" id="opt-used1x" onclick="selectWearOption('USED_1X')">
              <span class="wear-option-badge badge-used1x">Phím 1: Dao 1 Lần</span>
              <div class="wear-option-desc">Me còn bén, VB &lt; 0.15mm</div>
            </div>
            <div class="wear-option" id="opt-old" onclick="selectWearOption('OLD')">
              <span class="wear-option-badge badge-old">Phím 2: Dao Cũ</span>
              <div class="wear-option-desc">Mòn đều chạy thô</div>
            </div>
            <div class="wear-option" id="opt-scrapped" onclick="selectWearOption('SCRAPPED')">
              <span class="wear-option-badge badge-scrapped">Phím 3: Hủy</span>
              <div class="wear-option-desc">Mẻ me, nứt phế liệu</div>
            </div>
          </div>
          <input type="hidden" id="ret-status-val" value="USED_1X" />
        </div>

        <div class="form-group">
          <label class="form-label">Độ mòn me cắt Flank Wear VB (mm - Tùy chọn)</label>
          <input type="number" step="0.01" id="ret-flank-vb" class="form-control font-mono" placeholder="VD: 0.12" />
        </div>

        <div class="form-group">
          <label class="form-label">Ghi Chú Đánh Giá Kỹ Thuật</label>
          <input type="text" id="ret-note" class="form-control" placeholder="VD: Mẻ nhẹ góc 45 độ, chuyển phay thô nhôm" />
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-outline" onclick="closeModal('modal-single-return')">Hủy Bỏ (Esc)</button>
        <button class="btn btn-ok" onclick="submitSingleReturn()">
          <span>Xác Nhận Nhập Kho</span>
          <kbd>Space</kbd>
        </button>
      </div>
    </div>
  </div>

  <!-- MODAL HOAN TRA CUON REMNANT TDH -->
  <div id="modal-wip-return" class="modal-overlay">
    <div class="modal-card">
      <div class="modal-header">
        <span class="modal-title">Hoàn Trả Cuộn Lẻ (Remnant) TĐH</span>
        <button class="modal-close" onclick="closeModal('modal-wip-return')">&times;</button>
      </div>
      <div class="modal-body">
        <input type="hidden" id="wip-ret-id" />
        <div style="background: var(--surface-subtle); padding: 10px 14px; border-radius: var(--radius); margin-bottom: 14px;">
          <div style="font-weight: 700;" id="wip-ret-modal-code">--</div>
          <div style="font-size: 12px; color: var(--text-muted);" id="wip-ret-modal-desc">--</div>
        </div>

        <div class="form-group">
          <label class="form-label">Số Mét Hoàn Trả Lại Kho (m) *</label>
          <input type="number" step="0.1" id="wip-ret-meters" class="form-control font-mono" placeholder="VD: 8.5" oninput="calculateRemnantDifference()" required />
          <div class="form-hint" id="wip-ret-calc-hint">Nhập số mét trả lại để tính chi phí thực dùng của dự án</div>
        </div>

        <div class="form-group">
          <label class="form-label">Phương Pháp Đo Chiều Dài *</label>
          <select id="wip-ret-method" class="form-control">
            <option value="LASER_MARKING">Đọc số mét laser in trên thân ống Murrplastik</option>
            <option value="WEIGHT_TARE">Cân trừ bì (g/m) theo catalogue Đức</option>
            <option value="MANUAL_TAPE">Kéo thước dây kiểm tra thủ công</option>
          </select>
        </div>

        <div class="form-group">
          <label class="form-label">Vị Trí Kệ Lưu Trữ Cuộn Lẻ (Kho TĐH)</label>
          <input type="text" id="wip-ret-rack" class="form-control" value="Kệ Hàng Lẻ - Ngăn Remnant TĐH - Ô A2" />
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-outline" onclick="closeModal('modal-wip-return')">Hủy Bỏ</button>
        <button class="btn btn-brand" onclick="submitWipReturn()">Chốt Hoàn Kho & Sinh Tem QR</button>
      </div>
    </div>
  </div>

  <!-- TOAST NOTIFICATION -->
  <div id="toast" class="toast"></div>

  <script>
    // GLOBAL STATE
    let currentTab = '<?php echo $route; ?>';
    let unreturnedData = [];
    let wipData = [];
    let selectedToolIds = new Set();

    // 1. ROUTING & CLEAN URLS (PushState & PopState)
    function navigateTab(tabId, ev) {
      if (ev) ev.preventDefault();
      
      currentTab = tabId;
      document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
      document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

      const targetPane = document.getElementById('pane-' + tabId);
      if (targetPane) targetPane.classList.add('active');

      const navBtn = document.querySelector(`.nav-item[data-route='${tabId}']`);
      if (navBtn) navBtn.classList.add('active');

      // Update browser URL cleanly without page reload
      const cleanUrl = '/office/san-xuat/' + tabId;
      window.history.pushState({ tab: tabId }, '', cleanUrl);

      // Load corresponding tab data
      refreshCurrentTab();
    }

    window.addEventListener('popstate', function(ev) {
      if (ev.state && ev.state.tab) {
        navigateTab(ev.state.tab);
      } else {
        const parts = window.location.pathname.split('/');
        const lastPart = parts[parts.length - 1];
        if (['dao-cnc', 'tu-dong-hoa', 'kiem-dinh', 'no-treo'].includes(lastPart)) {
          navigateTab(lastPart);
        }
      }
    });

    // 2. DATA FETCHING
    async function loadStats() {
      try {
        const res = await fetch('/office/api.php?action=production_stats_dashboard');
        const r = await res.json();
        if (r.ok && r.data) {
          document.getElementById('kpi-in-shop').innerText = r.data.in_shop;
          document.getElementById('kpi-overdue').innerText = r.data.overdue_count;
          document.getElementById('kpi-remnants').innerText = r.data.active_remnants;
          document.getElementById('kpi-remnant-meters').innerText = r.data.remnant_meters_saved;
          document.getElementById('kpi-scrapped').innerText = r.data.scrapped_count;

          document.getElementById('nav-badge-cnc').innerText = r.data.unreturned_count;
          document.getElementById('nav-badge-wip').innerText = r.data.pending_wip_count;
          document.getElementById('nav-badge-inspect').innerText = r.data.in_shop;
          document.getElementById('nav-badge-overdue').innerText = r.data.overdue_count;
        }
      } catch (e) {
        console.error('Lỗi tải thống kê:', e);
      }
    }

    async function loadUnreturnedTools() {
      const opFilter = document.getElementById('filter-unreturned-operator').value;
      try {
        const res = await fetch(`/office/api.php?action=production_unreturned_tools&operator=${encodeURIComponent(opFilter)}`);
        const r = await res.json();
        if (r.ok) {
          unreturnedData = r.unreturned || [];
          renderUnreturnedTable(unreturnedData);
          renderOverdueTable(unreturnedData.filter(x => x.is_overdue));
          renderInspectionTable(unreturnedData);
        }
      } catch (e) {
        console.error('Lỗi tải danh sách dao chưa trả:', e);
      }
    }

    function renderUnreturnedTable(tools) {
      const tbody = document.getElementById('tbody-unreturned-tools');
      if (tools.length === 0) {
        tbody.innerHTML = '<tr><td colspan="9" style="text-align: center; color: var(--text-muted); padding: 24px;">Hiện tại không có dao nào chưa hoàn kho.</td></tr>';
        return;
      }

      let html = '';
      tools.forEach(t => {
        const overdueBadge = t.is_overdue ? `<span class="badge badge-overdue">${t.days_held} ngày (Quá hạn)</span>` : `<span class="font-mono">${t.days_held} ngày</span>`;
        const statusBadge = t.issued_status === 'NEW' ? '<span class="badge badge-new">Mới</span>' : (t.issued_status === 'USED_1X' ? '<span class="badge badge-used1x">1 Lần</span>' : '<span class="badge badge-old">Cũ</span>');

        html += `
          <tr>
            <td><input type="checkbox" class="tool-checkbox" value="${t.movement_id}" onchange="toggleSelectTool(${t.movement_id}, this.checked)" /></td>
            <td class="font-mono" style="font-weight: 600;">${escapeHtml(t.drawing_code)}</td>
            <td class="font-mono" style="font-weight: 700; color: var(--brand);">${escapeHtml(t.tool_code)}</td>
            <td>${escapeHtml(t.oem_specs || t.tool_name)}</td>
            <td><strong>${escapeHtml(t.operator_name)}</strong></td>
            <td class="font-mono">${t.issued_at.substring(0, 10)}</td>
            <td>${overdueBadge}</td>
            <td>${statusBadge}</td>
            <td>
              <button class="btn btn-outline btn-sm" onclick="openSingleReturnModal(${t.movement_id}, '${escapeHtml(t.tool_code)}', '${escapeHtml(t.tool_name)}', '${escapeHtml(t.operator_name)}')">
                Thu Hồi / Me
              </button>
            </td>
          </tr>
        `;
      });
      tbody.innerHTML = html;
    }

    function renderOverdueTable(tools) {
      const tbody = document.getElementById('tbody-overdue-list');
      if (tools.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align: center; color: var(--ok); padding: 24px;">Tuyệt vời! Không có dao cụ nào bị nợ quá 15 ngày.</td></tr>';
        return;
      }

      let html = '';
      tools.forEach(t => {
        html += `
          <tr>
            <td class="font-mono" style="font-weight: 600;">${escapeHtml(t.drawing_code)}</td>
            <td class="font-mono" style="font-weight: 700; color: var(--danger);">${escapeHtml(t.tool_code)}</td>
            <td>${escapeHtml(t.oem_specs || t.tool_name)}</td>
            <td><strong style="color: var(--danger);">${escapeHtml(t.operator_name)}</strong></td>
            <td class="font-mono">${t.issued_at.substring(0, 10)}</td>
            <td class="font-mono" style="font-weight: 700; color: var(--danger);">${t.days_held} ngày</td>
            <td><span class="badge badge-overdue">Vượt ngưỡng 15 ngày</span></td>
            <td>
              <button class="btn btn-brand btn-sm" onclick="openSingleReturnModal(${t.movement_id}, '${escapeHtml(t.tool_code)}', '${escapeHtml(t.tool_name)}', '${escapeHtml(t.operator_name)}')">
                Đôn Đốc Hoàn Kho
              </button>
            </td>
          </tr>
        `;
      });
      tbody.innerHTML = html;
    }

    function renderInspectionTable(tools) {
      const tbody = document.getElementById('tbody-inspection-list');
      if (tools.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align: center; color: var(--text-muted); padding: 24px;">Không có dao cụ nào đang chờ soi kính lúp.</td></tr>';
        return;
      }

      let html = '';
      tools.slice(0, 20).forEach(t => {
        html += `
          <tr>
            <td class="font-mono" style="font-weight: 700; color: var(--brand);">${escapeHtml(t.tool_code)}</td>
            <td>${escapeHtml(t.oem_specs || t.tool_name)}</td>
            <td>${escapeHtml(t.operator_name)}</td>
            <td class="font-mono">${escapeHtml(t.drawing_code)}</td>
            <td class="font-mono">${t.days_held} ngày</td>
            <td>
              <select id="inspect-status-${t.movement_id}" class="form-control" style="padding: 4px 6px;">
                <option value="USED_1X">Dao 1 Lần (VB < 0.15mm)</option>
                <option value="OLD">Dao Cũ (Chạy thô)</option>
                <option value="SCRAPPED">Dao Hủy (Phế liệu)</option>
              </select>
            </td>
            <td>
              <input type="text" id="inspect-note-${t.movement_id}" class="form-control" placeholder="Ghi chú mòn me..." style="padding: 4px 6px;" />
            </td>
            <td>
              <button class="btn btn-ok btn-sm" onclick="quickInspectSubmit(${t.movement_id})">Lưu Me</button>
            </td>
          </tr>
        `;
      });
      tbody.innerHTML = html;
    }

    async function loadWipList() {
      try {
        const res = await fetch('/office/api.php?action=production_wip_list');
        const r = await res.json();
        if (r.ok) {
          wipData = r.wip_list || [];
          renderWipTable(wipData);
        }
      } catch (e) {
        console.error('Lỗi tải danh mục WIP:', e);
      }
    }

    function renderWipTable(list) {
      const tbody = document.getElementById('tbody-wip-list');
      if (list.length === 0) {
        tbody.innerHTML = '<tr><td colspan="10" style="text-align: center; color: var(--text-muted); padding: 24px;">Không có vật tư tự động hóa dở dang.</td></tr>';
        return;
      }

      let html = '';
      list.forEach(w => {
        const statusBadge = w.status === 'ADVANCED_TO_FLOOR' ? '<span class="badge badge-new">Đang Thi Công</span>' : (w.status === 'RETURNED_REMNANT' ? '<span class="badge badge-used1x">Hoàn Kho Remnant</span>' : '<span class="badge badge-old">Dùng Hết 100%</span>');
        const qrCode = w.remnant_qr_code ? `<span class="badge badge-used1x font-mono">${escapeHtml(w.remnant_qr_code)}</span>` : '<span style="color: var(--text-muted);">-</span>';
        const actionBtn = w.status === 'ADVANCED_TO_FLOOR' ? `<button class="btn btn-outline btn-sm" onclick="openWipReturnModal(${w.id}, '${escapeHtml(w.advance_code)}', '${escapeHtml(w.project_code)}', ${w.advance_length_meters})">Hoàn Trả Remnant</button>` : '<span style="color: var(--ok); font-size: 11px;">Đã chốt sổ</span>';

        html += `
          <tr>
            <td class="font-mono" style="font-weight: 600;">${escapeHtml(w.advance_code)}</td>
            <td class="font-mono" style="font-weight: 700; color: var(--brand);">${escapeHtml(w.project_code)}</td>
            <td>${escapeHtml(w.engineer_name)}</td>
            <td>${escapeHtml(w.name_vn || 'Ống luồn bảo vệ Murrplastik')}</td>
            <td class="font-mono">${Number(w.advance_length_meters).toFixed(1)}m</td>
            <td class="font-mono">${w.returned_length_meters ? Number(w.returned_length_meters).toFixed(1) + 'm' : '-'}</td>
            <td class="font-mono" style="font-weight: 700;">${w.consumed_length_meters ? Number(w.consumed_length_meters).toFixed(1) + 'm' : '-'}</td>
            <td>${statusBadge}</td>
            <td>${qrCode}</td>
            <td>${actionBtn}</td>
          </tr>
        `;
      });
      tbody.innerHTML = html;
    }

    // 3. ACTION HANDLERS
    async function handleToolCheckout(ev) {
      ev.preventDefault();
      const payload = {
        drawing_code: document.getElementById('co-drawing').value,
        operator_name: document.getElementById('co-operator').value,
        programmer_name: document.getElementById('co-programmer').value,
        tool_code: document.getElementById('co-tool-code').value,
        issued_status: document.getElementById('co-issued-status').value,
        warehouse_staff: document.getElementById('co-warehouse-staff').value
      };

      try {
        const res = await fetch('/office/api.php?action=production_tool_checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const r = await res.json();
        if (r.ok) {
          showToast(r.message || 'Cấp dao thành công!');
          document.getElementById('co-tool-code').value = '';
          loadStats();
          loadUnreturnedTools();
        } else {
          alert(r.error || 'Lỗi cấp dao');
        }
      } catch (e) {
        alert('Lỗi kết nối máy chủ');
      }
    }

    function openSingleReturnModal(movementId, toolCode, toolName, operatorName) {
      document.getElementById('ret-movement-id').value = movementId;
      document.getElementById('ret-modal-tool-code').innerText = toolCode;
      document.getElementById('ret-modal-tool-desc').innerText = toolName;
      document.getElementById('ret-modal-operator').innerText = 'Kỹ thuật viên trả: ' + operatorName;
      document.getElementById('ret-flank-vb').value = '';
      document.getElementById('ret-note').value = '';
      selectWearOption('USED_1X');
      openModal('modal-single-return');
    }

    function selectWearOption(val) {
      document.getElementById('ret-status-val').value = val;
      document.querySelectorAll('.wear-option').forEach(el => el.classList.remove('selected'));
      if (val === 'USED_1X') document.getElementById('opt-used1x').classList.add('selected');
      if (val === 'OLD') document.getElementById('opt-old').classList.add('selected');
      if (val === 'SCRAPPED') document.getElementById('opt-scrapped').classList.add('selected');
    }

    async function submitSingleReturn() {
      const movementId = document.getElementById('ret-movement-id').value;
      const returnedStatus = document.getElementById('ret-status-val').value;
      const flankWearVb = document.getElementById('ret-flank-vb').value;
      const note = document.getElementById('ret-note').value;

      try {
        const res = await fetch('/office/api.php?action=production_tool_checkin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            movement_id: movementId,
            returned_status: returnedStatus,
            flank_wear_vb_mm: flankWearVb,
            note: note,
            inspector_name: 'Cô Huyền'
          })
        });
        const r = await res.json();
        if (r.ok) {
          closeModal('modal-single-return');
          showToast(r.message || 'Thu hồi dao thành công!');
          loadStats();
          loadUnreturnedTools();
        } else {
          alert(r.error || 'Lỗi thu hồi dao');
        }
      } catch (e) {
        alert('Lỗi kết nối máy chủ');
      }
    }

    async function quickInspectSubmit(movementId) {
      const status = document.getElementById(`inspect-status-${movementId}`).value;
      const note = document.getElementById(`inspect-note-${movementId}`).value;

      try {
        const res = await fetch('/office/api.php?action=production_tool_checkin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            movement_id: movementId,
            returned_status: status,
            note: note,
            inspector_name: 'Cô Huyền'
          })
        });
        const r = await res.json();
        if (r.ok) {
          showToast('Đã lưu kết quả kiểm định me cắt!');
          loadStats();
          loadUnreturnedTools();
        } else {
          alert(r.error || 'Lỗi lưu kiểm định');
        }
      } catch (e) {
        alert('Lỗi kết nối máy chủ');
      }
    }

    // 4. WIP HANDLERS
    async function handleWipAdvance(ev) {
      ev.preventDefault();
      const payload = {
        project_code: document.getElementById('wip-project').value,
        engineer_name: document.getElementById('wip-engineer').value,
        product_id: document.getElementById('wip-product').value,
        advance_length_meters: document.getElementById('wip-advance-length').value
      };

      try {
        const res = await fetch('/office/api.php?action=production_wip_advance', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const r = await res.json();
        if (r.ok) {
          showToast(r.message || 'Xuất tạm ứng cuộn thành công!');
          document.getElementById('wip-project').value = '';
          loadStats();
          loadWipList();
        } else {
          alert(r.error || 'Lỗi xuất tạm ứng');
        }
      } catch (e) {
        alert('Lỗi kết nối máy chủ');
      }
    }

    let activeAdvanceLength = 25.0;
    function openWipReturnModal(wipId, advCode, projectCode, advLength) {
      activeAdvanceLength = advLength;
      document.getElementById('wip-ret-id').value = wipId;
      document.getElementById('wip-ret-modal-code').innerText = advCode + ' (' + projectCode + ')';
      document.getElementById('wip-ret-modal-desc').innerText = 'Chiều dài tạm ứng ban đầu: ' + advLength.toFixed(1) + ' mét';
      document.getElementById('wip-ret-meters').value = '';
      document.getElementById('wip-ret-calc-hint').innerText = 'Nhập số mét trả lại để tính chi phí thực dùng của dự án';
      openModal('modal-wip-return');
    }

    function calculateRemnantDifference() {
      const ret = parseFloat(document.getElementById('wip-ret-meters').value) || 0;
      const consumed = Math.max(0, activeAdvanceLength - ret);
      const hintEl = document.getElementById('wip-ret-calc-hint');
      if (ret >= 2.0) {
        hintEl.innerHTML = `Chi phí thực dùng: <strong>${consumed.toFixed(1)}m</strong>. Cuộn lẻ còn lại: <strong>${ret.toFixed(1)}m</strong> (Đủ điều kiện nhập kho Remnant & dán QR)`;
      } else {
        hintEl.innerHTML = `Chi phí thực dùng: <strong>${consumed.toFixed(1)}m</strong>. Phần thừa &lt; 2m (${ret.toFixed(1)}m) tính vào hao hụt/phế liệu công trình.`;
      }
    }

    async function submitWipReturn() {
      const wipId = document.getElementById('wip-ret-id').value;
      const retLength = document.getElementById('wip-ret-meters').value;
      const method = document.getElementById('wip-ret-method').value;
      const rack = document.getElementById('wip-ret-rack').value;

      try {
        const res = await fetch('/office/api.php?action=production_wip_return', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            wip_id: wipId,
            returned_length_meters: retLength,
            measurement_method: method,
            rack_location: rack
          })
        });
        const r = await res.json();
        if (r.ok) {
          closeModal('modal-wip-return');
          showToast(r.message || 'Hoàn kho remnant thành công!');
          loadStats();
          loadWipList();
        } else {
          alert(r.error || 'Lỗi hoàn kho remnant');
        }
      } catch (e) {
        alert('Lỗi kết nối máy chủ');
      }
    }

    // 5. KEYBOARD SHORTCUTS (WAREHOUSE ACCELERATORS)
    document.addEventListener('keydown', function(ev) {
      // Escape to close modals
      if (ev.key === 'Escape') {
        closeAllModals();
        return;
      }

      // Alt+1..4 for Tab switching
      if (ev.altKey) {
        if (ev.key === '1') { navigateTab('dao-cnc'); ev.preventDefault(); }
        if (ev.key === '2') { navigateTab('tu-dong-hoa'); ev.preventDefault(); }
        if (ev.key === '3') { navigateTab('kiem-dinh'); ev.preventDefault(); }
        if (ev.key === '4') { navigateTab('no-treo'); ev.preventDefault(); }
      }

      // In Return Modal: 1, 2, 3 for wear status selection
      const modalReturn = document.getElementById('modal-single-return');
      if (modalReturn.classList.contains('active')) {
        if (ev.key === '1') { selectWearOption('USED_1X'); ev.preventDefault(); }
        if (ev.key === '2') { selectWearOption('OLD'); ev.preventDefault(); }
        if (ev.key === '3') { selectWearOption('SCRAPPED'); ev.preventDefault(); }
        if (ev.code === 'Space' && ev.target.tagName !== 'INPUT') {
          submitSingleReturn();
          ev.preventDefault();
        }
      }
    });

    // MODAL UTILS
    function openModal(id) {
      document.getElementById(id).classList.add('active');
    }
    function closeModal(id) {
      document.getElementById(id).classList.remove('active');
    }
    function closeAllModals() {
      document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
    }

    function showToast(msg) {
      const toast = document.getElementById('toast');
      toast.innerText = msg;
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 3500);
    }

    function escapeHtml(str) {
      if (!str) return '';
      return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    function refreshCurrentTab() {
      loadStats();
      if (currentTab === 'dao-cnc' || currentTab === 'kiem-dinh' || currentTab === 'no-treo') {
        loadUnreturnedTools();
      }
      if (currentTab === 'tu-dong-hoa') {
        loadWipList();
      }
    }

    // INIT ON LOAD
    window.addEventListener('DOMContentLoaded', function() {
      refreshCurrentTab();
    });
  </script>
</body>
</html>
