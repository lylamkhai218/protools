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
    $id = trim($_POST["fID"]);$username = trim($_POST["fUsername"]);
    $salt = get_salt_random();
    $type = trim($_POST["fType"]);
    $password = trim($_POST["fPassword"]);$repassword = trim($_POST["fRepassword"]);
    $firstname = trim($_POST["fFirstname"]);$lastname = trim($_POST["fLastname"]);
    $showname = trim($_POST["fShowname"]);$fullname = trim($_POST["fFullname"]);
    $avatar = trim($_POST["fAvatar"]);
    $gender = $_POST["fGender"];
    $day_of_birth = trim($_POST["fDay_of_birth"]);
    $day_of_birth = substr($day_of_birth,6) . substr($day_of_birth,3,2) . substr($day_of_birth,0,2) . '000000';
    $phone = trim($_POST["fPhone"]);$mobile = trim($_POST["fMobile"]);$email = trim($_POST["fEmail"]);$yahoo = trim($_POST["fYahoo"]);$skype = trim($_POST["fSkype"]);$address = trim($_POST["fAddress"]);
    $note = trim($_POST["fNote"]);$fax = trim($_POST["fFax"]);
    $status = 0;if($_POST["fStatus"]=="on"){$status = 1;}
    $create_time = date("YmdHis");$update_time = $create_time;
    //Global variable
    $userid = 0;
    $message_return = '';
    $status_return = 0;
    $url_return = '';
    if($web_mysql_escape_boolean){
        $username = mysql_escape_string($username);
        $showname = mysql_escape_string($showname);$fullname = mysql_escape_string($fullname);
        $firstname = mysql_escape_string($firstname);$lastname = mysql_escape_string($lastname);
        $phone = mysql_escape_string($phone);$mobile = mysql_escape_string($mobile);$email = mysql_escape_string($email);$yahoo = mysql_escape_string($yahoo);$skype = mysql_escape_string($skype);$address = mysql_escape_string($address);
        $note = mysql_escape_string($note);
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
    if(checklogin()){
        if($id==0){
            $user_permit_require = 30;
            $user_permit_require_name = get_list_colum_of_table_from_db('permit','name','id',$user_permit_require);
            $user_permit_value = get_column_of_table("select value from user_permit where permitid = $user_permit_require and userid = $userid");
            if($user_permit_value==1){
                $id = get_max_of_column('user','id') + 1;
                if(check_username_exists($username)){
                    $message_return = 'Tên truy cập đã tồn tại.';
                }
                elseif($username!=filter_user_char($username)){
                    $message_return = 'Tên truy cập chỉ chấp nhận chứa các ký tự đặc biệt: <u>.</u>, <u>@</u>.';
                }
                elseif(check_showname_exists($id,$showname)){
                    $message_return = 'Tên hiển thị đã tồn tại.';
                }
                elseif($password!=$repassword){
                    $message_return = 'Mật khẩu không giống nhau.';
                }
                else{
                    $newpassword = md5($password);
                    $newpassword = $newpassword . $salt;
                    $newpassword = md5($newpassword);
                    $query_user = "insert into user(id,creator,username,password,salt,type,create_time,status) values('$id','$userid','$username','$newpassword','$salt','$type','$create_time','$status')";
                    $query_user_info = "insert into user_info(id,firstname,lastname,fullname,showname,email,address,phone,mobile,avatar,gender,day_of_birth,yahoo,skype,fax,note) values('$id','$firstname','$lastname','$fullname','$showname','$email','$address','$phone','$mobile','$avatar','$gender','$day_of_birth','$yahoo','$skype','$fax','$note')";
                    if(process_non_query_in_db($query_user)){
                        if(process_non_query_in_db($query_user_info)){
                            if(get_permit_group($id,'insert')){
                                $status_return = 3;
                                $message_return = 'Tạo thành viên "' . $username . '" thành công.';
                                insert_into_system_log($userid,$create_time,get_list_colum_of_table_from_db('permit','groupid','id',$user_permit_require),$message_return,'admincp/#user_add?id='.$id,1);
                            }
                            else{
                                $status_return = 3;
                                $message_return = 'Tạo thành viên "' . $username . '" thành công. <font style="color:#ff0000;">Cập nhật quyền không thành công!</font>';
                                insert_into_system_log($userid,$create_time,get_list_colum_of_table_from_db('permit','groupid','id',$user_permit_require),$message_return,'admincp/#user_add?id='.$id,2);
                            }
                        }
                    }
                }
            }
            else{
                $message_return = 'Bạn không có quyền ' . $user_permit_require_name;
            }
        }
        else{
            $user_permit_require = 31;
            $user_permit_require_name = get_list_colum_of_table_from_db('permit','name','id',$user_permit_require);
            $user_permit_value = get_column_of_table("select value from user_permit where permitid = $user_permit_require and userid = $userid");
            if($user_permit_value==1){
                if(check_showname_exists($id,$showname)){
                    $message_return = 'Tên hiển thị đã tồn tại.';
                }
                elseif($password=='' && $_POST["fChangepassword"]=="on"){
                    $message_return = 'Mật khẩu không được để trống.';
                }
                elseif($password!=$repassword && $_POST["fChangepassword"]=="on"){
                    $message_return = 'Mật khẩu không giống nhau.';
                }
                else{
                    $newpassword = md5($password);
                    $newpassword = $newpassword . $salt;
                    $newpassword = md5($newpassword);
                    $query_user = "update user set type = '$type',update_time = '$update_time',status = '$status' where id = $id";
                    if($_POST["fChangepassword"]=="on"){
                        $query_user = "update user set password = '$newpassword',salt = '$salt',type = '$type',update_time = '$update_time',status = '$status' where id = $id";
                    }
                    $query_user_info = "update user_info set firstname = '$firstname',lastname = '$lastname',fullname = '$fullname',showname = '$showname',email = '$email',address = '$address',phone = '$phone',mobile = '$mobile',avatar = '$avatar',gender = '$gender',day_of_birth = '$day_of_birth',yahoo = '$yahoo',skype = '$skype',fax = '$fax',note = '$note' where id = $id";
                    if(process_non_query_in_db($query_user)){
                        if(process_non_query_in_db($query_user_info)){
                            if(get_permit_group($id,'update')){
                                $status_return = 2;
                                $message_return = 'Cập nhật thông tin thành viên "' . $username . '" thành công.';
                                insert_into_system_log($userid,$create_time,get_list_colum_of_table_from_db('permit','groupid','id',$user_permit_require),$message_return,'admincp/#user_add?id='.$id,1);
                            }
                            else{
                                $status_return = 2;
                                $message_return = 'Cập nhật thông tin thành viên "' . $username . '" thành công. <font style="color:#ff0000;">Cập nhật quyền không thành công!</font>';
                                insert_into_system_log($userid,$create_time,get_list_colum_of_table_from_db('permit','groupid','id',$user_permit_require),$message_return,'admincp/#user_add?id='.$id,2);
                            }
                        }
                    }
                    
                }
            }
            else{
                $message_return = 'Bạn không có quyền ' . $user_permit_require_name;
            }
        }
            
    }
    else{
        $message_return = 'Hệ thống có lỗi trong quá trình kiểm tra tài khoản.';
    }
    echo "<script language=\"javascript\" type=\"text/javascript\">window.top.window.frmProcess_after_submit('$message_return',$status_return,'$url_return','');</script>";
    // Insert user permit
    function get_permit_list_of_group($groupid,$userid,$mode) {
        $query = '';
        if($mode=='insert'){
            $query ="select * from permit where groupid = $groupid";
        }
        elseif($mode=='update'){
            $query ="select * from permit,user_permit where permit.id = user_permit.permitid and user_permit.userid = $userid and permit.groupid = $groupid and permit.status = 1";
        }
        $result = mysql_query($query,$GLOBALS["con"]);
        if($result==false||mysql_num_rows($result)<=0){
            return false;
        }
        else{
            while($row = mysql_fetch_array($result)){
                $permitid = $row['id'];
                $value = 0;
                if($_POST[md5($permitid)]=="on"){
                    $value = 1;
                }
                $query_user_permit = '';
                if($mode=='insert'){
                    $query_user_permit = "insert into user_permit(userid,permitid,value) values('$userid','$permitid','$value')";
                }
                elseif($mode=='update'){
                    $query_user_permit = "update user_permit set value = '$value' where userid = $userid and permitid = $permitid";
                }
                if(!process_non_query_in_db($query_user_permit)){
                    return false;
                }
            }
            return true;
        }
    }
    function get_permit_group($userid,$mode) {
        $query ="select * from permit_group";
        $result= mysql_query($query,$GLOBALS["con"]);
        if($result==false||mysql_num_rows($result)<=0){
            return false;
        }
        else{
            while($row = mysql_fetch_array($result)){
                if(!get_permit_list_of_group($row['id'],$userid,$mode)){
                    return false;
                }
            }
            return true;
        }
    }
    //Update user permit
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
    function check_username_exists($username) {
        $query = "select id from users where username = '$username'";
        $result= mysql_query($query,$GLOBALS["con"]);   
        if(mysql_num_rows($result) > 0){
            return true;
        }
        else{
            return false;
        }
    }
    function check_showname_exists($id,$showname) {
        $query = "select id from users where showname = '$showname' and id <> $id";
        $result= mysql_query($query,$GLOBALS["con"]);   
        if(mysql_num_rows($result) > 0){
            return true;
        }
        else{
            return false;
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
    
    // PROCESS NON QUERY INTO DATABASE
    function process_non_query_in_db($query){
        $result = mysql_query($query,$GLOBALS["con"]);
        if(!$result){
            $GLOBALS["message_return"] = mysql_error();$GLOBALS["message_return"] = str_replace("'",'"',$GLOBALS["message_return"]);
            insert_into_system_log($GLOBALS["userid"],date("YmdHis"),'30','Hệ thống có lỗi khi cập nhật Thành viên. Error: "' . $GLOBALS["message_return"] . '". Query: ' . $query,'',0);
        }
        return $result;
    }
    
    function get_salt_random(){
        $characters = array("a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","A","B","C","D","E","F","G","H","I","J","K","L","M","N","P","Q","R","S","T","U","V","W","X","Y","Z","0","1","2","3","4","5","6","7","8","9");
        $strreturn = '';
        $i = 0;
        while($i < 10) {
            $x = mt_rand(0, count($characters)-1);
            $strreturn = $strreturn . $characters[$x];
            $i = $i + 1;
        }
        return $strreturn;
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
