<?php 
    $base_folder = substr($_SERVER['SCRIPT_NAME'],0,strrpos($_SERVER['SCRIPT_NAME'], '/'));
    $base_folder = substr($base_folder,0,strrpos($base_folder, '/')) . '/';
    $path = $_SERVER['DOCUMENT_ROOT'];
    include($path . $base_folder . "config/database.php");
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<title>Đăng nhập | T&T VINA INDUSTRIAL</title>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
<link rel="icon" type="image/svg+xml" href="/logos/TTV_LOGO_Color_Master.svg" />
<link rel="alternate icon" type="image/png" href="/logos/TTV_LOGO_Color_Master.png" />
<link rel="shortcut icon" href="/logos/TTV_LOGO_Color_Master.png" />
<link rel="apple-touch-icon" href="/logos/TTV_LOGO_Color_Master.png" />
<link rel="stylesheet" type="text/css" href="<?php echo $base_folder;?>admincp/style.css" />
<script src="<?php echo $base_folder;?>js/jquery.min.js"></script>
<script src="<?php echo $base_folder;?>js/jquery.cookie.js"></script>
<script src="<?php echo $base_folder;?>js/other_js.js"></script>
<script src="<?php echo $base_folder;?>admincp/admin.js"></script>
<script type="text/javascript">var rootuser = "<?php echo $rootuser;?>";var rootpass = "<?php echo $rootpass;?>";var member_user = "<?php echo $member_user;?>";var member_pass = "<?php echo $member_pass;?>";var base_folder = "<?php echo $base_folder;?>";var domain = "<?php echo $domain;?>";var logined = "<?php echo $user_logined;?>";</script>
<script type="text/javascript">
    function focustextbox(){
        document.frmProcess.fUsername.focus();
    }
    function check_special_character(strinput){
        var iChars = "!#$%^&*()+=-[]\\\';,/{}|\":<>?";
        for (var i = 0; i < strinput.length; i++) {
            if (iChars.indexOf(strinput.charAt(i)) != -1) {
                return false;
            }
        }
    }
    function user_login(){
        try{
            if(document.frmProcess.fUsername.value == ""){
                show_alert_message('Vui lòng điền Tên đăng nhập.','#ff0000');
                document.frmProcess.fUsername.focus();
                return false;
            }
            if(check_special_character(document.frmProcess.fUsername.value)==false){
                show_alert_message('Tên đăng nhập chỉ chấp nhận có ký tự (a-z|0-9) và (.|_).','#ff0000');
                document.frmProcess.fUsername.focus();
                return false;
            }
            if(document.frmProcess.fPassword.value == ""){
                show_alert_message('Vui lòng điền Mật khẩu.','#ff0000');
                document.frmProcess.fPassword.focus();
                return false;
            }
            var password_hash = MD5(document.frmProcess.fPassword.value);
            $("[name='fPassword_hash']").val(password_hash);
            close_alert_message();
            show_alert_doing();
            return true;
        }catch(err){alert(err);return false;}
    }
    function login_status(message,status){
        try{
            close_alert_doing();
            if(status==1){
                show_alert_message('Đăng nhập thành công. Hệ thống sẽ tự động chuyển trong giây lát.','#0359BB');
                if($.cookie("bl_referer")!=null&&$.cookie("bl_referer")!=""){
                    location_referer = $.cookie("bl_referer");
                    $.cookie("bl_referer","",{ path: base_folder, domain: '.'+domain });
                    var targetAdmin = base_folder + "admincp/";
                    if(typeof location_referer === 'string' &&
                       !location_referer.startsWith('//') &&
                       !location_referer.toLowerCase().startsWith('javascript:') &&
                       !location_referer.toLowerCase().startsWith('data:') &&
                       (location_referer.startsWith(targetAdmin) || location_referer.startsWith('#'))){
                        window.location = location_referer;
                    } else {
                        window.location = targetAdmin;
                    }
                }
                else{
                    window.location = base_folder + "admincp/";
                }
            }
            else{
                show_alert_message(message,'#ff0000');
            }
            return true;
        }catch(err){alert(err);return false;}
    }
</script>
</head>
<body onload="focustextbox();">
    <div class="loginWallpaper">&nbsp;</div>
    <div id="wrap" class="loginWrapper">
        <?php include($_SERVER['DOCUMENT_ROOT'] . $base_folder . "admincp/modules/alert.php");?>
        <div class="loginform">
            <div class="aboutus">T&amp;T VINA INDUSTRIAL</div>
            <div class="title">Administrator Panel</div>
            <div class="top"></div>
            <div class="middle">
                <div class="contentlogin">
                    <form action="<?php echo $base_folder;?>admincp/modules/user_login.php" onsubmit="return user_login()" name="frmProcess" target="process_target" method="POST">
                        <input type="hidden" name="fPassword_hash" value="" />
                        <iframe name="process_target" src="#" style="width:0;height:0;border:0px;display:none;"></iframe>
                        <div class="rows">Username:</div>
                        <div class="rows_input"><input tabindex="1" type="text" name="fUsername" style="width:277px;" /></div>
                        <div class="rows">Password:</div>
                        <div class="rows_input"><input tabindex="2" type="password" name="fPassword" style="width:277px;" /></div>
                        <div class="remember">
                            <span class="check_box_style1" state="off" tabindex="3">
                                <span class="check_box_off1">
                                    <span class="check_box_on"></span>
                                    <span class="check_box_bar"></span>
                                    <input type="checkbox" name="fRemember" />
                                </span>
                            </span>
                            <span style="float:left;margin-left:5px;margin-top:1px;color:#777777;">Remember me</span>
                        </div>
                        <button tabindex="4" class="submit" value="Sign In" type="submit" name="btnLogin">
                            <img src="<?php echo $base_folder;?>admincp/media/signin.png" alt="" />
                        </button>
                        <div class="forgot_pass"><a href="">Forgot your password?</a></div>
                        <div id="login_process_status"></div>
                    </form>
                </div>
            </div>
            <div class="bottom"></div>
        </div>
    </div>
</body>
</html>
