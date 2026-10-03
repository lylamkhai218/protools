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
    
    $contact_array = array();
    $contact_array[1] = trim($_POST["fWebsiteColor"]);
    $contact_array[2] = trim($_POST["fBrand_number"]);
    $contact_array[3] = trim($_POST["fAge_number"]);
    $contact_array[4] = trim($_POST["fContent_type4"]);
    $contact_array[5] = trim($_POST["fContent_type5"]);
    $contact_array[6] = trim($_POST["fContent_type6"]);
    $contact_array[7] = trim($_POST["fContent_type7"]);
    $contact_array[8] = trim($_POST["fContent_type8"]);
    $contact_array[9] = trim($_POST["fContent_type9"]);
    $contact_array[10] = trim($_POST["fContent_type10"]);
    $contact_array[11] = trim($_POST["fContent_type11"]);
    $contact_array[12] = trim($_POST["fContent_type12"]);
    
    $update_time = date("YmdHis");$create_time = $update_time;
    $userid = 0;$message_return = '';$status_return = 0;$url_return = '';
    
    if(checklogin()){
        $user_permit_require = 50;
        $user_permit_require_name = get_list_colum_of_table_from_db('permit','name','id',$user_permit_require);
        $user_permit_value = get_column_of_table("select value from user_permit where permitid = $user_permit_require and userid = $userid");
        if($user_permit_value==1){
            for($i=1;$i<=12;$i++){
                support_list_process($contact_array[$i],$userid,$i);
            }
            insert_into_system_log($userid,$create_time,get_list_colum_of_table_from_db('permit','groupid','id',$user_permit_require),'Cập nhật thành công Loại sản phẩm.','admincp/#content_type',1);
            $message_return = 'Cập nhật thành công.';
            $status_return = 2;
            
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
            $query_delete = "delete from content_type where type = $type";
            process_non_query_in_db($query_delete);
        }
        else{
            $time_create = date("YmdHis");
            $list_id = '0';
            for($i=0;$i<$support_number;$i++){
                $id = trim($_POST['fSupport_list_'.$type.'_id'.$i]);
                $nick = trim($_POST['fSupport_list_'.$type.'_nick'.$i]);
                $name = post_submit_object_process('fSupport_list_'.$type.'_name'.$i,0,true);
                
                $maxid = post_submit_object_process('fSupport_list_'.$type.'_maxid'.$i,0,true);
                $region_column = post_submit_object_process('fSupport_list_'.$type.'_region'.$i,0,true);
                $tinycode = post_submit_object_process('fSupport_list_'.$type.'_tinycode'.$i,'',false);
                
                
                $status = 0;
                if($_POST['fSupport_list_'.$type.'_status'.$i]=="on"){$status=1;}
                if($nick != ''||$name != ''){
                    $query = '';
                    if($id==0){
                        $id = get_max_of_column('content_type','id') + 1;
                        $query = "insert into content_type(id,code,name,type,creator,create_time,status,maxid,tinycode,regionstt) values('$id','$nick','$name','$type','$userid','$time_create','$status','$maxid','$tinycode','$region_column')";
                    }
                    else{
                        $query = "update content_type set code = '$nick',name = '$name',maxid = '$maxid',tinycode = '$tinycode',editor = '$userid',edit_time = '$time_create',status = '$status',regionstt = '$region_column' where id = $id";
                    }
                    $list_id = $list_id . ',' . $id;
                    process_non_query_in_db($query);
                }
            }
            $query = "delete from content_type where id not in ($list_id) and type = $type";
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
