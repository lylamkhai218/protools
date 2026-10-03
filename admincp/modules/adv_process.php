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
    $listid = 0;
    if(isset($_GET["id"])){
        $listid = $_GET["id"];
    }
    $request = $_GET["rq"];
    $userid = 0;
    $error_return = '';
    if(checklogin()){
        process();
    }
    else{
        echo "Tài khoản đang đăng nhập không thể cập nhật. Vui lòng liên hệ Kỹ thuật T&T Vina (Mr. Kai).";
    }
    function check($username,$password) {
        $username = filter_user_char($username);
        $password = filter_pass_char($password);
        $query ="select id from user where username = '$username' and password = '$password' and type != 0 and status = 1";
        $result= mysql_query($query,$GLOBALS["con"]);
        if($result==false || mysql_num_rows($result)<=0){return false;}
        else{
            $row = mysql_fetch_array($result);
            $GLOBALS["userid"] = $row['id'];
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
    function process(){
        $list = explode(',', $GLOBALS["listid"]);
        for($i=0;$i<sizeof($list);$i++){
            $value = trim($list[$i]);
            if($value!=''&&$value!=0){
                if(!content_updating($value)){
                    exit;
                }
            }
        }
        echo 'Cập nhật thành công.';
    }
    function content_updating($id){
        $userid = $GLOBALS["userid"];
        $title = get_title_from_id($id);
        switch($GLOBALS["request"]){
            case 'active':
                $user_permit_require = 42;
                $user_permit_require_name = get_list_colum_of_table_from_db('permit','name','id',$user_permit_require);
                $user_permit_value = get_column_of_table("select value from user_permit where permitid = $user_permit_require and userid = $userid");
                if($user_permit_value==1){
                    if(update_column_of_table('adv','status',1,$id,'id')){
                        insert_into_system_log($GLOBALS["userid"],date("YmdHis"),get_list_colum_of_table_from_db('permit','groupid','id',$user_permit_require),'Kích hoạt quảng cáo:  "' . $title . '" thành công!','admincp/#adv_add?id='.$id,1);
                        return true;
                    }
                    else{
                        echo 'Cập nhật không thành công. Vui lòng liên hệ Kỹ thuật T&T Vina (Mr. Kai).';
                        insert_into_system_log($GLOBALS["userid"],date("YmdHis"),'30','Kích hoạt quảng cáo:  "' . $title . '" thất bại!','admincp/#adv_add?id='.$id,1);
                        return false;
                    }
                }
                else{
                    echo 'Bạn không có quyền ' . $user_permit_require_name;
                    return false;
                }
                break;
            case 'lock':
                $user_permit_require = 43;
                $user_permit_require_name = get_list_colum_of_table_from_db('permit','name','id',$user_permit_require);
                $user_permit_value = get_column_of_table("select value from user_permit where permitid = $user_permit_require and userid = $userid");
                if($user_permit_value==1){
                    if(update_column_of_table('adv','status',0,$id,'id')){
                        insert_into_system_log($GLOBALS["userid"],date("YmdHis"),get_list_colum_of_table_from_db('permit','groupid','id',$user_permit_require),'Khoá quảng cáo:  "' . $title . '" thành công!','admincp/#adv_add?id='.$id,1);
                        return true;
                    }
                    else{
                        echo 'Cập nhật không thành công. Vui lòng liên hệ Kỹ thuật T&T Vina (Mr. Kai).';
                        insert_into_system_log($GLOBALS["userid"],date("YmdHis"),'30','Khoá quảng cáo:  "' . $title . '" thất bại!','admincp/#adv_add?id='.$id,1);
                        return false;
                    }
                }
                else{
                    echo 'Bạn không có quyền ' . $user_permit_require_name;
                    return false;
                }
                break;
            case 'delete':
                $user_permit_require = 44;
                $user_permit_require_name = get_list_colum_of_table_from_db('permit','name','id',$user_permit_require);
                $user_permit_value = get_column_of_table("select value from user_permit where permitid = $user_permit_require and userid = $userid");
                if($user_permit_value==1){
                    if(delete_from_table('adv',$id,'id')){
                        delete_from_table('adv_catalog',$id,'advid');
                        delete_from_table('adv_click',$id,'id');
                        insert_into_system_log($GLOBALS["userid"],date("YmdHis"),get_list_colum_of_table_from_db('permit','groupid','id',$user_permit_require),'Xoá quảng cáo:  "' . $title . '" thành công!','admincp/#adv_add?id='.$id,1);
                        return true;
                    }
                    else{
                        echo 'Xoá thành viên không thành công. Vui lòng liên hệ Kỹ thuật T&T Vina (Mr. Kai).';
                        insert_into_system_log($GLOBALS["userid"],date("YmdHis"),'30','Xoá quảng cáo:  "' . $title . '" thất bại!','admincp/#adv_add?id='.$id,1);
                        return false;
                    }
                }
                else{
                    echo 'Bạn không có quyền ' . $user_permit_require_name;
                    return false;
                }
                break;
            default:
                break;
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
    function get_title_from_id($id) {
        $query = "select title from adv where id = $id";
        $result= mysql_query($query,$GLOBALS["con"]);   
        if($result==false||mysql_num_rows($result)<=0){
            return "";
        }
        else{
            $row = mysql_fetch_array($result);
            return $row['title'];
        }
    }
    function update_column_of_table($table,$column,$value,$number,$id){
        $query = "update $table set $column = '$value' where $id = '$number'";
        $result = mysql_query($query,$GLOBALS["con"]);  
        return $result;
    }
    function delete_from_table($table,$number,$id){
        $query = "delete from $table where $id = '$number'";
        $result = mysql_query($query,$GLOBALS["con"]);  
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
