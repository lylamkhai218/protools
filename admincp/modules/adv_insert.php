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
    $system_id = 5;
    $id = trim($_POST["fID"]);
    $title = trim($_POST["fTitle"]);$description = trim($_POST["fDescription"]);$image_list = post_submit_object_process('fImage_list','',false);
    $file_url = trim($_POST["fFile_url"]);
    $typeofopen = 1;
    $width = trim($_POST["fWidth"]);if($width==''){$width=0;}
    $height = trim($_POST["fHeight"]);if($height==''){$height=0;}
    $ordering = $_POST["fOrdering"];if($ordering==''){$ordering=0;}
    $type = trim($_POST["fType"]);
    $target = trim($_POST["fTarget"]);
    $position = trim($_POST["fPosition"]);
    $hyperlink = trim($_POST["fHyperlink"]);
    $catalog_show = trim($_POST["fCatalog_show"]);
    $catalog_show_number = trim($_POST["fCatalog_show_number"]);
    $padding_horizontal_left = trim($_POST["fPadding_horizontal_left"]);
    $padding_horizontal_right = trim($_POST["fPadding_horizontal_right"]);
    $padding_vertical_top = trim($_POST["fPadding_vertical_top"]);
    $padding_vertical_bottom = trim($_POST["fPadding_vertical_bottom"]);
    $showinhome = 0;if($_POST["fShowinhome"]=="on"){$showinhome = 1;}
    $showallpage = 0;if($_POST["fShowallpage"]=="on"){$showallpage = 1;}
    $expire = 0;if($_POST["fExpire"]=="on"){$expire = 1;}
    $expire_time = trim($_POST["fExpire_time"]);
    $expire_time = substr($expire_time,6) . substr($expire_time,3,2) . substr($expire_time,0,2) . '000000';
    $status = 0;if($_POST["fStatus"]=="on"){$status = 1;}
	$languageid = post_submit_object_process('fLanguage',1,true);
    $create_time = date("YmdHis");
    $userid = 0;
	echo 'testing...';
    if($web_mysql_escape_boolean){
        $title = mysql_escape_string($title);
        $description = mysql_escape_string($description);
        $file_url = mysql_escape_string($file_url);
        $hyperlink = mysql_escape_string($hyperlink);
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
            $user_permit_require = 40;
            $user_permit_require_name = get_list_colum_of_table_from_db('permit','name','id',$user_permit_require);
            $user_permit_value = get_column_of_table("select value from user_permit where permitid = $user_permit_require and userid = $userid");
            if($user_permit_value==1){
				if(check_adv_exists($adv_name,$parentid,$languageid)){
                    $message_return = 'Tên đã tồn tại!';
                }
				else{
					$id = get_max_of_column('adv','id') + 1;
					$query_adv = "insert into adv(id,title,description,position,ordering,type,file_url,typeofopen,hyperlink,width,height,padding_vertical_top,padding_vertical_bottom,padding_horizontal_left,padding_horizontal_right,create_time,target,catalog_show,catalog_show_number,showinhome,showallpage,expire,expire_time,status,image_list,languageid) values('$id','$title','$description','$position','$ordering','$type','$file_url','$typeofopen','$hyperlink','$width','$height','$padding_vertical_top','$padding_vertical_bottom','$padding_horizontal_left','$padding_horizontal_right','$create_time','$target','$catalog_show','$catalog_show_number','$showinhome','$showallpage','$expire','$expire_time','$status','$image_list','$languageid')";
					if(process_non_query_in_db($query_adv)){
						adv_catalog_process($id,$catalog_show);
						insert_into_system_log($userid,$create_time,$system_id,'Tạo quảng cáo "' . $title . '" thành công.','admincp/#adv_add?id='.$id,1);
						$message_return = 'Tạo quảng cáo thành công.';
						$status_return = 3;
					}
				}
			}
            else{
                $message_return = 'Bạn không có quyền ' . $user_permit_require_name;
            }
        }
        else{
            $user_permit_require = 41;
            $user_permit_require_name = get_list_colum_of_table_from_db('permit','name','id',$user_permit_require);
            $user_permit_value = get_column_of_table("select value from user_permit where permitid = $user_permit_require and userid = $userid");
            if($user_permit_value==1){
                $query_delete = "delete from adv_catalog where advid = $id";
                process_non_query_in_db($query_delete);
                $query_adv = "update adv set title = '$title',description = '$description',position = '$position',ordering = '$ordering',type = '$type',file_url = '$file_url',typeofopen = '$typeofopen',hyperlink = '$hyperlink',width = '$width',height = '$height',padding_vertical_top = '$padding_vertical_top',padding_vertical_bottom = '$padding_vertical_bottom',padding_horizontal_left = '$padding_horizontal_left',padding_horizontal_right = '$padding_horizontal_right',target = '$target',catalog_show = '$catalog_show',catalog_show_number = '$catalog_show_number',showinhome = '$showinhome',showallpage = '$showallpage',expire = '$expire',expire_time = '$expire_time',status = '$status',image_list = '$image_list',languageid = '$languageid' where id = $id";
                if(process_non_query_in_db($query_adv)){
                    adv_catalog_process($id,$catalog_show);
                    insert_into_system_log($userid,$create_time,$system_id,'Cập nhật quảng cáo "' . $title . '" thành công.','admincp/#adv_add?id='.$id,1);
                    $message_return = 'Cập nhật quảng cáo thành công.';
                    $status_return = 2;
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
    // Process adv_catalog
    function adv_catalog_process($advid,$catalog_show){
        $query_delete_adv_catalog = "delete from adv_catalog where advid = $advid";
        process_non_query_in_db($query_delete_adv_catalog);
        $list = explode(',', $catalog_show);
        for($i=0;$i<sizeof($list);$i++){
            $value = explode('-', trim($list[$i]));
            $catid = trim($value[0]);
            $ordering = trim($value[1]);
            if($catid!=0&&$catid!=""){
                $query_adv_catalog = "insert into adv_catalog(advid,catid,ordering) values('$advid','$catid','$ordering')";
                process_non_query_in_db($query_adv_catalog);
            }
        }
    }
    function check_adv_exists($adv_name,$parentid,$languageid) {
        $query = "select id,title from adv where title = '$adv_name' and languageid = $languageid";
        $result = mysql_query($query,$GLOBALS["con"]);   
        if($result==false||mysql_num_rows($result)<=0){
            return false;
        }
        else{
            while($row = mysql_fetch_array($result)){
                if($adv_name==$row['title']){
                    return true;
                }
            }
            return false;
        }
    }
    // PROCESS NON QUERY INTO DATABASE
    function process_non_query_in_db($query){
        $result = mysql_query($query,$GLOBALS["con"]);
        if(!$result){
            $GLOBALS["message_return"] = mysql_error();$GLOBALS["message_return"] = str_replace("'",'"',$GLOBALS["message_return"]);
            insert_into_system_log($GLOBALS["userid"],date("YmdHis"),'30','Hệ thống có lỗi khi tạo quảng cáo. Error: "' . $GLOBALS["message_return"] . '". Query: ' . $query,'',0);
        }
        return $result;
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
