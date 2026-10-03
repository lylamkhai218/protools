<?php
    header("Expires: Mon, 26 Jul 1997 05:00:00 GMT"); 
    header("Last-Modified: " . gmdate("D, d M Y H:i:s") . " GMT"); 
    header("cache-Control: no-store, no-cache, must-revalidate"); 
    header("cache-Control: post-check=0, pre-check=0", false); 
    header("Pragma: no-cache");
    $base_folder = substr($_SERVER['SCRIPT_NAME'],0,strrpos($_SERVER['SCRIPT_NAME'], '/'));
    $base_folder = substr($base_folder,0,strrpos($base_folder, '/'));
    $root_path = substr($base_folder,0,strrpos($base_folder, '/'));
    $base_folder = substr($base_folder,0,strrpos($base_folder, '/')) . '/';
    $path = $_SERVER['DOCUMENT_ROOT'];
    include($path . $base_folder . "function/mdl_function.php");
    include($path . $base_folder . "config/database.php");
    include($path . $base_folder . "modules/mdl_meta.php");
    include($path . $base_folder . "admincp/modules/mdl_global_admincp.php");
    date_default_timezone_set('Asia/Bangkok');
    $username = trim($_POST["fUsername"]);
    $password = trim($_POST["fPassword_hash"]);
    $remember = trim($_POST["fRemember"]);
    if($remember=="on"){$remember = true;}
    else{$remember = false;}
    check_username_and_password($username,$password,$remember);
    DisconnectDatabase();
    function check_username_and_password($username,$password,$remember) {
        $username = filter_user_char($username);
        $query ="select id,salt,password,type from user where username = '$username' and status = 1";
        $result = mysql_query($query,$GLOBALS["con"]);
        if($result==false||mysql_num_rows($result)<=0){
            echo "<script language=\"javascript\" type=\"text/javascript\">window.top.window.login_status('Tên truy cập không tồn tại!',0);</script>";
            return false;
        }
        else{
            $row = mysql_fetch_array($result);
            if($row['type']!=0){
                //$password = md5($password);
                $password = $password . $row['salt'];
                $password = md5($password);
                if(strcmp($password,$row['password'])==0){
                    $expire = false;
                    if($remember){
                        $expire = time()+60*60*24*365;
                    }
                    setcookie($GLOBALS['rootuser'],$username,$expire,$GLOBALS['base_folder'],$GLOBALS["domain"],0);
                    setcookie($GLOBALS['rootpass'],$password,$expire,$GLOBALS['base_folder'],$GLOBALS["domain"],0);
                    update_lastvisit($row['id']);
                    echo "<script language=\"javascript\" type=\"text/javascript\">window.top.window.login_status(1,1);</script>";
                    
                }
                else{
                    echo "<script language=\"javascript\" type=\"text/javascript\">window.top.window.login_status('Mật khẩu không chính xác!',0);</script>";
                }
            }
            else{
                echo "<script language=\"javascript\" type=\"text/javascript\">window.top.window.login_status('Bạn không có quyền truy cập vào trang quản trị!',0);</script>";
            }
            mysql_free_result($result);  
            return true;
        }
    }
    function update_lastvisit($id){
        $query = "update user set last_login = '" . date("YmdHis") . "', last_login_ip = '".$_SERVER['REMOTE_ADDR']."' where id = $id";
        $result = mysql_query($query,$GLOBALS["con"]);
        return $result;
    }
?>
