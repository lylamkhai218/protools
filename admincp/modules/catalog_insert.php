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
    $catid = $_POST["fCatid"];
    $parentid = post_submit_object_process('fParentid',0,true);$old_parentid = post_submit_object_process('fOld_parentid',0,true);
    $catalog_name = post_submit_object_process('fCatalog_name','',false);
    $pagetext = post_submit_object_process('fPagetext','',false);if($pagetext==""&&$catid==0){$pagetext=$catalog_name;}
    $catalog_alias = get_alias_from_name($catalog_name);
    $first_name = post_submit_object_process('fFirst_name','',false);
    $last_name = post_submit_object_process('fLast_name','',false);
    $catalog_title = trim($_POST["fCatalog_title"]);if($catalog_title==""){$catalog_title=$catalog_name;}
    $catalog_description = trim($_POST["fCatalog_description"]);
    $meta_description = trim($_POST["fMeta_description"]);if($meta_description==""){$meta_description=substring(strip_tags($catalog_description),230);}
    $meta_keywords = trim($_POST["fMeta_keywords"]);if($meta_keywords==""){$meta_keywords=$catalog_name;}
    $hyper_link = trim($_POST["fHyper_link"]);
    $languageid = post_submit_object_process('fLanguage',1,true);
    $status = 0;if($_POST["fStatus"]=="on"){$status = 1;}
    //catalog_info
    $update_time = date("YmdHis");
    //Content config
    $image = trim($_POST["fImage"]);$image_list = trim($_POST["fImage_list"]);$icon = trim($_POST["fIcon"]);$video_url = trim($_POST["fVideo_url"]);$video_name = trim($_POST["fVideo_name"]);
    $style = 1;
    $style_in_catalog = post_submit_object_process('fStyle_in_catalog',1,true);
    $special = 0;if(isset($_POST["fSpecial"])){if($_POST["fSpecial"]=="on"){$special = 1;}}
    $type = 0;$note = trim($_POST["fNote"]);
    $content_group = trim($_POST["fContent_group"]);
    $news_limit = post_submit_object_process('fNews_limit',$GLOBALS["meta_news_in_catalog"],true);
    $showinhome = 0;if(isset($_POST["fShowinhome"])){if($_POST["fShowinhome"]=="on"){$showinhome = 1;}}
    $orderinghome = 0;if(isset($_POST["fOrderinghome"])){$orderinghome = trim($_POST["fOrderinghome"]);}
    $style_in_home = 1;if(isset($_POST["fStyle_in_home"])){$style_in_home = trim($_POST["fStyle_in_home"]);}
    $showinmenu = 0;if(isset($_POST["fShowinmenu"])){if($_POST["fShowinmenu"]=="on"){$showinmenu = 1;}}
    $orderingmenu = trim($_POST["fOrderingmenu"]);if(isset($_POST["fOrderingmenu"])){$orderingmenu = trim($_POST["fOrderingmenu"]);}
    $showinmenutop = 0;if(isset($_POST["fShowinmenutop"])){if($_POST["fShowinmenutop"]=="on"){$showinmenutop = 1;}}
    $orderingmenutop = 0;if(isset($_POST["fOrderingmenutop"])){$orderingmenutop = trim($_POST["fOrderingmenutop"]);}
    $showinmenuleft = 0;if(isset($_POST["fShowinmenuleft"])){if($_POST["fShowinmenuleft"]=="on"){$showinmenuleft = 1;}}
    $orderingmenuleft = 0;if(isset($_POST["fOrderingmenuleft"])){$orderingmenuleft = trim($_POST["fOrderingmenuleft"]);}
    $showinmenubottom = 0;if(isset($_POST["fShowinmenubottom"])){if($_POST["fShowinmenubottom"]=="on"){$showinmenubottom = 1;}}
    $orderingmenubottom = 0;if(isset($_POST["fOrderingmenubottom"])){$orderingmenubottom = trim($_POST["fOrderingmenubottom"]);}
    $showincontentleft = 0;if(isset($_POST["fShowincontentleft"])){if($_POST["fShowincontentleft"]=="on"){$showincontentleft = 1;}}
    $orderingcontentleft = 0;if(isset($_POST["fOrderingcontentleft"])){$orderingcontentleft = trim($_POST["fOrderingcontentleft"]);}
    $style_in_content_left = 1;if(isset($_POST["fStyle_in_content_left"])){$style_in_content_left = trim($_POST["fStyle_in_content_left"]);}
    $showincontentright = 0;if(isset($_POST["fShowincontentright"])){if($_POST["fShowincontentright"]=="on"){$showincontentright = 1;}}
    $orderingcontentright = 0;if(isset($_POST["fOrderingcontentright"])){$orderingcontentright = trim($_POST["fOrderingcontentright"]);}
    $style_in_content_right = 1;if(isset($_POST["fStyle_in_content_right"])){$style_in_content_right = trim($_POST["fStyle_in_content_right"]);}
    $showinsearch = 0;if(isset($_POST["fShowinsearch"])){if($_POST["fShowinsearch"]=="on"){$showinsearch = 1;}}
    $orderingsearch = 0;if(isset($_POST["fOrderingsearch"])){$orderingsearch = trim($_POST["fOrderingsearch"]);}
    $showinlastest = 0;if(isset($_POST["fShowinlastest"])){if($_POST["fShowinlastest"]=="on"){$showinlastest = 1;}}
    $orderinglastest = 0;if(isset($_POST["fOrderinglastest"])){$orderinglastest = trim($_POST["fOrderinglastest"]);}
    $style_in_lastest = 1;if(isset($_POST["fStyle_in_lastest"])){$style_in_lastest = trim($_POST["fStyle_in_lastest"]);}
    $showincontentbottom = 0;if(isset($_POST["fShowincontentbottom"])){if($_POST["fShowincontentbottom"]=="on"){$showincontentbottom = 1;}}
    $orderingcontentbottom = 1;if(isset($_POST["fOrderingcontentbottom"])){$orderingcontentbottom = trim($_POST["fOrderingcontentbottom"]);}
    
    $ticket_seach_show = 0;if(isset($_POST["ticket_seach_show"])){if($_POST["ticket_seach_show"]=="on"){$ticket_seach_show = 1;}}
    $ticket_seach_ordering = post_submit_object_process('ticket_seach_ordering',0,true);
    $other_name = post_submit_object_process('other_name','',false);
    $region_code = post_submit_object_process('region_code','',false);
    
    $note1 = 0;if(isset($_POST["note1"])){if($_POST["note1"]=="on"){$note1 = 1;}}
    $note2 = 0;if(isset($_POST["note2"])){if($_POST["note2"]=="on"){$note2 = 1;}}
    $note3 = 0;if(isset($_POST["note3"])){if($_POST["note3"]=="on"){$note3 = 1;}}
    $note4 = 0;if(isset($_POST["note4"])){if($_POST["note4"]=="on"){$note4 = 1;}}
    $note5 = 0;if(isset($_POST["note5"])){if($_POST["note5"]=="on"){$note5 = 1;}}
    // OTHER
    $catalog_left = 0;if(isset($_POST["fCatalog_left"])){$catalog_left = trim($_POST["fCatalog_left"]);}
    $catalog_right = 0;if(isset($_POST["fCatalog_right"])){$catalog_right = trim($_POST["fCatalog_right"]);}
    $catalog_center = 0;if(isset($_POST["fCatalog_center"])){$catalog_center = trim($_POST["fCatalog_center"]);}
    // Global
    $userid = 0;$permit_name = 0;
    $user_permit_require = 0;
    $create_time = date("YmdHis");$publish_time = 0;
    $message_return = '';
    $status_return = 0;
    $url_return = '';
    
    $other_name = fn_escapse_string($other_name);
    $region_code = fn_escapse_string($region_code);
    
    //Escape
    if($web_mysql_escape_boolean){
        $catalog_name = mysql_escape_string($catalog_name);$first_name = mysql_escape_string($first_name);$last_name = mysql_escape_string($last_name);
        $catalog_title = mysql_escape_string($catalog_title);$catalog_description = mysql_escape_string($catalog_description);
        $meta_description = mysql_escape_string($meta_description);$meta_keywords = mysql_escape_string($meta_keywords);$pagetext = mysql_escape_string($pagetext);$video_name = mysql_escape_string($video_name);
    }
    if(checklogin()){
        if($catid==0){
            if($catalog_description==""){$catalog_description=$catalog_name;}
            $user_permit_require = 20;
            $user_permit_require_name = get_list_colum_of_table_from_db('permit','name','id',$user_permit_require);
            $user_permit_value = get_column_of_table("select value from user_permit where permitid = $user_permit_require and userid = $userid");
            if($user_permit_value==1){
                if(check_catalog_exists($catalog_name,$parentid,$languageid)){
                    $message_return = 'Tên đã tồn tại!';
                }
                else{
                    $catid = get_max_of_column('catalog','catid') + 1;$contentid = get_max_of_column('content','contentid') + 1;
                    $query_catalog = "insert into catalog(catid,parentid,catalog_name,first_name,last_name,pagetext,catalog_alias,catalog_title,catalog_description,meta_description,meta_keywords,hyper_link,languageid,content_group,contentid,status,other_name,region_code) values('$catid','$parentid','$catalog_name','$first_name','$last_name','$pagetext','$catalog_alias','$catalog_title','$catalog_description','$meta_description','$meta_keywords','$hyper_link','$languageid','$content_group','$contentid','$status','$other_name','$region_code')";
                    $query_config = "insert into catalog_config(catid,image,image_list,video_url,video_name,icon,style,style_in_catalog,special,type,note,news_limit,showinmenu,orderingmenu,showinhome,orderinghome,style_in_home,showinmenutop,orderingmenutop,showinmenuleft,orderingmenuleft,showinmenubottom,orderingmenubottom,showincontentleft,orderingcontentleft,style_in_content_left,showincontentright,orderingcontentright,style_in_content_right,showinsearch,orderingsearch,showinlastest,orderinglastest,style_in_lastest,showincontentbottom,orderingcontentbottom,note1,note2,note3,note4,note5,ticket_seach_show,ticket_seach_ordering) values('$catid','$image','$image_list','$video_url','$video_name','$icon','$style','$style_in_catalog','$special','$type','$note','$news_limit','$showinmenu','$orderingmenu','$showinhome','$orderinghome','$style_in_home','$showinmenutop','$orderingmenutop','$showinmenuleft','$orderingmenuleft','$showinmenubottom','$orderingmenubottom','$showincontentleft','$orderingcontentleft','$style_in_content_left','$showincontentright','$orderingcontentright','$style_in_content_right','$showinsearch','$orderingsearch','$showinlastest','$orderinglastest','$style_in_lastest','$showincontentbottom','$orderingcontentbottom','$note1','$note2','$note3','$note4','$note5','$ticket_seach_show','$ticket_seach_ordering')";
                    $query_info = "insert into catalog_info(catid,creator,create_time) values('$catid','$userid','$create_time')";
                    if(process_non_query_in_db($query_catalog)){
                        if(process_non_query_in_db($query_config)){
                            if(process_non_query_in_db($query_info)){
                                catalog_right_process($catid,$catalog_left,2);
                                catalog_right_process($catid,$catalog_right,3);
                                catalog_right_process($catid,$catalog_center,4);
                                insert_into_system_log($userid,$create_time,get_list_colum_of_table_from_db('permit','groupid','id',$user_permit_require),'Tạo mới chuyên mục: "' . $catalog_name . '"','admincp/#catalog_add?id='.$catid,1);
                                $message_return = 'Tạo chuyên mục <u>' . $catalog_name . '</u> thành công.';
                                $status_return = 10;
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
            $user_permit_require = 21;
            $user_permit_require_name = get_list_colum_of_table_from_db('permit','name','id',$user_permit_require);
            $user_permit_value = get_column_of_table("select value from user_permit where permitid = $user_permit_require and userid = $userid");
            if($user_permit_value==1){
                $query_catalog = "update catalog set parentid = '$parentid',catalog_name = '$catalog_name', catalog_alias = '$catalog_alias', first_name = '$first_name', last_name = '$last_name',pagetext = '$pagetext', catalog_title = '$catalog_title', catalog_description = '$catalog_description', meta_description = '$meta_description', meta_keywords = '$meta_keywords',hyper_link = '$hyper_link',languageid = '$languageid', content_group = '$content_group',status = '$status',other_name='$other_name',region_code='$region_code' where catid = $catid";
                $query_config = "update catalog_config set image = '$image',image_list = '$image_list',video_url='$video_url',video_name='$video_name',icon = '$icon', style = '$style', style_in_catalog = '$style_in_catalog', special = '$special', type = '$type', note = '$note', news_limit = '$news_limit', showinmenu = '$showinmenu', orderingmenu = '$orderingmenu', showinhome = '$showinhome', orderinghome = '$orderinghome', style_in_home = '$style_in_home', showinmenutop = '$showinmenutop', orderingmenutop = '$orderingmenutop', showinmenuleft = '$showinmenuleft', orderingmenuleft = '$orderingmenuleft', orderingcontentleft = '$orderingcontentleft', showinmenubottom = '$showinmenubottom', orderingmenubottom = '$orderingmenubottom', showincontentleft = '$showincontentleft', orderingmenubottom = '$orderingmenubottom', style_in_content_left = '$style_in_content_left', showincontentright = '$showincontentright', orderingcontentright = '$orderingcontentright', style_in_content_right = '$style_in_content_right', showinsearch = '$showinsearch', orderingsearch = '$orderingsearch', showinlastest = '$showinlastest', orderinglastest = '$orderinglastest',style_in_lastest = '$style_in_lastest', showincontentbottom = '$showincontentbottom', orderingcontentbottom = '$orderingcontentbottom', note1 = '$note1', note2 = '$note2', note3 = '$note3', note4 = '$note4', note5 = '$note5',ticket_seach_show = '$ticket_seach_show',ticket_seach_ordering = '$ticket_seach_ordering' where catid = $catid";
                $query_info = "update catalog_info set update_time = '$update_time',last_user_update = '$userid' where catid = $catid";
                if(process_non_query_in_db($query_catalog)){
                    if(process_non_query_in_db($query_config)){
                        if(process_non_query_in_db($query_info)){
                            catalog_right_process($catid,$catalog_left,2);
                            catalog_right_process($catid,$catalog_right,3);
                            catalog_right_process($catid,$catalog_center,4);
                            // Catalog news number process
                            if($parentid!=$old_parentid){
                                //Update content
                                $query_content = "update content set parentid = $parentid where parentid = $old_parentid and catid = $catid";
                                process_non_query_in_db($query_content);
                                //Update content temp
                                $query_content_temp = "update content_temp set parentid = $parentid where parentid = $old_parentid and catid = $catid";
                                process_non_query_in_db($query_content_temp);
                                //Update content hot
                                $query_content_hot = "update content_hot set parentid = $parentid where parentid = $old_parentid and catid = $catid";
                                process_non_query_in_db($query_content_hot);
                                if(process_content_of_catalogs($catid,$parentid,$old_parentid)==false){
                                    $message_return = 'Cập nhật chuyên mục ' . $catalog_name . ' thành công. <font style="color:#ff0000">Lỗi cập nhật số lượng bài viết!</font>';
                                    $status_return = 5;
                                }
                                else{
                                    $message_return = 'Cập nhật chuyên mục <u>' . $catalog_name . '</u> thành công.';
                                    $status_return = 5;
                                }
                            }
                            else{
                                $message_return = 'Cập nhật chuyên mục <u>' . $catalog_name . '</u> thành công.';
                                $status_return = 2;
                            }
                            insert_into_system_log($userid,$create_time,get_list_colum_of_table_from_db('permit','groupid','id',$user_permit_require),'Cập nhật chuyên mục: "' . $catalog_name . '"','admincp/#catalog_add?id='.$catid,1);
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
    // CATALOG RIGHT PROCESS
    function catalog_right_process($catid,$catalog_right,$position){
        $query_delete = "delete from catalog_show where catid = $catid and position = $position";
        process_non_query_in_db($query_delete);
        if(strpos($catalog_right,',')!==false){
            $list = explode(',', $catalog_right);
            for($i=0;$i<sizeof($list);$i++){
                $value = trim($list[$i]);
                if(strpos($value,'-')!==false){
                    $value = explode('-', $value);
                    $id = trim($value[0]);
                    $ordering = trim($value[1]);
                    $style = trim($value[2]);
                    if($id!=''&&$id!='0'){
                        $query = "insert into catalog_show(catid,catalog_show,ordering,style,position) values('$catid','$id','$ordering','$style','$position')";
                        process_non_query_in_db($query);
                    }
                }
            }
        }
    }
    // GET DATA FROM DB
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
    function check_catalog_exists($catalog_name,$parentid,$languageid) {
        $query = "select catid,catalog_name from catalog where catalog_name = '$catalog_name' and languageid = $languageid and parentid = $parentid";
        $result = mysql_query($query,$GLOBALS["con"]);   
        if($result==false||mysql_num_rows($result)<=0){
            return false;
        }
        else{
            while($row = mysql_fetch_array($result)){
                if($catalog_name==$row['catalog_name']){
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
            insert_into_system_log($GLOBALS["userid"],date("YmdHis"),'30','Hệ thống có lỗi khi cập nhật chuyên mục. Error: "' . $GLOBALS["message_return"] . '". Query: ' . $query,'',0);
        }
        return $result;
    }
    function update_column_of_table($table,$column,$value,$number,$id){
        $query = "update $table set $column = '$value' where $id = '$number'";
        $result = mysql_query($query,$GLOBALS["con"]);
        return $result;
    }
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
    function process_content_of_catalogs($catid,$parentid,$old_parentid) {
        //$query = "select content.contentid from content,content_catalog where content.contentid = content_catalog.contentid and content_catalog.catid = $catid";
        $query = "select contentid,catid from content";
        $result = mysql_query($query,$GLOBALS["con"]);
        if($result==false){
            return false;
        }
        else{
            if(mysql_num_rows($result)<=0){return true;}
            else{
                fn_process_query("delete from content_catalog");
                while($row = mysql_fetch_array($result)){
                    $contentid = $row['contentid'];
                    $catid = $row['catid'];
                    fn_process_query("insert into content_catalog(contentid,catid) values('$contentid','$catid')");
                    $parent_insert = fn_get_column_of_table_with_query("select parentid from catalog where catid = $catid",0,0);
                    $i = 0;
                    while($parent_insert!=0&&$i<=20){
                        fn_process_query("insert into content_catalog(contentid,catid) values('$contentid','$parent_insert')");
                        $parent_insert = fn_get_column_of_table_with_query("select parentid from catalog where catid = $parent_insert",0,0);
                        $i += 1;
                    }
                }
                return process_news_number_of_catalogs();
            }
        }
    }
    function process_news_number_of_catalogs() {
        $query = "select catid from catalog"; // Repair all catalog
        $result= mysql_query($query,$GLOBALS["con"]);
        if($result==false||mysql_num_rows($result)<=0){
            return false;
        }
        else{
            while($row = mysql_fetch_array($result))
            {
                $catid = $row['catid'];
                if(update_column_of_table('catalog_info','news_number',count_column_of_table("select count(contentid) from content_catalog where catid = $catid"),$catid,'catid')==false){
                    return false;
                }
                if(update_column_of_table('catalog_info','approve_number',count_column_of_table("select count(content_process.contentid) from content_process,content_catalog where content_process.contentid = content_catalog.contentid and content_process.approved = 1 and content_catalog.catid = $catid"),$catid,'catid')==false){
                    return false;
                }
                if(update_column_of_table('catalog_info','publish_number',count_column_of_table("select count(content_process.contentid) from content_process,content_catalog where content_process.contentid = content_catalog.contentid and content_process.published = 1 and content_catalog.catid = $catid"),$catid,'catid')==false){
                    return false;
                }
            }
            return true;
        }
    }
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
    function get_parentid_of_catalog($catid) {
        $query ="select parentid from catalog where catid = $catid";
        $result= mysql_query($query,$GLOBALS["con"]);
        if($result==false||mysql_num_rows($result)<=0){
            return 0;
        }
        else{
            $row = mysql_fetch_array($result);
            return $row['parentid'];
        }
    }
    function insert_content_into_catalog_content($contentid,$catid){
        $query = "insert into content_catalog(contentid,catid) values('$contentid','$catid')";
        $result = mysql_query($query,$GLOBALS["con"]);
        if(!$result){
            $GLOBALS["message_return"] = mysql_error();$GLOBALS["message_return"] = str_replace("'",'"',$GLOBALS["message_return"]);
            insert_into_system_log($GLOBALS["userid"],date("YmdHis"),'30','Hệ thống có lỗi khi cập nhật chuyên mục. Error: "' . $GLOBALS["message_return"] . '". Query: ' . $query,'',0);
        }
        return $result;
    }
    function delete_content_from_catalog_content($contentid){
        $query = "delete from content_catalog where contentid = $contentid";
        $result = mysql_query($query,$GLOBALS["con"]);
        if(!$result){
            $GLOBALS["message_return"] = mysql_error();$GLOBALS["message_return"] = str_replace("'",'"',$GLOBALS["message_return"]);
            insert_into_system_log($GLOBALS["userid"],date("YmdHis"),'30','Hệ thống có lỗi khi cập nhật chuyên mục. Error: "' . $GLOBALS["message_return"] . '". Query: ' . $query,'',0);
        }
        return $result;
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
