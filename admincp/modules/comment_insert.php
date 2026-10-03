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
    $userid = 0;$poster = 0;
    $query_error = '';
    // Content variable
    $contentid = $_POST["fID"];$article_id = trim($_POST["fContentid"]);$body = trim($_POST["fBody"]);$body = str_replace(chr(13),"<br>",$body);
    if($web_mysql_escape_boolean){
        $body = mysql_escape_string($body);
    }
    $message_return = '';$status_return = 0;$url_return = '';
    if(checklogin()){
        if($GLOBALS["contentid"]==0){
            if($GLOBALS["published"] == 1 && $GLOBALS['publish_permit'] == 1){
                
            }
            //insertnews();
        }
        else{
            $publish_permit_require = 82;
            $publish_permit = get_column_of_table("select value from user_permit where permitid = $publish_permit_require and userid = $userid");
            
            $user_permit_require = 81;
            $user_permit_require_name = get_list_colum_of_table_from_db('permit','name','id',$user_permit_require);
            $user_permit_value = get_column_of_table("select value from user_permit where permitid = $user_permit_require and userid = $userid");
            $editor = $userid;$edit_time = date("YmdHis");
            $query_comment = "update comment set editor = '$editor',edit_time = '$edit_time' where commentid = $contentid";
            if($publish_permit==0){
                $query_comment = "update comment set published = '0',editor = '$editor',edit_time = '$edit_time' where commentid = $contentid";
            }
            $query_comment_body = "update comment_body set body = '$body' where commentid = $contentid";
            if(process_non_query_in_db($query_comment)==true && process_non_query_in_db($query_comment_body)==true){
                if($publish_permit==0){
                    comment_of_content_process('down',$contentid,$edit_time,$article_id);
                    $message_return = 'Cập nhật thành công phản hồi. Hệ thống đang chờ duyệt!';
                }
                else{
                    $message_return = 'Cập nhật thành công phản hồi!';
                }
                insert_into_system_log($userid,$create_time,get_list_colum_of_table_from_db('permit','groupid','id',$user_permit_require),'Cập nhật phản hồi "' . $contentid . '" thành công!','admincp/#comment_add?id='.$contentid,1);
                $status_return = 2;
            }
            else{
                insert_into_system_log($userid,$create_time,get_list_colum_of_table_from_db('permit','groupid','id',$user_permit_require),'Cập nhật phản hồi "' . $contentid . '" không thành công!','admincp/#comment_add?id='.$contentid,2);
                $message_return = 'Cập nhật không thành công phản hồi!';
                $status_return = 0;
            }
        }
    }
    else{
        $message_return = 'Hệ thống có lỗi trong quá trình kiểm tra tài khoản.';
    }
    echo "<script language=\"javascript\" type=\"text/javascript\">window.top.window.frmProcess_after_submit('$message_return',$status_return,'$url_return','');</script>";
    function comment_of_content_process($mode,$commentid,$create_time,$contentid){
        if($mode=='publish'){
            $query_update1 = "update content_info set comment_number = comment_number + 1, last_commentid = '$commentid', last_comment_time = '$create_time' where contentid = $contentid";
            process_non_query_in_db($query_update1);
            $orderingcommenttime = get_max_of_column('content','orderingcommenttime') + 1;
            $query_update2 = "update content set orderingcommenttime = '$orderingcommenttime' where contentid = $contentid";
            process_non_query_in_db($query_update2);
            $query_update3 = "update content_temp set orderingcommenttime = '$orderingcommenttime' where contentid = $contentid";
            process_non_query_in_db($query_update3);
        }
        elseif($mode=='republish'){
            $query_update1 = "update content_info set last_commentid = '$commentid', last_comment_time = '$create_time' where contentid = $contentid";
            process_non_query_in_db($query_update1);
            $orderingcommenttime = get_max_of_column('content','orderingcommenttime') + 1;
            $query_update2 = "update content set orderingcommenttime = '$orderingcommenttime' where contentid = $contentid";
            process_non_query_in_db($query_update2);
            $query_update3 = "update content_temp set orderingcommenttime = '$orderingcommenttime' where contentid = $contentid";
            process_non_query_in_db($query_update3);
        }
        elseif($mode=='down'){
            set_commentid_of_content($contentid);
        }
    }
    function set_commentid_of_content($contentid){
        $query = "select commentid,publish_time 
                from comment where contentid = $contentid and published = 1 order by publish_time DESC limit 1";
        $result = mysql_query($query,$GLOBALS["con"]);
        $commentid = 0;
        $publish_time = 0;
        $orderingcommenttime = 0;
        if($result==false||mysql_num_rows($result)<=0){
            $query_update2 = "update content set orderingcommenttime = '$orderingcommenttime' where contentid = $contentid";
            process_non_query_in_db($query_update2);
            $query_update3 = "update content_temp set orderingcommenttime = '$orderingcommenttime' where contentid = $contentid";
            process_non_query_in_db($query_update3);
        }
        else{
            $row = mysql_fetch_array($result);
            $commentid  = $row['commentid'];
            $publish_time  = $row['publish_time'];
            //$orderingcommenttime = get_max_of_column('content','orderingcommenttime') + 1;
        }
        $query_update1 = "update content_info set comment_number = comment_number - 1, last_commentid = '$commentid', last_comment_time = '$publish_time' where comment_number > 0 and contentid = $contentid";
        process_non_query_in_db($query_update1);
        return true;
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
    // INSERT INTO DATABASE
    function process_non_query_in_db($query){
        $result = mysql_query($query,$GLOBALS["con"]);
        if(!$result){
            $GLOBALS["message_return"] = mysql_error();$GLOBALS["message_return"]=str_replace("'",'"',$GLOBALS["message_return"]);
            insert_into_system_log($GLOBALS["userid"],date("YmdHis"),'30','Hệ thống có lỗi khi cập nhật nội dung phản hồi. Error: "' . $GLOBALS["message_return"] . '". Query: ' . $query);
        }
        return $result;
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