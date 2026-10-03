<div class="admin_header">
    <div class="header_logo">
        <button type="button" class="mobile_nav_btn" onclick="toggle_mobile_nav();" title="Menu điều hướng" aria-label="Menu điều hướng">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
        </button>
        <a href="<?php echo $GLOBALS["base_folder"];?>admincp/">
            <img src="<?php echo $GLOBALS["base_folder"];?>admincp/media/logo_ttvina.png" alt="T&T VINA INDUSTRIAL">
        </a>
    </div>
    
    <div class="header_nav">
        <?php include($_SERVER['DOCUMENT_ROOT'] . $base_folder . "admincp/modules/menu.php");?>
    </div>

    <div class="customer_info">
        <span class="user" title="Tài khoản quản trị">
            <svg class="nav-svg-icon" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            <span class="user-text"><?php echo $_COOKIE[$GLOBALS['rootuser']];?></span>
        </span>
        <span class="message">
            <a href="#" title="Thông báo hệ thống">
                <svg class="nav-svg-icon" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
                <span class="label-text">Thông báo (0)</span>
            </a>
        </span>
        <span class="help">
            <a href="javascript:;" onclick="open_help_modal();" title="Hỗ trợ kỹ thuật">
                <svg class="nav-svg-icon" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                <span class="label-text">Trợ giúp</span>
            </a>
        </span>
        <span class="logout">
            <a href="javascript:;" onclick="logout();" title="Đăng xuất">
                <svg class="nav-svg-icon" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                <span class="label-text">Đăng xuất</span>
            </a>
        </span>
        <span class="customer_id">
            <a target="_blank" href="<?php echo $GLOBALS["base_folder"];?>" title="Xem website Protools">
                <svg class="nav-svg-icon" viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                <span class="label-text"><?php echo $GLOBALS["domain_upper"];?></span>
            </a>
        </span>
    </div>
</div>

<div id="help_modal_overlay" style="display:none;position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(15,23,42,0.65);z-index:99999;" onclick="close_help_modal();">
    <div id="help_modal_box" style="position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);width:480px;background:#ffffff;border-radius:10px;box-shadow:0 25px 50px -12px rgba(0,0,0,0.35);padding:24px;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1e293b;z-index:100000;" onclick="event.stopPropagation();">
        <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #e2e8f0;padding-bottom:14px;margin-bottom:16px;">
            <div style="display:flex;align-items:center;gap:10px;">
                <img src="<?php echo $GLOBALS["base_folder"];?>admincp/media/logo_ttvina.png" alt="T&T VINA" style="height:26px;">
                <h3 style="margin:0;font-size:15px;font-weight:700;color:#0f172a;text-transform:uppercase;letter-spacing:0.5px;">Hỗ Trợ Kỹ Thuật Nội Bộ</h3>
            </div>
            <span onclick="close_help_modal();" style="cursor:pointer;font-size:22px;font-weight:bold;color:#64748b;line-height:1;">&times;</span>
        </div>
        <div style="font-size:13px;line-height:1.7;color:#334155;">
            <p style="margin:0 0 10px 0;font-weight:600;color:#0f172a;">CỔNG QUẢN TRỊ HỆ THỐNG PROTOOLS.COM.VN</p>
            <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:14px;margin-bottom:14px;">
                <div style="margin-bottom:10px;">
                    <span style="display:inline-block;width:140px;font-weight:600;color:#475569;">Phụ trách kỹ thuật:</span>
                    <strong style="color:#0284c7;">Mr. Kai</strong> &mdash; Hotline / Zalo: <a href="tel:0968597131" style="color:#0284c7;font-weight:700;text-decoration:none;">0968.597.131</a>
                </div>
                <div style="margin-bottom:10px;">
                    <span style="display:inline-block;width:140px;font-weight:600;color:#475569;">Phòng Dự án:</span>
                    <strong style="color:#0284c7;">Mr. Thanh</strong> &mdash; Hotline / Zalo: <a href="tel:0943301886" style="color:#0284c7;font-weight:700;text-decoration:none;">0943.301.886</a>
                </div>
                <div>
                    <span style="display:inline-block;width:140px;font-weight:600;color:#475569;">Email hỗ trợ:</span>
                    <a href="mailto:info@t2tvina.com?subject=[Protools%20AdminCP]%20Yeu%20cau%20ho%20tro" style="color:#0284c7;font-weight:700;text-decoration:none;">info@t2tvina.com</a>
                </div>
            </div>
            <p style="margin:0;font-size:12px;color:#64748b;">Trực kỹ thuật 24/7 đối với mọi sự cố gián đoạn hệ thống hoặc lỗi nghiệp vụ.</p>
        </div>
        <div style="text-align:right;margin-top:20px;">
            <button type="button" onclick="close_help_modal();" style="background:#0f172a;color:#ffffff;border:none;padding:8px 20px;border-radius:6px;font-size:13px;font-weight:600;cursor:pointer;">Đóng</button>
        </div>
    </div>
</div>
<script type="text/javascript">
function open_help_modal(){
    $("#help_modal_overlay").fadeIn(150);
}
function close_help_modal(){
    $("#help_modal_overlay").fadeOut(150);
}
function toggle_mobile_nav(){
    $('.header_nav').toggleClass('mobile_open');
}
$(document).on('click', '.header_nav a', function(){
    if($(window).width() <= 800){
        $('.header_nav').removeClass('mobile_open');
    }
});
</script>
