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
    $title = post_submit_object_process('fTitle','',false);
    $description = post_submit_object_process('fDescription','',false);
    $keywords = post_submit_object_process('fKeywords','',false);
    $keyword_tags = post_submit_object_process('fKeyword_tags','',false);
    $hotnews = post_submit_object_process('fHotnews',0,true);
	$news_in_catalog = post_submit_object_process('fNews_in_catalog',0,true);
	$column_home = post_submit_object_process('fColumn_home',0,true);
	$num_catalog_home = post_submit_object_process('fNum_catalog_home',0,true);
    $icon = post_submit_object_process('fIcon','',false);
    $background = post_submit_object_process('fBackground','',false);
    $background_color = post_submit_object_process('fBackground_color','',false);
    $background_left = post_submit_object_process('fBackground_left','',false);
    $background_top = post_submit_object_process('fBackground_top','',false);
    $background_repeat = post_submit_object_process('fBackground_repeat','',false);
    $background_attachment = post_submit_object_process('fBackground_attachment','',false);
    $contact = post_submit_object_process('fContact','',false);
    $logo = post_submit_object_process('fLogo','',false);$logo_bottom = post_submit_object_process('fLogo_bottom','',false);
    $address = post_submit_object_process('fAddress','',false);
    $hotline = post_submit_object_process('fHotline','',false);
    $email_sender = post_submit_object_process('fEmail_sender','',false);$email_sender_pass = post_submit_object_process('fEmail_sender_pass','',false);
    $send_email_type = 0;if(isset($_POST["fSend_email_type"])){if($_POST["fSend_email_type"]=="on"){$send_email_type=1;}}
    $email_booking = post_submit_object_process('fEmail_booking','',false);
    $slogan = post_submit_object_process('fSlogan','',false);
    $copyright = post_submit_object_process('fCopyright','',false);
    $facebook_url = post_submit_object_process('fFacebook_url','',false);$twitter_url = post_submit_object_process('fTwitter_url','',false);
    $youtube_url = post_submit_object_process('fYoutube_url','',false);$googleplus_url = post_submit_object_process('fGoogleplus_url','',false);
    $footer = post_submit_object_process('fFooter','',false);
    $map = post_submit_object_process('fMap','',false);$help1 = post_submit_object_process('fHelp1','',false);$help2 = post_submit_object_process('fHelp2','',false);$money_type = post_submit_object_process('fMoney_type','',false);
    $counter_code = post_submit_object_process('fCounter_code','',false);
    $newsnumberinright = post_submit_object_process('fNewsNumberInRight',6,true);$productnumberinright = post_submit_object_process('fProductNumberInRight',6,true);
    $languageid = post_submit_object_process('fLanguage',1,true);$roe = post_submit_object_process('fRoe',0,true);
    $salt = '';
    $encode_password = encode_password($email_sender_pass);
    if(strpos($encode_password,'<salt>')!==false){
        $email_sender_pass = substr($encode_password,0,strpos($encode_password,'<salt>'));
        $salt = substr($encode_password,strpos($encode_password,'<salt>')+6);
        $salt = substr($salt,0,strpos($salt,'</salt>'));
    }
    $update_time = date("YmdHis");
    $userid = 0;
    $message_return = '';
    $status_return = 0;
    $url_return = '';
    function get_salt_random($len){
        $characters = array("0","1","2","3","4","5","6","7","8","9");
        $strreturn = '';
        $i = 0;
        while($i < $len + 1) {
            $x = mt_rand(0, count($characters)-1);
            $strreturn = $strreturn . $characters[$x];
            $i = $i + 1;
        }
        return $strreturn;
    }
    
    $title = fn_escapse_string($title);$description = fn_escapse_string($description);$keywords = fn_escapse_string($keywords);$keyword_tags = fn_escapse_string($keyword_tags);
    $contact = fn_escapse_string($contact);$address = fn_escapse_string($address);$slogan = fn_escapse_string($slogan);$footer = fn_escapse_string($footer);
    $map = fn_escapse_string($map);$help1 = fn_escapse_string($help1);$help2 = fn_escapse_string($help2);$counter_code = fn_escapse_string($counter_code);
    $facebook_url = fn_escapse_string($facebook_url);$twitter_url = fn_escapse_string($twitter_url);$youtube_url = fn_escapse_string($youtube_url);$googleplus_url = fn_escapse_string($googleplus_url);
    $copyright = fn_escapse_string($copyright);
    
    if(checklogin()){
        $user_permit_require = 50;
        $user_permit_require_name = get_list_colum_of_table_from_db('permit','name','id',$user_permit_require);
        $user_permit_value = get_column_of_table("select value from user_permit where permitid = $user_permit_require and userid = $userid");
        if($user_permit_value==1){
            $query_config = "update website_config set hotnews = '$hotnews',news_in_catalog = '$news_in_catalog',icon = '$icon',logo = '$logo',logo_bottom = '$logo_bottom',slogan = '$slogan',copyright = '$copyright',background = '$background',background_color = '$background_color',background_left = '$background_left',background_top = '$background_top',background_repeat = '$background_repeat',background_attachment = '$background_attachment',footer = '$footer',map = '$map',help1 = '$help1',help2 = '$help2',money_type = '$money_type',counter_code='$counter_code',newsnumberinright = '$newsnumberinright',productnumberinright = '$productnumberinright',facebook_url='$facebook_url',twitter_url='$twitter_url',youtube_url='$youtube_url',googleplus_url='$googleplus_url',roe = '$roe',update_time = '$update_time',column_home = '$column_home',num_catalog_home = '$num_catalog_home'";
            $query_seo = "update website_seo set title = '$title',description = '$description',keywords = '$keywords',keyword_tags = '$keyword_tags'";
            $query_contact = "update website_contact set contact = '$contact',address = '$address'";
            
            if($GLOBALS["meta_multi_language"]==1){
                $query_config .= " where id = $id";
                $query_seo .= " where id = $id";
                $query_contact .= " where id = $id";
            }
            
            
            if(process_non_query_in_db($query_config)==true && process_non_query_in_db($query_seo)==true && process_non_query_in_db($query_contact)==true){
                /*
                for($i=1;$i<=4;$i++){
                    support_list_process($contact_array[$i],$userid,$i);
                }
                */
                insert_into_system_log($userid,$create_time,get_list_colum_of_table_from_db('permit','groupid','id',$user_permit_require),'Cập nhật thành công Cấu hình chung.','admincp/#config',1);
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
                    else{
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
            insert_into_system_log($GLOBALS["userid"],date("YmdHis"),'30','Hệ thống có lỗi khi cập nhật Cấu hình chung. Error: "' . $GLOBALS["message_return"] . '". Query: ' . $query,'',0);
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
