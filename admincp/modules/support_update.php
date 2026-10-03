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
    
    $id = $_POST["fID"];
    $hotline = post_submit_object_process('fHotline','',false);
    $yahoo = post_submit_object_process('fYahoo','',false);
    $skype = post_submit_object_process('fSkype','',false);
    $hour_support = post_submit_object_process('fHour_support','',false);$other_contact = post_submit_object_process('fOther_contact','',false);
    $email_sender = post_submit_object_process('fEmail_sender','',false);$email_sender_pass = post_submit_object_process('fEmail_sender_pass','',false);
    $send_email_type = 0;if(isset($_POST["fSend_email_type"])){if($_POST["fSend_email_type"]=="on"){$send_email_type=1;}}
    $email_booking = post_submit_object_process('fEmail_booking','',false);
    $meta_support1 = post_submit_object_process('meta_support1','',false);
    $meta_support2 = post_submit_object_process('meta_support2','',false);
	$languageid = post_submit_object_process('fLanguage',1,true);
    if($web_mysql_escape_boolean){
        $other_contact = mysql_escape_string($other_contact);
        $hour_support = mysql_escape_string($hour_support);
        $yahoo = mysql_escape_string($yahoo);
        $skype = mysql_escape_string($skype);
        $languageid = mysql_escape_string($languageid);
    }
    $contact_array = array();
    $contact_array[1] = trim($_POST["fYahoo_number"]);
    $contact_array[2] = trim($_POST["fSkype_number"]);
    $contact_array[3] = trim($_POST["fPhone_number"]);
    $contact_array[4] = trim($_POST["fEmail_number"]);
    
    
    $update_time = date("YmdHis");
    $userid = 0;$message_return = '';$status_return = 0;$url_return = '';
    
    $meta_support1 = fn_escapse_string($meta_support1);
    $meta_support2 = fn_escapse_string($meta_support2);
    
    if(checklogin()){
        $user_permit_require = 50;
        $user_permit_require_name = get_list_colum_of_table_from_db('permit','name','id',$user_permit_require);
        $user_permit_value = get_column_of_table("select value from user_permit where permitid = $user_permit_require and userid = $userid");
        if($user_permit_value==1){
            $query_config = "update website_config set email_sender='$email_sender',email_sender_pass = '$email_sender_pass',send_email_type = '$send_email_type',salt = '$salt',email_booking = '$email_booking',meta_support1 = '$meta_support1',meta_support2 = '$meta_support2',update_time = '$update_time'";
            //$query_seo = "update website_seo set title = '$title',description = '$description',keywords = '$keywords',keyword_tags = '$keyword_tags' where id = $id";
            $query_contact = "update website_contact set hotline = '$hotline',yahoo = '$yahoo',skype = '$skype',hour_support='$hour_support',other_contact='$other_contact'";
            if(process_non_query_in_db($query_config)==true && process_non_query_in_db($query_contact)==true){
                for($i=1;$i<=4;$i++){
                    support_list_process($contact_array[$i],$userid,$i);
                }
                insert_into_system_log($userid,$create_time,get_list_colum_of_table_from_db('permit','groupid','id',$user_permit_require),'Cập nhật thành công Thông tin hỗ trợ.','admincp/#config',1);
                $message_return = 'Cập nhật thành công.';
                $status_return = 2;
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
    function support_list_process($support_number,$userid,$type){
        if($support_number<=0){
            $query_delete = "delete from support_list where type = $type";
            process_non_query_in_db($query_delete);
        }
        else{
            $time_create = date("YmdHis");
            $list_id = '0';
            for($i=0;$i<$support_number;$i++){
                $id = trim($_POST['fSupport_list_'.$type.'_id'.$i]);
                $nick = trim($_POST['fSupport_list_'.$type.'_nick'.$i]);
                $name = trim($_POST['fSupport_list_'.$type.'_name'.$i]);
                $status = 0;
                if($_POST['fSupport_list_'.$type.'_status'.$i]=="on"){$status=1;}
                if($nick != ''||$name != ''){
                    $query = '';
                    if($id==0){
                        $id = get_max_of_column('support_list','id') + 1;
                        $query = "insert into support_list(id,nick,name,type,creator,create_time,status) values('$id','$nick','$name','$type','$userid','$time_create','$status')";
                    }
                    else{//,languageid = '$languageid'
                        $query = "update support_list set nick = '$nick',name = '$name',editor = '$userid',edit_time = '$time_create',status = '$status' where id = $id";
                    }
                    $list_id = $list_id . ',' . $id;
                    process_non_query_in_db($query);
                }
            }
            $query = "delete from support_list where id not in ($list_id) and type = $type";
            process_non_query_in_db($query);
        }
    }
    
    function get_max_of_column($table,$column){
        $query = "select max($column) from $table";
        $result = mysql_query($query,$GLOBALS["con"]);
        if($result==false){
            return -1;
        }
        elseif(mysql_num_rows($result)<=0){
            return 0;
        }
        else{
            $row = mysql_fetch_array($result);
            $strreturn = $row[0];
            if($strreturn==null||$strreturn==""){$strreturn=0;}
            return $strreturn;
        }
    }
    
    function get_column_of_table($query) {
        $result = mysql_query($query,$GLOBALS["con"]);
        if($result==false||mysql_num_rows($result)<=0){
            return 0;
        }   
        else{
            $row = mysql_fetch_array($result);
            return $row[0];
        }
    }
    
    function get_list_colum_of_table_from_db($table,$column,$id,$input){
        $query = "select $column from $table where $id in ($input)";
        $result = mysql_query($query,$GLOBALS["con"]);
        if($result==false||mysql_num_rows($result)<=0){
            return '';
        }
        else{
            $strreturn = '';
            while($row = mysql_fetch_array($result)){
                $strreturn = $strreturn . ', ' . $row[0];
            }
            if(strpos($strreturn,',')==0){$strreturn=substr($strreturn,1);}
            return trim($strreturn);
        }
    }
    
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
    // PROCESS NON QUERY INTO DATABASE
    function process_non_query_in_db($query){
        $result = mysql_query($query,$GLOBALS["con"]);
        if(!$result){
            $GLOBALS["message_return"] = mysql_error();$GLOBALS["message_return"] = str_replace("'",'"',$GLOBALS["message_return"]);
            insert_into_system_log($GLOBALS["userid"],date("YmdHis"),'30','Hệ thống có lỗi khi cập nhật Thông tin hỗ trợ. Error: "' . $GLOBALS["message_return"] . '". Query: ' . $query,'',0);
        }
        return $result;
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
