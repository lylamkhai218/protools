<?php

/**

 * TTVINA OFFICE - INDUSTRIAL B2B OPERATIONS SYSTEM

 * Frontend Portal: High-Density Industrial SPA

 * Built strictly according to design-taste-frontend App Screens standards

 */

require_once __DIR__ . '/config.php';

$user = get_auth_user();
if ($user && !empty($user['workshop_role'])) { header('Location: /office/san-xuat'); exit; }

?>

<!DOCTYPE html>

<html lang="vi">

<head>
<?php if ($user): ?>
<meta name="office-csrf" content="<?=htmlspecialchars($_SESSION['tt_csrf'],ENT_QUOTES,'UTF-8')?>">
<script src="/office/production-client.js" defer></script>
<?php endif; ?>

  <meta charset="UTF-8" />

  <meta name="viewport" content="width=device-width, initial-scale=1.0" />

  <meta name="robots" content="noindex, nofollow, noarchive" />

  <title>TTVina Office - Hệ Thống Quản Lý Vận Hành Doanh Nghiệp</title>

  <link rel="icon" type="image/svg+xml" href="/logos/TTV_LOGO_Color_Master.svg" />

  

  <!-- High-Precision Technical Typography (Inter & JetBrains Mono) -->

  <link rel="preconnect" href="https://fonts.googleapis.com">

  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet">



  <style>

    :root {

      --bg: #f8fafc;

      --surface: #ffffff;

      --surface-subtle: #f8fafc;

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

    }

    

    .font-mono {

      font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, monospace;

    }



    .tabular-num {

      font-variant-numeric: tabular-nums;

    }



    /* Header */

    .app-header { 

      background: #ffffff; 

      border-bottom: 1px solid var(--border); 

      padding: 10px 24px; 

      display: flex; 

      align-items: center; 

      justify-content: space-between; 

      position: sticky; 

      top: 0; 

      z-index: 100; 

    }

    .brand-wrap { display: flex; align-items: center; gap: 12px; }

    .brand-logo { height: 30px; }

    .brand-title { font-size: 15px; font-weight: 700; color: var(--brand-dark); letter-spacing: -0.01em; }

    .brand-sub { font-size: 11px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.04em; }

    

    .user-hub { display: flex; align-items: center; gap: 12px; }

    .role-badge { padding: 3px 8px; border-radius: 4px; font-size: 11px; font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase; }

    .role-ADMIN { background: #fee2e2; color: #991b1b; border: 1px solid #fecaca; }

    .role-SALES { background: #e0f2fe; color: #0369a1; border: 1px solid #bae6fd; }

    .role-PROCUREMENT { background: #fef3c7; color: #92400e; border: 1px solid #fde68a; }

    .role-WAREHOUSE { background: #dcfce7; color: #166534; border: 1px solid #bbf7d0; }

    .role-ACCOUNTANT { background: #f3e8ff; color: #6b21a8; border: 1px solid #e9d5ff; }

    

    .btn-logout { background: transparent; border: 1px solid var(--border); padding: 5px 10px; border-radius: var(--radius); cursor: pointer; font-size: 12px; font-weight: 500; color: var(--text); }

    .btn-logout:hover { background: var(--surface-subtle); color: var(--danger); border-color: var(--danger-border); }



    /* Navigation Bar (Segmented Control) */

    .nav-bar { 

      background: #ffffff; 

      border-bottom: 1px solid var(--border); 

      display: flex; 

      padding: 0 24px; 

      gap: 4px; 

      overflow-x: auto;

    }

    .nav-item { 

      padding: 11px 16px; 

      cursor: pointer; 

      font-weight: 600; 

      font-size: 13px;

      color: var(--text-muted); 

      border-bottom: 2px solid transparent; 

      transition: all 0.12s ease; 

      display: flex; 

      align-items: center; 

      gap: 6px; 

      white-space: nowrap;

    }

    .nav-item:hover { color: var(--brand); background: #f8fafc; }

    .nav-item.active { color: var(--brand); border-bottom-color: var(--brand); font-weight: 700; background: #f8fafc; }

    

    /* Layout Container */

    .main-wrap { max-width: 1440px; margin: 0 auto; padding: 20px 24px 60px; }

    

    /* Alerts */

    .alert-banner { 

      padding: 12px 16px; 

      border-radius: var(--radius); 

      margin-bottom: 16px; 

      display: flex; 

      align-items: center; 

      justify-content: space-between; 

      border: 1px solid transparent; 

    }

    .alert-danger { background: var(--danger-bg); border-color: var(--danger-border); color: var(--danger); }

    .alert-warn { background: var(--warn-bg); border-color: var(--warn-border); color: #92400e; }

    .alert-title { font-weight: 700; font-size: 13px; margin-bottom: 2px; }

    .alert-text { font-size: 12px; }

    

    /* Quick Action Header */

    .quick-action-bar {

      display: flex;

      flex-wrap: wrap;

      align-items: center;

      justify-content: space-between;

      gap: 12px;

      margin-bottom: 16px;

      padding: 10px 16px;

      background: #ffffff;

      border: 1px solid var(--border);

      border-radius: var(--radius);

    }

    .quick-actions-btns {

      display: flex;

      flex-wrap: wrap;

      gap: 8px;

    }



    /* KPI Cards (Clean Typography - Flat per app-screens.md) */

    .kpi-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 14px; margin-bottom: 20px; }

    .kpi-card { 

      background: #ffffff; 

      border: 1px solid var(--border); 

      border-radius: var(--radius); 

      padding: 14px 16px; 

    }

    .kpi-label { 

      font-size: 11px; 

      font-weight: 600; 

      color: var(--text-muted); 

      text-transform: uppercase; 

      letter-spacing: 0.04em; 

      margin-bottom: 4px; 

    }

    .kpi-value { 

      font-size: 24px; 

      font-weight: 800; 

      color: var(--brand-dark); 

      font-variant-numeric: tabular-nums;

      line-height: 1.2;

    }

    .kpi-sub { font-size: 11px; color: var(--text-muted); margin-top: 4px; }



    /* Tables (Clean rules & alignment) */

    .table-card { 

      background: #ffffff; 

      border: 1px solid var(--border); 

      border-radius: var(--radius); 

      overflow: hidden; 

      margin-bottom: 20px; 

    }

    .table-header { 

      padding: 12px 16px; 

      border-bottom: 1px solid var(--border); 

      display: flex; 

      justify-content: space-between; 

      align-items: center; 

      background: var(--surface-subtle); 

    }

    .table-title { font-size: 14px; font-weight: 700; color: var(--brand-dark); }

    .table-responsive { width: 100%; overflow-x: auto; }

    .table-scroll-container { max-height: 440px; overflow-y: auto; }

    

    table { width: 100%; border-collapse: collapse; text-align: left; font-size: 13px; }

    th { 

      background: #f8fafc; 

      color: var(--text-muted); 

      font-weight: 600; 

      padding: 9px 12px; 

      border-bottom: 1px solid var(--border); 

      font-size: 11px; 

      text-transform: uppercase;

      letter-spacing: 0.04em;

      white-space: nowrap;

      position: sticky;

      top: 0;

      z-index: 5;

    }

    th.num, td.num { text-align: right; font-variant-numeric: tabular-nums; }

    td { 

      padding: 10px 12px; 

      border-bottom: 1px solid #f1f5f9; 

      vertical-align: middle; 

    }

    tr:hover td { background: #f8fafc; }

    

    /* Table Footer Bar (Pagination / Expand UX) */

    .table-footer-bar {

      padding: 10px 16px;

      background: var(--surface-subtle);

      border-top: 1px solid var(--border);

      display: flex;

      justify-content: space-between;

      align-items: center;

      font-size: 12px;

    }

    .table-footer-info {

      color: var(--text-muted);

      font-weight: 500;

    }

    .table-footer-actions {

      display: flex;

      gap: 6px;

    }



    /* Buttons */

    .btn { 

      padding: 6px 12px; 

      border-radius: var(--radius); 

      font-size: 12px; 

      font-weight: 600; 

      cursor: pointer; 

      border: 1px solid transparent; 

      display: inline-flex; 

      align-items: center; 

      gap: 6px; 

      text-decoration: none; 

      transition: all 0.1s ease; 

    }

    .btn-primary { background: var(--brand); color: #ffffff; }

    .btn-primary:hover { background: var(--brand-dark); }

    .btn-outline { background: #ffffff; border-color: var(--border-dark); color: var(--text); }

    .btn-outline:hover { background: var(--surface-subtle); border-color: #94a3b8; }

    .btn-sm { padding: 4px 8px; font-size: 11px; }

    .btn-danger { background: #ffffff; border-color: var(--danger-border); color: var(--danger); }

    .btn-danger:hover { background: var(--danger-bg); }

    

    /* Floating Back-To-Top Button (Refined & Subtle) */

    #btn-back-to-top {

      position: fixed;

      bottom: 24px;

      right: 24px;

      z-index: 1000;

      width: 34px;

      height: 34px;

      border-radius: 50%;

      background: #ffffff;

      border: 1px solid var(--border-dark);

      color: var(--brand);

      display: none;

      align-items: center;

      justify-content: center;

      cursor: pointer;

      box-shadow: 0 4px 12px rgba(15,23,42,0.12);

      transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);

      opacity: 0;

    }

    #btn-back-to-top:hover {

      background: var(--brand);

      color: #ffffff;

      border-color: var(--brand);

      transform: translateY(-2px);

      box-shadow: 0 6px 16px rgba(0,71,141,0.25);

    }

    #btn-back-to-top.visible {

      display: flex;

      opacity: 1;

    }



    /* Modals */

    .modal-overlay { 

      position: fixed; 

      inset: 0; 

      background: rgba(15,23,42,0.55); 

      backdrop-filter: blur(2px);

      display: none; 

      align-items: center; 

      justify-content: center; 

      z-index: 1000; 

      padding: 16px; 

    }

    .modal-overlay.active { display: flex; }

    .modal-card { 

      background: #ffffff; 

      border-radius: 8px; 

      max-width: 720px; 

      width: 100%; 

      max-height: 90vh; 

      overflow-y: auto; 

      border: 1px solid var(--border-dark);

      box-shadow: 0 16px 36px rgba(0,0,0,0.18); 

    }

    .modal-header { 

      padding: 14px 18px; 

      border-bottom: 1px solid var(--border); 

      display: flex; 

      justify-content: space-between; 

      align-items: center; 

      background: #f8fafc;

    }

    .modal-title { font-size: 15px; font-weight: 700; color: var(--brand-dark); }

    .modal-body { padding: 18px; }

    .modal-footer { 

      padding: 12px 18px; 

      border-top: 1px solid var(--border); 

      display: flex; 

      justify-content: flex-end; 

      gap: 10px; 

      background: #f8fafc; 

    }



    /* Forms */

    .form-group { margin-bottom: 14px; }

    .form-label { display: block; font-size: 12px; font-weight: 600; color: var(--text); margin-bottom: 4px; }

    .form-input, .form-select { 

      width: 100%; 

      padding: 7px 10px; 

      border: 1px solid var(--border-dark); 

      border-radius: var(--radius); 

      font-size: 13px; 

      background: #ffffff;

      color: var(--text);

    }

    .form-input:focus, .form-select:focus { 

      border-color: var(--brand); 

      outline: none; 

      box-shadow: 0 0 0 2px var(--brand-bg); 

    }



    /* Toast Notification System */

    .toast-container {

      position: fixed;

      bottom: 20px;

      right: 20px;

      z-index: 2000;

      display: flex;

      flex-direction: column;

      gap: 8px;

    }

    .toast-box {

      padding: 10px 16px;

      border-radius: var(--radius);

      font-size: 13px;

      font-weight: 600;

      display: flex;

      align-items: center;

      gap: 10px;

      min-width: 280px;

      box-shadow: 0 4px 12px rgba(0,0,0,0.12);

      animation: slideIn 0.2s ease-out;

    }

    .toast-success { background: #065f46; color: #ffffff; }

    .toast-error { background: #991b1b; color: #ffffff; }

    .toast-info { background: #1e3a8a; color: #ffffff; }

    @keyframes slideIn {

      from { transform: translateY(20px); opacity: 0; }

      to { transform: translateY(0); opacity: 1; }

    }



    /* Login Gate */

    .login-container { min-height: 85vh; display: flex; align-items: center; justify-content: center; }

    .login-card { background: #ffffff; border: 1px solid var(--border); border-radius: 8px; padding: 32px; width: 100%; max-width: 400px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }

  

    /* Focus rings for keyboard navigation (WCAG 2.1) */

    :focus-visible {

      outline: 2px solid var(--brand);

      outline-offset: 2px;

    }



    /* Modal Close Button */

    .btn-modal-close {

      background: none;

      border: none;

      font-size: 22px;

      line-height: 1;

      width: 32px;

      height: 32px;

      display: flex;

      align-items: center;

      justify-content: center;

      cursor: pointer;

      color: var(--text-muted);

      border-radius: 4px;

      transition: all 0.15s ease;

    }

    .btn-modal-close:hover {

      background: var(--surface-subtle);

      color: var(--danger);

    }



    /* Responsive Breakpoints & Mobile Optimization */

    @media (max-width: 1024px) {

      .quick-actions { grid-template-columns: repeat(2, 1fr) !important; }

      .kpi-grid { grid-template-columns: repeat(2, 1fr) !important; }

    }



    @media (max-width: 768px) {

      .app-header { flex-direction: column; align-items: flex-start; gap: 12px; padding: 12px 16px; }

      .user-box { width: 100%; justify-content: space-between; }

      .nav-bar { overflow-x: auto; white-space: nowrap; -webkit-overflow-scrolling: touch; padding: 0 12px; scrollbar-width: none; }

      .nav-bar::-webkit-scrollbar { display: none; }

      .nav-item { flex-shrink: 0; padding: 10px 14px; font-size: 13px; }

      .main-content { padding: 12px; }

      .quick-actions { grid-template-columns: 1fr !important; }

      .kpi-grid { grid-template-columns: 1fr !important; }

      .modal-card { width: calc(100vw - 20px) !important; max-width: calc(100vw - 20px) !important; margin: 10px auto; max-height: 92vh; }

      .filter-bar { flex-direction: column; align-items: stretch; gap: 8px; }

      .filter-bar input { width: 100% !important; }

      .table-card { overflow-x: auto; }

      .table-header { flex-direction: column; align-items: flex-start; gap: 6px; }

    }



    /* Subtab and Filter Buttons */

    .subtab-btn {

      transition: all 0.15s ease;

      cursor: pointer;

    }

    .subtab-btn:hover {

      color: var(--brand);

    }

    .subtab-btn.active {

      border-bottom: 2px solid var(--brand) !important;

      color: var(--brand) !important;

      font-weight: 700 !important;

    }

    .btn-cust-filter {

      border: 1px solid var(--border);

      background: var(--surface);

      color: var(--text);

      cursor: pointer;

      transition: all 0.15s ease;

    }

    .btn-cust-filter:hover {

      border-color: var(--brand-border);

      color: var(--brand);

    }

    .btn-cust-filter.active {

      background: var(--brand) !important;

      color: #ffffff !important;

      border-color: var(--brand) !important;

      font-weight: 700 !important;

    }



    /* Print View for Quotation Detail */

    @media print {

      body * {

        visibility: hidden !important;

      }

      #modal-quote-detail,

      #modal-quote-detail * {

        visibility: visible !important;

      }

      #modal-quote-detail {

        position: absolute !important;

        left: 0 !important;

        top: 0 !important;

        width: 100% !important;

        background: #ffffff !important;

        padding: 0 !important;

        margin: 0 !important;

        box-shadow: none !important;

      }

      #modal-quote-detail .modal-card {

        box-shadow: none !important;

        border: none !important;

        max-width: 100% !important;

        width: 100% !important;

        padding: 0 !important;

      }

      #modal-quote-detail .btn-modal-close,

      #modal-quote-detail .modal-footer {

        display: none !important;

      }

    }

    @keyframes spin {

      to { transform: rotate(360deg); }

    }



    .excel-preview-table {

      width: 100%;

      border-collapse: collapse;

      font-size: 12px;

      font-family: inherit;

    }

    .excel-preview-table th,

    .excel-preview-table td {

      padding: 6px 10px;

      border: 1px solid #cbd5e1;

      white-space: nowrap;

    }

    .excel-preview-table tr:first-child th,

    .excel-preview-table tr:first-child td {

      background: #f1f5f9;

      font-weight: 700;

      position: sticky;

      top: 0;

      z-index: 2;

      box-shadow: 0 1px 0 #cbd5e1;

    }

    .excel-preview-table tr:nth-child(even) {

      background: #f8fafc;

    }

    .excel-preview-table tr:nth-child(odd) {

      background: #ffffff;

    }

    .excel-preview-table tr:hover {

      background: #eff6ff !important;

    }

    .btn-sheet-tab {

      transition: all 0.15s ease;

    }

    .btn-sheet-tab:hover {

      opacity: 0.9;

    }

      /* Industrial Action Button Group & Alignment */

    .action-group {

      display: flex;

      align-items: center;

      gap: 6px;

      justify-content: flex-start;

      white-space: nowrap;

    }

    .action-group-right {

      justify-content: flex-end;

    }



    .btn-act {

      display: inline-flex;

      align-items: center;

      justify-content: center;

      height: 26px;

      padding: 0 10px;

      font-size: 11.5px;

      font-weight: 600;

      border-radius: 4px;

      cursor: pointer;

      transition: all 0.15s ease;

      white-space: nowrap;

      line-height: 24px;

      border: 1px solid transparent;

      text-decoration: none;

      box-sizing: border-box;

      outline: none;

    }



    /* Xem (View) - Clean Brand Outline */

    .btn-act-view {

      background: #ffffff;

      border-color: #cbd5e1;

      color: var(--brand);

    }

    .btn-act-view:hover {

      background: #eff6ff;

      border-color: var(--brand);

      color: var(--brand-dark);

    }



    /* Duyệt (Approve) - Solid Brand */

    .btn-act-approve {

      background: #00478d;

      border-color: #00478d;

      color: #ffffff;

    }

    .btn-act-approve:hover {

      background: #003366;

      border-color: #003366;

    }



    /* Xóa (Delete) - Subtle Danger Outline */

    .btn-act-del {

      background: #ffffff;

      border-color: #fecaca;

      color: #dc2626;

      padding: 0 8px;

    }

    .btn-act-del:hover {

      background: #fef2f2;

      border-color: #dc2626;

    }



    /* Sửa (Edit) & Tải Về - Subtle Slate */

    .btn-act-edit {

      background: #ffffff;

      border-color: #cbd5e1;

      color: var(--text);

    }

    .btn-act-edit:hover {

      background: #f8fafc;

      border-color: var(--brand);

      color: var(--brand);

    }



    /* ============================================================================

       TASTE-SKILL V2: TECHNICAL LOGISTICS STEPPER WITH DASHED CONNECTORS

       ============================================================================ */

    .stepper-container {

      display: flex;

      align-items: flex-start;

      justify-content: space-between;

      position: relative;

      width: 100%;

      margin-top: 14px;

      padding: 6px 0 2px 0;

    }



    .stepper-step {

      flex: 1;

      display: flex;

      flex-direction: column;

      align-items: center;

      position: relative;

      text-align: center;

      padding: 0 4px;

    }



    /* Track connector lines between nodes */

    .stepper-track-line {

      position: absolute;

      top: 15px; /* exactly at vertical center of 30px circle */

      z-index: 1;

    }



    .stepper-track-left {

      left: 0;

      right: 50%;

    }



    .stepper-track-right {

      left: 50%;

      right: 0;

    }



    .stepper-track-solid {

      background: #0284c7;

      height: 2px;

    }



    .stepper-track-dashed {

      border-top: 2px dashed #0284c7;

      height: 0;

    }



    .stepper-track-muted-dashed {

      border-top: 2px dashed #cbd5e1;

      height: 0;

    }



    /* Node circle */

    .stepper-node-circle {

      width: 30px;

      height: 30px;

      border-radius: 50%;

      display: flex;

      align-items: center;

      justify-content: center;

      position: relative;

      z-index: 2;

      transition: all 0.2s ease;

      font-size: 11px;

      font-weight: 800;

      flex-shrink: 0;

    }



    .stepper-node-done {

      background: #0284c7;

      color: #ffffff;

      border: 2px solid #0284c7;

      box-shadow: 0 1px 3px rgba(2, 132, 199, 0.25);

    }



    .stepper-node-active {

      background: #0f172a;

      color: #ffffff;

      border: 2px solid #0284c7;

      box-shadow: 0 0 0 4px #e0f2fe;

    }



    @keyframes beaconPulse {

      0% { box-shadow: 0 0 0 0 rgba(2, 132, 199, 0.5); }

      70% { box-shadow: 0 0 0 7px rgba(2, 132, 199, 0); }

      100% { box-shadow: 0 0 0 0 rgba(2, 132, 199, 0); }

    }



    .stepper-node-active {

      animation: beaconPulse 2.4s infinite cubic-bezier(0.4, 0, 0.6, 1);

    }



    .stepper-node-pending {

      background: #ffffff;

      color: #94a3b8;

      border: 2px dashed #94a3b8;

    }



    .stepper-label-title {

      font-size: 11px;

      font-weight: 700;

      margin-top: 8px;

      line-height: 1.35;

      color: #0f172a;

    }

    .stepper-label-title.pending {

      color: #94a3b8;

      font-weight: 600;

    }

    .stepper-label-title.active {

      color: #0284c7;

    }



    .stepper-label-desc {

      font-size: 10px;

      color: #64748b;

      margin-top: 2px;

      line-height: 1.35;

      max-width: 125px;

      display: -webkit-box;

      -webkit-line-clamp: 2;

      -webkit-box-orient: vertical;

      overflow: hidden;

    }



    .stepper-label-date {

      display: inline-block;

      margin-top: 4px;

      font-size: 9.5px;

      font-weight: 700;

      padding: 1px 5px;

      border-radius: 3px;

      background: #f1f5f9;

      color: #475569;

      border: 1px solid #e2e8f0;

    }

    .stepper-label-date.active {

      background: #eff6ff;

      color: #0284c7;

      border-color: #bfdbfe;

    }

    .stepper-label-date.delivery {

      background: #ecfdf5;

      color: #059669;

      border-color: #a7f3d0;

    }

  </style>

  <!-- Client-side Document Engines (SheetJS for Excel & Mammoth for Word) -->

  <script src="/office/xlsx.full.min.js"></script>

  <script src="/office/mammoth.browser.min.js"></script>

</head>

<body>



<!-- Toast Notification Outlet -->

<div id="toast-container" class="toast-container"></div>



<!-- Floating Back To Top Button -->

<button id="btn-back-to-top" onclick="scrollToTop()" title="Cuộn lên đầu trang" aria-label="Cuộn lên đầu trang">

  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m18 15-6-6-6 6"/></svg>

</button>



<?php if (!$user): ?>

  <!-- LOGIN SCREEN -->

  <div class="login-container">

    <div class="login-card">

      <div style="text-align: center; margin-bottom: 24px;">

        <img src="/logos/TTV_LOGO_Color_Master.svg" alt="T&T Vina" style="height: 38px; margin-bottom: 10px;" />

        <h2 style="font-size: 18px; font-weight: 800; color: var(--brand-dark);">TTVINA OFFICE</h2>

        <p style="font-size: 12px; color: var(--text-muted);">Hệ Thống Quản Lý Vận Hành Doanh Nghiệp</p>

      </div>



      <div id="login-error" style="display: none;" class="alert-banner alert-danger">

        <span id="login-error-text"></span>

      </div>



      <form id="login-form">

        <div class="form-group">

          <label class="form-label">Email tài khoản</label>

          <input type="text" id="login-email" class="form-input" placeholder="Email hoặc mã nhân viên" autocomplete="username" required />

        </div>

        <div class="form-group">

          <label class="form-label">Mật khẩu</label>

          <input type="password" id="login-password" class="form-input" placeholder="Mật khẩu bảo mật" required />

        </div>

        <button type="submit" class="btn btn-primary" style="width: 100%; justify-content: center; padding: 9px; font-size: 13px;">ĐĂNG NHẬP HỆ THỐNG</button>

      </form>



      <!-- 2FA OTP FORM -->

      <form id="otp-form" style="display: none;" onsubmit="handleVerify2FA(event)">

        <div style="background: var(--surface-subtle); border: 1px solid var(--border); border-radius: 6px; padding: 12px; margin-bottom: 14px; text-align: center;">

          <div style="font-size: 11px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600;">Xác Thực Bảo Mật 2 Lớp</div>

          <div style="font-size: 13px; font-weight: 700; color: var(--brand-dark); margin-top: 4px;">Mã OTP đã gửi qua Telegram</div>

          <div style="font-size: 12px; color: var(--text-muted); margin-top: 2px;">Hiệu lực trong: <span id="otp-countdown" style="font-weight: 700; color: var(--warn);">05:00</span></div>

        </div>

        <div class="form-group">

          <label class="form-label" style="text-align: center;">Nhập mã OTP 6 chữ số</label>

          <input type="text" id="otp-code" class="form-input font-mono" maxlength="6" placeholder="------" style="font-size: 22px; font-weight: 800; text-align: center; letter-spacing: 6px;" required autocomplete="one-time-code" />

        </div>

        <button type="submit" id="btn-verify-otp" class="btn btn-primary" style="width: 100%; justify-content: center; padding: 9px; font-size: 13px; margin-bottom: 8px;">XÁC NHẬN ĐĂNG NHẬP</button>

        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px;">

          <button type="button" onclick="cancel2FA()" class="btn btn-outline btn-sm" style="font-size: 11px;">Quay lại</button>

          <button type="button" id="btn-resend-otp" onclick="resend2FA()" class="btn btn-outline btn-sm" style="font-size: 11px;">Gửi lại mã</button>

        </div>

        <div style="font-size: 11px; color: var(--text-muted); text-align: center; margin-top: 12px; border-top: 1px dashed var(--border); padding-top: 8px;">

          Mã OTP 6 số đã được gửi qua Telegram Bot an ninh. Vui lòng kiểm tra tin nhắn để hoàn tất.

        </div>

      </form>

    </div>

  </div>



<?php else: ?>

  <!-- APPLICATION SHELL -->

  <header class="app-header">

    <div class="brand-wrap">

      <img src="/logos/TTV_LOGO_Color_Master.svg" alt="T&T Vina" class="brand-logo" />

      <div>

        <div class="brand-title">TTVINA OFFICE</div>

        <div class="brand-sub">Hệ Thống Quản Lý Vận Hành Doanh Nghiệp</div>

      </div>

    </div>

    

    <div class="user-hub">

      <div style="text-align: right;">

        <div style="font-weight: 700; font-size: 13px;"><?= htmlspecialchars($user['name']) ?></div>

        <div style="font-size: 11px; color: var(--text-muted);"><?= htmlspecialchars($user['email']) ?></div>

      </div>

      <?php

      $roleNames = array(

          'ADMIN' => 'Ban Giám Đốc',

          'SALES' => 'Kinh Doanh',

          'PROCUREMENT' => 'Thu Mua & XNK',

          'WAREHOUSE' => 'Thủ Kho',

          'ACCOUNTANT' => 'Kế Toán'

      );

      $displayRole = isset($roleNames[$user['role']]) ? $roleNames[$user['role']] : $user['role'];

      ?>

      <span class="role-badge role-<?= $user['role'] ?>"><?= $displayRole ?></span>

      <button onclick="handleLogout()" class="btn-logout">Đăng xuất</button>

    </div>

  </header>



  <!-- NAVIGATION TABS -->

  <nav class="nav-bar">

    <div class="nav-item active" data-tab="dashboard" onclick="switchTab('dashboard', this)">1. Tổng quan</div>

    <div class="nav-item" data-tab="wms" onclick="switchTab('wms', this)">2. Kho hàng (WMS)</div>

    <div class="nav-item" data-tab="sales" onclick="switchTab('sales', this)">3. Bán hàng & Báo giá</div>

    <div class="nav-item" data-tab="procurement" onclick="switchTab('procurement', this)">4. Mua hàng & Vận tải (Air & Sea)</div>

    <div class="nav-item" data-tab="documents" onclick="switchTab('documents', this)">5. Hồ sơ Chứng từ</div>

  
    <a href="/office/san-xuat/dao-cnc" class="nav-item" style="text-decoration: none; color: inherit; display: inline-flex; align-items: center; gap: 6px;">
      <span>6. Kho Sản Xuất & Dao CNC</span>
      <span style="font-size: 10px; font-weight: 700; background: var(--brand-bg); color: var(--brand); border: 1px solid var(--brand-border); padding: 1px 5px; border-radius: 4px;">Mới</span>
    </a>
  </nav>



  <main class="main-wrap">

    

    <!-- TAB 1: TỔNG QUAN (DASHBOARD) -->

    <section id="tab-dashboard" class="tab-pane">

      

      <!-- Storage Fee Alert Banner -->

      <div id="storage-alert-box" style="display: none;" class="alert-banner alert-warn">

        <div>

          <div class="alert-title" id="storage-alert-title">Thông báo hàng về DHL Express (AWB 5864742881)</div>

          <div class="alert-text" id="storage-alert-text">Đang tải đồng hồ đếm ngược...</div>

        </div>

        <button onclick="switchTab('procurement')" class="btn btn-outline btn-sm">Xem chi tiết lô hàng</button>

      </div>



      <!-- Quick Action Operations Bar -->

      <div class="quick-action-bar">

        <div style="font-size: 12px; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Thao tác nhanh vận hành:</div>

        <div class="quick-actions-btns">

          <button onclick="openQuotationModal()" class="btn btn-primary btn-sm">+ Soạn Báo Giá</button>

          <button onclick="openReceiptModal()" class="btn btn-outline btn-sm">+ Lập Phiếu Nhập Kho (PNK)</button>

          <button onclick="openDeliveryModal()" class="btn btn-outline btn-sm">+ Lập Phiếu Xuất Kho (PXK)</button>

          <button onclick="switchTab('wms')" class="btn btn-outline btn-sm">Tra Cứu Catalog 15.407 SKU</button>

        </div>

      </div>



      <!-- KPI Cards Grid (Flat & Tabular Numbers) -->

      <div class="kpi-grid">

        <div class="kpi-card">

          <div class="kpi-label">Danh mục Sản phẩm</div>

          <div class="kpi-value tabular-num" id="kpi-products">15.407</div>

          <div class="kpi-sub">Mã vật tư Murrplastik Đức chuẩn hãng</div>

        </div>

        <div class="kpi-card">

          <div class="kpi-label">Tồn kho Thực tế (On-Hand)</div>

          <div class="kpi-value tabular-num" id="kpi-onhand">--</div>

          <div class="kpi-sub">Số lượng vật tư có sẵn tại kho Trà Hồi</div>

        </div>

        <div class="kpi-card">

          <div class="kpi-label">Tồn Giữ Chỗ (15 ngày)</div>

          <div class="kpi-value tabular-num" id="kpi-reserved">--</div>

          <div class="kpi-sub">Đã khóa cho đơn bán hàng (SO) của khách</div>

        </div>

        <div class="kpi-card">

          <div class="kpi-label">Báo giá Chờ Giám đốc duyệt</div>

          <div class="kpi-value tabular-num" id="kpi-pending-quotes" style="color: var(--warn);">--</div>

          <div class="kpi-sub">Hạn mức từ 5 triệu VNĐ trở lên</div>

        </div>

      </div>



      <!-- Quick Action Panels -->

      <div class="table-card">

        <div class="table-header">

          <span class="table-title">Chuyến hàng Quốc tế Mới nhất (Vận tải Đa phương thức: Air & Sea)</span>

          <button onclick="switchTab('procurement')" class="btn btn-outline btn-sm">Xem tất cả</button>

        </div>

        <div class="table-responsive">

          <table id="tbl-recent-shipments">

            <thead>

              <tr>

                <th>Mã chuyến hàng</th>

                <th>Hãng & Phương thức</th>

                <th>Số vận đơn (AWB / B/L)</th>

                <th>Quy cách kiện</th>

                <th class="num">Trọng lượng (GW)</th>

                <th>Cảng đến & Mã kho</th>

                <th>Hạn lưu kho miễn phí</th>

                <th>Trạng thái</th>

                <th>Hành trình</th>

              </tr>

            </thead>

            <tbody>

              <tr><td colspan="9" style="text-align: center; color: var(--text-muted); padding: 16px;">Đang tải dữ liệu chuyến hàng...</td></tr>

            </tbody>

          </table>

        </div>

      </div>

    </section>



    <!-- TAB 2: KHO HÀNG (WMS) -->

    <section id="tab-wms" class="tab-pane" style="display: none;">

      <!-- THÔNG BÁO TIẾP NHẬN LÔ HÀNG AIR FSTV & VINFAST (SCAN CHECK SẴN SÀNG) -->

      <div class="alert-banner" style="margin-bottom: 16px; display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 14px; background: #f0fdf4; border: 1px solid #86efac; padding: 14px 18px; border-radius: 8px;">

        <div>

          <div class="alert-title" style="color: #15803d; font-weight: 700; font-size: 14px; display: flex; align-items: center; gap: 8px;">

            <span>LÔ HÀNG VỀ KHO: FSTV & VINFAST (AWB 5864742881) - SẴN SÀNG SCAN CHECK</span>

            <span class="badge" style="background: #dcfce7; color: #166534; font-size: 11px;">8 SKU - 136 Đơn vị</span>

          </div>

          <div class="alert-text" style="font-size: 12px; color: #166534; margin-top: 4px; line-height: 1.5;">

            Hóa đơn: <b>9005222042</b> | Tờ khai Hải quan: <b>108741842050</b> (EVFTA 0%) | Quy cách: <b>2 Kiện (35.50 kg)</b><br/>

            Vị trí lưu kho chuẩn: <b>Hộp 10 - Kệ 2 - Tầng 1</b> (Kiện 1) và <b>Hộp 01, 02, 03, 05</b> (Kiện 2).

          </div>

        </div>

                <div style="display: flex; gap: 8px; flex-wrap: wrap;">
          <a href="/kho/?batch=AIR_FSTV_VF_OCT2026" target="_blank" rel="noopener" class="btn btn-primary" style="font-weight: 700; padding: 9px 16px; background: #16a34a; border-color: #16a34a; box-shadow: 0 2px 8px rgba(22,163,74,0.3); text-decoration: none; display: inline-flex; align-items: center; gap: 8px;">
            <span>Mở Ứng Dụng Quét Kho Mobile (/kho/)</span>
            <span style="font-size: 11px; background: rgba(255,255,255,0.25); padding: 1px 6px; border-radius: 4px;">Live</span>
          </a>
        </div>

      </div>



      <div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 10px; margin-bottom: 16px;">

        <div style="display: flex; gap: 10px; flex: 1; max-width: 480px;">

          <input type="text" id="wms-search" class="form-input" placeholder="Tìm theo mã SKU, tên sản phẩm hoặc vị trí Hộp-Kệ..." onkeyup="debounceSearchStock()" />

        </div>

        <div style="display: flex; gap: 8px;">

          <button onclick="openReceiptModal()" class="btn btn-primary">+ Lập Phiếu Nhập Kho</button>

          <button onclick="openDeliveryModal()" class="btn btn-outline">+ Lập Phiếu Xuất Kho</button>

        </div>

      </div>



      <!-- THẺ TỒN KHO & ĐỊNH VỊ KỆ HÀNG (THU GỌN 10 DÒNG + NÚT XEM THÊM) -->

      <div class="table-card">

        <div class="table-header">

          <span class="table-title">Số Dư Tồn Kho & Định Vị Kệ Hàng</span>

          <span id="stock-count-badge" style="font-size: 12px; color: var(--text-muted);">Đang tải...</span>

        </div>

        <div class="table-responsive table-scroll-container" id="stock-scroll-wrap">

          <table id="tbl-stock">

            <thead>

              <tr>

                <th>Mã SKU</th>

                <th>Tên sản phẩm Murrplastik</th>

                <th>Mã HS</th>

                <th>Định vị lưu kho chuẩn</th>

                <th class="num">Tồn thực tế</th>

                <th class="num">Giữ chỗ</th>

                <th class="num" style="color: var(--ok);">Khả dụng</th>

                <th style="text-align: center;">Thao tác</th>

              </tr>

            </thead>

            <tbody>

              <tr><td colspan="8" style="text-align: center; padding: 16px;">Đang tải tồn kho...</td></tr>

            </tbody>

          </table>

        </div>

        <!-- Thanh điều khiển Thu gọn / Xem thêm -->

        <div class="table-footer-bar" id="stock-footer-bar" style="display: none;">

          <span class="table-footer-info" id="stock-footer-info">Đang hiển thị 10 / 251 mặt hàng</span>

          <div class="table-footer-actions">

            <button type="button" id="btn-stock-more" class="btn btn-outline btn-sm" onclick="expandStock(20)">+ Xem thêm 20</button>

            <button type="button" id="btn-stock-all" class="btn btn-outline btn-sm" onclick="expandStock('all')">Xem tất cả</button>

            <button type="button" id="btn-stock-collapse" class="btn btn-outline btn-sm" style="display: none;" onclick="collapseStock()">Thu gọn (10)</button>

          </div>

        </div>

      </div>



      <!-- SỔ CÁI THẺ KHO (LỊCH SỬ TĂNG / GIẢM CHI TIẾT) -->

      <div class="table-card" style="margin-top: 20px;">

        <div class="table-header">

          <span class="table-title">Sổ Cái Thẻ Kho (Lịch sử Tăng / Giảm Chi Tiết)</span>

        </div>

        <div class="table-responsive table-scroll-container">

          <table id="tbl-ledger">

            <thead>

              <tr>

                <th>Mã phiếu</th>

                <th>Loại giao dịch</th>

                <th>Mã SKU</th>

                <th class="num">Biến động</th>

                <th class="num">Tồn sau giao dịch</th>

                <th>Vị trí kho</th>

                <th>Người thực hiện</th>

                <th>Thời gian</th>

              </tr>

            </thead>

            <tbody>

              <tr><td colspan="8" style="text-align: center; padding: 16px;">Đang tải thẻ kho...</td></tr>

            </tbody>

          </table>

        </div>

      </div>

    </section>



    <!-- TAB 3: BÁN HÀNG & BÁO GIÁ (B2B & KHÁCH LẺ) -->

    <section id="tab-sales" class="tab-pane" style="display: none;">

      <!-- Sub Navigation Bar -->

      <div style="display: flex; gap: 8px; border-bottom: 2px solid var(--border); margin-bottom: 16px; padding-bottom: 4px;">

        <button id="btn-subtab-quotes" type="button" onclick="switchSalesSubTab('quotes')" class="subtab-btn active" style="font-size: 13px; font-weight: 700; padding: 6px 14px; border: none; background: transparent; border-bottom: 2px solid var(--brand); color: var(--brand); margin-bottom: -6px;">

          Báo Giá Khách Hàng

        </button>

        <button id="btn-subtab-customers" type="button" onclick="switchSalesSubTab('customers')" class="subtab-btn" style="font-size: 13px; font-weight: 600; padding: 6px 14px; border: none; background: transparent; color: var(--text-muted); margin-bottom: -6px;">

          Danh Bạ Khách Hàng (B2B & Khách Lẻ)

        </button>

      </div>



      <!-- PANE 1: BÁO GIÁ KHÁCH HÀNG -->

      <div id="subpane-quotes">

        <div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 10px; margin-bottom: 16px;">

          <div>

            <h3 style="font-size: 15px; font-weight: 700; color: var(--brand-dark); margin: 0;">Quản lý Báo giá Khách hàng (B2B & Khách Lẻ)</h3>

            <span style="font-size: 12px; color: var(--text-muted);">Tự động duyệt nếu &lt; 5 triệu VNĐ | Áp dụng Quy chuẩn 9: Dàn đều cước ship</span>

          </div>

          <button onclick="openQuotationModal()" class="btn btn-primary">+ Soạn Báo Giá Mới</button>

        </div>

        

        <div class="table-card">

          <div class="table-header">

            <span class="table-title">Danh sách Báo giá Phát hành</span>

            <span style="font-size: 11px; color: var(--text-muted);">Cập nhật tự động theo thời gian thực</span>

          </div>

          <div class="table-responsive">

            <table id="tbl-quotes">

              <thead>

                <tr>

                  <th>Mã báo giá</th>

                  <th>Khách hàng</th>

                  <th class="num">Tiền hàng (All-in)</th>

                  <th class="num">Cước ship</th>

                  <th class="num">Tổng thanh toán</th>

                  <th>Hạn mức duyệt</th>

                  <th>Hiệu lực đến</th>

                  <th style="text-align: left; width: 170px;">Thao tác</th>

                </tr>

              </thead>

              <tbody>

                <tr><td colspan="8" style="text-align: center; padding: 16px;">Đang tải danh sách báo giá...</td></tr>

              </tbody>

            </table>

          </div>

        </div>

      </div>



      <!-- PANE 2: DANH BẠ KHÁCH HÀNG (CRUD B2B & KHÁCH LẺ) -->

      <div id="subpane-customers" style="display: none;">

        <div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 10px; margin-bottom: 16px;">

          <div>

            <h3 style="font-size: 15px; font-weight: 700; color: var(--brand-dark); margin: 0;">Danh Bạ Khách Hàng (B2B & Khách Lẻ)</h3>

            <span style="font-size: 12px; color: var(--text-muted);">Quản lý hồ sơ pháp nhân, mã số thuế, liên hệ và tra cứu lịch sử báo giá</span>

          </div>

          <button onclick="openCustomerModal()" class="btn btn-primary">+ Thêm Khách Hàng Mới</button>

        </div>



        <!-- Filter & Search Bar -->

        <div style="display: flex; flex-wrap: wrap; gap: 10px; align-items: center; background: #f8fafc; border: 1px solid var(--border); border-radius: var(--radius); padding: 10px 14px; margin-bottom: 16px;">

          <div style="flex: 1; min-width: 240px;">

            <input type="text" id="cust-search-input" class="form-input" placeholder="Tìm theo tên công ty, mã khách, MST, SĐT, người liên hệ..." oninput="debounceSearchCustomers()" />

          </div>

          <div style="display: flex; gap: 6px;">

            <button type="button" onclick="filterCustomerType('')" class="btn btn-sm btn-cust-filter active" id="btn-filter-cust-all" style="font-size: 12px; font-weight: 600;">Tất cả</button>

            <button type="button" onclick="filterCustomerType('B2B')" class="btn btn-sm btn-outline btn-cust-filter" id="btn-filter-cust-b2b" style="font-size: 12px; font-weight: 600;">Doanh nghiệp B2B</button>

            <button type="button" onclick="filterCustomerType('RETAIL')" class="btn btn-sm btn-outline btn-cust-filter" id="btn-filter-cust-retail" style="font-size: 12px; font-weight: 600;">Khách lẻ / Cá nhân</button>

          </div>

        </div>



        <div class="table-card">

          <div class="table-header">

            <span class="table-title">Danh sách Khách Hàng</span>

            <span id="cust-count-badge" style="font-size: 11px; color: var(--text-muted);">Đang tải...</span>

          </div>

          <div class="table-responsive">

            <table id="tbl-customers-dir">

              <thead>

                <tr>

                  <th style="width: 110px;">Mã Khách</th>

                  <th style="width: 100px;">Phân Loại</th>

                  <th>Tên Doanh Nghiệp / Khách Hàng</th>

                  <th style="width: 130px;">Mã Số Thuế</th>

                  <th>Người Liên Hệ & SĐT</th>

                  <th>Email & Địa Chỉ</th>

                  <th class="num" style="width: 80px;">Số Báo Giá</th>

                  <th style="text-align: left; width: 130px;">Thao Tác</th>

                </tr>

              </thead>

              <tbody id="tbl-customers-body">

                <tr><td colspan="8" style="text-align: center; padding: 20px;">Đang tải danh bạ khách hàng...</td></tr>

              </tbody>

            </table>

          </div>

        </div>

      </div>

    </section>



    <!-- TAB 4: MUA HÀNG & VẬN TẢI ĐA PHƯƠNG THỨC (AIR & SEA) -->

    <section id="tab-procurement" class="tab-pane" style="display: none;">

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 14px; margin-bottom: 16px;">

        <!-- Kênh 1: Đường Air -->

        <div class="alert-banner alert-warn" style="margin-bottom: 0;">

          <div>

            <div class="alert-title">Kênh 1: Vận Tải Hàng Không Hỏa Tốc (Air Express - DHL)</div>

            <div class="alert-text" style="font-size: 12px; line-height: 1.6;">

              - Lô hàng: <b>FSTV & VinFast</b> (Hóa đơn 9005222042)<br/>

              - Vận đơn: <b>AWB 5864742881</b> | Quy cách: <b>2 kiện</b> (GW: <b>35.50 kg</b>)<br/>

              - Cảng đến: <b>Sân bay Nội Bài (VNHAN)</b> | Chuyến bay: <b>EY112</b><br/>

              - Kho VNACCS: <b>01DDEC1</b> (Kho DHL Express) | REX EVFTA: <b>DEREX95500128</b> (0%)<br/>

              - Hạn thanh toán Murrplastik HQ: <b>08/12/2026</b> (2.309,50 EUR)

            </div>

            <div style="margin-top: 10px;">

              <button type="button" onclick="openScanCheckModal(2)" class="btn btn-primary btn-sm" style="background: #16a34a; border-color: #16a34a; font-weight: 700;">

                Quét Mã Vạch / Scan Check Hàng

              </button>

            </div>

          </div>

        </div>

        

        <!-- Kênh 2: Đường Biển Sea -->

        <div class="alert-banner" style="margin-bottom: 0; background: #ecfeff; border: 1px solid #a5f3fc;">

          <div>

            <div class="alert-title" style="color: #0e7490;">Kênh 2: Vận Tải Đường Biển (Sea Freight LCL - Quanterm)</div>

            <div class="alert-text" style="font-size: 12px; line-height: 1.6; color: #155e75;">

              - Lô hàng: <b>Stock 500kg Phổ thông</b> (Hóa đơn 9004768969)<br/>

              - Vận đơn: <b>B/L 8006432726</b> | Quy cách: <b>4 kiện Pallet IPPC</b> (GW: <b>557.00 kg</b>)<br/>

              - Cảng dỡ: <b>Cảng Hải Phòng (VNHPH)</b> | Thuế EVFTA: <b>0%</b> (REX)<br/>

              - Quy tắc tính cước Quanterm: <b>Min 1 CBM = 1.000 KG</b> (Revenue Ton)<br/>

              - Hiện trạng: <b>Đã thông quan 6 nhánh tờ khai & Nhập kho an toàn</b>

            </div>

          </div>

        </div>

      </div>



      <div class="table-card">

        <div class="table-header">

          <span class="table-title">Danh mục Chuyến hàng Nhập khẩu Quốc tế (Vận tải Air & Sea)</span>

        </div>

        <div class="table-responsive">

          <table id="tbl-shipments-full">

            <thead>

              <tr>

                <th>Mã chuyến hàng</th>

                <th>Hãng & Phương thức</th>

                <th>Số vận đơn (AWB / B/L)</th>

                <th>Quy cách kiện</th>

                <th class="num">Trọng lượng (GW)</th>

                <th>Cảng đến & Mã kho</th>

                <th>Hạn lưu kho miễn phí</th>

                <th>Trạng thái</th>

                <th>Hành trình</th>

              </tr>

            </thead>

            <tbody>

              <tr><td colspan="9" style="text-align: center; padding: 16px;">Đang tải danh sách chuyến hàng...</td></tr>

            </tbody>

          </table>

        </div>

      </div>

    </section>



    <!-- TAB 5: HỒ SƠ CHỨNG TỪ TẬP TRUNG -->

    <section id="tab-documents" class="tab-pane" style="display: none;">

      <!-- KPI THỐNG KÊ CHỨNG TỪ & HÓA ĐƠN -->

      <div class="kpi-grid" style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); margin-bottom: 16px;">

        <div class="kpi-card">

          <div class="kpi-label">Tổng Chứng Từ Số Hóa</div>

          <div class="kpi-value tabular-num" id="kpi-doc-total">--</div>

          <div class="kpi-sub">Đã mã hóa & bảo vệ qua download.php</div>

        </div>

        <div class="kpi-card">

          <div class="kpi-label">Hóa Đơn Thương Mại (HQ)</div>

          <div class="kpi-value tabular-num" id="kpi-doc-ci" style="color: #0284c7;">--</div>

          <div class="kpi-sub">Murrplastik GmbH (Đức)</div>

        </div>

        <div class="kpi-card">

          <div class="kpi-label">Hóa Đơn VAT Đầu Vào</div>

          <div class="kpi-value tabular-num" id="kpi-doc-vat" style="color: #dc2626;">--</div>

          <div class="kpi-sub">Tổng cục Thuế (2024 - 2025)</div>

        </div>

        <div class="kpi-card">

          <div class="kpi-label">Tờ Khai Hải Quan & Vận Đơn</div>

          <div class="kpi-value tabular-num" id="kpi-doc-customs" style="color: #16a34a;">--</div>

          <div class="kpi-sub">Đã thông quan & AWB DHL</div>

        </div>

      </div>



      <!-- THANH BỘ LỌC CHỨNG TỪ CHUYÊN NGHIỆP -->

      <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 16px; align-items: center; justify-content: space-between;">

        <div style="display: flex; flex-wrap: wrap; gap: 6px;" id="doc-filter-pills">

          <button type="button" class="btn btn-primary btn-sm doc-pill active" onclick="setDocFilter('', this)">Tất cả chứng từ (<span id="cnt-all">--</span>)</button>

          <button type="button" class="btn btn-outline btn-sm doc-pill" onclick="setDocFilter('COMMERCIAL_INVOICE', this)">Hóa đơn Thương mại HQ (<span id="cnt-ci">--</span>)</button>

          <button type="button" class="btn btn-outline btn-sm doc-pill" onclick="setDocFilter('VAT_INVOICE', this)">Hóa đơn VAT Đầu vào (<span id="cnt-vat">--</span>)</button>

          <button type="button" class="btn btn-outline btn-sm doc-pill" onclick="setDocFilter('CUSTOMS_DECLARATION', this)">Tờ khai Hải quan (<span id="cnt-customs">--</span>)</button>

          <button type="button" class="btn btn-outline btn-sm doc-pill" onclick="setDocFilter('LOGISTICS', this)">Vận tải (Air & Sea) (<span id="cnt-log">--</span>)</button>

          <button type="button" class="btn btn-outline btn-sm doc-pill" onclick="setDocFilter('SALES_DOCS', this)">Báo giá & Biên bản giao (<span id="cnt-sales">--</span>)</button>

        </div>

        <div style="display: flex; gap: 8px; align-items: center;">

          <input type="text" id="doc-search" class="form-input" style="width: 260px;" placeholder="Tìm tên tệp, số hóa đơn, AWB..." onkeyup="debounceSearchDocs()" />

        </div>

      </div>



      <div class="table-card">

        <div class="table-header">

          <span class="table-title">Kho Lưu Trữ Chứng Từ & Hóa Đơn Số Hóa Đa Chiều</span>

          <span style="font-size: 11px; color: var(--text-muted);">Bảo mật 100% bằng cơ chế Proxy Token</span>

        </div>

        <div class="table-responsive">

          <table id="tbl-docs">

            <thead>

              <tr>

                <th style="width: 150px;">Mã chứng từ</th>

                <th style="width: 200px;">Phân loại chứng từ</th>

                <th>Tên tệp tin gốc</th>

                <th style="width: 120px;">Định dạng & Size</th>

                <th style="width: 150px;">Ngày cập nhật</th>

                <th style="width: 140px; text-align: left;">Thao tác</th>

              </tr>

            </thead>

            <tbody>

              <tr><td colspan="6" style="text-align: center; padding: 24px;">Đang tải danh mục chứng từ & hóa đơn...</td></tr>

            </tbody>

          </table>

        </div>

      </div>

    </section>



  </main>



  <!-- MODAL: SOẠN BÁO GIÁ MỚI (QUOTATION BUILDER) -->

  <div id="modal-quotation" class="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modal-title-quotation">

    <div class="modal-card" style="max-width: 860px;">

      <div class="modal-header">

        <span class="modal-title" id="modal-title-quotation">Soạn Báo Giá (B2B & Khách Lẻ)</span>

        <button type="button" onclick="closeModals()" class="btn-modal-close" aria-label="Đóng cửa sổ">&times;</button>

      </div>

      <div class="modal-body">

        <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 14px; margin-bottom: 14px;">

          <div class="form-group" style="margin-bottom: 0;">

            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">

              <label class="form-label" style="margin-bottom: 0;">Chọn Khách Hàng (B2B hoặc Khách Lẻ)</label>

              <button type="button" onclick="openCustomerModal()" class="btn btn-outline btn-sm" style="padding: 2px 8px; font-size: 11px; font-weight: 700; color: var(--brand);">+ Thêm Khách Hàng</button>

            </div>

            <select id="qte-customer" class="form-select" required onchange="handleCustomerSelectChange()">

              <option value="">-- Đang nạp danh sách khách hàng... --</option>

            </select>

            <div id="qte-retail-wrap" style="display: none; margin-top: 6px;">

              <input type="text" id="qte-retail-name" class="form-input" placeholder="Ghi chú: Tên khách lẻ / SĐT / Địa chỉ giao hàng..." />

            </div>

          </div>

          <div class="form-group" style="margin-bottom: 0;">

            <label class="form-label">Thời hạn hiệu lực (Ngày)</label>

            <input type="number" id="qte-validity" class="form-input" min="7" max="90" value="30" />

          </div>

        </div>



        <!-- Catalog SKU Quick Finder -->

        <div style="background: #f8fafc; border: 1px solid var(--border); border-radius: var(--radius); padding: 12px; margin-bottom: 14px;">

          <div style="font-size: 11px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px;">Tra cứu nhanh danh mục 15.407 SKU Murrplastik:</div>

          <div style="display: grid; grid-template-columns: 140px 1fr 80px 120px 90px; gap: 8px;">

            <input type="text" id="add-sku" class="form-input font-mono" placeholder="Mã SKU (83...)" onblur="lookupSkuForQuote()" />

            <input type="text" id="add-name" class="form-input" placeholder="Tên sản phẩm Murrplastik" />

            <input type="number" id="add-qty" class="form-input num" min="1" value="1" placeholder="Số lượng" />

            <input type="number" id="add-price" class="form-input num" min="0" placeholder="Đơn giá (VNĐ)" />

            <button type="button" onclick="addQuoteRowFromFinder()" class="btn btn-primary btn-sm" style="justify-content: center;">+ Thêm</button>

          </div>

          <div id="add-sku-hint" style="font-size: 11px; color: var(--brand); margin-top: 4px; display: none;"></div>

        </div>



        <!-- Items Table -->

        <div style="border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; margin-bottom: 14px;">

          <table id="tbl-qte-items">

            <thead>

              <tr>

                <th style="width: 120px;">Mã SKU</th>

                <th>Tên sản phẩm</th>

                <th class="num" style="width: 80px;">SL</th>

                <th style="width: 60px;">ĐVT</th>

                <th class="num" style="width: 130px;">Đơn giá (VNĐ)</th>

                <th class="num" style="width: 140px;">Thành tiền (VNĐ)</th>

                <th style="width: 50px; text-align: center;">Xóa</th>

              </tr>

            </thead>

            <tbody id="qte-items-body">

              <tr><td colspan="7" style="text-align: center; color: var(--text-muted); padding: 16px;">Chưa có sản phẩm nào. Hãy tra cứu SKU ở trên để thêm.</td></tr>

            </tbody>

          </table>

        </div>



        <!-- Freight & Summary Calculations (Quy chuẩn 9: Dàn đều cước ship vào đơn giá sản phẩm) -->

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">

          <div class="form-group">

            <label class="form-label">Cước vận chuyển quốc tế (Air/Sea) ước tính</label>

            <div style="display: flex; gap: 8px;">

              <input type="number" id="qte-freight" class="form-input num" value="0" placeholder="0" oninput="calcQuoteTotals()" />

              <button type="button" onclick="bundleFreightIntoUnitPrices()" class="btn btn-outline btn-sm" style="font-weight: 700; color: var(--brand); border-color: var(--brand); white-space: nowrap;">

                Dàn Đều Vào Đơn Giá

              </button>

            </div>

            <div style="font-size: 11px; color: var(--text-muted); margin-top: 4px;">

              Quy chuẩn 9: Báo giá gửi khách hàng thể hiện đơn giá trọn gói All-in đã dàn đều cước ship, không tách dòng cước ship riêng.

            </div>

          </div>

          

          <div style="background: #f8fafc; border: 1px solid var(--border); border-radius: var(--radius); padding: 12px;">

            <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">

              <span style="color: var(--text-muted);">Tiền hàng (chưa VAT):</span>

              <span id="sum-products" class="font-mono tabular-num" style="font-weight: 600;">0 đ</span>

            </div>

            <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">

              <span style="color: var(--text-muted);">Cước vận chuyển:</span>

              <span id="sum-freight" class="font-mono tabular-num" style="font-weight: 600;">0 đ</span>

            </div>

            <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">

              <span style="color: var(--text-muted);">Thuế VAT (8%):</span>

              <span id="sum-vat" class="font-mono tabular-num" style="font-weight: 600;">0 đ</span>

            </div>

            <div style="border-top: 1px dashed var(--border-dark); padding-top: 6px; margin-top: 6px; display: flex; justify-content: space-between; align-items: baseline;">

              <span style="font-weight: 700; color: var(--brand-dark);">Tổng thanh toán:</span>

              <span id="sum-final" class="font-mono tabular-num" style="font-size: 16px; font-weight: 800; color: var(--brand);">0 đ</span>

            </div>

            <div id="qte-tier-badge" style="margin-top: 8px; text-align: right;">

              <span style="font-size: 11px; font-weight: 700; padding: 2px 6px; border-radius: 4px; background: #ecfdf5; color: #059669; border: 1px solid #a7f3d0;">Tự động duyệt (&lt; 5 triệu)</span>

            </div>

          </div>

        </div>



      </div>

      <div class="modal-footer">

        <button onclick="closeModals()" class="btn btn-outline">Hủy bỏ</button>

        <button onclick="submitQuotation()" class="btn btn-primary">Phát Hành Báo Giá</button>

      </div>

    </div>

  </div>



  <!-- MODAL: SCAN CHECK MÃ VẠCH NHẬP KHO (INBOUND BARCODE RECEIVING SCANNER) -->

  <div id="modal-scan-check" class="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modal-title-scan" style="z-index: 1050;">

    <div class="modal-card" style="max-width: 1120px; width: 96vw; max-height: 92vh; display: flex; flex-direction: column;">

      <div class="modal-header" style="background: #0f172a; color: white; border-bottom: 2px solid #334155; padding: 14px 20px;">

        <div>

          <div style="display: flex; align-items: center; gap: 8px;">

            <span class="modal-title" id="modal-title-scan" style="color: white; font-size: 16px; font-weight: 800; letter-spacing: -0.01em;">

              MÁY QUÉT MÃ VẠCH & KIỂM ĐẾM NHẬP KHO

            </span>

            <span id="scan-receipt-badge" class="badge" style="background: #fbbf24; color: #78350f; font-weight: 700; font-size: 11px;">

              CHỜ KIỂM ĐẾM

            </span>

          </div>

          <div id="scan-shipment-subtitle" style="font-size: 12px; color: #94a3b8; margin-top: 4px;">

            Lô hàng: <b>FSTV & VinFast</b> | Vận đơn: <b>AWB 5864742881</b> | Hóa đơn: <b>9005222042</b> | Tờ khai: <b>108741842050</b>

          </div>

        </div>

        <button type="button" onclick="closeScanCheckModal()" class="btn-modal-close" style="color: #94a3b8;" aria-label="Đóng cửa sổ">&times;</button>

      </div>



      <div class="modal-body" style="padding: 16px 20px; overflow-y: auto; flex: 1;">

        <!-- KHỐI QUÉT MÃ VẠCH (SCANNER INPUT & REAL-TIME FEEDBACK) -->

        <div style="background: #f8fafc; border: 2px dashed #94a3b8; border-radius: 8px; padding: 14px 18px; margin-bottom: 16px;">

          <div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 8px; margin-bottom: 8px;">

            <label for="scan-barcode-input" style="font-size: 13px; font-weight: 700; color: #0f172a; display: flex; align-items: center; gap: 6px;">

              <span>MÁY QUÉT MÃ VẠCH (BARCODE SCANNER GUN / BÀN PHÍM)</span>

              <span style="font-size: 11px; font-weight: normal; color: #059669; background: #ecfdf5; padding: 2px 8px; border-radius: 4px; border: 1px solid #a7f3d0;">

                Tự động nhận diện Enter

              </span>

            </label>

            <div style="display: flex; gap: 6px;">

              <button type="button" id="btn-pkg-all" onclick="filterScanPackage('all')" class="btn btn-outline btn-sm active-pkg" style="font-size: 11px; padding: 3px 10px; font-weight: 700; background: #2563eb; color: white;">Tất cả (8 SKU)</button>

              <button type="button" id="btn-pkg-1" onclick="filterScanPackage('Kiện 1')" class="btn btn-outline btn-sm" style="font-size: 11px; padding: 3px 10px;">Kiện 1 (100 Cái)</button>

              <button type="button" id="btn-pkg-2" onclick="filterScanPackage('Kiện 2')" class="btn btn-outline btn-sm" style="font-size: 11px; padding: 3px 10px;">Kiện 2 (36 ĐV)</button>

            </div>

          </div>



          <div style="display: flex; gap: 10px; align-items: center;">

            <input type="text" id="scan-barcode-input" class="form-input font-mono" 

                   placeholder="Đặt con trỏ tại đây & quét mã vạch (hoặc gõ SKU 8 số / Barcode GTIN 13 số rồi Enter)..." 

                   style="font-size: 15px; font-weight: 700; height: 46px; border: 2px solid #2563eb; background: #ffffff; color: #0f172a;"

                   autocomplete="off" onkeydown="onScanInputKeyDown(event)" />

            <button type="button" onclick="triggerManualScan()" class="btn btn-primary" style="height: 46px; padding: 0 20px; font-weight: 700;">

              Kiểm Tra

            </button>

          </div>

          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 6px; font-size: 11px; color: #64748b;">

            <span>Hỗ trợ cả <b>Mã SKU Murrplastik</b> (ví dụ: <code>83691502</code>) và <b>Mã GTIN/EAN-13</b> (ví dụ: <code>4045005186652</code>).</span>

            <span id="scan-feedback-status" style="font-weight: 600; color: #2563eb;">Máy quét sẵn sàng</span>

          </div>

        </div>



        <!-- THẺ THÔNG TIN SẢN PHẨM VỪA QUÉT (ACTIVE SCANNED CARD) -->

        <div id="scan-active-card" style="display: none; background: #ecfdf5; border: 1px solid #6ee7b7; border-radius: 8px; padding: 12px 16px; margin-bottom: 16px;">

        </div>



        <!-- BẢNG DANH MỤC 8 SKU KIỂM ĐẾM CHI TIẾT -->

        <div class="table-card" style="border: 1px solid #e2e8f0; margin-bottom: 14px;">

          <div class="table-header" style="background: #f8fafc; padding: 10px 16px; display: flex; justify-content: space-between; align-items: center;">

            <span class="table-title" style="font-size: 13px; font-weight: 700;">Danh Mục Mặt Hàng Trong Lô Cần Kiểm Đếm</span>

            <span id="scan-summary-counter" style="font-size: 12px; font-weight: 600; color: #0f172a;">0 / 8 SKU hoàn thành (0 / 136 đơn vị)</span>

          </div>

          <div class="table-responsive" style="max-height: 380px; overflow-y: auto;">

            <table id="tbl-scan-items" style="width: 100%; border-collapse: collapse; font-size: 12px;">

              <thead>

                <tr style="background: #f1f5f9; position: sticky; top: 0; z-index: 2;">

                  <th style="padding: 8px; text-align: center; width: 60px;">Kiện</th>

                  <th style="padding: 8px; text-align: center; width: 64px;">Ảnh</th>

                  <th style="padding: 8px; width: 140px;">Mã SKU & GTIN</th>

                  <th style="padding: 8px;">Tên sản phẩm Murrplastik</th>

                  <th style="padding: 8px; width: 170px;">Vị trí lưu kho chuẩn</th>

                  <th class="num" style="padding: 8px; width: 70px;">Yêu cầu</th>

                  <th class="num" style="padding: 8px; width: 180px;">Đã quét / Kiểm</th>

                  <th style="padding: 8px; text-align: center; width: 110px;">Trạng thái</th>

                </tr>

              </thead>

              <tbody id="scan-items-tbody">

                <tr><td colspan="8" style="text-align: center; padding: 20px;">Đang tải danh mục phiếu nhập kho...</td></tr>

              </tbody>

            </table>

          </div>

        </div>



        <!-- THANH TIẾN ĐỘ TỔNG QUAN -->

        <div style="background: #f1f5f9; border-radius: 6px; padding: 10px 14px; margin-bottom: 10px;">

          <div style="display: flex; justify-content: space-between; font-size: 12px; font-weight: 700; margin-bottom: 6px;">

            <span>Tiến độ kiểm đếm toàn bộ lô hàng:</span>

            <span id="scan-progress-percent">0%</span>

          </div>

          <div style="height: 10px; background: #e2e8f0; border-radius: 5px; overflow: hidden;">

            <div id="scan-progress-bar" style="height: 100%; width: 0%; background: #2563eb; transition: width 0.3s ease;"></div>

          </div>

        </div>

      </div>



      <div class="modal-footer" style="padding: 12px 20px; background: #f8fafc; border-top: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center;">

        <button type="button" onclick="closeScanCheckModal()" class="btn btn-outline">

          Đóng cửa sổ

        </button>

        <div style="display: flex; gap: 8px;">

          <button type="button" onclick="saveScanProgress()" class="btn btn-outline" style="font-weight: 600;">

            Lưu Tiến Độ Tạm

          </button>

          <button type="button" id="btn-complete-receipt" onclick="submitCompleteScanReceipt()" class="btn btn-primary" style="background: #16a34a; border-color: #16a34a; font-weight: 700;">

            Xác Nhận Hoàn Tất Nhập Kho

          </button>

        </div>

      </div>

    </div>

  </div>



  <!-- MODAL: NHẬP KHO (GOODS RECEIPT) -->

  <div id="modal-receipt" class="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modal-title-receipt">

    <div class="modal-card">

      <div class="modal-header">

        <span class="modal-title" id="modal-title-receipt">Lập Phiếu Nhập Kho & Phân Bổ Landed Cost</span>

        <button type="button" onclick="closeModals()" class="btn-modal-close" aria-label="Đóng cửa sổ">&times;</button>

      </div>

      <div class="modal-body">

        <div class="form-group">

          <label class="form-label">Chọn Chuyến Hàng (AWB / Lô hàng)</label>

          <select id="rcpt-shipment" class="form-select">

            <option value="">-- Nhập kho độc lập / Không theo AWB --</option>

          </select>

        </div>

        <div class="form-group">

          <label class="form-label">Mã SKU Murrplastik</label>

          <input type="text" id="rcpt-sku" class="form-input font-mono" placeholder="Ví dụ: 83691502" />

        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">

          <div class="form-group">

            <label class="form-label">Số lượng thực nhận</label>

            <input type="number" id="rcpt-qty" class="form-input num" min="1" value="10" />

          </div>

          <div class="form-group">

            <label class="form-label">Định vị Kệ - Hộp chuẩn tiếng Việt</label>

            <input type="text" id="rcpt-location" class="form-input" value="Hộp 01 - Kệ 1 - Tầng 1" />

          </div>

        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">

          <div class="form-group">

            <label class="form-label">Đơn giá Net HQ (EUR)</label>

            <input type="number" id="rcpt-eur" class="form-input num" step="0.0001" placeholder="Ví dụ: 20.00" />

          </div>

          <div class="form-group">

            <label class="form-label">Giá vốn Landed Cost về kho (VNĐ)</label>

            <input type="number" id="rcpt-landed" class="form-input num" placeholder="Net EUR + Cước Quốc Tế + Thuế" />

          </div>

        </div>

        <div class="form-group">

          <label class="form-label">Ghi chú phiếu nhập</label>

          <input type="text" id="rcpt-note" class="form-input" placeholder="Ví dụ: Nhập theo lô AWB 5864742881" />

        </div>

      </div>

      <div class="modal-footer">

        <button onclick="closeModals()" class="btn btn-outline">Hủy bỏ</button>

        <button onclick="submitReceipt()" class="btn btn-primary">Xác Nhận Nhập Kho</button>

      </div>

    </div>

  </div>



  <!-- MODAL: XUẤT KHO (DELIVERY ORDER) -->

  <div id="modal-delivery" class="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modal-title-delivery">

    <div class="modal-card">

      <div class="modal-header">

        <span class="modal-title" id="modal-title-delivery">Lập Phiếu Xuất Kho Giao Hàng</span>

        <button type="button" onclick="closeModals()" class="btn-modal-close" aria-label="Đóng cửa sổ">&times;</button>

      </div>

      <div class="modal-body">

        <div class="form-group">

          <label class="form-label">Mã SKU cần xuất</label>

          <input type="text" id="deliv-sku" class="form-input font-mono" placeholder="Nhập mã SKU (ví dụ: 83561856)" />

        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">

          <div class="form-group">

            <label class="form-label">Số lượng xuất</label>

            <input type="number" id="deliv-qty" class="form-input num" min="1" value="2" />

          </div>

          <div class="form-group">

            <label class="form-label">Vị trí lấy hàng</label>

            <input type="text" id="deliv-location" class="form-input" value="Hộp 03 - Kệ 1 - Tầng 3" />

          </div>

        </div>

        <div class="form-group">

          <label class="form-label">Địa chỉ giao hàng</label>

          <input type="text" id="deliv-address" class="form-input" placeholder="Nhà máy VinFast / FSTV / Khách hàng..." />

        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">

          <div class="form-group">

            <label class="form-label">Người nhận hàng</label>

            <input type="text" id="deliv-name" class="form-input" placeholder="Họ tên người nhận" />

          </div>

          <div class="form-group">

            <label class="form-label">SĐT người nhận</label>

            <input type="text" id="deliv-phone" class="form-input" placeholder="Số điện thoại" />

          </div>

        </div>

      </div>

      <div class="modal-footer">

        <button onclick="closeModals()" class="btn btn-outline">Hủy bỏ</button>

        <button onclick="submitDelivery()" class="btn btn-primary">Xác Nhận Xuất Kho</button>

      </div>

    </div>

  </div>



  <!-- MODAL: THÊM NHANH KHÁCH HÀNG (B2B & KHÁCH LẺ) -->

  <div id="modal-customer" class="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modal-title-customer">

    <div class="modal-card" style="max-width: 520px;">

      <div class="modal-header">

        <span class="modal-title" id="modal-title-customer">Thêm Hồ Sơ Khách Hàng</span>

        <button type="button" onclick="closeCustomerModal()" class="btn-modal-close" aria-label="Đóng cửa sổ">&times;</button>

      </div>

      <div class="modal-body">

        <div class="form-group">

          <label class="form-label">Phân Loại Khách Hàng</label>

          <div style="display: flex; gap: 20px; padding: 4px 0;">

            <label style="display: flex; align-items: center; gap: 6px; cursor: pointer; font-size: 13px; font-weight: 600;">

              <input type="radio" name="cust-type" value="B2B" checked onchange="toggleCustomerTypeFields()" /> Doanh Nghiệp (B2B)

            </label>

            <label style="display: flex; align-items: center; gap: 6px; cursor: pointer; font-size: 13px; font-weight: 600;">

              <input type="radio" name="cust-type" value="RETAIL" onchange="toggleCustomerTypeFields()" /> Khách Lẻ / Cá Nhân

            </label>

          </div>

        </div>



        <div class="form-group">

          <label class="form-label" id="lbl-cust-name">Tên Công Ty / Doanh Nghiệp <span style="color: var(--danger);">*</span></label>

          <input type="text" id="new-cust-name" class="form-input" placeholder="Ví dụ: Công ty TNHH Cơ Khí An Phát..." required />

        </div>



        <div class="form-group" id="grp-cust-tax">

          <label class="form-label">Mã Số Thuế (MST)</label>

          <input type="text" id="new-cust-tax" class="form-input font-mono" placeholder="Mã số thuế doanh nghiệp (10 hoặc 13 số)" />

        </div>



        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">

          <div class="form-group">

            <label class="form-label">Người Liên Hệ</label>

            <input type="text" id="new-cust-contact" class="form-input" placeholder="Họ và tên người nhận" />

          </div>

          <div class="form-group">

            <label class="form-label">Số Điện Thoại</label>

            <input type="text" id="new-cust-phone" class="form-input font-mono" placeholder="09xx xxx xxx" />

          </div>

        </div>



        <div class="form-group">

          <label class="form-label">Email Nhận Báo Giá</label>

          <input type="email" id="new-cust-email" class="form-input" placeholder="email@domain.com" />

        </div>



        <div class="form-group" style="margin-bottom: 0;">

          <label class="form-label">Địa Chỉ Giao Hàng / Nhà Máy</label>

          <input type="text" id="new-cust-address" class="form-input" placeholder="Địa chỉ giao hàng hoặc trụ sở" />

        </div>

      </div>

      <div class="modal-footer">

        <button type="button" onclick="closeCustomerModal()" class="btn btn-outline btn-sm">Hủy Bỏ</button>

        <button type="button" id="btn-save-cust" onclick="saveNewCustomer()" class="btn btn-primary btn-sm">LƯU KHÁCH HÀNG</button>

      </div>

    </div>

  </div>



  <!-- MODAL: CHỈNH SỬA HỒ SƠ KHÁCH HÀNG -->

  <div id="modal-customer-edit" class="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modal-title-customer-edit">

    <div class="modal-card" style="max-width: 520px;">

      <div class="modal-header">

        <span class="modal-title" id="modal-title-customer-edit">Chỉnh Sửa Hồ Sơ Khách Hàng</span>

        <button type="button" onclick="closeCustomerEditModal()" class="btn-modal-close" aria-label="Đóng cửa sổ">&times;</button>

      </div>

      <div class="modal-body">

        <input type="hidden" id="edit-cust-id" />

        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; background: #f8fafc; padding: 8px 12px; border-radius: var(--radius); border: 1px solid var(--border);">

          <span style="font-size: 12px; color: var(--text-muted);">Mã khách hàng: <b id="edit-cust-code" class="font-mono" style="color: var(--brand);"></b></span>

          <span id="edit-cust-type-badge"></span>

        </div>



        <div class="form-group">

          <label class="form-label">Tên Doanh Nghiệp / Khách Hàng <span style="color: var(--danger);">*</span></label>

          <input type="text" id="edit-cust-name" class="form-input" required />

        </div>



        <div class="form-group" id="grp-edit-cust-tax">

          <label class="form-label">Mã Số Thuế (MST)</label>

          <input type="text" id="edit-cust-tax" class="form-input font-mono" placeholder="Mã số thuế doanh nghiệp (nếu có)" />

        </div>



        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">

          <div class="form-group">

            <label class="form-label">Người Liên Hệ</label>

            <input type="text" id="edit-cust-contact" class="form-input" />

          </div>

          <div class="form-group">

            <label class="form-label">Số Điện Thoại</label>

            <input type="text" id="edit-cust-phone" class="form-input font-mono" />

          </div>

        </div>



        <div class="form-group">

          <label class="form-label">Email Nhận Báo Giá</label>

          <input type="email" id="edit-cust-email" class="form-input" />

        </div>



        <div class="form-group" style="margin-bottom: 0;">

          <label class="form-label">Địa Chỉ Giao Hàng / Nhà Máy</label>

          <input type="text" id="edit-cust-address" class="form-input" />

        </div>

      </div>

      <div class="modal-footer">

        <button type="button" onclick="closeCustomerEditModal()" class="btn btn-outline btn-sm">Hủy Bỏ</button>

        <button type="button" id="btn-save-edit-cust" onclick="saveEditCustomer()" class="btn btn-primary btn-sm">CẬP NHẬT THÔNG TIN</button>

      </div>

    </div>

  </div>



  <!-- MODAL: XEM CHI TIẾT & IN BÁO GIÁ KHÁCH HÀNG -->

  <div id="modal-quote-detail" class="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modal-title-quote-detail">

    <div class="modal-card" style="max-width: 880px;">

      <div class="modal-header">

        <span class="modal-title" id="modal-title-quote-detail">Chi Tiết Báo Giá Murrplastik</span>

        <button type="button" onclick="closeQuoteDetailModal()" class="btn-modal-close" aria-label="Đóng cửa sổ">&times;</button>

      </div>

      <div class="modal-body" id="quote-detail-print-area">

        <!-- Letterhead -->

        <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid var(--brand); padding-bottom: 12px; margin-bottom: 14px;">

          <div>

            <div style="font-size: 16px; font-weight: 800; color: var(--brand);">CÔNG TY TNHH THƯƠNG MẠI VÀ DỊCH VỤ KỸ THUẬT T&T VINA</div>

            <div style="font-size: 12px; color: var(--text-muted); margin-top: 2px;">Nhà phân phối ủy quyền chính hãng Murrplastik Systemtechnik GmbH (Đức) tại Việt Nam</div>

            <div style="font-size: 11px; color: var(--text-muted); margin-top: 2px;">Email: info@t2tvina.com | Hotline: +84 973 363 824 | Website: t2tvina.com</div>

          </div>

          <div style="text-align: right;">

            <div id="qd-code" class="font-mono" style="font-size: 16px; font-weight: 800; color: var(--brand-dark);"></div>

            <div id="qd-date" style="font-size: 12px; color: var(--text-muted); margin-top: 2px;"></div>

            <div id="qd-status" style="margin-top: 4px;"></div>

          </div>

        </div>



        <!-- Customer & Quotation Meta Info -->

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; background: #f8fafc; border: 1px solid var(--border); border-radius: var(--radius); padding: 12px; margin-bottom: 14px;">

          <div>

            <div style="font-size: 11px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; margin-bottom: 4px;">Thông tin khách hàng:</div>

            <div id="qd-cust-name" style="font-size: 14px; font-weight: 700; color: var(--brand-dark);"></div>

            <div id="qd-cust-tax" style="font-size: 12px; color: var(--text-muted);"></div>

            <div id="qd-cust-contact" style="font-size: 12px; color: var(--text-muted);"></div>

            <div id="qd-cust-address" style="font-size: 12px; color: var(--text-muted);"></div>

          </div>

          <div>

            <div style="font-size: 11px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; margin-bottom: 4px;">Điều kiện giao dịch:</div>

            <div style="font-size: 12px; line-height: 1.6;">

              - Thời hạn báo giá: <b id="qd-validity"></b><br/>

              - Quy chuẩn tính giá: <b>Quy chuẩn 9 (Đơn giá trọn gói All-in đã dàn đều cước ship)</b><br/>

              - Xuất xứ: <b>Murrplastik GmbH (Đức) - REX DEREX95500128</b><br/>

              - Người lập báo giá: <b id="qd-creator"></b>

            </div>

          </div>

        </div>



        <!-- Itemized Products Table -->

        <div style="border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; margin-bottom: 14px;">

          <table style="width: 100%; border-collapse: collapse; font-size: 12px;">

            <thead>

              <tr style="background: #f1f5f9; border-bottom: 1px solid var(--border);">

                <th style="padding: 8px 10px; width: 40px; text-align: center;">STT</th>

                <th style="padding: 8px 10px; width: 120px;">Mã SKU</th>

                <th style="padding: 8px 10px;">Tên Sản Phẩm / Quy Cách</th>

                <th style="padding: 8px 10px; width: 70px; text-align: right;">SL</th>

                <th style="padding: 8px 10px; width: 60px; text-align: center;">ĐVT</th>

                <th style="padding: 8px 10px; width: 130px; text-align: right;">Đơn Giá (VNĐ)</th>

                <th style="padding: 8px 10px; width: 140px; text-align: right;">Thành Tiền (VNĐ)</th>

              </tr>

            </thead>

            <tbody id="qd-items-body">

            </tbody>

          </table>

        </div>



        <!-- Totals Summary -->

        <div style="display: flex; justify-content: flex-end;">

          <div style="min-width: 320px; background: #f8fafc; border: 1px solid var(--border); border-radius: var(--radius); padding: 12px;">

            <div style="display: flex; justify-content: space-between; margin-bottom: 4px; font-size: 12px;">

              <span style="color: var(--text-muted);">Tiền hàng (All-in đã dàn cước ship):</span>

              <span id="qd-sum-products" class="font-mono tabular-num" style="font-weight: 600;">0 đ</span>

            </div>

            <div style="display: flex; justify-content: space-between; margin-bottom: 4px; font-size: 12px;">

              <span style="color: var(--text-muted);">Thuế VAT (8%):</span>

              <span id="qd-sum-vat" class="font-mono tabular-num" style="font-weight: 600;">0 đ</span>

            </div>

            <div style="border-top: 1px dashed var(--border-dark); padding-top: 6px; margin-top: 6px; display: flex; justify-content: space-between; align-items: baseline;">

              <span style="font-weight: 700; color: var(--brand-dark);">TỔNG CỘNG THANH TOÁN:</span>

              <span id="qd-sum-final" class="font-mono tabular-num" style="font-size: 16px; font-weight: 800; color: var(--brand);">0 đ</span>

            </div>

          </div>

        </div>

      </div>

      <div class="modal-footer">

        <button type="button" onclick="closeQuoteDetailModal()" class="btn btn-outline">Đóng</button>

        <button type="button" onclick="printQuoteDetail()" class="btn btn-primary">In Báo Giá</button>

      </div>

    </div>

  </div>



  <!-- MODAL: XEM TRƯỚC TÀI LIỆU & CHỨNG TỪ SỐ (UNIVERSAL PREVIEWER) -->

  <div id="modal-doc-preview" class="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="prev-doc-name">

    <div class="modal-card" style="max-width: 1140px; width: 95vw; height: 90vh; display: flex; flex-direction: column; padding: 0; overflow: hidden;">

      

      <!-- Modal Header -->

      <div class="modal-header" style="padding: 12px 18px; border-bottom: 1px solid var(--border); background: #ffffff; flex-shrink: 0; display: flex; align-items: center; justify-content: space-between;">

        <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap; flex: 1; min-width: 0;">

          <span class="font-mono" id="prev-doc-code" style="font-size: 13px; font-weight: 800; color: var(--brand);">DOC-CODE</span>

          <span id="prev-doc-badge"></span>

          <span id="prev-doc-format"></span>

          <span id="prev-doc-size" class="font-mono tabular-num" style="font-size: 11px; color: var(--text-muted);"></span>

          <div id="prev-doc-name" style="font-size: 13px; font-weight: 700; color: var(--brand-dark); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 380px;">Tên file tài liệu</div>

        </div>

        <div style="display: flex; align-items: center; gap: 8px; flex-shrink: 0;">

          <a id="prev-btn-download" href="#" class="btn btn-outline btn-sm" style="font-size: 11px; font-weight: 700; padding: 4px 10px; color: var(--brand); border-color: var(--brand-border);" title="Tải tệp tin gốc về máy tính">

            Tải Bản Gốc

          </a>

          <a id="prev-btn-open-tab" href="#" target="_blank" class="btn btn-outline btn-sm" style="font-size: 11px; padding: 4px 10px;" title="Mở trực tiếp trên tab mới của trình duyệt">

            Mở Tab Mới

          </a>

          <button type="button" onclick="closeDocPreviewModal()" class="btn-modal-close" aria-label="Đóng cửa sổ">&times;</button>

        </div>

      </div>



      <!-- Preview Body Container -->

      <div style="flex: 1; overflow: hidden; display: flex; flex-direction: column; background: #f8fafc; position: relative;">

        

        <!-- Loading Spinner -->

        <div id="prev-loading" style="display: none; position: absolute; inset: 0; background: rgba(255,255,255,0.92); z-index: 20; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px;">

          <div style="width: 36px; height: 36px; border: 3px solid #e2e8f0; border-top-color: var(--brand); border-radius: 50%; animation: spin 0.8s linear infinite;"></div>

          <div style="font-size: 13px; font-weight: 600; color: var(--text);">Đang nạp và phân tích dữ liệu xem trước...</div>

          <div style="font-size: 11px; color: var(--text-muted);">Hỗ trợ xem trực tiếp PDF, Excel (.xlsx), Word (.docx) & Hình ảnh</div>

        </div>



        <!-- Error Container -->

        <div id="prev-error" style="display: none; flex: 1; align-items: center; justify-content: center; padding: 30px; text-align: center;">

          <div style="max-width: 440px; background: #ffffff; border: 1px solid var(--border); border-radius: var(--radius); padding: 24px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">

            <div style="font-size: 14px; font-weight: 700; color: var(--brand-dark); margin-bottom: 8px;">Không thể xem trước trực tiếp</div>

            <div id="prev-error-msg" style="font-size: 12px; color: var(--text-muted); margin-bottom: 16px; line-height: 1.6;">Tệp tin có định dạng đặc thù hoặc dung lượng lớn.</div>

            <a id="prev-error-dl-btn" href="#" class="btn btn-primary" style="margin: 0 auto; justify-content: center;">Tải Tệp Tin Về Máy</a>

          </div>

        </div>



        <!-- PDF Viewer Container -->

        <div id="prev-pdf-wrap" style="display: none; width: 100%; height: 100%; flex: 1;">

          <iframe id="doc-prev-iframe" style="width: 100%; height: 100%; border: none;" src="about:blank"></iframe>

        </div>



        <!-- Excel Spreadsheet Viewer Container (SheetJS) -->

        <div id="prev-excel-wrap" style="display: none; width: 100%; height: 100%; flex-direction: column; flex: 1; overflow: hidden; background: #ffffff;">

          <!-- Sheet Tabs & Search Bar -->

          <div style="display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 8px; padding: 8px 14px; background: #f1f5f9; border-bottom: 1px solid var(--border); flex-shrink: 0;">

            <div style="display: flex; align-items: center; gap: 6px; overflow-x: auto; max-width: 65%;">

              <span style="font-size: 11px; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Trang tính:</span>

              <div id="excel-sheet-tabs" style="display: flex; gap: 4px;"></div>

            </div>

            <div style="display: flex; align-items: center; gap: 10px;">

              <span id="excel-sheet-info" class="font-mono tabular-num" style="font-size: 11px; color: var(--text-muted);"></span>

              <input type="text" id="excel-filter-input" placeholder="Lọc nội dung bảng..." oninput="filterExcelTable()" style="padding: 3px 8px; font-size: 11px; border: 1px solid var(--border); border-radius: 4px; width: 160px;" />

            </div>

          </div>

          <!-- Truncation notice banner for large Excel files -->

          <div id="excel-truncation-notice" style="display: none; padding: 7px 16px; background: #fefce8; border-bottom: 1px solid #fef08a; font-size: 11.5px; color: #854d0e; align-items: center; justify-content: space-between; flex-shrink: 0;">

            <div style="display: flex; align-items: center; gap: 8px;">

              <span style="font-weight: 700; background: #fef08a; padding: 1px 6px; border-radius: 3px;">Tối ưu tốc độ:</span>

              <span>Đang hiển thị 100 dòng đầu tiên (tổng số <b id="excel-total-rows" class="font-mono">--</b> dòng) để không bị lag trình duyệt.</span>

            </div>

            <a id="excel-notice-dl-btn" href="#" class="btn btn-outline btn-sm" style="font-size: 11px; padding: 2px 8px; border-color: #ca8a04; color: #854d0e; font-weight: 700;">Tải Về Bản Gốc</a>

          </div>

          <!-- Spreadsheet Grid Area -->

          <div id="excel-sheet-render" style="flex: 1; overflow: auto; padding: 0;"></div>

        </div>



        <!-- Word Document Viewer Container (Mammoth) -->

        <div id="prev-word-wrap" style="display: none; width: 100%; height: 100%; overflow: auto; padding: 24px 20px; background: #e2e8f0; flex: 1;">

          <div id="word-render-content" style="max-width: 820px; min-height: 500px; margin: 0 auto; padding: 40px 50px; background: #ffffff; border-radius: 4px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); font-size: 13.5px; line-height: 1.7; color: #1e293b;"></div>

        </div>



        <!-- Image Viewer Container -->

        <div id="prev-img-wrap" style="display: none; width: 100%; height: 100%; align-items: center; justify-content: center; padding: 20px; background: #0f172a; flex: 1;">

          <img id="doc-prev-img-el" alt="Bản xem trước hình ảnh" style="max-width: 100%; max-height: 100%; object-fit: contain; border-radius: 4px; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.3);" />

        </div>



        <!-- Text/Code Viewer Container -->

        <div id="prev-txt-wrap" style="display: none; width: 100%; height: 100%; flex: 1; overflow: auto; background: #0f172a;">

          <pre id="doc-prev-txt-content" class="font-mono" style="padding: 16px 20px; margin: 0; color: #e2e8f0; font-size: 12px; line-height: 1.6; white-space: pre-wrap; word-break: break-all;"></pre>

        </div>



      </div>



      <!-- Modal Footer -->

      <div class="modal-footer" style="padding: 8px 18px; border-top: 1px solid var(--border); background: #ffffff; display: flex; justify-content: space-between; align-items: center; flex-shrink: 0;">

        <span style="font-size: 11px; color: var(--text-muted);">Hệ Thống Xem Trước Tài Liệu An Toàn TTVina EDMS (Chế độ chỉ đọc)</span>

        <button type="button" onclick="closeDocPreviewModal()" class="btn btn-outline btn-sm">Đóng Bản Xem Trước</button>

      </div>



    </div>

  </div>





  <!-- MODAL: THEO DÕI HÀNH TRÌNH VẬN CHUYỂN (UNIFIED VENDOR TRACKING) -->

  <div id="modal-shipment-tracking" class="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modal-tracking-title">

    <div class="modal-card" style="max-width: 860px; width: 95vw; max-height: 90vh; display: flex; flex-direction: column; padding: 0; overflow: hidden;">

      

      <!-- Modal Header -->

      <div class="modal-header" style="padding: 14px 20px; border-bottom: 1px solid var(--border); background: #ffffff; display: flex; align-items: center; justify-content: space-between; flex-shrink: 0;">

        <div style="display: flex; align-items: center; gap: 12px;">

          <span id="track-carrier-badge" style="padding: 4px 10px; font-size: 11px; font-weight: 800; border-radius: 4px;">CARRIER</span>

          <div>

            <div id="modal-tracking-title" style="font-size: 15px; font-weight: 800; color: var(--brand-dark);">Hành Trình Vận Chuyển Quốc Tế</div>

            <div style="font-size: 11.5px; color: var(--text-muted); margin-top: 1px;">

              Số vận đơn: <span id="track-awb-no" class="font-mono" style="font-weight: 700; color: var(--brand);">--</span>

              <button type="button" onclick="copyTrackingCode()" style="margin-left: 6px; padding: 1px 6px; font-size: 10px; border: 1px solid var(--border); border-radius: 3px; background: #f8fafc; cursor: pointer;">Copy mã</button>

            </div>

          </div>

        </div>

        <div style="display: flex; align-items: center; gap: 8px;">

          <a id="track-vendor-btn" href="#" target="_blank" class="btn btn-outline btn-sm" style="font-size: 11.5px; font-weight: 700;" title="Mở trang tra cứu chính thức của hãng">

            Mở Trang Hãng ↗

          </a>

          <button type="button" onclick="closeTrackingModal()" class="btn-modal-close" aria-label="Đóng cửa sổ">&times;</button>

        </div>

      </div>

      

      <!-- Modal Body -->

      <div style="flex: 1; overflow-y: auto; padding: 20px 24px; background: #f8fafc; display: flex; flex-direction: column; gap: 18px;">

        

        <!-- Current Status & Progress Stepper -->

        <div style="background: #ffffff; border: 1px solid var(--border); border-radius: var(--radius); padding: 18px 20px;">

          <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #f1f5f9; padding-bottom: 12px;">

            <div>

              <div style="font-size: 10.5px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px;">Tiến độ vận chuyển quốc tế</div>

              <div style="display: flex; align-items: center; gap: 8px; margin-top: 3px;">

                <span id="track-live-beacon" style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: #10b981; box-shadow: 0 0 0 3px #d1fae5; flex-shrink: 0;"></span>

                <span id="track-status-text" style="font-size: 15px; font-weight: 800; color: #0f172a; letter-spacing: -0.01em;">--</span>

              </div>

            </div>

            <div style="display: flex; align-items: center; gap: 8px;">

              <span id="track-mode-badge" style="font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 4px; background: #f1f5f9; color: var(--text);">--</span>

              <span id="track-step-counter" class="font-mono tabular-num" style="font-size: 11px; font-weight: 700; padding: 3px 8px; border-radius: 4px; background: #f8fafc; color: #475569; border: 1px solid #e2e8f0;">Bước -- / --</span>

            </div>

          </div>

          

          <!-- Stepper Nodes Container with Technical Dashed Lines -->

          <div id="track-stepper-container" style="margin-top: 14px; overflow-x: auto;"></div>

          

          <!-- Estimated Delivery Banner -->

          <div id="track-eta-delivery-wrap" style="display: none; margin-top: 16px; background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 6px; padding: 10px 16px; align-items: center; justify-content: space-between;">

            <div style="display: flex; align-items: center; gap: 10px;">

              <span style="font-size: 10.5px; font-weight: 800; background: #059669; color: #ffffff; padding: 2px 7px; border-radius: 3px; text-transform: uppercase; letter-spacing: 0.3px;">Giao hàng dự kiến</span>

              <span id="track-eta-delivery-val" class="font-mono" style="font-size: 13.5px; font-weight: 800; color: #065f46;">--</span>

            </div>

            <span style="font-size: 11px; color: #047857; font-weight: 600;">Giao hàng tận nơi cơ sở T&T Vina</span>

          </div>

        </div>

        

        <!-- Logistics Specifications Grid -->

        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px;">

          

          <!-- Departure & Arrival Route -->

          <div style="background: #ffffff; border: 1px solid var(--border); border-radius: var(--radius); padding: 16px;">

            <div style="font-size: 12px; font-weight: 800; color: var(--brand); margin-bottom: 12px; text-transform: uppercase; border-bottom: 1px solid #f1f5f9; padding-bottom: 6px;">

              Lộ Trình Cảng Biển / Hàng Không

            </div>

            <div style="display: flex; flex-direction: column; gap: 10px; font-size: 12px;">

              <div>

                <span style="color: var(--text-muted);">Cảng xuất phát (POL):</span>

                <div id="track-pol" style="font-weight: 700; color: var(--text); margin-top: 1px;">--</div>

                <div id="track-etd-pol" class="font-mono tabular-num" style="font-size: 11px; color: var(--text-muted);">ETD: --</div>

              </div>

              <div>

                <span style="color: var(--text-muted);">Cảng dỡ / Sân bay đến (POD):</span>

                <div id="track-pod" style="font-weight: 700; color: var(--text); margin-top: 1px;">--</div>

                <div id="track-eta-pod" class="font-mono tabular-num" style="font-size: 11px; color: var(--text-muted);">ETA: --</div>

              </div>

              <div>

                <span style="color: var(--text-muted);">Kho đích / Kho CFS giám sát:</span>

                <div id="track-destination" style="font-weight: 700; color: var(--brand-dark); margin-top: 1px;">--</div>

              </div>

            </div>

          </div>

          

          <!-- Technical Specifications -->

          <div style="background: #ffffff; border: 1px solid var(--border); border-radius: var(--radius); padding: 16px;">

            <div style="font-size: 12px; font-weight: 800; color: var(--brand); margin-bottom: 12px; text-transform: uppercase; border-bottom: 1px solid #f1f5f9; padding-bottom: 6px;">

              Thông Số Kiện Hàng & Phương Tiện

            </div>

            <div style="display: flex; flex-direction: column; gap: 8px; font-size: 12px;">

              <div style="display: flex; justify-content: space-between;">

                <span style="color: var(--text-muted);">Phương tiện (Tàu / Bay):</span>

                <span id="track-vehicle" class="font-mono" style="font-weight: 700; color: var(--text);">--</span>

              </div>

              <div style="display: flex; justify-content: space-between;">

                <span style="color: var(--text-muted);">Số Cont / Chì niêm:</span>

                <span id="track-cont-seal" class="font-mono" style="font-weight: 700; color: var(--text);">--</span>

              </div>

              <div style="display: flex; justify-content: space-between;">

                <span style="color: var(--text-muted);">Quy cách kiện hàng:</span>

                <span id="track-packages" style="font-weight: 700; color: var(--text);">--</span>

              </div>

              <div style="display: flex; justify-content: space-between;">

                <span style="color: var(--text-muted);">Tổng trọng lượng (GW):</span>

                <span id="track-weight" class="font-mono tabular-num" style="font-weight: 700; color: var(--brand-dark);">--</span>

              </div>

              <div style="display: flex; justify-content: space-between;">

                <span style="color: var(--text-muted);">Thể tích kiện (Volume):</span>

                <span id="track-volume" class="font-mono tabular-num" style="font-weight: 700; color: var(--text);">--</span>

              </div>

              <div style="display: flex; justify-content: space-between;">

                <span style="color: var(--text-muted);">Thanh toán cước phí:</span>

                <span id="track-payment" style="font-weight: 700;">--</span>

              </div>

            </div>

          </div>

          

        </div>

        

        <!-- Detailed Milestones Chronology -->

        <div style="background: #ffffff; border: 1px solid var(--border); border-radius: var(--radius); padding: 16px 20px;">

          <div style="font-size: 12px; font-weight: 800; color: var(--brand); margin-bottom: 12px; text-transform: uppercase; border-bottom: 1px solid #f1f5f9; padding-bottom: 6px;">

            Lịch Trình Chi Tiết Các Mốc Thời Gian (Milestones)

          </div>

          <div id="track-milestones-list" style="display: flex; flex-direction: column; gap: 12px;"></div>

        </div>

        

      </div>

      

      <!-- Modal Footer -->

      <div class="modal-footer" style="padding: 10px 20px; border-top: 1px solid var(--border); background: #ffffff; display: flex; justify-content: space-between; align-items: center; flex-shrink: 0;">

        <span style="font-size: 11px; color: var(--text-muted);">Đồng bộ dữ liệu trực tiếp từ Cổng vận tải DHL Express & Quanterm Logistics</span>

        <button type="button" onclick="closeTrackingModal()" class="btn btn-outline btn-sm">Đóng Cửa Sổ</button>

      </div>



    </div>

  </div>



<?php endif; ?>



<script>

// ============================================================================

// CYBERSECURITY SHIELD: ANTI-SELF-XSS & CONSOLE TAMPERING WARNING

// ============================================================================

try {

  console.log(

    '%cDỪNG LẠI! (STOP!)',

    'color: #dc2626; font-size: 32px; font-weight: 900; -webkit-text-stroke: 1px black; padding: 4px;'

  );

  console.log(

    '%cĐây là tính năng bảo mật nội bộ của TTVina Office.\n' +

    'TUYỆT ĐỐI KHÔNG DÁN hoặc chạy bất kỳ đoạn mã JavaScript nào tại đây (Nguy cơ Self-XSS).\n' +

    'Toàn bộ yêu cầu can thiệp hệ thống đều được xác thực nghiêm ngặt và lưu vết nhật ký an ninh tại máy chủ.',

    'font-size: 13px; color: #1e293b; font-weight: 600; line-height: 1.6;'

  );

} catch (e) {}



// Toast Notification Helper (Clean & Non-Intrusive)

function showToast(message, type = 'info') {

  const container = document.getElementById('toast-container');

  if (!container) return;

  const toast = document.createElement('div');

  toast.className = `toast-box toast-${type}`;

  toast.textContent = message;

  container.appendChild(toast);

  setTimeout(() => {

    toast.style.opacity = '0';

    toast.style.transform = 'translateY(10px)';

    toast.style.transition = 'all 0.2s ease-out';

    setTimeout(() => toast.remove(), 200);

  }, 3500);

}



// Floating Back-To-Top Handler

window.addEventListener('scroll', () => {

  const btn = document.getElementById('btn-back-to-top');

  if (btn) {

    if (window.scrollY > 200) {

      btn.classList.add('visible');

    } else {

      btn.classList.remove('visible');

    }

  }

});



function scrollToTop() {

  window.scrollTo({ top: 0, behavior: 'smooth' });

}



// SPA Client Engine

let currentTab = 'dashboard';

window.currentUserRole = '<?= isset($user['role']) ? $user['role'] : '' ?>';

let quoteItems = [];

let cachedCustomers = [];



// Stock Pagination / Expand State

let allStockItems = [];

let stockDisplayLimit = 10;



document.addEventListener('DOMContentLoaded', () => {

  const loginForm = document.getElementById('login-form');

  if (loginForm) {

    loginForm.addEventListener('submit', handleLogin);

  } else {

    loadDashboard();

    loadCustomers();

  }

});





let otpTimer = null;

let resendTimer = null;



function startOtpCountdown(seconds) {

  clearInterval(otpTimer);

  clearInterval(resendTimer);

  let remain = seconds;

  const cdEl = document.getElementById('otp-countdown');

  const resendBtn = document.getElementById('btn-resend-otp');

  

  // 30s cooldown for resend button instead of blocking for 5 minutes

  let resendCooldown = 30;

  if (resendBtn) {

    resendBtn.disabled = true;

    resendBtn.textContent = `Gửi lại mã (${resendCooldown}s)`;

  }

  

  resendTimer = setInterval(() => {

    resendCooldown--;

    if (resendBtn) {

      if (resendCooldown > 0) {

        resendBtn.disabled = true;

        resendBtn.textContent = `Gửi lại mã (${resendCooldown}s)`;

      } else {

        clearInterval(resendTimer);

        resendBtn.disabled = false;

        resendBtn.textContent = 'Gửi lại mã';

      }

    }

  }, 1000);



  function update() {

    const m = Math.floor(remain / 60);

    const s = remain % 60;

    if (cdEl) cdEl.textContent = `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;

    if (remain <= 0) {

      clearInterval(otpTimer);

      if (cdEl) cdEl.textContent = 'Đã hết hạn';

    }

    remain--;

  }

  update();

  otpTimer = setInterval(update, 1000);

}



function cancel2FA() {

  clearInterval(otpTimer);

  clearInterval(resendTimer);

  document.getElementById('otp-form').style.display = 'none';

  document.getElementById('login-form').style.display = 'block';

  document.getElementById('login-error').style.display = 'none';

  const resendBtn = document.getElementById('btn-resend-otp');

  if (resendBtn) {

    resendBtn.disabled = false;

    resendBtn.textContent = 'Gửi lại mã';

  }

}



async function resend2FA() {

  const errBox = document.getElementById('login-error');

  const errText = document.getElementById('login-error-text');

  const resendBtn = document.getElementById('btn-resend-otp');

  

  if (resendBtn) {

    resendBtn.disabled = true;

    resendBtn.textContent = 'Đang gửi...';

  }

  if (errBox) errBox.style.display = 'none';



  try {

    const res = await fetch('/office/api.php?action=resend_2fa', { method: 'POST' });

    const data = await res.json();

    if (data.ok) {

      showToast(data.message || 'Đã gửi lại mã OTP mới qua Telegram!', 'success');

      startOtpCountdown(300);

    } else {

      if (resendBtn) {

        resendBtn.disabled = false;

        resendBtn.textContent = 'Gửi lại mã';

      }

      errBox.style.display = 'block';

      errText.textContent = data.error || 'Không thể gửi lại mã OTP';

    }

  } catch (e) {

    if (resendBtn) {

      resendBtn.disabled = false;

      resendBtn.textContent = 'Gửi lại mã';

    }

    errBox.style.display = 'block';

    errText.textContent = 'Lỗi kết nối máy chủ.';

  }

}



async function handleVerify2FA(e) {

  e.preventDefault();

  const otp = document.getElementById('otp-code').value.trim();

  const errBox = document.getElementById('login-error');

  const errText = document.getElementById('login-error-text');

  

  if (!otp || otp.length !== 6) {

    errBox.style.display = 'block';

    errText.textContent = 'Vui lòng nhập đủ 6 chữ số OTP.';

    return;

  }

  

  try {

    const res = await fetch('/office/api.php?action=verify_2fa', {

      method: 'POST',

      headers: { 'Content-Type': 'application/json' },

      body: JSON.stringify({ otp })

    });

    const data = await res.json();

    if (data.ok) {

      clearInterval(otpTimer);

      window.location.reload();

    } else {

      errBox.style.display = 'block';

      errText.textContent = data.error || 'Mã OTP không chính xác';

    }

  } catch (err) {

    errBox.style.display = 'block';

    errText.textContent = 'Lỗi kết nối máy chủ.';

  }

}



async function handleLogin(e) {

  e.preventDefault();

  const email = document.getElementById('login-email').value;

  const password = document.getElementById('login-password').value;

  const errBox = document.getElementById('login-error');

  const errText = document.getElementById('login-error-text');

  

  try {

    const res = await fetch('/office/api.php?action=login', {

      method: 'POST',

      headers: { 'Content-Type': 'application/json' },

      body: JSON.stringify({ email, password })

    });

    const data = await res.json();

    if (data.ok) {

      if (data.require_2fa) {

        document.getElementById('login-form').style.display = 'none';

        document.getElementById('otp-form').style.display = 'block';

        document.getElementById('otp-code').value = '';

        document.getElementById('otp-code').focus();

        startOtpCountdown(300);

      } else {

        window.location.reload();

      }

    } else {

      errBox.style.display = 'block';

      errText.textContent = data.error || 'Đăng nhập không thành công';

    }

  } catch (err) {

    errBox.style.display = 'block';

    errText.textContent = 'Lỗi kết nối máy chủ.';

  }

}



async function handleLogout() {

  await fetch('/office/api.php?action=logout', { method: 'POST' });

  window.location.reload();

}



let activeDocFilter = '';



function setDocFilter(filterType, btn) {

  activeDocFilter = filterType;

  document.querySelectorAll('.doc-pill').forEach(b => {

    b.classList.remove('btn-primary');

    b.classList.add('btn-outline');

  });

  if (btn) {

    btn.classList.remove('btn-outline');

    btn.classList.add('btn-primary');

  }

  loadDocuments();

}



function switchTab(tabId, el) {

  currentTab = tabId;

  if (window.location.hash !== '#' + tabId) { history.replaceState(null, '', '#' + tabId); }

  document.querySelectorAll('.tab-pane').forEach(p => p.style.display = 'none');

  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

  

  const targetPane = document.getElementById('tab-' + tabId);

  if (targetPane) targetPane.style.display = 'block';

  

  if (el) {

    el.classList.add('active');

  } else {

    const navBtn = document.querySelector(`.nav-item[data-tab='${tabId}']`);

    if (navBtn) navBtn.classList.add('active');

  }

  

  if (tabId === 'dashboard') loadDashboard();

  if (tabId === 'wms') { loadStock(); loadLedger(); }

  if (tabId === 'sales') {

    const custPane = document.getElementById('subpane-customers');

    if (custPane && custPane.style.display === 'block') {

      loadCustomersDirectory();

    } else {

      loadQuotes();

    }

  }

  if (tabId === 'procurement') loadShipments();

  if (tabId === 'documents') loadDocuments();

}



async function loadDashboard() {

  try {

    const res = await fetch('/office/api.php?action=dashboard_metrics');

    const data = await res.json();

    if (!data.ok) return;

    

    const m = data.metrics;

    document.getElementById('kpi-products').textContent = m.total_products?.toLocaleString('vi-VN') || '15.407';

    document.getElementById('kpi-onhand').textContent = m.total_on_hand_units?.toLocaleString('vi-VN') || '0';

    document.getElementById('kpi-reserved').textContent = m.total_reserved_units?.toLocaleString('vi-VN') || '0';

    document.getElementById('kpi-pending-quotes').textContent = m.pending_director_quotes || '0';

    

    // Storage alert countdown

    const alertBox = document.getElementById('storage-alert-box');

    if (m.storage_alert) {

      alertBox.style.display = 'flex';

      document.getElementById('storage-alert-text').textContent = 

        `AWB ${m.storage_alert.awb_no}: ${m.storage_alert.formatted} (Hạn chót: ${m.storage_alert.deadline})`;

    } else {

      alertBox.style.display = 'none';

    }

    

    // Recent shipments table

    renderShipmentsTable('tbl-recent-shipments', data.recent_shipments);

  } catch (e) {

    console.error('Lỗi nạp dashboard:', e);

  }

}



function getTransportModeBadge(mode) {

  if (mode === 'AIR') {

    return '<span style="display: inline-block; font-size: 11px; font-weight: 700; padding: 2px 6px; border-radius: 4px; background: #eff6ff; color: #1d4ed8; border: 1px solid #bfdbfe; white-space: nowrap;">Đường Air (Bay)</span>';

  } else if (mode === 'SEA_LCL') {

    return '<span style="display: inline-block; font-size: 11px; font-weight: 700; padding: 2px 6px; border-radius: 4px; background: #ecfeff; color: #0e7490; border: 1px solid #a5f3fc; white-space: nowrap;">Đường Sea (LCL Gom)</span>';

  } else if (mode === 'SEA_FCL') {

    return '<span style="display: inline-block; font-size: 11px; font-weight: 700; padding: 2px 6px; border-radius: 4px; background: #ecfeff; color: #0e7490; border: 1px solid #a5f3fc; white-space: nowrap;">Đường Sea (FCL Nguyên Cont)</span>';

  }

  return '<span style="display: inline-block; font-size: 11px; font-weight: 700; padding: 2px 6px; border-radius: 4px; background: #f1f5f9; color: #475569; border: 1px solid #e2e8f0; white-space: nowrap;">Đa phương thức</span>';

}



function getPortName(portCode) {

  if (portCode === 'VNHAN') return 'Nội Bài (VNHAN)';

  if (portCode === 'VNHPH') return 'Hải Phòng (VNHPH)';

  if (portCode === 'VNSGN') return 'Cát Lái (VNSGN)';

  return portCode || 'VNHAN';

}



function renderShipmentsTable(elementId, shipments) {

  const tbody = document.querySelector(`#${elementId} tbody`);

  if (!shipments || shipments.length === 0) {

    tbody.innerHTML = '<tr><td colspan="9" style="text-align: center; color: var(--text-muted); padding: 16px;">Không có chuyến hàng nào gần đây.</td></tr>';

    return;

  }

  tbody.innerHTML = shipments.map(s => {

    const isQuanterm = (s.carrier_name || '').toLowerCase().indexOf('quanterm') !== -1 || (s.awb_no || '').indexOf('SEA') !== -1;

    const displayAwb = (isQuanterm && (s.awb_no === '8006432726' || !s.awb_no.includes('/'))) ? 'SEA44/2606-1096' : s.awb_no;

    return `

    <tr>

      <td class="font-mono" style="font-weight: 700; color: var(--brand);">${s.shipment_code}</td>

      <td>

        <div style="font-weight: 600;">${s.carrier_name}</div>

        <div style="margin-top: 3px;">${getTransportModeBadge(s.transport_mode)}</div>

      </td>

      <td>

        <div class="font-mono" style="font-weight: 700; color: var(--brand-dark);">${displayAwb}</div>

        <button type="button" onclick="openTrackingModal(${s.id}, '${escapeJsQuote(displayAwb)}', '${escapeJsQuote(s.carrier_name)}')" class="btn-act btn-act-view" style="font-size: 10.5px; padding: 2px 7px; margin-top: 4px; display: inline-flex; align-items: center; gap: 4px;" title="Tra cứu hành trình vận chuyển">

          Tra cứu

        </button>

      </td>

      <td><span style="font-weight: 600;">${s.package_qty || 1} kiện</span></td>

      <td class="num font-mono" style="font-weight: 600;">${Number(s.gross_weight_kg || 0).toLocaleString('vi-VN')} kg</td>

      <td>

        <div style="font-weight: 600;">${getPortName(s.discharge_port_code)}</div>

        <div style="font-size: 11px; color: var(--text-muted); margin-top: 2px;">Kho: ${s.customs_warehouse_code || '01DDEC1'}</div>

      </td>

      <td style="color: ${s.status === 'ARRIVED_NOTICE' ? 'var(--warn)' : 'inherit'}; font-weight: 600; font-size: 12px;">

        ${s.free_storage_deadline || '-'}

      </td>

      <td>${getShipmentStatusBadge(s.status)}</td>

      <td style="text-align: left; white-space: nowrap;">

        <button type="button" onclick="openTrackingModal(${s.id}, '${escapeJsQuote(displayAwb)}', '${escapeJsQuote(s.carrier_name)}')" class="btn-act btn-act-view" title="Xem hành trình chi tiết">

          Chi tiết

        </button>

      </td>

    </tr>

  `;

  }).join('');

}



async function loadStock() {

  const q = document.getElementById('wms-search')?.value || '';

  const res = await fetch('/office/api.php?action=get_stock&q=' + encodeURIComponent(q));

  const data = await res.json();

  const tbody = document.querySelector('#tbl-stock tbody');

  

  if (!data.ok || !data.items || data.items.length === 0) {

    allStockItems = [];

    tbody.innerHTML = '<tr><td colspan="8" style="text-align: center; color: var(--text-muted); padding: 16px;">Không tìm thấy vật tư nào trong kho.</td></tr>';

    document.getElementById('stock-footer-bar').style.display = 'none';

    document.getElementById('stock-count-badge').textContent = '0 mặt hàng';

    return;

  }

  

  allStockItems = data.items;

  document.getElementById('stock-count-badge').textContent = `Tổng ${allStockItems.length} mặt hàng`;

  

  renderStockRows();

}



function renderStockRows() {

  const tbody = document.querySelector('#tbl-stock tbody');

  const q = document.getElementById('wms-search')?.value.trim() || '';

  const footerBar = document.getElementById('stock-footer-bar');

  const footerInfo = document.getElementById('stock-footer-info');

  const btnMore = document.getElementById('btn-stock-more');

  const btnAll = document.getElementById('btn-stock-all');

  const btnCollapse = document.getElementById('btn-stock-collapse');

  

  // If user is searching, show all matching rows and hide footer controls

  if (q.length > 0) {

    footerBar.style.display = 'none';

    tbody.innerHTML = allStockItems.map(renderSingleStockRow).join('');

    return;

  }

  

  // Normal mode: apply display limit

  footerBar.style.display = 'flex';

  const visibleItems = (stockDisplayLimit === 'all') 

    ? allStockItems 

    : allStockItems.slice(0, stockDisplayLimit);

  

  tbody.innerHTML = visibleItems.map(renderSingleStockRow).join('');

  footerInfo.textContent = `Đang hiển thị ${visibleItems.length} / ${allStockItems.length} mặt hàng`;

  

  if (stockDisplayLimit === 'all' || visibleItems.length >= allStockItems.length) {

    btnMore.style.display = 'none';

    btnAll.style.display = 'none';

    btnCollapse.style.display = 'inline-flex';

  } else {

    btnMore.style.display = 'inline-flex';

    btnAll.style.display = 'inline-flex';

    btnCollapse.style.display = (stockDisplayLimit > 10) ? 'inline-flex' : 'none';

  }

}



function renderSingleStockRow(it) {
  const isChecked = !!it.wms_checked;
  const projectTag = it.customer_project
    ? `<div style="margin-top:2px;"><span style="background:#eff6ff; color:#1d4ed8; font-size:11px; font-weight:700; padding:1px 6px; border-radius:3px; border:1px solid #bfdbfe;">${it.customer_project}</span></div>`
    : '';
  const statusBadge = isChecked
    ? `<div style="font-size:11px; color:#16a34a; font-weight:700; margin-top:2px;">Đã kiểm tại kho</div>`
    : `<div style="font-size:11px; color:#f59e0b; font-weight:600; margin-top:2px;">Chờ kiểm kho</div>`;
  const photoBtn = it.wms_img_real
    ? `<a href="${it.wms_img_real}" target="_blank" rel="noopener" class="btn btn-outline btn-sm" style="padding:2px 7px; font-size:11px; margin-right:4px; text-decoration:none;">Xem ảnh</a>`
    : '';

  return `
    <tr>
      <td class="font-mono" style="font-weight: 700; color: var(--brand);">${it.sku}</td>
      <td>
        <b>${it.name_vn}</b>
        ${projectTag}
      </td>
      <td class="font-mono">${it.hs_code || '39174000'}</td>
      <td>
        <span style="background: var(--surface-subtle); padding: 2px 6px; border-radius: 4px; font-weight: 600; border: 1px solid var(--border);">${it.location_code}</span>
        ${statusBadge}
      </td>
      <td class="num font-mono" style="font-weight: 700;">${Number(it.qty_on_hand).toLocaleString('vi-VN')}</td>
      <td class="num font-mono" style="color: var(--warn); font-weight: 600;">${Number(it.qty_reserved).toLocaleString('vi-VN')}</td>
      <td class="num font-mono" style="color: var(--ok); font-weight: 800;">${Number(it.qty_available).toLocaleString('vi-VN')}</td>
      <td style="text-align: center; white-space: nowrap;">
        ${photoBtn}
        <button class="btn btn-outline btn-sm" onclick="quickDeliver('${it.sku}', '${it.location_code}')">Xuất</button>
      </td>
    </tr>
  `;
}



function expandStock(amount) {

  if (amount === 'all') {

    stockDisplayLimit = 'all';

  } else {

    stockDisplayLimit = (typeof stockDisplayLimit === 'number' ? stockDisplayLimit : 10) + amount;

  }

  renderStockRows();

}



function collapseStock() {

  stockDisplayLimit = 10;

  renderStockRows();

  // Smooth scroll back to top of stock card

  document.getElementById('tab-wms').scrollIntoView({ behavior: 'smooth', block: 'start' });

}



async function loadLedger() {

  const res = await fetch('/office/api.php?action=get_ledger');

  const data = await res.json();

  const tbody = document.querySelector('#tbl-ledger tbody');

  

  if (!data.ok || !data.ledger || data.ledger.length === 0) {

    tbody.innerHTML = '<tr><td colspan="8" style="text-align: center; color: var(--text-muted); padding: 16px;">Chưa có biến động thẻ kho nào.</td></tr>';

    return;

  }

  

  tbody.innerHTML = data.ledger.map(l => `

    <tr>

      <td class="font-mono" style="font-weight: 700;">${l.trans_code}</td>

      <td>${getLedgerTypeBadge(l.trans_type)}</td>

      <td class="font-mono">${l.sku}</td>

      <td class="num font-mono" style="font-weight: 700; color: ${Number(l.qty_change) > 0 ? 'var(--ok)' : 'var(--danger)'};">

        ${Number(l.qty_change) > 0 ? '+' : ''}${Number(l.qty_change).toLocaleString('vi-VN')}

      </td>

      <td class="num font-mono" style="font-weight: 700;">${Number(l.balance_after).toLocaleString('vi-VN')}</td>

      <td>${l.location_code}</td>

      <td>${l.created_by_name || 'Hệ thống'}</td>

      <td style="font-size: 11px; color: var(--text-muted);">${l.created_at}</td>

    </tr>

  `).join('');

}



function getShipmentStatusBadge(status) {

  const map = {

    'ARRIVED_NOTICE': { label: 'Đã có thông báo đến (DHL)', bg: '#fef3c7', color: '#92400e', border: '#fde68a' },

    'IN_TRANSIT': { label: 'Đang vận chuyển quốc tế', bg: '#e0f2fe', color: '#0369a1', border: '#bae6fd' },

    'CUSTOMS_CLEARED': { label: 'Đã thông quan Hải quan', bg: '#dcfce7', color: '#166534', border: '#bbf7d0' },

    'DELIVERED_TO_WH': { label: 'Đã nhập kho an toàn', bg: '#f0fdf4', color: '#15803d', border: '#86efac' }

  };

  const conf = map[status] || { label: status, bg: '#f1f5f9', color: '#475569', border: '#e2e8f0' };

  return `<span style="display: inline-block; font-size: 11px; font-weight: 700; padding: 2px 7px; border-radius: 4px; background: ${conf.bg}; color: ${conf.color}; border: 1px solid ${conf.border}; white-space: nowrap;">${conf.label}</span>`;

}



function getLedgerTypeBadge(type) {

  const map = {

    'IN_PURCHASE': { label: 'Nhập Mua Hàng', bg: '#dcfce7', color: '#166534', border: '#bbf7d0' },

    'OUT_SALES': { label: 'Xuất Bán Hàng', bg: '#e0f2fe', color: '#0369a1', border: '#bae6fd' },

    'ADJUST_IN': { label: 'Kiểm Kê Tăng', bg: '#dcfce7', color: '#166534', border: '#bbf7d0' },

    'ADJUST_OUT': { label: 'Kiểm Kê Giảm', bg: '#fee2e2', color: '#991b1b', border: '#fecaca' },

    'REVERSAL': { label: 'Hủy Giao Dịch', bg: '#fef3c7', color: '#92400e', border: '#fde68a' }

  };

  const conf = map[type] || { label: type, bg: '#f1f5f9', color: '#475569', border: '#e2e8f0' };

  return `<span style="display: inline-block; font-size: 11px; font-weight: 700; padding: 2px 7px; border-radius: 4px; background: ${conf.bg}; color: ${conf.color}; border: 1px solid ${conf.border}; white-space: nowrap;">${conf.label}</span>`;

}



function getQuoteStatusBadge(status) {

  const map = {

    'AUTO_APPROVED': { label: 'Tự động duyệt (< 5 triệu)', bg: '#dcfce7', color: '#166534', border: '#bbf7d0' },

    'DIRECTOR_APPROVED': { label: 'Giám đốc đã phê duyệt', bg: '#f0fdf4', color: '#15803d', border: '#86efac' },

    'PENDING_DIRECTOR': { label: 'Chờ Giám đốc duyệt', bg: '#fef3c7', color: '#92400e', border: '#fde68a' },

    'DRAFT': { label: 'Bản nháp', bg: '#f1f5f9', color: '#475569', border: '#e2e8f0' },

    'REJECTED': { label: 'Từ chối duyệt', bg: '#fee2e2', color: '#991b1b', border: '#fecaca' }

  };

  const conf = map[status] || { label: status, bg: '#f1f5f9', color: '#475569', border: '#e2e8f0' };

  return `<span style="display: inline-block; font-size: 11px; font-weight: 700; padding: 2px 7px; border-radius: 4px; background: ${conf.bg}; color: ${conf.color}; border: 1px solid ${conf.border}; white-space: nowrap;">${conf.label}</span>`;

}



async function loadQuotes() {

  const tbody = document.querySelector('#tbl-quotes tbody');

  try {

    const res = await fetch('/office/api.php?action=get_quotations');

    const data = await res.json();

    if (!data.ok || !data.quotations || data.quotations.length === 0) {

      tbody.innerHTML = '<tr><td colspan="8" style="text-align: center; padding: 24px; color: var(--text-muted);">Chưa có báo giá nào được tạo.</td></tr>';

      return;

    }

    

    tbody.innerHTML = data.quotations.map(q => {

      const isPending = q.approval_status === 'PENDING_DIRECTOR';

      const canApprove = (window.currentUserRole === 'ADMIN' && isPending);

      const canDelete = (window.currentUserRole === 'ADMIN' || window.currentUserRole === 'SALES');

      return `

        <tr>

          <td class="font-mono" style="font-weight: 700; color: var(--brand); font-size: 12px;">${q.quote_code}</td>

          <td><b>${q.customer_name}</b></td>

          <td class="num font-mono" style="font-weight: 600;">${Number(q.total_amount_vnd).toLocaleString('vi-VN')} đ</td>

          <td class="num font-mono" style="color: var(--text-muted);">${Number(q.freight_amount_vnd).toLocaleString('vi-VN')} đ</td>

          <td class="num font-mono" style="font-weight: 700; color: var(--brand-dark);">${Number(q.final_amount_vnd).toLocaleString('vi-VN')} đ</td>

          <td>${getQuoteStatusBadge(q.approval_status)}</td>

          <td style="font-size: 12px; color: var(--text-muted);">${q.valid_until || '30 ngày'}</td>

          <td style="text-align: left; white-space: nowrap;">

            <div class="action-group">

              <button type="button" onclick="viewQuoteDetail(${q.id})" class="btn-act btn-act-view" title="Xem chi tiết & In báo giá">Xem</button>

              ${canApprove ? `<button type="button" onclick="approveQuote(${q.id})" class="btn-act btn-act-approve" title="Phê duyệt báo giá">Duyệt</button>` : ''}

              ${canDelete ? `<button type="button" onclick="handleDeleteQuote(${q.id}, '${q.quote_code}')" class="btn-act btn-act-del" title="Xóa báo giá">Xóa</button>` : ''}

            </div>

          </td>

        </tr>

      `;

    }).join('');

  } catch (e) {

    tbody.innerHTML = '<tr><td colspan="8" style="text-align: center; color: var(--danger); padding: 16px;">Lỗi tải danh sách báo giá.</td></tr>';

  }

}



async function approveQuote(quoteId) {

  if (!confirm('Xác nhận phê duyệt báo giá này cho khách hàng?')) return;

  try {

    const res = await fetch('/office/api.php?action=approve_quotation', {

      method: 'POST',

      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },

      body: 'quote_id=' + encodeURIComponent(quoteId)

    });

    const data = await res.json();

    if (data.ok) {

      showToast(data.message || 'Phê duyệt thành công!', 'success');

      loadQuotes();

      loadDashboard();

    } else {

      showToast(data.error || 'Lỗi phê duyệt', 'error');

    }

  } catch (e) {

    showToast('Lỗi kết nối máy chủ', 'error');

  }

}



function getDocTypeBadge(type) {

  const map = {

    'COMMERCIAL_INVOICE': { label: 'Hóa đơn Thương mại (HQ)', bg: '#e0f2fe', color: '#0369a1', border: '#bae6fd' },

    'VAT_INVOICE': { label: 'Hóa đơn VAT Đầu vào', bg: '#fef2f2', color: '#b91c1c', border: '#fecaca' },

    'CUSTOMS_DECLARATION': { label: 'Tờ khai Hải quan', bg: '#f0fdf4', color: '#15803d', border: '#bbf7d0' },

    'ARRIVAL_NOTICE_DHL': { label: 'Thông báo hàng về DHL', bg: '#fefce8', color: '#a16207', border: '#fef08a' },

    'AIR_WAYBILL': { label: 'Vận đơn Hàng không (AWB)', bg: '#f0f9ff', color: '#0284c7', border: '#e0f2fe' },

    'PACKING_LIST': { label: 'Phiếu Đóng gói (PKL)', bg: '#faf5ff', color: '#7e22ce', border: '#f3e8ff' },

    'ORDER_CONFIRMATION': { label: 'Xác nhận Đơn hàng (OC)', bg: '#f8fafc', color: '#334155', border: '#cbd5e1' },

    'QUOTATION': { label: 'Báo giá Khách hàng', bg: '#eff6ff', color: '#1d4ed8', border: '#dbeafe' },

    'DELIVERY_RECEIPT': { label: 'Biên bản Giao hàng', bg: '#ecfdf5', color: '#047857', border: '#a7f3d0' }

  };

  const conf = map[type] || { label: type, bg: '#f1f5f9', color: '#475569', border: '#e2e8f0' };

  return `<span style="display: inline-block; font-size: 11px; font-weight: 700; padding: 2px 7px; border-radius: 4px; background: ${conf.bg}; color: ${conf.color}; border: 1px solid ${conf.border}; white-space: nowrap;">${conf.label}</span>`;

}



function getFileFormatBadge(fileName) {

  const ext = fileName.split('.').pop().toLowerCase();

  if (ext === 'pdf') {

    return `<span style="font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 3px; background: #fee2e2; color: #dc2626;">PDF</span>`;

  } else if (ext === 'xlsx' || ext === 'xls') {

    return `<span style="font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 3px; background: #dcfce7; color: #16a34a;">EXCEL</span>`;

  } else if (ext === 'docx' || ext === 'doc') {

    return `<span style="font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 3px; background: #e0e7ff; color: #4338ca;">WORD</span>`;

  }

  return `<span style="font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 3px; background: #f1f5f9; color: #64748b;">${ext.toUpperCase()}</span>`;

}





// ============================================================================

// UNIVERSAL DOCUMENT PREVIEWER LOGIC (SHEETJS, MAMMOTH, PDF, IMAGES)

// ============================================================================

let currentWorkbook = null;

let currentWorksheetNames = [];

let currentDocId = null;



function escapeJsQuote(str) {

  if (!str) return '';

  return String(str).replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/"/g, '&quot;');

}



async function previewDocument(id, fileName, docCode, docType, fileSize) {

  currentDocId = id;

  const ext = (fileName.split('.').pop() || '').toLowerCase();

  

  // Set modal headers

  document.getElementById('prev-doc-code').textContent = docCode || ('DOC-' + id);

  document.getElementById('prev-doc-name').textContent = fileName;

  document.getElementById('prev-doc-name').title = fileName;

  document.getElementById('prev-doc-badge').innerHTML = getDocTypeBadge(docType);

  document.getElementById('prev-doc-format').innerHTML = getFileFormatBadge(fileName);

  document.getElementById('prev-doc-size').textContent = (fileSize ? (fileSize / 1024).toFixed(1) + ' KB' : '');

  

  // Update action buttons

  document.getElementById('prev-btn-download').href = `/office/download.php?id=${id}&download=1`;

  document.getElementById('prev-btn-open-tab').href = `/office/download.php?id=${id}`;

  document.getElementById('prev-error-dl-btn').href = `/office/download.php?id=${id}&download=1`;

  

  // Hide all preview containers

  document.getElementById('prev-loading').style.display = 'flex';

  document.getElementById('prev-error').style.display = 'none';

  document.getElementById('prev-pdf-wrap').style.display = 'none';

  document.getElementById('prev-excel-wrap').style.display = 'none';

  document.getElementById('prev-word-wrap').style.display = 'none';

  document.getElementById('prev-img-wrap').style.display = 'none';

  document.getElementById('prev-txt-wrap').style.display = 'none';

  

  // Open modal

  document.getElementById('modal-doc-preview').classList.add('active');

  

  try {

    if (ext === 'pdf') {

      // PDF: render in iframe

      const iframe = document.getElementById('doc-prev-iframe');

      iframe.src = `/office/download.php?id=${id}&inline=1`;

      iframe.onload = () => {

        document.getElementById('prev-loading').style.display = 'none';

        document.getElementById('prev-pdf-wrap').style.display = 'block';

      };

      setTimeout(() => {

        document.getElementById('prev-loading').style.display = 'none';

        document.getElementById('prev-pdf-wrap').style.display = 'block';

      }, 700);

    } else if (ext === 'xlsx' || ext === 'xls') {

      // Excel: Fetch arrayBuffer and parse with SheetJS

      const resp = await fetch(`/office/download.php?id=${id}`);

      if (!resp.ok) throw new Error('Không thể tải tệp tin từ máy chủ.');

      const buffer = await resp.arrayBuffer();

      

      if (typeof XLSX === 'undefined') {

        throw new Error('Thư viện phân tích bảng tính SheetJS chưa được nạp.');

      }

      

      currentWorkbook = XLSX.read(buffer, { type: 'array' });

      currentWorksheetNames = currentWorkbook.SheetNames || [];

      

      if (currentWorksheetNames.length === 0) {

        throw new Error('Bảng tính không có trang tính nào.');

      }

      

      // Render sheet tabs

      const tabsEl = document.getElementById('excel-sheet-tabs');

      tabsEl.innerHTML = currentWorksheetNames.map((name, idx) => `

        <button type="button" onclick="renderExcelSheet(${idx})" class="btn-sheet-tab" id="sheet-tab-${idx}" style="padding: 4px 10px; font-size: 11px; font-weight: 600; border-radius: 4px; border: 1px solid var(--border); background: ${idx === 0 ? 'var(--brand)' : '#ffffff'}; color: ${idx === 0 ? '#ffffff' : 'var(--text)'}; cursor: pointer; white-space: nowrap;">

          ${name}

        </button>

      `).join('');

      

      // Render first sheet

      renderExcelSheet(0);

      

      document.getElementById('prev-loading').style.display = 'none';

      document.getElementById('prev-excel-wrap').style.display = 'flex';

    } else if (ext === 'docx' || ext === 'doc') {

      // Word: Fetch arrayBuffer and parse with Mammoth

      const resp = await fetch(`/office/download.php?id=${id}`);

      if (!resp.ok) throw new Error('Không thể tải tệp tin.');

      const buffer = await resp.arrayBuffer();

      

      if (typeof mammoth !== 'undefined') {

        const result = await mammoth.convertToHtml({ arrayBuffer: buffer });

        document.getElementById('word-render-content').innerHTML = result.value || '<p style="color: var(--text-muted);">Tài liệu không có nội dung văn bản.</p>';

        document.getElementById('prev-loading').style.display = 'none';

        document.getElementById('prev-word-wrap').style.display = 'block';

      } else {

        throw new Error('Thư viện đọc tài liệu Word chưa sẵn sàng.');

      }

    } else if (['png', 'jpg', 'jpeg', 'svg', 'webp', 'gif'].indexOf(ext) !== -1) {

      // Images

      const img = document.getElementById('doc-prev-img-el');

      img.src = `/office/download.php?id=${id}`;

      img.onload = () => {

        document.getElementById('prev-loading').style.display = 'none';

        document.getElementById('prev-img-wrap').style.display = 'flex';

      };

      img.onerror = () => {

        throw new Error('Không thể tải hình ảnh.');

      };

    } else if (['txt', 'csv', 'json', 'xml', 'log'].indexOf(ext) !== -1) {

      // Plain text / Data

      const resp = await fetch(`/office/download.php?id=${id}`);

      const txt = await resp.text();

      document.getElementById('doc-prev-txt-content').textContent = txt;

      document.getElementById('prev-loading').style.display = 'none';

      document.getElementById('prev-txt-wrap').style.display = 'block';

    } else {

      throw new Error(`Định dạng tệp .${ext.toUpperCase()} chưa hỗ trợ xem trước trực tiếp trên trình duyệt.`);

    }

  } catch (err) {

    document.getElementById('prev-loading').style.display = 'none';

    document.getElementById('prev-error-msg').textContent = err.message || 'Lỗi khi hiển thị bản xem trước.';

    document.getElementById('prev-error').style.display = 'flex';

  }

}



function renderExcelSheet(sheetIndex) {

  if (!currentWorkbook || !currentWorksheetNames[sheetIndex]) return;

  const sheetName = currentWorksheetNames[sheetIndex];

  const worksheet = currentWorkbook.Sheets[sheetName];

  

  // Highlight active tab

  currentWorksheetNames.forEach((_, idx) => {

    const btn = document.getElementById(`sheet-tab-${idx}`);

    if (btn) {

      if (idx === sheetIndex) {

        btn.style.background = 'var(--brand)';

        btn.style.color = '#ffffff';

      } else {

        btn.style.background = '#ffffff';

        btn.style.color = 'var(--text)';

      }

    }

  });



  const container = document.getElementById('excel-sheet-render');

  const noticeEl = document.getElementById('excel-truncation-notice');

  const dlBtn = document.getElementById('excel-notice-dl-btn');

  if (dlBtn && currentDocId) {

    dlBtn.href = `/office/download.php?id=${currentDocId}&download=1`;

  }

  

  // Calculate row and col count & bounded range

  let totalRows = 0, totalCols = 0;

  let renderRange = null;

  let isTruncated = false;

  

  if (worksheet['!ref']) {

    const origRange = XLSX.utils.decode_range(worksheet['!ref']);

    totalRows = origRange.e.r - origRange.s.r + 1;

    totalCols = origRange.e.c - origRange.s.c + 1;

    

    // Lightning-fast bounding: max 100 rows and max 35 cols

    if (totalRows > 100 || totalCols > 35) {

      isTruncated = true;

      renderRange = {

        s: { r: origRange.s.r, c: origRange.s.c },

        e: { 

          r: Math.min(origRange.e.r, origRange.s.r + 99),

          c: Math.min(origRange.e.c, origRange.s.c + 34)

        }

      };

    }

  }



  if (noticeEl) {

    if (isTruncated) {

      noticeEl.style.display = 'flex';

      const countEl = document.getElementById('excel-total-rows');

      if (countEl) countEl.textContent = totalRows.toLocaleString('vi-VN');

    } else {

      noticeEl.style.display = 'none';

    }

  }

  

  document.getElementById('excel-sheet-info').textContent = `${sheetName} (${totalRows.toLocaleString('vi-VN')} dòng × ${totalCols} cột)`;

  

  // Convert sheet to HTML table using SheetJS with range constraint

  const htmlTable = XLSX.utils.sheet_to_html(worksheet, {

    range: renderRange || worksheet['!ref'],

    id: 'excel-preview-table',

    editable: false

  });

  

  container.innerHTML = htmlTable;

  

  // Style table quickly without lag

  const table = document.getElementById('excel-preview-table');

  if (table) {

    table.className = 'excel-preview-table';

  }

  

  // Clear filter input

  const filterInput = document.getElementById('excel-filter-input');

  if (filterInput) filterInput.value = '';

}



function filterExcelTable() {

  const q = document.getElementById('excel-filter-input')?.value.toLowerCase().trim() || '';

  const table = document.getElementById('excel-preview-table');

  if (!table) return;

  const rows = table.querySelectorAll('tr');

  rows.forEach((tr, idx) => {

    if (idx === 0) return; // Keep header visible

    if (!q) {

      tr.style.display = '';

    } else {

      const text = tr.textContent.toLowerCase();

      tr.style.display = text.indexOf(q) !== -1 ? '' : 'none';

    }

  });

}



function closeDocPreviewModal() {

  document.getElementById('modal-doc-preview').classList.remove('active');

  const iframe = document.getElementById('doc-prev-iframe');

  if (iframe) iframe.src = 'about:blank';

  const img = document.getElementById('doc-prev-img-el');

  if (img) img.src = '';

  document.getElementById('excel-sheet-render').innerHTML = '';

  document.getElementById('word-render-content').innerHTML = '';

  document.getElementById('doc-prev-txt-content').textContent = '';

  currentWorkbook = null;

}





async function loadDocuments() {

  const q = document.getElementById('doc-search')?.value || '';

  let url = `/office/api.php?action=get_documents&q=${encodeURIComponent(q)}`;

  if (activeDocFilter) {

    url += `&type=${encodeURIComponent(activeDocFilter)}`;

  }

  

  const res = await fetch(url);

  const data = await res.json();

  const tbody = document.querySelector('#tbl-docs tbody');

  

  if (data.counts) {

    const c = data.counts;

    if (document.getElementById('kpi-doc-total')) document.getElementById('kpi-doc-total').textContent = c.all || 0;

    if (document.getElementById('kpi-doc-ci')) document.getElementById('kpi-doc-ci').textContent = c.commercial_invoices || 0;

    if (document.getElementById('kpi-doc-vat')) document.getElementById('kpi-doc-vat').textContent = c.vat_invoices || 0;

    if (document.getElementById('kpi-doc-customs')) document.getElementById('kpi-doc-customs').textContent = (c.customs || 0) + (c.logistics || 0);

    

    if (document.getElementById('cnt-all')) document.getElementById('cnt-all').textContent = c.all || 0;

    if (document.getElementById('cnt-ci')) document.getElementById('cnt-ci').textContent = c.commercial_invoices || 0;

    if (document.getElementById('cnt-vat')) document.getElementById('cnt-vat').textContent = c.vat_invoices || 0;

    if (document.getElementById('cnt-customs')) document.getElementById('cnt-customs').textContent = c.customs || 0;

    if (document.getElementById('cnt-log')) document.getElementById('cnt-log').textContent = c.logistics || 0;

    if (document.getElementById('cnt-sales')) document.getElementById('cnt-sales').textContent = c.sales_docs || 0;

  }

  

  if (!data.ok || !data.documents || data.documents.length === 0) {

    tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 32px; color: var(--text-muted);">Không tìm thấy chứng từ hoặc hóa đơn nào phù hợp bộ lọc.</td></tr>';

    return;

  }

  

  tbody.innerHTML = data.documents.map(d => `

    <tr>

      <td class="font-mono" style="font-weight: 700; color: var(--brand); font-size: 12px;">${d.doc_code || 'DOC-' + d.id}</td>

      <td>${getDocTypeBadge(d.doc_type)}</td>

      <td>

        <div style="font-weight: 600; color: var(--text);">${d.file_name_original}</div>

      </td>

      <td>

        ${getFileFormatBadge(d.file_name_original)}

        <span class="font-mono tabular-num" style="font-size: 11px; color: var(--text-muted); margin-left: 4px;">${(d.file_size / 1024).toFixed(1)} KB</span>

      </td>

      <td style="font-size: 12px; color: var(--text-muted);">${d.created_at}</td>

      <td style="text-align: left; white-space: nowrap;">

        <div class="action-group">

          <button type="button" onclick="previewDocument(${d.id}, '${escapeJsQuote(d.file_name_original)}', '${escapeJsQuote(d.doc_code || '')}', '${escapeJsQuote(d.doc_type || '')}', ${d.file_size || 0})" class="btn-act btn-act-view" title="Xem trước tài liệu trong hệ thống">

            Xem

          </button>

          <a href="/office/download.php?id=${d.id}&download=1" class="btn-act btn-act-edit" title="Tải tệp tin về máy tính">

            Tải Về

          </a>

        </div>

      </td>

    </tr>

  `).join('');

}



async function loadShipments() {

  const res = await fetch('/office/api.php?action=dashboard_metrics');

  const data = await res.json();

  if (data.ok) {

    renderShipmentsTable('tbl-shipments-full', data.recent_shipments);

  }

}



async function loadCustomers() {

  try {

    const res = await fetch('/office/api.php?action=get_customers');

    const data = await res.json();

    if (data.ok && data.customers) {

      cachedCustomers = data.customers;

      populateCustomerDropdown();

    }

  } catch (e) {

    console.error('Lỗi nạp danh sách khách hàng:', e);

  }

}



function populateCustomerDropdown() {

  const select = document.getElementById('qte-customer');

  if (!select) return;

  select.innerHTML = '<option value="">-- Chọn khách hàng (B2B hoặc Khách lẻ) --</option>' +

    cachedCustomers.map(c => {

      const isRetail = (c.code === 'CUST_RETAIL' || (c.code && c.code.indexOf('LE-') === 0) || !c.tax_id);

      const badge = isRetail ? '[Khách Lẻ]' : '[B2B]';

      const info = c.tax_id ? `MST: ${c.tax_id}` : (c.contact_phone ? `SĐT: ${c.contact_phone}` : c.code);

      return `<option value="${c.id}">${badge} ${c.name} (${info})</option>`;

    }).join('');

}



function handleCustomerSelectChange() {

  const select = document.getElementById('qte-customer');

  const retailWrap = document.getElementById('qte-retail-wrap');

  if (!select || !retailWrap) return;

  const selectedId = select.value;

  const cust = cachedCustomers.find(c => String(c.id) === String(selectedId));

  if (cust && cust.code === 'CUST_RETAIL') {

    retailWrap.style.display = 'block';

    setTimeout(() => { const inp = document.getElementById('qte-retail-name'); if (inp) inp.focus(); }, 100);

  } else {

    retailWrap.style.display = 'none';

  }

}



function openCustomerModal() {

  document.getElementById('new-cust-name').value = '';

  document.getElementById('new-cust-tax').value = '';

  document.getElementById('new-cust-contact').value = '';

  document.getElementById('new-cust-phone').value = '';

  document.getElementById('new-cust-email').value = '';

  document.getElementById('new-cust-address').value = '';

  const rB2B = document.querySelector('input[name="cust-type"][value="B2B"]');

  if (rB2B) rB2B.checked = true;

  toggleCustomerTypeFields();

  document.getElementById('modal-customer').classList.add('active');

  setTimeout(() => { const el = document.getElementById('new-cust-name'); if (el) el.focus(); }, 100);

}



function closeCustomerModal() {

  document.getElementById('modal-customer').classList.remove('active');

}



function toggleCustomerTypeFields() {

  const rRetail = document.querySelector('input[name="cust-type"]:checked');

  const isRetail = rRetail && rRetail.value === 'RETAIL';

  const lblName = document.getElementById('lbl-cust-name');

  const grpTax = document.getElementById('grp-cust-tax');

  const inpName = document.getElementById('new-cust-name');

  

  if (isRetail) {

    if (lblName) lblName.innerHTML = 'Họ Tên Khách Lẻ / Cá Nhân <span style="color: var(--danger);">*</span>';

    if (inpName) inpName.placeholder = 'Ví dụ: Anh Hoàng - Xưởng Chế Tạo Thạch Thất';

    if (grpTax) grpTax.style.display = 'none';

  } else {

    if (lblName) lblName.innerHTML = 'Tên Công Ty / Doanh Nghiệp <span style="color: var(--danger);">*</span>';

    if (inpName) inpName.placeholder = 'Ví dụ: Công ty TNHH Cơ Khí An Phát...';

    if (grpTax) grpTax.style.display = 'block';

  }

}



async function saveNewCustomer() {

  const name = document.getElementById('new-cust-name').value.trim();

  if (!name) {

    alert('Vui lòng nhập tên khách hàng hoặc tên công ty.');

    document.getElementById('new-cust-name').focus();

    return;

  }

  const typeEl = document.querySelector('input[name="cust-type"]:checked');

  const type = typeEl ? typeEl.value : 'B2B';

  const tax_id = document.getElementById('new-cust-tax').value.trim();

  const contact_name = document.getElementById('new-cust-contact').value.trim();

  const contact_phone = document.getElementById('new-cust-phone').value.trim();

  const contact_email = document.getElementById('new-cust-email').value.trim();

  const address = document.getElementById('new-cust-address').value.trim();

  

  const btn = document.getElementById('btn-save-cust');

  btn.disabled = true;

  btn.textContent = 'Đang lưu...';

  

  try {

    const res = await fetch('/office/api.php?action=create_customer', {

      method: 'POST',

      headers: { 'Content-Type': 'application/json' },

      body: JSON.stringify({ name, type, tax_id, contact_name, contact_phone, contact_email, address })

    });

    const data = await res.json();

    if (data.ok && data.customer) {

      showToast(data.message || 'Đã thêm khách hàng thành công!', 'success');

      closeCustomerModal();

      

      // Refresh customer dropdown and select the newly added customer

      await loadCustomers();

      const select = document.getElementById('qte-customer');

      if (select) {

        select.value = data.customer.id;

        handleCustomerSelectChange();

      }

    } else {

      alert(data.error || 'Không thể lưu khách hàng.');

    }

  } catch (e) {

    alert('Lỗi kết nối máy chủ.');

  } finally {

    btn.disabled = false;

    btn.textContent = 'LƯU KHÁCH HÀNG';

  }

}



// ============================================================================

// QUOTATION BUILDER MODAL LOGIC (CHUẨN MURRPLASTIK)

// ============================================================================



// ============================================================================

// CUSTOMER DIRECTORY & CRUD FUNCTIONS (B2B & KHÁCH LẺ)

// ============================================================================

let currentCustFilter = '';

let custSearchTimer = null;



function switchSalesSubTab(tab) {

  const btnQuotes = document.getElementById('btn-subtab-quotes');

  const btnCust = document.getElementById('btn-subtab-customers');

  const paneQuotes = document.getElementById('subpane-quotes');

  const paneCust = document.getElementById('subpane-customers');

  

  if (tab === 'quotes') {

    if (btnQuotes) btnQuotes.classList.add('active');

    if (btnCust) btnCust.classList.remove('active');

    if (paneQuotes) paneQuotes.style.display = 'block';

    if (paneCust) paneCust.style.display = 'none';

    loadQuotes();

  } else if (tab === 'customers') {

    if (btnCust) btnCust.classList.add('active');

    if (btnQuotes) btnQuotes.classList.remove('active');

    if (paneCust) paneCust.style.display = 'block';

    if (paneQuotes) paneQuotes.style.display = 'none';

    loadCustomersDirectory();

  }

}



function debounceSearchCustomers() {

  clearTimeout(custSearchTimer);

  custSearchTimer = setTimeout(() => {

    loadCustomersDirectory();

  }, 300);

}



function filterCustomerType(type) {

  currentCustFilter = type;

  document.querySelectorAll('.btn-cust-filter').forEach(b => b.classList.remove('active'));

  if (!type) {

    const el = document.getElementById('btn-filter-cust-all');

    if (el) el.classList.add('active');

  } else if (type === 'B2B') {

    const el = document.getElementById('btn-filter-cust-b2b');

    if (el) el.classList.add('active');

  } else if (type === 'RETAIL') {

    const el = document.getElementById('btn-filter-cust-retail');

    if (el) el.classList.add('active');

  }

  loadCustomersDirectory();

}



async function loadCustomersDirectory() {

  const tbody = document.getElementById('tbl-customers-body');

  if (!tbody) return;

  const countBadge = document.getElementById('cust-count-badge');

  const q = document.getElementById('cust-search-input')?.value.trim() || '';

  

  try {

    let url = '/office/api.php?action=get_customers';

    const params = [];

    if (q) params.push('q=' + encodeURIComponent(q));

    if (currentCustFilter) params.push('type=' + encodeURIComponent(currentCustFilter));

    if (params.length > 0) url += '&' + params.join('&');

    

    const res = await fetch(url);

    const data = await res.json();

    if (!data.ok || !data.customers || data.customers.length === 0) {

      tbody.innerHTML = '<tr><td colspan="8" style="text-align: center; padding: 24px; color: var(--text-muted);">Không tìm thấy hồ sơ khách hàng nào phù hợp.</td></tr>';

      if (countBadge) countBadge.textContent = '0 khách hàng';

      return;

    }

    

    if (countBadge) countBadge.textContent = `${data.customers.length} khách hàng`;

    

    tbody.innerHTML = data.customers.map(c => {

      const isRetail = (c.code === 'CUST_RETAIL' || (c.code && c.code.indexOf('LE-') === 0) || !c.tax_id);

      const typeBadge = isRetail 

        ? '<span style="display: inline-block; font-size: 11px; font-weight: 700; padding: 2px 7px; border-radius: 4px; background: #ecfdf5; color: #059669; border: 1px solid #a7f3d0;">Khách Lẻ</span>'

        : '<span style="display: inline-block; font-size: 11px; font-weight: 700; padding: 2px 7px; border-radius: 4px; background: #e0f2fe; color: #0369a1; border: 1px solid #bae6fd;">B2B</span>';

      const quoteCount = Number(c.quote_count || 0);

      const isDefaultRetail = (c.code === 'CUST_RETAIL');

      

      const safeName = (c.name || '').replace(/'/g, "\\'");

      const safeCode = (c.code || '').replace(/'/g, "\\'");

      

      return `

        <tr>

          <td class="font-mono" style="font-weight: 700; color: var(--brand); font-size: 12px;">${c.code}</td>

          <td>${typeBadge}</td>

          <td><b>${c.name}</b></td>

          <td class="font-mono">${c.tax_id ? c.tax_id : '<span style="color: var(--text-muted);">-</span>'}</td>

          <td>

            ${c.contact_name ? `<b>${c.contact_name}</b>` : '<span style="color: var(--text-muted);">-</span>'}

            ${c.contact_phone ? `<div class="font-mono" style="font-size: 11px; color: var(--text-muted);">${c.contact_phone}</div>` : ''}

          </td>

          <td>

            ${c.contact_email ? `<div style="font-size: 12px; color: var(--brand);">${c.contact_email}</div>` : ''}

            <div style="font-size: 11px; color: var(--text-muted);">${c.address || '-'}</div>

          </td>

          <td class="num font-mono" style="font-weight: 700;">${quoteCount}</td>

          <td style="text-align: left; white-space: nowrap;">

            <div class="action-group">

              <button type="button" onclick="openEditCustomerModal(${c.id})" class="btn-act btn-act-edit" title="Chỉnh sửa thông tin">Sửa</button>

              ${!isDefaultRetail ? `

                <button type="button" onclick="handleDeleteCustomer(${c.id}, '${safeName}', ${quoteCount}, '${safeCode}')" class="btn-act btn-act-del" title="Xóa khách hàng">Xóa</button>

              ` : `<span style="font-size: 11px; color: var(--text-muted); padding: 0 4px;" title="Khách mặc định hệ thống">-</span>`}

            </div>

          </td>

        </tr>

      `;

    }).join('');

  } catch (e) {

    tbody.innerHTML = '<tr><td colspan="8" style="text-align: center; color: var(--danger); padding: 16px;">Lỗi kết nối khi tải danh bạ khách hàng.</td></tr>';

  }

}



async function openEditCustomerModal(id) {

  try {

    const res = await fetch('/office/api.php?action=get_customer_detail&id=' + encodeURIComponent(id));

    const data = await res.json();

    if (!data.ok || !data.customer) {

      showToast(data.error || 'Không tìm thấy hồ sơ khách hàng', 'error');

      return;

    }

    const c = data.customer;

    document.getElementById('edit-cust-id').value = c.id;

    document.getElementById('edit-cust-code').textContent = c.code;

    document.getElementById('edit-cust-name').value = c.name || '';

    document.getElementById('edit-cust-tax').value = c.tax_id || '';

    document.getElementById('edit-cust-contact').value = c.contact_name || '';

    document.getElementById('edit-cust-phone').value = c.contact_phone || '';

    document.getElementById('edit-cust-email').value = c.contact_email || '';

    document.getElementById('edit-cust-address').value = c.address || '';

    

    const isRetail = (c.code === 'CUST_RETAIL' || (c.code && c.code.indexOf('LE-') === 0) || !c.tax_id);

    document.getElementById('edit-cust-type-badge').innerHTML = isRetail

      ? '<span style="font-size: 11px; font-weight: 700; padding: 2px 7px; border-radius: 4px; background: #ecfdf5; color: #059669; border: 1px solid #a7f3d0;">Khách Lẻ</span>'

      : '<span style="font-size: 11px; font-weight: 700; padding: 2px 7px; border-radius: 4px; background: #e0f2fe; color: #0369a1; border: 1px solid #bae6fd;">B2B</span>';



    document.getElementById('modal-customer-edit').classList.add('active');

  } catch (e) {

    showToast('Lỗi tải thông tin khách hàng', 'error');

  }

}



function closeCustomerEditModal() {

  document.getElementById('modal-customer-edit').classList.remove('active');

}



async function saveEditCustomer() {

  const id = document.getElementById('edit-cust-id').value;

  const name = document.getElementById('edit-cust-name').value.trim();

  if (!name) {

    alert('Vui lòng nhập tên khách hàng hoặc tên công ty.');

    document.getElementById('edit-cust-name').focus();

    return;

  }

  

  const tax_id = document.getElementById('edit-cust-tax').value.trim();

  const contact_name = document.getElementById('edit-cust-contact').value.trim();

  const contact_phone = document.getElementById('edit-cust-phone').value.trim();

  const contact_email = document.getElementById('edit-cust-email').value.trim();

  const address = document.getElementById('edit-cust-address').value.trim();

  

  const btn = document.getElementById('btn-save-edit-cust');

  btn.disabled = true;

  btn.textContent = 'Đang lưu...';

  

  try {

    const res = await fetch('/office/api.php?action=update_customer', {

      method: 'POST',

      headers: { 'Content-Type': 'application/json' },

      body: JSON.stringify({ id: Number(id), name, tax_id, contact_name, contact_phone, contact_email, address })

    });

    const data = await res.json();

    if (data.ok) {

      showToast(data.message || 'Cập nhật thông tin khách hàng thành công!', 'success');

      closeCustomerEditModal();

      loadCustomersDirectory();

      loadCustomers();

    } else {

      alert(data.error || 'Không thể cập nhật hồ sơ khách hàng.');

    }

  } catch (e) {

    alert('Lỗi kết nối máy chủ.');

  } finally {

    btn.disabled = false;

    btn.textContent = 'CẬP NHẬT THÔNG TIN';

  }

}



async function handleDeleteCustomer(id, name, quoteCount, code) {

  if (code === 'CUST_RETAIL') {

    alert('Không thể xóa khách hàng lẻ mặc định của hệ thống!');

    return;

  }

  

  if (quoteCount > 0) {

    alert(`Không thể xóa khách hàng '${name}' vì đã phát sinh ${quoteCount} báo giá trong hệ thống.\n\nĐể bảo toàn lịch sử chứng từ kế toán, vui lòng sử dụng chức năng Sửa thay vì xóa.`);

    return;

  }

  

  if (!confirm(`Bạn có chắc chắn muốn xóa khách hàng '${name}' khỏi danh bạ?`)) {

    return;

  }

  

  try {

    const res = await fetch('/office/api.php?action=delete_customer', {

      method: 'POST',

      headers: { 'Content-Type': 'application/json' },

      body: JSON.stringify({ id: Number(id) })

    });

    const data = await res.json();

    if (data.ok) {

      showToast(data.message || 'Đã xóa khách hàng thành công!', 'success');

      loadCustomersDirectory();

      loadCustomers();

    } else {

      alert(data.error || 'Không thể xóa khách hàng.');

    }

  } catch (e) {

    alert('Lỗi kết nối máy chủ.');

  }

}



// ============================================================================

// QUOTATION DETAIL MODAL & PRINTING

// ============================================================================

async function viewQuoteDetail(quoteId) {

  try {

    const res = await fetch('/office/api.php?action=get_quotation_detail&id=' + encodeURIComponent(quoteId));

    const data = await res.json();

    if (!data.ok || !data.quotation) {

      showToast(data.error || 'Không tìm thấy dữ liệu báo giá.', 'error');

      return;

    }

    const q = data.quotation;

    

    document.getElementById('qd-code').textContent = q.quote_code;

    document.getElementById('qd-date').textContent = 'Ngày lập: ' + (q.created_at ? q.created_at.split(' ')[0] : 'Hôm nay');

    document.getElementById('qd-status').innerHTML = getQuoteStatusBadge(q.approval_status);

    

    document.getElementById('qd-cust-name').textContent = q.customer_name || 'Khách hàng';

    document.getElementById('qd-cust-tax').textContent = q.customer_tax_id ? ('Mã số thuế: ' + q.customer_tax_id) : (q.customer_code ? ('Mã KH: ' + q.customer_code) : '');

    document.getElementById('qd-cust-contact').textContent = 'Người liên hệ: ' + (q.customer_contact || 'N/A') + (q.customer_phone ? (' | SĐT: ' + q.customer_phone) : '');

    document.getElementById('qd-cust-address').textContent = 'Địa chỉ: ' + (q.customer_address || 'Địa chỉ giao hàng theo yêu cầu');

    

    document.getElementById('qd-validity').textContent = q.valid_until ? (q.valid_until + ' (hoặc 30 ngày kể từ ngày phát hành)') : '30 ngày';

    document.getElementById('qd-creator').textContent = q.created_by_name || 'Bộ phận Bán Hàng';

    

    const tbody = document.getElementById('qd-items-body');

    if (!q.items || q.items.length === 0) {

      tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 12px; color: var(--text-muted);">Không có chi tiết mặt hàng.</td></tr>';

    } else {

      tbody.innerHTML = q.items.map((it, idx) => `

        <tr style="border-bottom: 1px solid var(--border);">

          <td style="padding: 8px 10px; text-align: center; color: var(--text-muted);">${idx + 1}</td>

          <td class="font-mono" style="padding: 8px 10px; font-weight: 700; color: var(--brand);">${it.sku}</td>

          <td style="padding: 8px 10px;"><b>${it.product_name}</b></td>

          <td class="font-mono tabular-num" style="padding: 8px 10px; text-align: right;">${Number(it.quantity).toLocaleString('vi-VN')}</td>

          <td style="padding: 8px 10px; text-align: center; color: var(--text-muted);">${it.unit || 'Cái'}</td>

          <td class="font-mono tabular-num" style="padding: 8px 10px; text-align: right;">${Number(it.unit_price_vnd).toLocaleString('vi-VN')} đ</td>

          <td class="font-mono tabular-num" style="padding: 8px 10px; text-align: right; font-weight: 700;">${Number(it.quantity * it.unit_price_vnd).toLocaleString('vi-VN')} đ</td>

        </tr>

      `).join('');

    }

    

    document.getElementById('qd-sum-products').textContent = Number(q.total_amount_vnd).toLocaleString('vi-VN') + ' đ';

    document.getElementById('qd-sum-vat').textContent = Number(q.vat_amount_vnd).toLocaleString('vi-VN') + ' đ';

    document.getElementById('qd-sum-final').textContent = Number(q.final_amount_vnd).toLocaleString('vi-VN') + ' đ';

    

    document.getElementById('modal-quote-detail').classList.add('active');

  } catch (e) {

    showToast('Lỗi tải chi tiết báo giá', 'error');

  }

}



function closeQuoteDetailModal() {

  document.getElementById('modal-quote-detail').classList.remove('active');

}



function printQuoteDetail() {

  window.print();

}



// ============================================================================

// QUY CHUẨN 9: DÀN ĐỀU CƯỚC SHIP VÀO ĐƠN GIÁ SẢN PHẨM

// ============================================================================

function bundleFreightIntoUnitPrices() {

  const freight = Number(document.getElementById('qte-freight')?.value || 0);

  if (freight <= 0) {

    showToast('Vui lòng nhập số tiền cước vận chuyển lớn hơn 0 để dàn đều.', 'info');

    return;

  }

  if (!quoteItems || quoteItems.length === 0) {

    showToast('Báo giá chưa có mặt hàng nào để dàn đều cước ship.', 'error');

    return;

  }

  

  let totalProducts = 0;

  quoteItems.forEach(it => {

    totalProducts += (it.quantity * it.unit_price_vnd);

  });

  

  if (totalProducts <= 0) {

    showToast('Tổng giá trị hàng phải lớn hơn 0 để tính tỷ trọng cước ship.', 'error');

    return;

  }



  // Quy chuẩn 9: Dàn đều cước ship theo tỷ trọng giá trị vào từng sản phẩm

  const ratio = freight / totalProducts;

  quoteItems.forEach(it => {

    const addPrice = (it.unit_price_vnd * ratio);

    it.unit_price_vnd = Math.round((it.unit_price_vnd + addPrice) / 1000) * 1000;

  });



  document.getElementById('qte-freight').value = 0;

  renderQuoteItems();

  calcQuoteTotals();

  showToast('Đã dàn đều cước ship vào đơn giá từng sản phẩm theo Quy chuẩn 9!', 'success');

}



function openQuotationModal() {

  quoteItems = [];

  renderQuoteItems();

  calcQuoteTotals();

  if (cachedCustomers.length === 0) {

    loadCustomers();

  } else {

    populateCustomerDropdown();

  }

  document.getElementById('modal-quotation').classList.add('active');

  setTimeout(() => { const el = document.getElementById('add-sku'); if (el) el.focus(); }, 100);

}



let skuLookupTimer = null;

async function lookupSkuForQuote() {

  const sku = document.getElementById('add-sku').value.trim();

  const hint = document.getElementById('add-sku-hint');

  if (!sku) {

    hint.style.display = 'none';

    return;

  }

  try {

    const res = await fetch('/office/api.php?action=get_products&q=' + encodeURIComponent(sku));

    const data = await res.json();

    if (data.ok && data.items && data.items.length > 0) {

      const p = data.items[0];

      document.getElementById('add-name').value = p.name_vn || p.name_en;

      hint.style.display = 'block';

      hint.textContent = `Đã tìm thấy: ${p.sku} - ${p.name_vn} (${p.unit || 'Cái'})`;

      // Default suggested price if available

      if (p.gross_eur_pl26 && Number(p.gross_eur_pl26) > 0) {

        // Approximate VND price

        const approxVnd = Math.round(Number(p.gross_eur_pl26) * 31000);

        if (!document.getElementById('add-price').value) {

          document.getElementById('add-price').value = approxVnd;

        }

      }

    } else {

      hint.style.display = 'block';

      hint.style.color = 'var(--warn)';

      hint.textContent = 'Mã SKU mới (sẽ tạo trực tiếp vào báo giá)';

    }

  } catch (e) {}

}



async function addQuoteRowFromFinder() {

  const sku = document.getElementById('add-sku').value.trim();

  const name = document.getElementById('add-name').value.trim();

  const qty = Number(document.getElementById('add-qty').value || 1);

  const price = Number(document.getElementById('add-price').value || 0);

  

  if (!sku) {

    showToast('Vui lòng nhập mã SKU Murrplastik', 'error');

    return;

  }

  if (qty <= 0) {

    showToast('Số lượng phải lớn hơn 0', 'error');

    return;

  }



  // Find product ID if exists

  let productId = 1;

  let unit = 'Cái';

  try {

    const pRes = await fetch('/office/api.php?action=get_products&q=' + encodeURIComponent(sku));

    const pData = await pRes.json();

    if (pData.ok && pData.items && pData.items.length > 0) {

      productId = pData.items[0].id;

      unit = pData.items[0].unit || 'Cái';

    }

  } catch (e) {}



  quoteItems.push({

    product_id: productId,

    sku: sku,

    product_name: name || ('Sản phẩm Murrplastik SKU ' + sku),

    quantity: qty,

    unit: unit,

    unit_price_vnd: price

  });



  // Clear inputs

  document.getElementById('add-sku').value = '';

  document.getElementById('add-name').value = '';

  document.getElementById('add-qty').value = '1';

  document.getElementById('add-price').value = '';

  document.getElementById('add-sku-hint').style.display = 'none';



  renderQuoteItems();

  calcQuoteTotals();

}



function removeQuoteRow(index) {

  quoteItems.splice(index, 1);

  renderQuoteItems();

  calcQuoteTotals();

}



function renderQuoteItems() {

  const tbody = document.getElementById('qte-items-body');

  if (quoteItems.length === 0) {

    tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; color: var(--text-muted); padding: 16px;">Chưa có sản phẩm nào. Hãy tra cứu SKU ở trên để thêm.</td></tr>';

    return;

  }

  tbody.innerHTML = quoteItems.map((it, idx) => `

    <tr>

      <td class="font-mono" style="font-weight: 700; color: var(--brand);">${it.sku}</td>

      <td><b>${it.product_name}</b></td>

      <td class="num font-mono">${it.quantity}</td>

      <td>${it.unit}</td>

      <td class="num font-mono">${Number(it.unit_price_vnd).toLocaleString('vi-VN')} đ</td>

      <td class="num font-mono" style="font-weight: 700;">${Number(it.quantity * it.unit_price_vnd).toLocaleString('vi-VN')} đ</td>

      <td style="text-align: center;">

        <button type="button" onclick="removeQuoteRow(${idx})" class="btn btn-danger btn-sm" style="padding: 1px 6px;">&times;</button>

      </td>

    </tr>

  `).join('');

}



function calcQuoteTotals() {

  const freight = Number(document.getElementById('qte-freight')?.value || 0);

  let totalProducts = 0;

  quoteItems.forEach(it => {

    totalProducts += (it.quantity * it.unit_price_vnd);

  });

  

  const vat = Math.round((totalProducts + freight) * 0.08);

  const finalAmount = totalProducts + freight + vat;



  document.getElementById('sum-products').textContent = totalProducts.toLocaleString('vi-VN') + ' đ';

  document.getElementById('sum-freight').textContent = freight.toLocaleString('vi-VN') + ' đ';

  document.getElementById('sum-vat').textContent = vat.toLocaleString('vi-VN') + ' đ';

  document.getElementById('sum-final').textContent = finalAmount.toLocaleString('vi-VN') + ' đ';



  // Preview Approval Tier

  const tierBadge = document.getElementById('qte-tier-badge');

  if (totalProducts < 5000000) {

    tierBadge.innerHTML = '<span style="font-size: 11px; font-weight: 700; padding: 2px 7px; border-radius: 4px; background: #ecfdf5; color: #059669; border: 1px solid #a7f3d0;">Tự động duyệt (< 5 triệu)</span>';

  } else {

    tierBadge.innerHTML = '<span style="font-size: 11px; font-weight: 700; padding: 2px 7px; border-radius: 4px; background: #fffbeb; color: #d97706; border: 1px solid #fde68a;">Chờ Giám đốc duyệt (>= 5 triệu)</span>';

  }

}



async function submitQuotation() {

  const customerId = document.getElementById('qte-customer').value;

  const validityDays = Number(document.getElementById('qte-validity').value || 30);

  const freight = Number(document.getElementById('qte-freight').value || 0);



  if (!customerId) {

    showToast('Vui lòng chọn khách hàng (B2B hoặc khách lẻ)', 'error');

    return;

  }

  if (quoteItems.length === 0) {

    showToast('Báo giá phải có ít nhất 1 dòng sản phẩm', 'error');

    return;

  }



  const retailNote = document.getElementById('qte-retail-name') ? document.getElementById('qte-retail-name').value.trim() : '';



  // Quy chuẩn 9: Nếu còn cước ship chưa bấm nút dàn đều, tự động dàn đều trước khi phát hành

  if (freight > 0) {

    bundleFreightIntoUnitPrices();

    freight = 0;

  }



  const payload = {

    customer_id: Number(customerId),

    valid_days: validityDays,

    freight_amount_vnd: freight,

    bundle_freight: true,

    retail_note: retailNote,

    items: quoteItems

  };



  try {

    const res = await fetch('/office/api.php?action=create_quotation', {

      method: 'POST',

      headers: { 'Content-Type': 'application/json' },

      body: JSON.stringify(payload)

    });

    const result = await res.json();

    if (result.ok) {

      showToast(result.message || 'Phát hành báo giá thành công!', 'success');

      closeModals();

      loadQuotes();

      loadDashboard();

      switchTab('sales');

    } else {

      showToast('Lỗi: ' + (result.error || 'Không thể tạo báo giá'), 'error');

    }

  } catch (e) {

    showToast('Lỗi kết nối máy chủ', 'error');

  }

}



// 1-Hour (3600s) Inactivity Session Timeout

let inactivityTimer;

const INACTIVITY_LIMIT_MS = 3600 * 1000;



function resetInactivityTimer() {

  clearTimeout(inactivityTimer);

  if (window.currentUserRole) {

    inactivityTimer = setTimeout(function() {

      showToast('Phiên làm việc đã tự động kết thúc sau 1 giờ không tương tác.', 'info');

      setTimeout(handleLogout, 2000);

    }, INACTIVITY_LIMIT_MS);

  }

}



['mousedown', 'keydown', 'scroll', 'touchstart'].forEach(function(evt) {

  window.addEventListener(evt, resetInactivityTimer, { passive: true });

});

resetInactivityTimer();



// Debounce Document Search

let docSearchTimer;

function debounceSearchDocs() {

  clearTimeout(docSearchTimer);

  docSearchTimer = setTimeout(loadDocuments, 300);

}



// Modal controls & Ergonomics



// ============================================================================

// LOGISTICS UNIFIED TRACKING ENGINE (DHL EXPRESS & QUANTERM LOGISTICS)

// ============================================================================

let currentTrackingAwb = '';



async function openTrackingModal(shipmentId, awbNo, carrierName) {

  currentTrackingAwb = awbNo || '';

  const modal = document.getElementById('modal-shipment-tracking');

  if (!modal) return;

  modal.classList.add('active');

  

  // Placeholders

  document.getElementById('track-awb-no').textContent = awbNo || 'Đang nạp...';

  document.getElementById('track-status-text').textContent = 'Đang đồng bộ dữ liệu tracking từ hãng...';

  document.getElementById('track-milestones-list').innerHTML = '<div style="text-align: center; padding: 20px; color: var(--text-muted);">Đang tải dữ liệu hành trình...</div>';

  document.getElementById('track-stepper-container').innerHTML = '';

  

  try {

    const res = await fetch(`/office/api.php?action=get_shipment_tracking&shipment_id=${shipmentId}&awb=${encodeURIComponent(awbNo)}&carrier=${encodeURIComponent(carrierName)}`);

    const data = await res.json();

    if (!data.ok || !data.tracking) {

      throw new Error(data.error || 'Không tìm thấy dữ liệu vận chuyển.');

    }

    const t = data.tracking;

    currentTrackingAwb = t.awb_no;

    

    // Header styling

    const badge = document.getElementById('track-carrier-badge');

    if (t.carrier_code === 'QUANTERM') {

      badge.style.background = '#f3e8ff';

      badge.style.color = '#7e22ce';

      badge.textContent = 'QUANTERM LOGISTICS';

    } else {

      badge.style.background = '#fef2f2';

      badge.style.color = '#dc2626';

      badge.textContent = 'DHL EXPRESS';

    }

    

    document.getElementById('track-awb-no').textContent = t.awb_no;

    document.getElementById('track-vendor-btn').href = t.vendor_url || '#';

    document.getElementById('track-status-text').textContent = t.status_text;

    document.getElementById('track-mode-badge').textContent = t.transport_label;

    

    // Route info

    document.getElementById('track-pol').textContent = t.pol || '-';

    document.getElementById('track-etd-pol').textContent = 'ETD: ' + (t.etd_pol || '-');

    document.getElementById('track-pod').textContent = t.pod || '-';

    document.getElementById('track-eta-pod').textContent = 'ETA: ' + (t.eta_pod || '-');

    document.getElementById('track-destination').textContent = t.final_destination || '-';

    

    // Tech specs

    document.getElementById('track-vehicle').textContent = (t.vessel || t.flight_no || '-');

    document.getElementById('track-cont-seal').textContent = (t.cont_seal || '-');

    document.getElementById('track-packages').textContent = (t.packages || '-');

    document.getElementById('track-weight').textContent = (Number(t.gross_weight_kg || 0).toLocaleString('vi-VN') + ' kg');

    document.getElementById('track-volume').textContent = (t.volume_cbm ? Number(t.volume_cbm).toFixed(3) + ' CBM' : '-');

    

    const payEl = document.getElementById('track-payment');

    payEl.textContent = t.payment_text || '-';

    payEl.style.color = t.is_paid ? '#16a34a' : '#d97706';

    

    // Render Stepper with Dashed & Solid technical track connectors (Taste-Skill v2)

    const steps = t.steps || [];

    const totalSteps = steps.length;

    const stepperEl = document.getElementById('track-stepper-container');

    

    // Find active step index: either explicitly marked or last done step

    let activeIdx = steps.findIndex(s => s.is_current);

    if (activeIdx === -1) {

      for (let i = steps.length - 1; i >= 0; i--) {

        if (steps[i].done) { activeIdx = i; break; }

      }

    }

    if (activeIdx === -1) activeIdx = 0;

    

    // Update step counter pill in header

    const counterEl = document.getElementById('track-step-counter');

    if (counterEl) {

      counterEl.textContent = `Bước ${activeIdx + 1} / ${totalSteps}`;

    }



    stepperEl.innerHTML = `

      <div class="stepper-container">

        ${steps.map((st, idx) => {

          const isDone = st.done;

          const isActive = (idx === activeIdx);

          const isPending = !isDone;

          const isLast = (idx === totalSteps - 1);

          const isFirst = (idx === 0);



          // Left line state

          let leftLineClass = '';

          if (!isFirst) {

            const prevStep = steps[idx - 1];

            if (prevStep && prevStep.done && isDone) {

              leftLineClass = 'stepper-track-solid';

            } else if (prevStep && prevStep.done) {

              leftLineClass = 'stepper-track-dashed';

            } else {

              leftLineClass = 'stepper-track-muted-dashed';

            }

          }



          // Right line state

          let rightLineClass = '';

          if (!isLast) {

            const nextStep = steps[idx + 1];

            if (isDone && nextStep && nextStep.done) {

              rightLineClass = 'stepper-track-solid';

            } else if (isDone || isActive) {

              rightLineClass = 'stepper-track-dashed';

            } else {

              rightLineClass = 'stepper-track-muted-dashed';

            }

          }



          // Node icon SVG

          let nodeIcon = '';

          let nodeClass = '';

          if (isActive) {

            nodeClass = 'stepper-node-active';

            nodeIcon = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" title="Vị trí trạm hiện tại"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>`;

          } else if (isDone) {

            nodeClass = 'stepper-node-done';

            nodeIcon = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;

          } else {

            nodeClass = 'stepper-node-pending';

            nodeIcon = `<span class="font-mono">${idx + 1}</span>`;

          }



          const dateBadgeClass = isLast && isPending ? 'delivery' : (isActive ? 'active' : '');



          return `

            <div class="stepper-step">

              <!-- Left connector track -->

              ${!isFirst ? `<div class="stepper-track-line stepper-track-left ${leftLineClass}"></div>` : ''}

              

              <!-- Center node circle -->

              <div class="stepper-node-circle ${nodeClass}" title="${st.title}">

                ${nodeIcon}

              </div>

              

              <!-- Right connector track -->

              ${!isLast ? `<div class="stepper-track-line stepper-track-right ${rightLineClass}"></div>` : ''}

              

              <!-- Step Labels -->

              <div class="stepper-label-title ${isActive ? 'active' : (isPending ? 'pending' : '')}">

                ${st.title}

              </div>

              

              <div class="stepper-label-desc" title="${st.desc || ''}">

                ${st.desc || ''}

              </div>

              

              ${st.date ? `

                <div class="stepper-label-date font-mono tabular-num ${dateBadgeClass}">

                  ${st.date}

                </div>

              ` : ''}

            </div>

          `;

        }).join('')}

      </div>

    `;

    

    // Render Estimated Delivery if present

    const etaWrap = document.getElementById('track-eta-delivery-wrap');

    if (t.estimated_delivery && etaWrap) {

      etaWrap.style.display = 'flex';

      document.getElementById('track-eta-delivery-val').textContent = t.estimated_delivery;

    } else if (etaWrap) {

      etaWrap.style.display = 'none';

    }



    // Render Milestones or Detailed Vendor Event Log

    const milestonesEl = document.getElementById('track-milestones-list');

    if (t.events && t.events.length > 0) {

      milestonesEl.innerHTML = `

        <div style="overflow-x: auto;">

          <table style="width: 100%; border-collapse: collapse; font-size: 12px;">

            <thead>

              <tr style="background: #f1f5f9; border-bottom: 2px solid var(--border);">

                <th style="padding: 8px 12px; text-align: left; font-weight: 700; width: 175px;">Thời gian</th>

                <th style="padding: 8px 12px; text-align: left; font-weight: 700;">Cập nhật trạng thái</th>

                <th style="padding: 8px 12px; text-align: left; font-weight: 700; width: 150px;">Địa điểm</th>

              </tr>

            </thead>

            <tbody>

              ${t.events.map((ev, i) => `

                <tr style="border-bottom: 1px solid #e2e8f0; background: ${i === 0 ? '#f0fdf4' : '#ffffff'};">

                  <td class="font-mono tabular-num" style="padding: 8px 12px; font-weight: ${i === 0 ? '700' : '600'}; color: ${i === 0 ? '#15803d' : 'var(--text)'};">

                    ${ev.time}

                  </td>

                  <td style="padding: 8px 12px;">

                    <div style="font-weight: 700; color: ${i === 0 ? '#15803d' : 'var(--brand-dark)'};">${ev.status}</div>

                    ${ev.detail ? `<div style="font-size: 11px; color: var(--text-muted); margin-top: 2px;">${ev.detail}</div>` : ''}

                  </td>

                  <td class="font-mono" style="padding: 8px 12px; font-weight: 600; color: var(--text-muted); font-size: 11.5px;">

                    ${ev.location}

                  </td>

                </tr>

              `).join('')}

            </tbody>

          </table>

        </div>

      `;

    } else {

      milestonesEl.innerHTML = steps.map((st, idx) => `

        <div style="display: flex; gap: 12px; align-items: flex-start; padding-left: 4px; position: relative;">

          <div style="width: 10px; height: 10px; border-radius: 50%; background: ${st.done ? 'var(--brand)' : '#cbd5e1'}; margin-top: 4px; flex-shrink: 0;"></div>

          <div style="flex: 1;">

            <div style="display: flex; justify-content: space-between; align-items: baseline;">

              <span style="font-size: 12.5px; font-weight: 700; color: ${st.done ? 'var(--text)' : 'var(--text-muted)'};">${st.title}</span>

              <span class="font-mono tabular-num" style="font-size: 11px; color: var(--text-muted);">${st.date || ''}</span>

            </div>

            <div style="font-size: 12px; color: var(--text-muted); margin-top: 2px; line-height: 1.5;">${st.desc}</div>

          </div>

        </div>

      `).join('');

    }

    

  } catch (err) {

    document.getElementById('track-status-text').textContent = 'Lỗi tra cứu hành trình: ' + err.message;

    document.getElementById('track-milestones-list').innerHTML = `<div style="text-align: center; color: #dc2626; padding: 16px;">${err.message}</div>`;

  }

}



function closeTrackingModal() {

  const modal = document.getElementById('modal-shipment-tracking');

  if (modal) modal.classList.remove('active');

}



function copyTrackingCode() {

  if (currentTrackingAwb) {

    navigator.clipboard.writeText(currentTrackingAwb);

    showToast('Đã sao chép mã vận đơn ' + currentTrackingAwb, 'success');

  }

}





function closeModals() {

  const pIframe = document.getElementById('doc-prev-iframe'); if (pIframe) pIframe.src = 'about:blank';

  document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));

}



// Keyboard Accessibility: ESC closes open modals

window.addEventListener('keydown', function(e) {

  if (e.key === 'Escape') {

    closeModals();

  }

});



// Backdrop click dismiss for modals

document.addEventListener('DOMContentLoaded', function() {

  document.querySelectorAll('.modal-overlay').forEach(function(overlay) {

    overlay.addEventListener('click', function(e) {

      if (e.target === overlay) {

        closeModals();

      }

    });

  });

});



function openReceiptModal() {

  document.getElementById('modal-receipt').classList.add('active');

  setTimeout(() => { const el = document.getElementById('rcpt-sku'); if (el) el.focus(); }, 100);

}



function openDeliveryModal() {

  document.getElementById('modal-delivery').classList.add('active');

  setTimeout(() => { const el = document.getElementById('deliv-sku'); if (el) el.focus(); }, 100);

}



function quickDeliver(sku, loc) {

  document.getElementById('deliv-sku').value = sku;

  document.getElementById('deliv-location').value = loc;

  openDeliveryModal();

}



async function submitReceipt() {

  const sku = document.getElementById('rcpt-sku').value.trim();

  const qty = Number(document.getElementById('rcpt-qty').value);

  const location = document.getElementById('rcpt-location').value.trim();

  const eurNet = Number(document.getElementById('rcpt-eur').value || 0);

  const landedVnd = Number(document.getElementById('rcpt-landed').value || 0);

  const note = document.getElementById('rcpt-note').value.trim();

  

  const pRes = await fetch('/office/api.php?action=get_products&q=' + encodeURIComponent(sku));

  const pData = await pRes.json();

  if (!pData.ok || !pData.items || pData.items.length === 0) {

    showToast('Không tìm thấy mã SKU Murrplastik này trong danh mục catalog.', 'error');

    return;

  }

  

  const prodId = pData.items[0].id;

  const payload = {

    items: [{

      product_id: prodId,

      qty_received: qty,

      location_code: location,

      box_code: location.split(' - ')[0] || 'Hộp 01',

      unit_cost_net_eur: eurNet,

      unit_cost_landed_vnd: landedVnd

    }],

    note: note

  };

  

  const res = await fetch('/office/api.php?action=create_receipt', {

    method: 'POST',

    headers: { 'Content-Type': 'application/json' },

    body: JSON.stringify(payload)

  });

  const result = await res.json();

  if (result.ok) {

    showToast(result.message || 'Nhập kho thành công!', 'success');

    closeModals();

    loadStock();

    loadLedger();

  } else {

    showToast('Lỗi: ' + result.error, 'error');

  }

}



async function submitDelivery() {

  const sku = document.getElementById('deliv-sku').value.trim();

  const qty = Number(document.getElementById('deliv-qty').value);

  const location = document.getElementById('deliv-location').value.trim();

  const address = document.getElementById('deliv-address').value.trim();

  const name = document.getElementById('deliv-name').value.trim();

  const phone = document.getElementById('deliv-phone').value.trim();

  

  const pRes = await fetch('/office/api.php?action=get_products&q=' + encodeURIComponent(sku));

  const pData = await pRes.json();

  if (!pData.ok || !pData.items || pData.items.length === 0) {

    showToast('Không tìm thấy mã SKU này.', 'error');

    return;

  }

  

  const prodId = pData.items[0].id;

  const payload = {

    delivery_address: address,

    recipient_name: name,

    recipient_phone: phone,

    items: [{

      product_id: prodId,

      quantity: qty,

      location_code: location

    }]

  };

  

  const res = await fetch('/office/api.php?action=create_delivery', {

    method: 'POST',

    headers: { 'Content-Type': 'application/json' },

    body: JSON.stringify(payload)

  });

  const result = await res.json();

  if (result.ok) {

    showToast(result.message || 'Xuất kho thành công!', 'success');

    closeModals();

    loadStock();

    loadLedger();

  } else {

    showToast('Lỗi: ' + result.error, 'error');

  }

}



let searchTimer;

function debounceSearchStock() {

  clearTimeout(searchTimer);

  searchTimer = setTimeout(loadStock, 300);

}



// ==============================================================================

// INBOUND BARCODE RECEIVING SCANNER LOGIC (FSTV & VINFAST AWB 5864742881)

// ==============================================================================

let currentScanSession = null;

let currentPkgFilter = 'all';



function playSuccessBeep() {

  try {

    const ctx = new (window.AudioContext || window.webkitAudioContext)();

    const osc = ctx.createOscillator();

    const gain = ctx.createGain();

    osc.connect(gain);

    gain.connect(ctx.destination);

    osc.type = 'sine';

    osc.frequency.setValueAtTime(880, ctx.currentTime);

    osc.frequency.exponentialRampToValueAtTime(1760, ctx.currentTime + 0.12);

    gain.gain.setValueAtTime(0.3, ctx.currentTime);

    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);

    osc.start(ctx.currentTime);

    osc.stop(ctx.currentTime + 0.12);

  } catch(e) {}

}



function playWarningBeep() {

  try {

    const ctx = new (window.AudioContext || window.webkitAudioContext)();

    const osc = ctx.createOscillator();

    const gain = ctx.createGain();

    osc.connect(gain);

    gain.connect(ctx.destination);

    osc.type = 'sawtooth';

    osc.frequency.setValueAtTime(300, ctx.currentTime);

    gain.gain.setValueAtTime(0.4, ctx.currentTime);

    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);

    osc.start(ctx.currentTime);

    osc.stop(ctx.currentTime + 0.25);

  } catch(e) {}

}



function openScanCheckModal(grId = 2) {
  window.open('/kho/?batch=AIR_FSTV_VF_OCT2026', '_blank');
}

function closeScanCheckModal() {

  const modal = document.getElementById('modal-scan-check');

  if (modal) modal.classList.remove('active');

}



function filterScanPackage(pkg) {

  currentPkgFilter = pkg;

  

  document.querySelectorAll('#modal-scan-check .btn-sm').forEach(btn => {

    btn.style.background = 'transparent';

    btn.style.color = 'var(--text-muted)';

  });

  

  let btnId = 'btn-pkg-all';

  if (pkg === 'Kiện 1') btnId = 'btn-pkg-1';

  else if (pkg === 'Kiện 2') btnId = 'btn-pkg-2';

  

  const activeBtn = document.getElementById(btnId);

  if (activeBtn) {

    activeBtn.style.background = '#2563eb';

    activeBtn.style.color = 'white';

    activeBtn.style.fontWeight = '700';

  }

  

  renderScanTable();

}



function renderScanTable() {

  if (!currentScanSession || !currentScanSession.items) return;

  

  const tbody = document.getElementById('scan-items-tbody');

  tbody.innerHTML = '';

  

  let totalOrdered = 0;

  let totalReceived = 0;

  let completedSkus = 0;

  let totalSkus = currentScanSession.items.length;

  

  currentScanSession.items.forEach(it => {

    const oQty = Number(it.qty_ordered || 0);

    const rQty = Number(it.qty_received || 0);

    totalOrdered += oQty;

    totalReceived += Math.min(rQty, oQty);

    if (rQty >= oQty && oQty > 0) completedSkus++;

  });

  

  const percent = totalOrdered > 0 ? Math.round((totalReceived / totalOrdered) * 100) : 0;

  const pBar = document.getElementById('scan-progress-bar');

  const pText = document.getElementById('scan-progress-percent');

  const summaryCounter = document.getElementById('scan-summary-counter');

  

  if (pBar) {

    pBar.style.width = percent + '%';

    pBar.style.background = percent === 100 ? '#16a34a' : '#2563eb';

  }

  if (pText) pText.textContent = percent + '%';

  if (summaryCounter) {

    summaryCounter.textContent = `${completedSkus} / ${totalSkus} SKU hoàn thành (${totalReceived} / ${totalOrdered} đơn vị)`;

  }

  

  const filtered = currentScanSession.items.filter(it => {

    if (currentPkgFilter === 'all') return true;

    return (it.package_no || '').indexOf(currentPkgFilter) !== -1;

  });

  

  if (filtered.length === 0) {

    tbody.innerHTML = '<tr><td colspan="8" style="text-align:center; padding:16px;">Không có mặt hàng nào trong kiện này.</td></tr>';

    return;

  }

  

  filtered.forEach((it, idx) => {

    const oQty = Number(it.qty_ordered || 0);

    const rQty = Number(it.qty_received || 0);

    const isDone = (rQty >= oQty && oQty > 0);

    const isStarted = (rQty > 0 && rQty < oQty);

    

    let statusBadge = '<span class="badge" style="background:#f1f5f9; color:#64748b;">Chờ quét</span>';

    if (isDone) {

      statusBadge = '<span class="badge" style="background:#dcfce7; color:#166534; font-weight:700;">Khớp 100%</span>';

    } else if (isStarted) {

      statusBadge = `<span class="badge" style="background:#fef3c7; color:#92400e; font-weight:700;">Đang kiểm (${rQty}/${oQty})</span>`;

    }

    

    const tr = document.createElement('tr');

    tr.id = 'scan-row-' + it.item_id;

    tr.style.background = isDone ? '#f0fdf4' : (idx % 2 === 1 ? '#f8fafc' : '#ffffff');

    tr.style.transition = 'background 0.3s ease';

    

    const shortPkg = (it.package_no || '').indexOf('Kiện 1') !== -1 ? 'Kiện 1' : 'Kiện 2';

    const imgHtml = it.image_url 

      ? `<img src="${it.image_url}" alt="${it.sku}" style="width: 44px; height: 44px; object-fit: contain; border-radius: 4px; border: 1px solid #e2e8f0; background: white;" />`

      : '<div style="width:44px;height:44px;background:#e2e8f0;border-radius:4px;display:flex;align-items:center;justify-content:center;font-size:10px;color:#64748b;">Ảnh</div>';

      

    tr.innerHTML = `

      <td style="text-align: center; font-weight: 700; color: #1e40af;">${shortPkg}</td>

      <td style="text-align: center;">${imgHtml}</td>

      <td>

        <div class="font-mono" style="font-weight: 700; color: #0f172a; font-size: 13px;">${it.sku}</div>

        <div style="font-size: 10px; color: #64748b;" class="font-mono">${it.gtin_barcode || '-'}</div>

      </td>

      <td>

        <div style="font-weight: 600; color: #0f172a;">${it.name_vn}</div>

        <div style="font-size: 11px; color: #64748b;">${it.name_en || ''}</div>

      </td>

      <td>

        <input type="text" id="loc-input-${it.item_id}" class="form-input" style="font-size: 11px; padding: 4px 6px;" 

               value="${it.location_code || 'Hộp 01 - Kệ 1 - Tầng 1'}" 

               onchange="onLocationChange(${it.item_id}, this.value)" />

      </td>

      <td class="num font-mono" style="font-weight: 700; font-size: 13px;">

        ${oQty} <span style="font-weight: normal; font-size: 11px; color: #64748b;">${it.unit}</span>

      </td>

      <td>

        <div style="display: flex; align-items: center; justify-content: flex-end; gap: 4px;">

          <button type="button" class="btn btn-outline btn-sm" style="padding: 2px 6px; font-size: 10px;" onclick="adjustScannedQty(${it.item_id}, -1)">-1</button>

          <input type="number" id="qty-input-${it.item_id}" class="form-input num font-mono" 

                 style="width: 58px; text-align: right; padding: 4px 6px; font-weight: 700; font-size: 13px; color: ${isDone ? '#166534' : '#0f172a'};"

                 value="${rQty}" min="0" max="${oQty * 2}" 

                 onchange="onManualQtyChange(${it.item_id}, this.value)" />

          <button type="button" class="btn btn-outline btn-sm" style="padding: 2px 6px; font-size: 10px;" onclick="adjustScannedQty(${it.item_id}, 1)">+1</button>

          ${oQty >= 10 ? `<button type="button" class="btn btn-outline btn-sm" style="padding: 2px 6px; font-size: 10px;" onclick="adjustScannedQty(${it.item_id}, 10)">+10</button>` : ''}

          <button type="button" class="btn btn-outline btn-sm" style="padding: 2px 6px; font-size: 10px; background: #ecfdf5; color: #166534; border-color: #86efac;" onclick="adjustScannedQty(${it.item_id}, 0, true)">Đủ</button>

        </div>

      </td>

      <td style="text-align: center;">${statusBadge}</td>

    `;

    tbody.appendChild(tr);

  });

}



function onScanInputKeyDown(e) {

  if (e.key === 'Enter') {

    e.preventDefault();

    triggerManualScan();

  }

}



function triggerManualScan() {

  const inp = document.getElementById('scan-barcode-input');

  if (!inp) return;

  const raw = inp.value.trim();

  if (!raw) return;

  

  handleBarcodeScan(raw);

  inp.value = '';

  inp.focus();

}



function handleBarcodeScan(code) {

  if (!currentScanSession || !currentScanSession.items) return;

  

  const statusEl = document.getElementById('scan-feedback-status');

  const cleanCode = code.trim().toLowerCase();

  

  // Match SKU or GTIN barcode

  const matched = currentScanSession.items.find(it => {

    const s = (it.sku || '').toLowerCase();

    const g = (it.gtin_barcode || '').toLowerCase();

    return s === cleanCode || g === cleanCode || s.replace(/\D/g, '') === cleanCode.replace(/\D/g, '');

  });

  

  if (!matched) {

    playWarningBeep();

    if (statusEl) {

      statusEl.textContent = `Không tìm thấy mã "${code}" trong danh mục lô hàng này!`;

      statusEl.style.color = '#dc2626';

    }

    showToast(`Không tìm thấy mã vạch "${code}" trong lô hàng này.`, 'error');

    return;

  }

  

  const oQty = Number(matched.qty_ordered || 0);

  let rQty = Number(matched.qty_received || 0);

  

  if (rQty >= oQty) {

    playWarningBeep();

    if (statusEl) {

      statusEl.textContent = `Mã SKU ${matched.sku} đã đủ số lượng (${rQty}/${oQty})!`;

      statusEl.style.color = '#d97706';

    }

    showToast(`Mã SKU ${matched.sku} đã được kiểm đếm đủ (${oQty} ${matched.unit}).`, 'warning');

  } else {

    playSuccessBeep();

    rQty += 1;

    matched.qty_received = rQty;

    if (statusEl) {

      statusEl.textContent = `Đã quét khớp: ${matched.sku} - ${matched.name_vn} (+1)`;

      statusEl.style.color = '#16a34a';

    }

  }

  

  // Show Active Card

  const activeCard = document.getElementById('scan-active-card');

  if (activeCard) {

    activeCard.style.display = 'block';

    const isDone = (rQty >= oQty);

    activeCard.style.background = isDone ? '#ecfdf5' : '#eff6ff';

    activeCard.style.borderColor = isDone ? '#6ee7b7' : '#93c5fd';

    

    activeCard.innerHTML = `

      <div style="display: flex; gap: 14px; align-items: center;">

        ${matched.image_url ? `<img src="${matched.image_url}" style="width: 56px; height: 56px; object-fit: contain; background: white; border-radius: 6px; border: 1px solid #cbd5e1;" />` : ''}

        <div style="flex: 1;">

          <div style="display: flex; gap: 8px; align-items: center;">

            <span class="font-mono" style="font-weight: 800; font-size: 15px; color: #0f172a;">${matched.sku}</span>

            <span class="badge" style="background: #e2e8f0; font-size: 11px;">${matched.package_no}</span>

            <span class="badge" style="background: #dbeafe; color: #1e40af; font-weight: 700; font-size: 11px;">${matched.location_code}</span>

          </div>

          <div style="font-weight: 700; font-size: 13px; color: #1e293b; margin-top: 2px;">${matched.name_vn}</div>

          <div style="font-size: 11px; color: #64748b;">GTIN: <code>${matched.gtin_barcode || '-'}</code> | HS Code: <code>${matched.hs_code || '-'}</code></div>

        </div>

        <div style="text-align: right;">

          <div style="font-size: 11px; color: #64748b;">Tiến độ SKU</div>

          <div class="font-mono" style="font-size: 20px; font-weight: 800; color: ${isDone ? '#166534' : '#2563eb'};">

            ${rQty} / ${oQty} <span style="font-size: 13px;">${matched.unit}</span>

          </div>

        </div>

      </div>

    `;

  }

  

  renderScanTable();

  

  // Highlight row momentarily

  const rowEl = document.getElementById('scan-row-' + matched.item_id);

  if (rowEl) {

    rowEl.style.outline = '2px solid #2563eb';

    rowEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    setTimeout(() => { if (rowEl) rowEl.style.outline = 'none'; }, 800);

  }

}



function adjustScannedQty(itemId, delta, setFull = false) {

  if (!currentScanSession || !currentScanSession.items) return;

  const it = currentScanSession.items.find(x => x.item_id === itemId);

  if (!it) return;

  

  const oQty = Number(it.qty_ordered || 0);

  let rQty = Number(it.qty_received || 0);

  

  if (setFull) {

    rQty = oQty;

  } else {

    rQty = Math.max(0, rQty + delta);

  }

  

  it.qty_received = rQty;

  playSuccessBeep();

  renderScanTable();

}



function onManualQtyChange(itemId, val) {

  if (!currentScanSession || !currentScanSession.items) return;

  const it = currentScanSession.items.find(x => x.item_id === itemId);

  if (!it) return;

  it.qty_received = Math.max(0, Number(val || 0));

  renderScanTable();

}



function onLocationChange(itemId, val) {

  if (!currentScanSession || !currentScanSession.items) return;

  const it = currentScanSession.items.find(x => x.item_id === itemId);

  if (!it) return;

  it.location_code = val.trim();

  const parts = val.trim().split(' - ');

  it.box_code = parts[0] || 'Hộp 01';

}



async function saveScanProgress() {

  if (!currentScanSession || !currentScanSession.receipt) return;

  

  const payload = {

    gr_id: currentScanSession.receipt.id,

    items: currentScanSession.items.map(it => ({

      item_id: it.item_id,

      qty_received: Number(it.qty_received || 0),

      location_code: it.location_code

    }))

  };

  

  try {

    const res = await fetch('/office/api.php?action=save_scan_progress', {

      method: 'POST',

      headers: { 'Content-Type': 'application/json' },

      body: JSON.stringify(payload)

    });

    const result = await res.json();

    if (result.ok) {

      showToast(result.message || 'Đã lưu tiến độ quét thành công!', 'success');

    } else {

      showToast('Lỗi: ' + result.error, 'error');

    }

  } catch (err) {

    showToast('Lỗi kết nối: ' + err.message, 'error');

  }

}



async function submitCompleteScanReceipt() {

  if (!currentScanSession || !currentScanSession.receipt) return;

  

  let incompleteCount = 0;

  currentScanSession.items.forEach(it => {

    if (Number(it.qty_received || 0) < Number(it.qty_ordered || 0)) {

      incompleteCount++;

    }

  });

  

  let confirmMsg = 'Xác nhận hoàn tất kiểm hàng và nhập kho lô hàng FSTV & VinFast (AWB 5864742881)?';

  if (incompleteCount > 0) {

    confirmMsg = `Có ${incompleteCount} mặt hàng chưa quét đủ số lượng. Hệ thống sẽ tự động lấy theo số lượng thực tế đã quét. Bạn có chắc chắn muốn hoàn tất nhập kho?`;

  }

  

  if (!confirm(confirmMsg)) return;

  

  const btn = document.getElementById('btn-complete-receipt');

  if (btn) {

    btn.disabled = true;

    btn.textContent = 'Đang xử lý nhập kho...';

  }

  

  const payload = {

    gr_id: currentScanSession.receipt.id,

    items: currentScanSession.items.map(it => ({

      item_id: it.item_id,

      qty_received: Number(it.qty_received || 0),

      location_code: it.location_code

    }))

  };

  

  try {

    const res = await fetch('/office/api.php?action=complete_scan_receipt', {

      method: 'POST',

      headers: { 'Content-Type': 'application/json' },

      body: JSON.stringify(payload)

    });

    const result = await res.json();

    if (result.ok) {

      playSuccessBeep();

      setTimeout(playSuccessBeep, 160);

      showToast(result.message || 'Nhập kho hoàn tất thành công 100%!', 'success');

      closeScanCheckModal();

      loadStock();

      loadLedger();

      loadDashboard();

      if (typeof loadShipments === 'function') loadShipments();

    } else {

      showToast('Lỗi nhập kho: ' + result.error, 'error');

    }

  } catch (err) {

    showToast('Lỗi kết nối: ' + err.message, 'error');

  } finally {

    if (btn) {

      btn.disabled = false;

      btn.textContent = 'Xác Nhận Hoàn Tất Nhập Kho';

    }

  }

}

</script>

</body>

</html>

