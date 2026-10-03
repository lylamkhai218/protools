<?php
    date_default_timezone_set('Asia/Bangkok');
    $base_folder = substr($_SERVER['SCRIPT_NAME'],0,strrpos($_SERVER['SCRIPT_NAME'], '/'));
    $base_folder = substr($base_folder,0,strrpos($base_folder, '/')) . '/';
    $path = $_SERVER['DOCUMENT_ROOT'];
    include($path . $base_folder . "function/mdl_function.php");
    include($path . $base_folder . "config/database.php");
    include($path . $base_folder . "modules/mdl_meta.php");
    $userid = 0;
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
        elseif(isset($_COOKIE[$GLOBALS['member_user']])==true && isset($_COOKIE[$GLOBALS['member_pass']])==true){
            if(check($_COOKIE[$GLOBALS['member_user']],$_COOKIE[$GLOBALS['member_pass']])){
                return true;
            }
        }
        return false;
    }
    if(!checklogin()){
        http_response_code(403);
        header('Content-Type: text/plain; charset=utf-8');
        echo "Kiểm tra tài khoản lỗi!";
        exit;
    }
    $funcNum = isset($_GET['CKEditorFuncNum']) ? intval($_GET['CKEditorFuncNum']) : 0;
    $upload_type = isset($_FILES['upload']["type"]) ? $_FILES['upload']["type"] : '';
    $upload_size = isset($_FILES['upload']['size']) ? $_FILES['upload']['size'] : 0;
    $upload_tmp = isset($_FILES['upload']['tmp_name']) ? $_FILES['upload']['tmp_name'] : ''; 
    $upload_name = isset($_FILES['upload']['name']) ? basename($_FILES['upload']['name']) : '';
    $folder_save = 'files';
    $file_acept_array = array(
        0 => "image/jpeg",
        1 => "image/x-icon",
        2 => "image/gif",
        3 => "image/png",
        4 => "text/plain",
        5 => "application/pdf",
        6 => "application/msword",
        7 => "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        8 => "application/rtf",
        9 => "application/vnd.ms-excel",
        10 => "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        11 => "application/vnd.ms-powerpoint",
        12 => "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        13 => "application/vnd.oasis.opendocument.text",
        14 => "application/vnd.oasis.opendocument.spreadsheet",
        15 => "application/zip",
        16 => "application/x-zip-compressed",
        17 => "application/x-compressed",
        18 => "multipart/x-zip",
        19 => "application/x-rar-compressed",
        20 => "application/octet-stream"
    );
    $check_accept = false;$file_type = '';
    $disallowed_ext = array('php', 'phtml', 'php3', 'php4', 'php5', 'phps', 'html', 'htm', 'shtml', 'svg', 'js', 'exe', 'sh', 'bat', 'cmd', 'swf');
    $ext = strtolower(pathinfo($upload_name, PATHINFO_EXTENSION));
    if(!in_array($ext, $disallowed_ext)){
        for($i=0;$i<sizeof($file_acept_array);$i++){
            if($upload_type==$file_acept_array[$i]){
                $check_accept = true;
                $file_type = $file_acept_array[$i];
                if($file_type=='image/jpeg' || $file_type=='image/x-icon' || $file_type=='image/gif' || $file_type=='image/png'){
                    $folder_save = 'images';
                }
            }
        }
    }
    $target_folder = $_SERVER['DOCUMENT_ROOT'] . $base_folder;
    if(file_exists($target_folder . $folder_save) == 0){
        mkdir($target_folder . $folder_save, 0777);
    }
    if($check_accept==true && !empty($upload_tmp) && is_uploaded_file($upload_tmp)){
        $folder_time = fn_get_directory_of_folder_date($target_folder,$folder_save.'/');
        $uploadedImageURL = $folder_save . "/$folder_time/" . $upload_name;
        if(file_exists($target_folder . $uploadedImageURL)){
            $j = 0;
            while(file_exists($target_folder . $uploadedImageURL)){
                $uploadedImageURL = $folder_save . "/$folder_time/" . $j . "-" . $upload_name;
                $j += 1;
            }
        }
        $target_path = $target_folder . $uploadedImageURL;
        $result = 0;
        if(move_uploaded_file($_FILES['upload']['tmp_name'], $target_path)){
            if(fn_check_content_of_file_upload($target_path)){
                insert_into_system_log($GLOBALS["userid"],date("YmdHis"),'5','Tải file "' . $uploadedImageURL . '" qua ckeditor thành công!',$base_folder.$uploadedImageURL,1);
                $result = 1;
            }
            else{
                insert_into_system_log($GLOBALS["userid"],date("YmdHis"),'5','Hệ thống phát hiện nội dung lạ trong file ảnh. Tải file "' . $target_path . '" qua ckeditor không thành công.','',0);
                unlink($target_path);
                $result = 0;
            }
        }
        else{
            chmod($target_folder . $folder_save, 0777);
            chmod($target_folder . $folder_save . "/" . date("Y"), 0777);
            chmod($target_folder . $folder_save . "/" . date("Y") . "/" . date("m"), 0777);
            chmod($target_folder . $folder_save . "/" . date("Y") . "/" . date("m") . "/" . date("d"), 0777);
            if(move_uploaded_file($_FILES['upload']['tmp_name'], $target_path)){
                if(fn_check_content_of_file_upload($target_path)){
                    insert_into_system_log($GLOBALS["userid"],date("YmdHis"),'5','Tải file "' . $uploadedImageURL . '" qua ckeditor thành công!',$base_folder.$uploadedImageURL,1);
                    $result = 1;
                }
                else{
                    insert_into_system_log($GLOBALS["userid"],date("YmdHis"),'5','Hệ thống phát hiện nội dung lạ trong file ảnh. Tải file "' . $target_path . '" qua ckeditor không thành công.','',0);
                    unlink($target_path);
                    $result = 0;
                }
            }
            else{
                $result = 0;
            }
        }
    }
    else{
        $uploadedImageURL = 'Hỗ trợ các loại file: jpg, png, gif, txt, pdf, doc, docx, xls, xlsx, zip, rar.';
    }
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
    $safe_url = htmlspecialchars($base_folder . $uploadedImageURL, ENT_QUOTES, 'UTF-8');
?>
<script type='text/javascript'>window.parent.CKEDITOR.tools.callFunction(<?php echo $funcNum;?>,'<?php echo addslashes($safe_url);?>');</script>