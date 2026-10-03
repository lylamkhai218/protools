<?php
    header("Expires: Mon, 26 Jul 1997 05:00:00 GMT"); 
    header("Last-Modified: " . gmdate("D, d M Y H:i:s") . " GMT"); 
    header("cache-Control: no-store, no-cache, must-revalidate"); 
    header("cache-Control: post-check=0, pre-check=0", false); 
    header("Pragma: no-cache");
    date_default_timezone_set('Asia/Bangkok');
    $base_folder = substr($_SERVER['SCRIPT_NAME'],0,strrpos($_SERVER['SCRIPT_NAME'], '/'));
    $base_folder = substr($base_folder,0,strrpos($base_folder, '/'));
    $base_folder = substr($base_folder,0,strrpos($base_folder, '/')) . '/';
    $path = $_SERVER['DOCUMENT_ROOT'];
    include($path . $base_folder . "function/mdl_function.php");
    include($path . $base_folder . "/config/database.php");
    include($path . $base_folder . "/modules/mdl_meta.php");
    include($path . $base_folder . "/admincp/modules/mdl_global_admincp.php");
    $userid = 0;$system_id = 30;
    function check($username,$password) {
        $username = filter_user_char($username);
        $password = filter_pass_char($password);
        $query ="select id from user where username = '$username' and password = '$password' and status = 1";
        $result= mysql_query($query,$GLOBALS["con"]);
        if($result==false || mysql_num_rows($result)<=0){return false;}
        else{
            $row = mysql_fetch_array($result);
            $GLOBALS['userid'] = $row['id'];
            return true;
        }
    }
    function checklogin(){
        if(isset($_COOKIE[$GLOBALS['rootuser']])==true && isset($_COOKIE[$GLOBALS['rootpass']])==true){
            if(check($_COOKIE[$GLOBALS['rootuser']],$_COOKIE[$GLOBALS['rootpass']])){
                return true;
            }
        }
        return false;
    }
    if(!checklogin()){
        http_response_code(403);
        header('Content-Type: text/plain; charset=utf-8');
        echo "Tài khoản không hợp lệ.";
        exit;
    }
    $message = '';
    $status = 0;
    $uploadedurl = '';
    $target_folder = $path . $base_folder;
    $target = preg_replace('/[^a-zA-Z0-9_\-]/', '', isset($_POST["fTarget"]) ? $_POST["fTarget"] : '');
    $raw_function = isset($_POST["fFunction"]) ? $_POST["fFunction"] : '';
    $jsfunction = preg_replace('/[^a-zA-Z0-9_]/', '', $raw_function);
    if(empty($jsfunction)){
        $jsfunction = 'content_upload_image_status';
    }
    $max_size = isset($_POST["fMaxsize"]) && is_numeric($_POST["fMaxsize"]) ? intval($_POST["fMaxsize"]) : 2048;
    $save_directory = 'images/stores/';
    $max_size_to_byte = $max_size * 1024;
    $result = 0;
    $fileurl = "";
    $extent_image = '.'.fn_ShowFileExtension(isset($_FILES['userfile']['name']) ? $_FILES['userfile']['name'] : '');
    $ext_clean = strtolower(ltrim($extent_image, '.'));
    $disallowed_ext = array('php', 'phtml', 'php3', 'php4', 'php5', 'phps', 'html', 'htm', 'shtml', 'svg', 'js', 'exe', 'sh', 'bat', 'cmd', 'swf');

    if(file_exists($target_folder . "images/") == 0){
        mkdir($target_folder . "images/", 0777);
    }
    if(file_exists($target_folder . "images/stores/") == 0){
        mkdir($target_folder . "images/stores/", 0777);
    }
    if(!in_array($ext_clean, $disallowed_ext) && isset($_FILES['userfile']) && is_uploaded_file($_FILES['userfile']['tmp_name']) && ($_FILES["userfile"]["type"] == "image/jpeg" || $_FILES["userfile"]["type"] == "image/x-icon" || $_FILES["userfile"]["type"] == "image/gif" || $_FILES["userfile"]["type"] == "image/png" || $_FILES["userfile"]["type"] == "text/plain" || $_FILES["userfile"]["type"] == "application/pdf" || $_FILES["userfile"]["type"] == "image/vnd.adobe.photoshop" || $_FILES["userfile"]["type"] == "application/msword" || $_FILES["userfile"]["type"] == "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || $_FILES["userfile"]["type"] == "application/rtf" || $_FILES["userfile"]["type"] == "application/vnd.ms-excel" || $_FILES["userfile"]["type"] == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || $_FILES["userfile"]["type"] == "application/vnd.ms-powerpoint" || $_FILES["userfile"]["type"] == "application/vnd.openxmlformats-officedocument.presentationml.presentation" || $_FILES["userfile"]["type"] == "application/vnd.oasis.opendocument.text" || $_FILES["userfile"]["type"] == "application/vnd.oasis.opendocument.spreadsheet" || $_FILES["userfile"]["type"] == "application/zip" || $_FILES["userfile"]["type"] == "application/x-zip-compressed" || $_FILES["userfile"]["type"] == "multipart/x-zip" || $_FILES["userfile"]["type"] == "application/x-compressed" || $_FILES["userfile"]["type"] == "application/x-rar-compressed" || $_FILES["userfile"]["type"] == "application/octet-stream") && $_FILES['userfile']['size']<=$max_size_to_byte){
        $filename = basename($_FILES['userfile']['name']);
        if(empty($_POST["filename"])){
            $fileurl = "images/stores/" . fn_get_directory_of_folder_date($target_folder,$save_directory) . "/" . $filename;
            $i = 0;
            while(file_exists($target_folder . $fileurl)){
                $fileurl = "images/stores/" . fn_get_directory_of_folder_date($target_folder,$save_directory) . "/" . $i . "-" . $filename;
                $i = $i + 1;
            }
        }
        else{
            $custom_fn = preg_replace('/[^a-zA-Z0-9_\-]/', '', strtolower($_POST["filename"]));
            $fileurl = "images/stores/" . fn_get_directory_of_folder_date($target_folder,$save_directory) . "/" . $custom_fn . $extent_image;
            if(file_exists($target_folder . $fileurl)){
                $j = 0;
                while(file_exists($target_folder . $fileurl)){
                    $fileurl = "images/stores/" . fn_get_directory_of_folder_date($target_folder,$save_directory) . "/" . $custom_fn . "-" . $j . $extent_image;
                    $j = $j + 1;
                }
            }
        }
        $target_path = $target_folder . $fileurl;
        if(move_uploaded_file($_FILES['userfile']['tmp_name'], $target_path)){
            if(fn_check_content_of_file_upload($target_path)){
                insert_into_system_log($GLOBALS["userid"],date("YmdHis"),$system_id,'Tải file "' . $filename . '" thành công!',$fileurl,1);
                $result = 1;
            }
            else{
                insert_into_system_log($GLOBALS["userid"],date("YmdHis"),$system_id,'Hệ thống phát hiện nội dung lạ trong file. Tải file "' . $fileurl . '" không thành công!','',2);
                unlink($target_path);
                $result = 0;
            }
        }
        else{
            chmod($target_folder . "images", 0777);
            chmod($target_folder . "images/stores", 0777);
            chmod($target_folder . "images/stores/" . date("Y"), 0777);
            chmod($target_folder . "images/stores/" . date("Y") . "/" . date("m"), 0777);
            chmod($target_folder . "images/stores/" . date("Y") . "/" . date("m") . "/" . date("d"), 0777);
            if(move_uploaded_file($_FILES['userfile']['tmp_name'], $target_path)){
                if(fn_check_content_of_file_upload($target_path)){
                    insert_into_system_log($GLOBALS["userid"],date("YmdHis"),$system_id,'Tải file "' . $filename . '" thành công!',$filename,1);
                    $result = 1;
                }
                else{
                    insert_into_system_log($GLOBALS["userid"],date("YmdHis"),$system_id,'Hệ thống phát hiện nội dung lạ trong file. Tải file "' . $filename . '" thất bại.!','',2);
                    unlink($target_path);
                    $result = 0;
                }
            }
        }
        if($result==1){
            $status = $result;
        }
        else{
            $message = 'Hệ thống có lỗi trong quá trình tải file.';
        }
    }
    else{
        $message = 'Loại file không hợp lệ hoặc dung lượng vượt quá giới hạn.';
    }
    $safe_status = intval($status);
    $safe_message = addslashes(htmlspecialchars($message, ENT_QUOTES, 'UTF-8'));
    $safe_fileurl = addslashes(htmlspecialchars($fileurl, ENT_QUOTES, 'UTF-8'));
    echo "<script language=\"javascript\" type=\"text/javascript\">window.top.window.".$jsfunction."('".$safe_status."','".$safe_message."','".$safe_fileurl."');</script>";
    
    //INSERT TO SYSTEM_LOG
    function insert_into_system_log($userid,$create_time,$type,$note,$hyper_link,$status) {
        if($GLOBALS["web_mysql_escape_boolean"]){
            $note = mysql_escape_string($note);
        }
        $ip_address = $_SERVER['REMOTE_ADDR'];
        $query = "insert into system_log(userid,create_time,type,note,ip_address,hyper_link,status) values('$userid','$create_time','$type','$note','$ip_address','$hyper_link','$status')";
        $result = mysql_query($query,$GLOBALS["con"]);
        return $result;
    }
?>