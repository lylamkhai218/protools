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
    $id = $_POST["fID"];
    $parentid = $_POST["fParentid"];$old_parentid = $_POST["fOld_parentid"];
    $region_parent = $parentid;
    $region_name = trim($_POST["fRegion_name"]);
    $region_alias = get_alias_from_name($region_name);
    $region_description = trim($_POST["fRegion_description"]);
    if($region_description==""){$region_description=$region_name;}
    $meta_title = trim($_POST["fMeta_title"]);
    if($meta_title==""){$meta_title=$region_name;}
    $meta_description = trim($_POST["fMeta_description"]);
    if($meta_description==""){$meta_description=$region_name;}
    $meta_keywords = trim($_POST["fMeta_keywords"]);
    if($meta_keywords==""){$meta_keywords=$region_name;}
    $hyper_link = trim($_POST["fHyper_link"]);
    $languageid = trim($_POST["fLanguage"]);
    $status = 0;if($_POST["fStatus"]=="on"){$status = 1;}
    $image = trim($_POST["fImage"]);$icon = trim($_POST["fIcon"]);
    //info
    $update_time = date("YmdHis");
    //Content config
    $news_limit = $GLOBALS["meta_news_in_catalog"];
    if(isset($_POST["fNews_limit"])){
        $news_limit = trim($_POST["fNews_limit"]);
    }
    $showinhome = 0;
    if(isset($_POST["fShowinhome"])){
        if($_POST["fShowinhome"]=="on"){$showinhome = 1;}
    }
    $orderinghome = 0;
    if(isset($_POST["fOrderinghome"])){$orderinghome = trim($_POST["fOrderinghome"]);}
    $showinmenu = 0;
    if(isset($_POST["fShowinmenu"])){
        if($_POST["fShowinmenu"]=="on"){$showinmenu = 1;}
    }
    $orderingmenu = trim($_POST["fOrderingmenu"]);
    if(isset($_POST["fOrderingmenu"])){$orderingmenu = trim($_POST["fOrderingmenu"]);}
    $showinmenubottom = 0;
    if(isset($_POST["fShowinmenubottom"])){
        if($_POST["fShowinmenubottom"]=="on"){$showinmenubottom = 1;}
    }
    $orderingmenubottom = 0;
    if(isset($_POST["fOrderingmenubottom"])){$orderingmenubottom = trim($_POST["fOrderingmenubottom"]);}
    // Global
    $userid = 0;$permit_name = 0;
    $user_permit_require = 0;
    $create_time = date("YmdHis");$publish_time = 0;
    $message_return = '';
    $status_return = 0;
    $url_return = '';
    //Escape
    if($web_mysql_escape_boolean){
        $region_name = mysql_escape_string($region_name);
        $meta_title = mysql_escape_string($meta_title);$region_description = mysql_escape_string($region_description);
        $meta_description = mysql_escape_string($meta_description);
        $meta_keywords = mysql_escape_string($meta_keywords);
    }
    if(checklogin()){
        if($id==0){
            $user_permit_require = 60;
            $user_permit_require_name = get_list_colum_of_table_from_db('permit','name','id',$user_permit_require);
            $user_permit_value = get_column_of_table("select value from user_permit where permitid = $user_permit_require and userid = $userid");
            if($user_permit_value==1){
                if(check_catalog_exists($region_name,$parentid,$languageid)){
                    $message_return = 'Tên đã tồn tại!';
                }
                else{
                    $id = get_max_of_column('region','id') + 1;
                    $query_region = "insert into region(id,region_parent,region_name,region_alias,region_description,meta_title,meta_description,meta_keywords,hyper_link,showinmenu,orderingmenu,showinhome,orderinghome,showinmenubottom,orderingmenubottom,status,languageid,news_limit,image,icon) values('$id','$region_parent','$region_name','$region_alias','$region_description','$meta_title','$meta_description','$meta_keywords','$hyper_link','$showinmenu','$orderingmenu','$showinhome','$orderinghome','$showinmenubottom','$orderingmenubottom','$status','$languageid','$news_limit','$image','$icon')";
                    $query_region_info = "insert into region_info(id,creator,create_time) values('$id','$userid','$create_time')";
                    if(process_non_query_in_db($query_region)){
                        if(process_non_query_in_db($query_region_info)){
                            insert_into_system_log($userid,$create_time,get_list_colum_of_table_from_db('permit','groupid','id',$user_permit_require),'Tạo mới khu vực: "' . $region_name . '"','admincp/#region_add?id='.$id,1);
                            $message_return = 'Tạo khu vực ' . $region_name . ' thành công.';
                            $status_return = 3;
                        }
                    }
                }
            }
            else{
                $message_return = 'Bạn không có quyền ' . $user_permit_require_name;
            }
        }
        else{
            $user_permit_require = 61;
            $user_permit_require_name = get_list_colum_of_table_from_db('permit','name','id',$user_permit_require);
            $user_permit_value = get_column_of_table("select value from user_permit where permitid = $user_permit_require and userid = $userid");
            if($user_permit_value==1){
                $query_region = "update region set region_parent = '$region_parent',region_name='$region_name',region_alias='$region_alias',region_description='$region_description',meta_title='$meta_title', meta_description='$meta_description',meta_keywords='$meta_keywords',hyper_link='$hyper_link',showinmenu='$showinmenu',orderingmenu='$orderingmenu',showinhome='$showinhome',orderinghome='$orderinghome', showinmenubottom='$showinmenubottom',orderingmenubottom='$orderingmenubottom',status='$status',languageid='$languageid',news_limit='$news_limit',image='$image',icon='$icon' where id = $id";
                $query_region_info = "update region_info set update_time = '$update_time' where id = $id";
                if(process_non_query_in_db($query_region)){
                    if(process_non_query_in_db($query_region_info)){
                        // Region news number process
                        if($parentid!=$old_parentid){
                            //Update content_info
                            $query_content_info = "update content_info set region_parent = $parentid where region_parent = $old_parentid and regionid = $id";
                            process_non_query_in_db($query_content_info);
                            if(process_content_of_regions($id,$parentid,$old_parentid)==false){
                                $message_return = 'Cập nhật khu vực ' . $region_name . ' thành công. <font style="color:#ff0000">Lỗi cập nhật số lượng bài viết!</font>';
                                $status_return = 4;
                            }
                            else{
                                $message_return = 'Cập nhật khu vực ' . $region_name . ' thành công.';
                                $status_return = 4;
                            }
                        }
                        else{
                            $message_return = 'Cập nhật khu vực ' . $region_name . ' thành công.';
                            $status_return = 2;
                        }
                        insert_into_system_log($userid,$create_time,get_list_colum_of_table_from_db('permit','groupid','id',$user_permit_require),'Cập nhật khu vực: "' . $region_name . '"','admincp/#region_add?id='.$id,1);
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
    // GET DATA FROM DB
    function count_column_of_table($query) {
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
    function check_catalog_exists($region_name,$parentid,$languageid) {
        $query = "select id from region where region_name = '$region_name' and languageid = $languageid and region_parent = $parentid";
        $result = mysql_query($query,$GLOBALS["con"]);   
        if(mysql_num_rows($result) > 0){
            return true;
        }
        else{
            return false;
        }
    }
    // PROCESS NON QUERY INTO DATABASE
    function process_non_query_in_db($query){
        $result = mysql_query($query,$GLOBALS["con"]);
        if(!$result){
            $GLOBALS["message_return"] = mysql_error();$GLOBALS["message_return"] = str_replace("'",'"',$GLOBALS["message_return"]);
            insert_into_system_log($GLOBALS["userid"],date("YmdHis"),'30','Hệ thống có lỗi khi cập nhật khu vực. Error: "' . $GLOBALS["message_return"] . '". Query: ' . $query,'',0);
        }
        return $result;
    }
    function update_column_of_table($table,$column,$value,$number,$id){
        $query = "update $table set $column = '$value' where $id = '$number'";
        $result = mysql_query($query,$GLOBALS["con"]);
        return $result;
    }
    
    // Check login
    function check($username,$password) {
        $username = filter_user_char($username);
        $password = filter_pass_char($password);
        $query ="select id,permit_name from user where username = '$username' and password = '$password' and type != 0 and status = 1";
        $result= mysql_query($query,$GLOBALS["con"]);
        if($result==false || mysql_num_rows($result)<=0){return false;}
        else{
            $row = mysql_fetch_array($result);
            $GLOBALS['userid'] = $row['id'];
            $GLOBALS['permit_name'] = $row['permit_name'];
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
    // Process region project
    
    // Process region_content and region project
    function process_content_of_regions($regionid,$parentid,$old_parentid) {
        $query = "select content.contentid,content.content_group from content,content_info where content.contentid = content_info.contentid and content_info.regionid = $regionid";
        $result = mysql_query($query,$GLOBALS["con"]);
        if($result==false){
            return false;
        }
        else{
            if(mysql_num_rows($result)<=0){return true;}
            else{
                $catalog_list = $regionid;
                while($row = mysql_fetch_array($result))
                {
                    $content_group = $row['content_group'];
                    $parent_insert = $parentid;
                    $i = 0;
                    if($content_group==2){ // Project
                        process_non_query_in_db("delete from region_project where projectid = " . $row['contentid']);
                        process_non_query_in_db("insert into region_project(projectid,regionid) values('".$row['contentid']."','$regionid')");
                        while($parent_insert!=0&&$i<=10){
                            if(stripos(','.$catalog_list.',',','.$parent_insert.',')===false){
                                $catalog_list = $catalog_list . ',' . $parent_insert;
                            }
                            process_non_query_in_db("insert into region_project(projectid,regionid) values('".$row['contentid']."','$parent_insert')");
                            $parent_insert = get_column_of_table("select region_parent from region where id = $parent_insert");
                            $i = $i + 1;
                        }
                    }
                    elseif($content_group==3){ //Real
                        process_non_query_in_db("delete from region_content where contentid = ".$row['contentid']);
                        process_non_query_in_db("insert into region_content(contentid,regionid) values('".$row['contentid']."','$regionid')");
                        while($parent_insert!=0&&$i<=10){
                            if(stripos(','.$catalog_list.',',','.$parent_insert.',')===false){
                                $catalog_list = $catalog_list . ',' . $parent_insert;
                            }
                            process_non_query_in_db("insert into region_content(contentid,regionid) values('".$row['contentid']."','$parent_insert')");
                            $parent_insert = get_column_of_table("select region_parent from region where id = $parent_insert");
                            $i = $i + 1;
                        }
                    }
                }
                if(process_news_number_of_regions($catalog_list)==true && process_project_number_of_regions($catalog_list)==true){
                    return true;
                }
                else{
                    return false;
                }
            }
        }
    }
    function process_project_number_of_regions($catalog_list) {
        $query ="select id from region where id in ($catalog_list)";
        $result= mysql_query($query,$GLOBALS["con"]);
        if($result==false||mysql_num_rows($result)<=0){
            return false;
        }
        else{
            while($row = mysql_fetch_array($result))
            {
                $id = $row['id'];
                if(update_column_of_table('region_info','project_number',count_column_of_table("select count(projectid) from region_project where regionid = $id"),$id,'id')==false){
                    return false;
                }
                if(update_column_of_table('region_info','project_publish',count_column_of_table("select count(content_process.contentid) from content_process,region_project where content_process.contentid = region_project.projectid and content_process.published = 1 and region_project.regionid = $id"),$id,'id')==false){
                    return false;
                }
            }
            return true;
        }
    }
    function process_news_number_of_regions($catalog_list) {
        $query ="select id from region where id in ($catalog_list)";
        $result= mysql_query($query,$GLOBALS["con"]);
        if($result==false||mysql_num_rows($result)<=0){
            return false;
        }
        else{
            while($row = mysql_fetch_array($result))
            {
                $id = $row['id'];
                if(update_column_of_table('region_info','news_number',count_column_of_table("select count(contentid) from region_content where regionid = $id"),$id,'id')==false){
                    return false;
                }
                if(update_column_of_table('region_info','approve_number',count_column_of_table("select count(content_process.contentid) from content_process,region_content where content_process.contentid = region_content.contentid and content_process.approved = 1 and region_content.regionid = $id"),$id,'id')==false){
                    return false;
                }
                if(update_column_of_table('region_info','publish_number',count_column_of_table("select count(content_process.contentid) from content_process,region_content where content_process.contentid = region_content.contentid and content_process.published = 1 and region_content.regionid = $id"),$id,'id')==false){
                    return false;
                }
            }
            return true;
        }
    }
    
    function get_alias_from_name($str){
        $str = khongdau($str);
        $str = removeotherchar($str);
        $str = strtolower($str);
        return $str;
    }
    function khongdau($str) {
        $str = preg_replace("/(à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ)/", 'a', $str);
        $str = preg_replace("/(è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ)/", 'e', $str);
        $str = preg_replace("/(ì|í|ị|ỉ|ĩ)/", 'i', $str);
        $str = preg_replace("/(ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ)/", 'o', $str);
        $str = preg_replace("/(ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ)/", 'u', $str);
        $str = preg_replace("/(ỳ|ý|ỵ|ỷ|ỹ)/", 'y', $str);
        $str = preg_replace("/(đ)/", 'd', $str);
        $str = preg_replace("/(À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ)/", 'A', $str);
        $str = preg_replace("/(È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ)/", 'E', $str);
        $str = preg_replace("/(Ì|Í|Ị|Ỉ|Ĩ)/", 'I', $str);
        $str = preg_replace("/(Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ)/", 'O', $str);
        $str = preg_replace("/(Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ)/", 'U', $str);
        $str = preg_replace("/(Ỳ|Ý|Ỵ|Ỷ|Ỹ)/", 'Y', $str);
        $str = preg_replace("/(Đ)/", 'D', $str);                           
        return $str;
    }
    function removeotherchar($strinput){
        $strinput = preg_replace("/[^A-Za-z0-9 -]/","",$strinput);
        $strinput = str_ireplace(" ","-",$strinput);
        while(strpos($strinput,"--")>0){
            $strinput = str_replace("--","-",$strinput);
        }
        return $strinput;
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
