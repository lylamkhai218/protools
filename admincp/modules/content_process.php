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
    $contentid = 0;$catid = 0;$parentid = 0;$content_group = 0;
    $title = '';$view = 0;$poster = 0;$showinhome = 0;
    $note = 0;$note1 = 0;$note2 = 0;$note3 = 0;$note4 = 0;
    $content_type = 0;$orderingtime = 0;$languageid = 0;$publish_time = 0;
    $userid = 0;$user_type = 0;
    $query_error = '';
    if(checklogin()){
        $array_contentid = explode(',', $list);
        for($i=0;$i<sizeof($array_contentid);$i++){
            $value = trim($array_contentid[$i]);
            if($value!=''&&$value!=0){
                $contentid = $value;
                if(!process()){exit;}
            }
        }
        echo 'Thực hiện thành công';
    }
    else{
        echo "Tài khoản bạn đang đăng nhập không thể thực hiện!";
    }
    function check($username,$password) {
        $username = filter_user_char($username);$password = filter_pass_char($password);
        $query ="select id,type from user where username = '$username' and password = '$password' and type != 0 and status = 1";
        $result= mysql_query($query,$GLOBALS["con"]);
        if($result==false || mysql_num_rows($result)<=0){return false;}
        else{
            $row = mysql_fetch_array($result);
            $GLOBALS['userid'] = $row['id'];$GLOBALS['user_type'] = $row['type'];
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
        $userid = $GLOBALS["userid"];
        if(getinfo($GLOBALS["contentid"])){
            if($GLOBALS["request"] == "republish"){
                $user_permit_require = 13;
                $user_permit_require_name = get_list_colum_of_table_from_db('permit','name','id',$user_permit_require);
                $user_permit_value = get_column_of_table("select value from user_permit where permitid = $user_permit_require and userid = $userid");
                if($user_permit_value == 1){
                    $GLOBALS["publish_time"] = date("YmdHis");
                    $GLOBALS["orderingtime"] = get_max_of_column('content','orderingtime') + 1;
                    republish();
                    insert_into_system_log($GLOBALS["userid"],date("YmdHis"),get_list_colum_of_table_from_db('permit','groupid','id',$user_permit_require),'Tái xuất bản bài viết "' . $GLOBALS["title"] . '"','admincp/#content_add?id='.$GLOBALS["contentid"],1);
                    return true;
                }
                else{
                    echo "Bạn không có quyền " . $user_permit_require_name;
                    return false;
                }
            }
            elseif($GLOBALS["request"] == "publish"){
                $user_permit_require = 13;
                $user_permit_require_name = get_list_colum_of_table_from_db('permit','name','id',$user_permit_require);
                $user_permit_value = get_column_of_table("select value from user_permit where permitid = $user_permit_require and userid = $userid");
                if($user_permit_value == 1){
                    $GLOBALS["publish_time"] = date("YmdHis");
                    $GLOBALS["orderingtime"] = get_max_of_column('content','orderingtime') + 1;
                    publish();
                    insert_into_system_log($GLOBALS["userid"],date("YmdHis"),get_list_colum_of_table_from_db('permit','groupid','id',$user_permit_require),'Xuất bản bài viết "' . $GLOBALS["title"] . '"','admincp/#content_add?id='.$GLOBALS["contentid"],1);
                    return true;
                }
                else{
                    echo "Bạn không có quyền " . $user_permit_require_name;
                    return false;
                }
            }
            elseif($GLOBALS["request"] == "down"){
                $user_permit_require = 14;
                $user_permit_require_name = get_list_colum_of_table_from_db('permit','name','id',$user_permit_require);
                $user_permit_value = get_column_of_table("select value from user_permit where permitid = $user_permit_require and userid = $userid");
                if($user_permit_value==1){
                    down();
                    insert_into_system_log($GLOBALS["userid"],date("YmdHis"),get_list_colum_of_table_from_db('permit','groupid','id',$user_permit_require),'Gỡ bài viết "' . $GLOBALS["title"] . '"','admincp/#content_add?id='.$GLOBALS["contentid"],1);
                    return true;
                }
                else{
                    echo "Bạn không có quyền " . $user_permit_require_name;
                    return false;
                }
            }
            elseif($GLOBALS["request"] == "delete"){
                $user_permit_require = 15;
                $user_permit_require_name = get_list_colum_of_table_from_db('permit','name','id',$user_permit_require);
                $user_permit_value = get_column_of_table("select value from user_permit where permitid = $user_permit_require and userid = $userid");
                if($user_permit_value == 1){
                    delete_content();
                    insert_into_system_log($GLOBALS["userid"],date("YmdHis"),get_list_colum_of_table_from_db('permit','groupid','id',$user_permit_require),'Xóa bài viết "' . $GLOBALS["title"] . '"','',1);
                    return true;
                }
                else{
                    echo "Bạn không có quyền " . $user_permit_require_name;
                    return false;
                }
            }
            elseif($GLOBALS["request"] == "delete_all"){
                $user_permit_require = 15;
                $user_permit_require_name = get_list_colum_of_table_from_db('permit','name','id',$user_permit_require);
                $user_permit_value = get_column_of_table("select value from user_permit where permitid = $user_permit_require and userid = $userid");
                if($user_permit_value == 1){
                    delete_all_image($GLOBALS["contentid"]);
                    delete_content();
                    insert_into_system_log($GLOBALS["userid"],date("YmdHis"),get_list_colum_of_table_from_db('permit','groupid','id',$user_permit_require),'Xóa bài viết "' . $GLOBALS["title"] . '"','',1);
                    return true;
                }
                else{
                    echo "Bạn không có quyền " . $user_permit_require_name;
                    return false;
                }
            }
            elseif($GLOBALS["request"] == "reset"){
                // SECURITY GUARD: Chức năng Reset cơ sở dữ liệu đã bị vô hiệu hóa vĩnh viễn để bảo vệ an toàn dữ liệu T&T Vina.
                echo "Chức năng Reset cơ sở dữ liệu đã bị vô hiệu hóa.";
                return false;
            }
        }
        else{
            
        }
    }
    function get_permit_group($userid) {
        $query ="select * from permit_group";
        $result= mysql_query($query,$GLOBALS["con"]);
        if($result==false||mysql_num_rows($result)<=0){
            return false;
        }
        else{
            while($row = mysql_fetch_array($result)){
                if(!get_permit_list_of_group($row['id'],$userid)){
                    return false;
                }
            }
            return true;
        }
    }
    function get_permit_list_of_group($groupid,$userid) {
        $query ="select * from permit where groupid = $groupid";
        $result = mysql_query($query,$GLOBALS["con"]);
        if($result==false||mysql_num_rows($result)<=0){
            return false;
        }
        else{
            while($row = mysql_fetch_array($result)){
                $permitid = $row['id'];$value = 1;
                $query_user_permit = "insert into user_permit(userid,permitid,value) values('$userid','$permitid','$value')";
                if(!fn_process_query($query_user_permit)){
                    return false;
                }
            }
            return true;
        }
    }
    
    // GET CONTENT FROM DB
    function getinfo($contentid) {
        $query = "select content.catid,content.parentid,content.content_group,content.showinhome,content.view,content.note,content.note1,content.note2,content.note3,content.note4,content.content_type,content.orderingtime,content.languageid
                    ,content_meta.title
                    ,content_process.poster,content_process.published,content_process.publish_time 
                    from content,content_process,content_meta 
                    where content.contentid = content_meta.contentid 
                            and content.contentid = content_process.contentid 
                            and content.contentid = $contentid";
        $result = mysql_query($query,$GLOBALS["con"]);
        if($result==false||mysql_num_rows($result)<=0){
            return false;
        }
        else{
            $row = mysql_fetch_array($result);
            $GLOBALS["catid"] = $row['catid'];
            $GLOBALS["parentid"] = $row['parentid'];
            $GLOBALS["content_group"] = $row['content_group'];
            $GLOBALS["showinhome"] = $row['showinhome'];
            $GLOBALS["view"] = $row['view'];
            $GLOBALS["note"] = $row['note'];
            $GLOBALS["note1"] = $row['note1'];$GLOBALS["note2"] = $row['note2'];
            $GLOBALS["note3"] = $row['note3'];$GLOBALS["note4"] = $row['note4'];
            $GLOBALS["content_type"] = $row['content_type'];
            $GLOBALS["orderingtime"] = $row['orderingtime'];
            $GLOBALS["languageid"] = $row['languageid'];
            $GLOBALS["title"] = $row['title'];
            $GLOBALS["poster"] = $row['poster'];
            $GLOBALS["published"] = $row['published'];$GLOBALS["publish_time"] = $row['publish_time'];
            $GLOBALS["title"] = fn_escapse_string($GLOBALS["title"]);
            return true;
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
    function get_parent_id($id,$table_query){
        $query = "select parentid from $table_query where catid = $id";
        $result = mysql_query($query,$GLOBALS["con"]);
        if($result==false||mysql_num_rows($result)<=0){
            return 0;
        }
        else{
            $row = mysql_fetch_array($result);
            return $row['parentid'];
        }
    }
    // PROCESS NON QUERY INTO DATABASE
    function process_non_query_in_db($query){
        $result = mysql_query($query,$GLOBALS["con"]);
        if(!$result){
            $GLOBALS["message_return"] = mysql_error();$GLOBALS["message_return"] = str_replace("'",'"',$GLOBALS["message_return"]);
            insert_into_system_log($GLOBALS["userid"],date("YmdHis"),'30','Hệ thống có lỗi khi xử lý bài viết. Error: "' . $GLOBALS["message_return"] . '". Query: ' . $query,'','0');
        }
        return $result;
    }
    // PUBLISH
    function publish(){
        if(!publish_content()){
            echo "Hệ thống có lỗi xảy ra. Vui lòng liên hệ hỗ trợ kỹ thuật.";   
        }
    }
    function publish_content(){
        $query1 = "update content set orderingtime = '" . $GLOBALS["orderingtime"] . "' where contentid = " . $GLOBALS["contentid"];
        $query2 = "update content_process set approved = '1',approver = '" . $GLOBALS["userid"] . "',approve_time = '" . $GLOBALS["publish_time"] . "',published = '1',publisher = '" . $GLOBALS["userid"] . "',publish_time = '" . $GLOBALS["publish_time"] . "' where contentid = " . $GLOBALS["contentid"];
        if(process_non_query_in_db($query1)==true&&process_non_query_in_db($query2)==true){
            $query3 = "update user set publish_number = publish_number + 1 where id = " . $GLOBALS["userid"];
            process_non_query_in_db($query3);
            catalog_content_process($GLOBALS["contentid"],$GLOBALS["catid"],1);
            //Insert into content_temp
            insert_into_temp_content();
            if($GLOBALS["note"]==1){
                insert_into_temp_hot();
            }
            sync_status_to_production_catalog($GLOBALS["contentid"], 1);
            return true;
        }
        else{
            return false;
        }
    }
    function catalog_content_process($contentid,$catid,$published){
        if($published==1){
            // Incre news number
            $query1 = "update catalog_info set approve_number = approve_number + 1,publish_number = publish_number + 1 where catid = $catid";
            process_non_query_in_db($query1);
        }
        $parent_insert = get_parent_id($catid,'catalog');
        $i = 0;
        while($parent_insert!=0&&$i<20){
            if($published==1){
                $query1 = "update catalog_info set approve_number = approve_number + 1,publish_number = publish_number + 1 where catid = $parent_insert";
                process_non_query_in_db($query1);
            }
            $parent_insert = get_parent_id($parent_insert,'catalog');
            $i = $i + 1;
        }
        return true;
    }
    function insert_into_temp_content() {
        $query = "insert into content_temp(contentid,catid,parentid,content_group,view,poster,showinhome,note,note1,note2,note3,note4,content_type,orderingtime,languageid) values('" . $GLOBALS["contentid"] . "','" . 
                $GLOBALS["catid"] . "','" . $GLOBALS["parentid"] . "','" . $GLOBALS["content_group"] . "','" . $GLOBALS["view"] . "','" . $GLOBALS["poster"] . "','" . 
                $GLOBALS["showinhome"] . "','" . $GLOBALS["note"] . "','" . $GLOBALS["note1"] . "','" . $GLOBALS["note2"] . "','" . $GLOBALS["note3"] . "','" . $GLOBALS["note4"] . "','" . $GLOBALS["content_type"] . "','" . $GLOBALS["orderingtime"] . "','" . $GLOBALS["languageid"] . "')";
        $result = mysql_query($query,$GLOBALS["con"]); 
        if($result==false){$GLOBALS["query_error"] = mysql_error();$GLOBALS["query_error"]=str_replace("'",'"',$GLOBALS["query_error"]);}
        return $result;
    }
    function insert_into_temp_hot() {
        $query = "insert into content_hot(contentid,catid,parentid,content_group,view,poster,showinhome,note,note1,note2,note3,note4,content_type,orderingtime,languageid) values('" . $GLOBALS["contentid"] . "','" . 
                $GLOBALS["catid"] . "','" . $GLOBALS["parentid"] . "','" . $GLOBALS["content_group"] . "','" . $GLOBALS["view"] . "','" . $GLOBALS["poster"] . "','" . 
                $GLOBALS["showinhome"] . "','" . $GLOBALS["note"] . "','" . $GLOBALS["note1"] . "','" . $GLOBALS["note2"] . "','" . $GLOBALS["note3"] . "','" . $GLOBALS["note4"] . "','" . $GLOBALS["content_type"] . "','" . $GLOBALS["orderingtime"] . "','" . $GLOBALS["languageid"] . "')";
        $result = mysql_query($query,$GLOBALS["con"]); 
        if($result==false){$GLOBALS["query_error"] = mysql_error();$GLOBALS["query_error"]=str_replace("'",'"',$GLOBALS["query_error"]);}
        return $result;
    }
    // REPUBLISH
    function republish(){
        if($GLOBALS["published"]!=1){
            publish();
        }
        else{
            delete_from_temp_content($GLOBALS["contentid"]);
            update_publish_time_content();
            insert_into_temp_content();
            delete_from_temp_hot($GLOBALS["contentid"]);
            if($GLOBALS["note"]==1){
                insert_into_temp_hot();
            }
            sync_status_to_production_catalog($GLOBALS["contentid"], 1);
        }       
    }
    function update_publish_time_content() {
        $query1 = "update content_process set publisher = '" . $GLOBALS["userid"] . "', publish_time = '" . $GLOBALS["publish_time"] . "' where contentid = " . $GLOBALS["contentid"];
        $query2 = "update content set orderingtime = '" . $GLOBALS["orderingtime"] . "' where contentid = " . $GLOBALS["contentid"];
        if(process_non_query_in_db($query1)==true&&process_non_query_in_db($query2)==true){
            return true;
        }
        else{
            return false;
        }
    }
    // DOWN
    function down(){
        if($GLOBALS["published"]==1){
            delete_from_temp_content($GLOBALS["contentid"]);
            delete_from_temp_hot($GLOBALS["contentid"]);
            if(down_content()){
                $query3 = "update user set approve_number = approve_number - 1,publish_number = publish_number - 1 where publish_number > 0 and id = " . $GLOBALS["userid"];
                process_non_query_in_db($query3);
                deincre_catalog_content_process($GLOBALS["contentid"],$GLOBALS["catid"]);
                sync_status_to_production_catalog($GLOBALS["contentid"], 0);
            }
        }
    }
    function deincre_catalog_content_process($contentid,$catid){
        $query1 = "update catalog_info set approve_number = approve_number - 1 where approve_number > 0 and catid = $catid";
        process_non_query_in_db($query1);
        $query1 = "update catalog_info set publish_number = publish_number - 1 where publish_number > 0 and catid = $catid";
        process_non_query_in_db($query1);
        $parent_insert = get_parent_id($catid,'catalog');
        $i = 0;
        while($parent_insert!=0&&$i<20){
            $query1 = "update catalog_info set approve_number = approve_number - 1 where approve_number > 0 and catid = $parent_insert";
            process_non_query_in_db($query1);
            $query1 = "update catalog_info set publish_number = publish_number - 1 where publish_number > 0 and catid = $parent_insert";
            process_non_query_in_db($query1);
            $parent_insert = get_parent_id($parent_insert,'catalog');
            $i = $i + 1;
        }
        return true;
    }
    function down_content() {
        $query = "update content_process set approved = '0',published = '0',remover = '" . $GLOBALS["userid"] . "',remove_time = '" . date("YmdHis") . "' where contentid = " . $GLOBALS["contentid"];
        $result = mysql_query($query,$GLOBALS["con"]);  
        return $result;
    } 
    // DELETE
    function delete_content(){
        sync_status_to_production_catalog($GLOBALS["contentid"], 0);
        if($GLOBALS["published"]==1){
            down();
        }
        delete_from_content($GLOBALS["contentid"]);
        delete_from_content_process($GLOBALS["contentid"]);
        delete_from_content_info($GLOBALS["contentid"]);
        delete_from_content_meta($GLOBALS["contentid"]);
        delete_from_content_body($GLOBALS["contentid"]);
        $query3 = "update user set news_number = news_number - 1 where news_number > 0 and id = " . $GLOBALS["userid"];
        process_non_query_in_db($query3);
        deincre_news_number_of_catalog_content_delete($GLOBALS["contentid"],$GLOBALS["catid"]);
    }
    // DELETE IMAGE
    function delete_all_image($id){
        $body = get_column_of_table("select body from content_body where contentid = $id");
        $image = get_column_of_table("select image from content_meta where contentid = $id");
        if($image!=""){$body=$body.'<img src="'.$image.'">';}
        $hotimage = get_column_of_table("select hotimage from content_meta where contentid = $id");
        if($hotimage!=""){$body=$body.'<img src="'.$hotimage.'">';}
        $image_large = get_column_of_table("select image_large from content_meta where contentid = $id");
        if($image_large!=""){$body=$body.'<img src="'.$image_large.'">';}
        //preg_match_all('/<img[^>]+>/i',$body,$matches); // get all img tag
        preg_match_all('/( src)="([^"]*)"/i',$body,$matches); // get all image link
        //echo $matches[2][0];
        for($i=0;$i<sizeof($matches[2]);$i++){
            $url = $matches[2][$i];
            if(strpos($url,'http://')===false){
                delete_image_on_hdd($url);
            }
            elseif(strpos($url,$GLOBALS["domain"])!==false){
                $url = str_ireplace('http://'.$GLOBALS["domain"],'',$url);
                $url = str_ireplace('http://www.'.$GLOBALS["domain"],'',$url);
                delete_image_on_hdd($url);
            }
        }
    }
    function delete_image_on_hdd($directory_image){
        unlink($GLOBALS["path"] . $directory_image);
    }
    function deincre_news_number_of_catalog_content_delete($contentid,$catid){
        $query1 = "update catalog_info set news_number = news_number - 1 where news_number > 0 and catid = $catid";
        process_non_query_in_db($query1);
        $parent_insert = get_parent_id($catid,'catalog');
        $i = 0;
        while($parent_insert!=0&&$i<20){
            $query1 = "update catalog_info set news_number = news_number - 1 where news_number > 0 and catid = $parent_insert";
            process_non_query_in_db($query1);
            $parent_insert = get_parent_id($parent_insert,'catalog');
            $i = $i + 1;
        }
        $query_delete = "delete from content_catalog where contentid = $contentid";
        process_non_query_in_db($query_delete);
        return true;
    }
    function delete_from_content($contentid) {
        $query = "delete from content where contentid = $contentid";
        $result = mysql_query($query,$GLOBALS["con"]);
        return $result;
    }
    function delete_from_content_process($contentid) {
        $query = "delete from content_process where contentid = $contentid";
        $result = mysql_query($query,$GLOBALS["con"]);
        return $result;
    }
    function delete_from_content_info($contentid) {
        $query = "delete from content_info where contentid = $contentid";
        $result = mysql_query($query,$GLOBALS["con"]);
        return $result;
    }
    function delete_from_content_meta($contentid) {
        $query = "delete from content_meta where contentid = $contentid";
        $result = mysql_query($query,$GLOBALS["con"]);
        return $result;
    }
    function delete_from_content_body($contentid) {
        $query = "delete from content_body where contentid = $contentid";
        $result = mysql_query($query,$GLOBALS["con"]);
        return $result;
    }
    function delete_from_temp_hot($contentid) {
        $query = "delete from content_hot where contentid = $contentid";
        $result = mysql_query($query,$GLOBALS["con"]); 
        return $result;
    }
    function delete_from_temp_content($contentid) {
        $query = "delete from content_temp where contentid = $contentid";
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
