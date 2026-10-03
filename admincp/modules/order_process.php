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
    $request = $_GET["rq"];
    $list = trim($_GET["id"]);
    $contentid = 0;
    $body = '';
    $fullname = '';
    $poster = 0;
    $userid = 0;
    $publisher = 0;
    $query_error = '';
    $published = 0;
    $publish_time = time();
    if(checklogin()){
        $process_return = true;
        $array_contentid = split('[,]', $list);
        for($i=0;$i<sizeof($array_contentid);$i++){
            $value = trim($array_contentid[$i]);
            if($value!=''&&$value!=0){
                $process_return = process($value,$publish_time,$userid);
                if(!$process_return){exit;}
            }
        }
        if($process_return){echo 'Thực hiện thành công'.$request;}
    }
    else{
        echo "Tài khoản bạn đang đăng nhập không thể thực hiện!";
    }
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
    function process($contentid,$publish_time,$userid){
        getinfo($contentid);
        if($GLOBALS["request"] == "republish"){
            $user_permit_require = 72;
            $user_permit_require_name = get_list_colum_of_table_from_db('permit','name','id',$user_permit_require);
            $user_permit_value = get_column_of_table("select value from user_permit where permitid = $user_permit_require and userid = $userid");
            if($user_permit_value == 1){
                $query1 = "update order_list set published = '1',publisher = '$userid',publish_time = '$publish_time' where id = $contentid";
                if(process_non_query_in_db($query1)){
                    insert_into_system_log($GLOBALS["userid"],date("YmdHis"),'8','Duyệt lại đơn hàng: "' . $GLOBALS["poster"] . ' - ' . $GLOBALS["fullname"] . ' - ' . substring($GLOBALS["body"],60) . '"','admincp/#comment_add?id='.$contentid,1);
                    return true;
                }
                else{
                    insert_into_system_log($GLOBALS["userid"],date("YmdHis"),'8','Duyệt lại đơn hàng không thành công: "' . $GLOBALS["poster"] . ' - ' . $GLOBALS["fullname"] . ' - ' . substring($GLOBALS["body"],60) . '"','admincp/#comment_add?id='.$contentid,2);
                    return false;
                }
            }
            else{
                echo "Bạn không có quyền " . $user_permit_require_name;
                return false;
            }
        }
        if($GLOBALS["request"] == "publish"){
            $user_permit_require = 72;
            $user_permit_require_name = get_list_colum_of_table_from_db('permit','name','id',$user_permit_require);
            $user_permit_value = get_column_of_table("select value from user_permit where permitid = $user_permit_require and userid = $userid");
            if($user_permit_value == 1){
                $query1 = "update order_list set published = '1',publisher = '$userid',publish_time = '$publish_time' where id = $contentid";
                if(process_non_query_in_db($query1)){
                    insert_into_system_log($GLOBALS["userid"],date("YmdHis"),'8','Duyệt đơn hàng của: "' . $GLOBALS["fullname"] . '"','admincp/#order_add?id='.$contentid,1);
                    return true;
                }
                else{
                    insert_into_system_log($GLOBALS["userid"],date("YmdHis"),'8','Duyệt đơn hàng không thành công: "' . $GLOBALS["fullname"] . '"','admincp/#order_add?id='.$contentid,2);
                    return false;
                }
            }
            else{
                echo "Bạn không có quyền " . $user_permit_require_name;
                return false;
            }
        }
        if($GLOBALS["request"] == "down"){
            $user_permit_require = 74;
            $user_permit_require_name = get_list_colum_of_table_from_db('permit','name','id',$user_permit_require);
            $user_permit_value = get_column_of_table("select value from user_permit where permitid = $user_permit_require and userid = $userid");
            if($user_permit_value == 1){
                $query1 = "update order_list set published = '0',remover = '$userid',remove_time = '$publish_time' where id = $contentid";
                if(process_non_query_in_db($query1)){
                    insert_into_system_log($GLOBALS["userid"],date("YmdHis"),'8','Gỡ đơn hàng: "' . $GLOBALS["fullname"] . '"','admincp/#order_add?id='.$contentid,1);
                    return true;
                }
                else{
                    insert_into_system_log($GLOBALS["userid"],date("YmdHis"),'8','Gỡ đơn hàng không thành công: "' . $GLOBALS["fullname"] . '"','admincp/#order_add?id='.$contentid,2);
                    return false;
                }
            }
            else{
                echo "Bạn không có quyền " .$user_permit_require_name;
                return false;
            }
        }
        if($GLOBALS["request"] == "delete"){
            $user_permit_require = 73;
            $user_permit_require_name = get_list_colum_of_table_from_db('permit','name','id',$user_permit_require);
            $user_permit_value = get_column_of_table("select value from user_permit where permitid = $user_permit_require and userid = $userid");
            if($user_permit_value == 1){
                $query1 = "delete from order_list where id = $contentid";
                if(process_non_query_in_db($query1)){
                    insert_into_system_log($GLOBALS["userid"],date("YmdHis"),'8','Xoá đơn hàng: "' . $GLOBALS["fullname"] . '"','',1);
                    return true;
                }
                else{
                    insert_into_system_log($GLOBALS["userid"],date("YmdHis"),'8','Xoá đơn hàng không thành công: "' . $GLOBALS["fullname"] . '"','',2);
                    return false;
                }
            }
            else{
                echo "Bạn không có quyền " . $user_permit_require_name;
                return false;
            }
        }
    }
    function getinfo($id) {
        $query = "select * from order_list where id = $id";
        $result = mysql_query($query,$GLOBALS["con"]);
        if($result==false||mysql_num_rows($result)<=0){return false;}
        else{
            $row = mysql_fetch_array($result);
            $GLOBALS["fullname"] = $row['fullname'];
            $GLOBALS["published"] = $row['published'];
            return true;
        }
    }
    
    // GET DATA FROM DB
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
    function get_max_of_column($table,$column){
        $query = "select max($column) from $table";
        $result = mysql_query($query,$GLOBALS["con"]);
        if($result==false||mysql_num_rows($result)<=0){
            return -1;
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
    // PROCESS NON QUERY IN DATABASE
    function process_non_query_in_db($query){
        $result = mysql_query($query,$GLOBALS["con"]);
        if(!$result){
            $GLOBALS["message_return"] = mysql_error();$GLOBALS["message_return"]=str_replace("'",'"',$GLOBALS["message_return"]);
            insert_into_system_log($GLOBALS["userid"],date("YmdHis"),'30','Hệ thống có lỗi khi xử lý đơn hàng. Error: "' . $GLOBALS["message_return"] . '". Query: ' . $query);
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
