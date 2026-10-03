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
    include($path . $base_folder . "config/database.php");
    include($path . $base_folder . "modules/mdl_meta.php");
    include($path . $base_folder . "admincp/modules/mdl_global_admincp.php");
    
    $update_time = date("YmdHis");
    $userid = 0;$message_return = '';$status_return = 0;$url_return = '';
    
    if(checklogin()){
        $user_permit_require = 50;
        $user_permit_require_name = fn_get_column_of_table_with_query("select name from permit where id = $user_permit_require");
        $user_permit_value = fn_get_column_of_table_with_query("select value from user_permit where permitid = $user_permit_require and userid = $userid",0,0);
        if($user_permit_value==1){
            $message_return = 'Cập nhật ngôn ngữ thành công.';
            $status_return = 5;
            $result_language = fn_get_array_with_query("select * from language where status = 1 order by id ASC");
            $language_array = array();
            if($result_language!=false && mysql_num_rows($result_language)>0){
                $i = 0;
                while($row = mysql_fetch_array($result_language)){
                    $language_array[$i] = $row['id'];
                    $i+=1;
                }
            }
            if(sizeof($language_array)>0){
                $result_language_insert_new = fn_get_array_with_query("select * from language_template where languageid = 1 order by id ASC");
                if($result_language_insert_new!=false && mysql_num_rows($result_language_insert_new)>0){
                    while($row_insert_new = mysql_fetch_array($result_language_insert_new)){
                        $id = $row_insert_new['id'];
                        for($i=0;$i<sizeof($language_array);$i++){
                            $name_post = 'language_' . $language_array[$i] . '_' . $id;
                            if(isset($_POST[$name_post])){
                                $value = post_submit_object_process($name_post,'2',false);
                                $value = fn_escapse_string($value);
                                if(fn_process_query("update language_template set value = '$value' where id = $id and languageid = " . $language_array[$i])){
                                    
                                }
                                else{
                                    $message_return = 'Hệ thống có lỗi trong quá trình cập nhật ngôn ngữ.';
                                    $status_return = 0;
                                }
                            }
                        }
                    }
                }
            }
            else{
                $message_return = 'Hệ thống có lỗi trong quá trình cập nhật ngôn ngữ.';
                $status_return = 0;
            }
            
        }
        else{
            $message_return = 'Bạn không có quyền ' . $user_permit_require_name;
        }
    }
    else{
        $message_return = 'Hệ thống có lỗi trong quá trình kiểm tra tài khoản.';
    }
    echo "<script language=\"javascript\" type=\"text/javascript\">window.top.window.frmProcess_after_submit('$message_return',$status_return,'$url_return','');</script>";
    
    function check($username,$password) {
        $username = filter_user_char($username);
        $password = filter_pass_char($password);
        $query ="select id from user where username = '$username' and password = '$password' and type != 0 and status = 1";
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
