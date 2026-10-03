<?php
    header("Expires: Mon, 26 Jul 1997 05:00:00 GMT"); 
    header("Last-Modified: " . gmdate("D, d M Y H:i:s") . " GMT"); 
    header("cache-Control: no-store, no-cache, must-revalidate"); 
    header("cache-Control: post-check=0, pre-check=0", false); 
    header("Pragma: no-cache");             
    $base_folder = substr($_SERVER['SCRIPT_NAME'],0,strrpos($_SERVER['SCRIPT_NAME'], '/'));
    $base_folder = substr($base_folder,0,strrpos($base_folder, '/'));
    $base_folder = substr($base_folder,0,strrpos($base_folder, '/')) . '/';
    $path = $_SERVER['DOCUMENT_ROOT'];
    include($path . $base_folder . "function/mdl_function.php");
    include($path . $base_folder . "config/database.php");
    include($path . $base_folder . "modules/mdl_meta.php");   
    include($path . $base_folder . "admincp/modules/mdl_global_admincp.php");       
    date_default_timezone_set('Asia/Bangkok');
    $id = 0;
    if(isset($_GET["id"])){
        $id = $_GET["id"];
    }
    $request = '';
    if(isset($_GET["rq"])){
        $request = $_GET["rq"];
    }
    $userid = 0;
    $error_return = '';
    if(checklogin()){
        $name = get_list_name_from_listid('user','username','id',$id);
        if($request=='active'){
            $user_permit_require = 34;
            $user_permit_require_name = get_list_colum_of_table_from_db('permit','name','id',$user_permit_require);
            $user_permit_value = get_column_of_table("select value from user_permit where permitid = $user_permit_require and userid = $userid");
            if($user_permit_value==1){
                if(update_list_column_of_table('user','status',1,'id',$id)){
                    $list = split('[,]', $id);
                    for($i=0;$i<sizeof($list);$i++){
                        $value = trim($list[$i]);
                        if($value!="" && $value!=0){
                            $note = 'Kích hoạt thành viên: "' . get_list_name_from_listid('user','username','id',$value) . '" thành công.';
                            insert_into_system_log($userid,date("YmdHis"),get_list_colum_of_table_from_db('permit','groupid','id',$user_permit_require),$note,'admincp/#user_add?id='.$value,1);
                        }
                    }
                    echo 'Kích hoạt thành công.';
                }
                else{
                    $list = split('[,]', $catid);
                    for($i=0;$i<sizeof($list);$i++){
                        $value = trim($list[$i]);
                        if($value!="" && $value!=0){
                            $note = 'Kích hoạt thành viên: "' . get_list_name_from_listid('user','username','id',$value) . '" không thành công.';
                            insert_into_system_log($userid,date("YmdHis"),get_list_colum_of_table_from_db('permit','groupid','id',$user_permit_require),$note,'admincp/#user_add?id='.$value,2);
                        }
                    }
                    echo '<font style="color:#ff0000;">Kích hoạt không thành công. Vui lòng liên hệ Kỹ thuật T&T Vina (Mr. Kai).</font>';
                }
            }
            else{
                echo '<font style="color:#ff0000;">Bạn không có quyền ' . $user_permit_require_name . '</font>';
            }
        }
        elseif($request=='lock'){
            $user_permit_require = 35;
            $user_permit_require_name = get_list_colum_of_table_from_db('permit','name','id',$user_permit_require);
            $user_permit_value = get_column_of_table("select value from user_permit where permitid = $user_permit_require and userid = $userid");
            if($user_permit_value==1){
                if(update_list_column_of_table('user','status',0,'id',$id)){
                    $list = split('[,]', $id);
                    for($i=0;$i<sizeof($list);$i++){
                        $value = trim($list[$i]);
                        if($value!= "" && $value!=0){
                            $note = 'Khoá thành viên: "' . get_list_name_from_listid('user','username','id',$value) . '" thành công.';
                            insert_into_system_log($userid,date("YmdHis"),get_list_colum_of_table_from_db('permit','groupid','id',$user_permit_require),$note,'admincp/#user_add?id='.$value,1);
                        }
                    }
                    echo 'Khoá thành công.';
                }
                else{
                    $list = split('[,]', $id);
                    for($i=0;$i<sizeof($list);$i++){
                        $value = trim($list[$i]);
                        if($value!= "" && $value!=0){
                            $note = 'Khoá thành viên: "' . get_list_name_from_listid('user','username','id',$value) . '" không thành công.';
                            insert_into_system_log($userid,date("YmdHis"),get_list_colum_of_table_from_db('permit','groupid','id',$user_permit_require),$note,'admincp/#user_add?id='.$value,2);
                        }
                    }
                    echo '<font style="color:#ff0000;">Khoá không thành công. Vui lòng liên hệ Kỹ thuật T&T Vina (Mr. Kai).</font>';
                }
            }
            else{
                echo '<font style="color:#ff0000;">Bạn không có quyền ' . $user_permit_require_name.'</font>';
            }
        }
        elseif($request=='delete'){
            $user_permit_require = 33;
            $user_permit_require_name = get_list_colum_of_table_from_db('permit','name','id',$user_permit_require);
            $user_permit_value = get_column_of_table("select value from user_permit where permitid = $user_permit_require and userid = $userid");
            if($user_permit_value==1){
                if(delete_list_rows_of_table('user','id',$id)==true && delete_list_rows_of_table('user_info','id',$id)==true){
                    delete_list_rows_of_table('user_permit','userid',$id);
                    insert_into_system_log($userid,date("YmdHis"),get_list_colum_of_table_from_db('permit','groupid','id',$user_permit_require),'Xoá thành viên:  "' . $name . '" thành công.','',1);
                    echo 'Xoá thành công.';
                }
                else{
                    $list = split('[,]', $id);
                    for($i=0;$i<sizeof($list);$i++){
                        $value = trim($list[$i]);
                        if($value!= "" && $value!=0){
                            $note = 'Xoá thành viên:  "' . get_list_name_from_listid('user','username','id',$value) . '" không thành công.';
                            insert_into_system_log($userid,date("YmdHis"),get_list_colum_of_table_from_db('permit','groupid','id',$user_permit_require),$note,'admincp/#user_add?id='.$value,2);
                        }
                    }
                    echo '<font style="color:#ff0000;">Xoá không thành công. Vui lòng liên hệ Kỹ thuật T&T Vina (Mr. Kai).</font>';
                }
            }
            else{
                echo '<font style="color:#ff0000;">Bạn không có quyền ' .$user_permit_require_name.'</font>';
            }
        }
        else{
            echo '<font style="color:#ff0000;">Yêu cầu không xác định.</font>';
        }
    }
    else{
        echo '<font style="color:#ff0000;">Không thể cập nhật. Vui lòng liên hệ Admin.</font>';
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
    function get_colum_of_table_with_query($query){
        $result = mysql_query($query,$GLOBALS["con"]);
        if($result==false||mysql_num_rows($result)<=0){
            return false;
        }
        else{
            $row = mysql_fetch_array($result);
            return $row[0];
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
    function get_list_name_from_listid($table,$column,$column_id,$listid) {
        $query = "select $column from $table where $column_id in ($listid)";
        $result= mysql_query($query,$GLOBALS["con"]);   
        if($result==false||mysql_num_rows($result)<=0){
            return "";
        }
        else{
            $strreturn = '';
            while($row = mysql_fetch_array($result)){
                $strreturn = $strreturn . ', ' . $row[$column];
            }
            if(strpos($strreturn,',')==0){$strreturn=trim(substr($strreturn,1));}
            return $strreturn;
        }
    }
    function delete_list_rows_of_table($table,$column_id,$listid){
        $query = "delete from $table where $column_id in ($listid)";
        $result = mysql_query($query,$GLOBALS["con"]);  
        return $result;
    }
    function update_list_column_of_table($table,$column,$value,$column_id,$listid){
        $query = "update $table set $column = '$value' where $column_id in ($listid)";
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
