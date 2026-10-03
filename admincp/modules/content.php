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
    // Content_variable
    $number_auto_published = 0;
    $number_auto_published_view = 0;
    $number_auto_published_search = 0;
    $number_user_published = 0;
    $number_user_published_view = 0;
    $number_user_published_search = 0;
    $number_view_summary = 0;
    $number_search_summary = 0;
    $number_google_index = 0;$cookie_list_column_name = 'content_list_column';
    $catid = 'all';
    $mode = "all";
    $languageid = 1;
    $GLOBALS["sort_by"] = 'time_desc';
    if(isset($_GET["sort_by"]) && ($_GET["sort_by"]=="time_asc" || $_GET["sort_by"]=="time_desc")){
        $GLOBALS["sort_by"] = $_GET["sort_by"];
    } elseif(isset($_COOKIE["product_sort_time"]) && ($_COOKIE["product_sort_time"]=="time_asc" || $_COOKIE["product_sort_time"]=="time_desc")){
        $GLOBALS["sort_by"] = $_COOKIE["product_sort_time"];
    }
    $GLOBALS["sort_dir"] = ($GLOBALS["sort_by"] == 'time_asc') ? 'ASC' : 'DESC';
    $sort_by = $GLOBALS["sort_by"];
    $sort_dir = $GLOBALS["sort_dir"];

    $ajax = 0;
    if(isset($_GET["ajax"])){
        $ajax = $_GET["ajax"];
    }
    $search_text = '';
    if(isset($_GET["search_text"])){
        $search_text = strip_tags(trim($_GET["search_text"]));
    }
    $page = 1;
    if(isset($_GET["page"]) && is_numeric($_GET["page"]) && intval($_GET["page"]) > 0){
        $page = intval($_GET["page"]);
    }
    $GLOBALS["page"] = $page;
    $number_limit = 20;
    if(isset($_GET["limit"]) && is_numeric($_GET["limit"]) && intval($_GET["limit"]) > 0){
        $number_limit = intval($_GET["limit"]);
    } elseif(isset($_COOKIE["number_limit"]) && is_numeric($_COOKIE["number_limit"]) && intval($_COOKIE["number_limit"]) > 0){
        $number_limit = intval($_COOKIE["number_limit"]);
    }
    $GLOBALS["number_limit"] = $number_limit;
    $mode_name = 'bài viết';
    $table_query = 'content';
    $table_group_query = 'content,content_process';
    $hyper_tag = 'content';
    $select_field = 'content.contentid';
    $query_main = "select $select_field from ";
    $index_id = 'contentid';
    $query_count_condition = "select count($table_query.$index_id) from ";
    $query_count_summary = "select count($index_id) from ";
    $query_condition = ' where content.contentid = content_process.contentid';
    if(isset($_GET["search_text"])){
        $search_text = strip_tags(trim($_GET["search_text"]));
        if($search_text!=""&&$search_text!="tìm kiếm"&&$search_text!="Tìm kiếm"){
            $table_group_query = 'content,content_process,content_meta';
            $query_condition = ' where content.contentid = content_process.contentid and content.contentid = content_meta.contentid';
            $search_escaped = function_exists('filter_sql_inject') ? filter_sql_inject($search_text) : addslashes($search_text);
            $query_condition = $query_condition . " and content_meta.title like '%$search_escaped%'";
        }
    }
    $GLOBALS["search_text"] = htmlspecialchars($search_text, ENT_QUOTES, 'UTF-8');
    if(isset($_GET["mode"])){
        $mode = $_GET["mode"];
        if($mode=="published"){
            $query_condition = $query_condition . " and published = 1";
        }
        elseif($mode=="unpublished"){
            $query_condition = $query_condition . " and published = 0";
        }
        elseif($mode=="newproduct"){
            $query_condition = $query_condition . " and note1 = 1";
        }
        elseif($mode=="deal"){
            $query_condition = $query_condition . " and note2 = 1";
        }
        elseif($mode=="todaysale"){
            $query_condition = $query_condition . " and note2 = 1";
        }
        elseif($mode=="bestseller"){
            $query_condition = $query_condition . " and note3 = 1";
        }
        elseif($mode=="highlightnews"){
            $query_condition = $query_condition . " and content_type = 1 and content_group = 1";
        }
        elseif($mode=="hotnews"){
            $query_condition = $query_condition . " and note = 1";
        }
    }
    if(isset($_GET["catid"])){
        if($_GET["catid"] === 'all'){
            $catid = 'all';
        } else {
            $catid = intval($_GET["catid"]);
            $query_condition = $query_condition . " and content.contentid = content_catalog.contentid and content_catalog.catid = $catid";
            $table_group_query = $table_group_query . ',content_catalog';
        }
    }
    $GLOBALS["catid"] = $catid;
    $mn_menu = 'mn_'.$hyper_tag;
    if(isset($_GET["mn"])){
        $mn_menu = preg_replace('/[^a-zA-Z0-9_\-]/', '', $_GET["mn"]);
    }
    $GLOBALS["mn_menu"] = $mn_menu;
    $content_group = 6;
    if(isset($_GET["content_group"]) && is_numeric($_GET["content_group"])){
        $content_group = intval($_GET["content_group"]);
    }
    if($content_group!=0){
        $query_condition = $query_condition . " and content_group = $content_group";
    }
    $GLOBALS["content_group"] = $content_group;
    if($content_group==2 || $content_group==6){$cookie_list_column_name='product_list_column';}
    if(isset($_GET["languageid"])){
        $languageid = $_GET["languageid"];
    }
    $query_condition = $query_condition . " and languageid = $languageid";
    $userid = get_column_of_table("select id from user where username = '".$_COOKIE[$GLOBALS['rootuser']]."'");
    if($userid==0){exit;}
    $view_another_content_permit = 16;
    $view_another_content_permit_name = get_list_colum_of_table_from_db('permit','name','id',$view_another_content_permit);
    $view_another_content_permit_value = get_column_of_table("select value from user_permit where permitid = $view_another_content_permit and userid = $userid");
    if($view_another_content_permit_value!=1){
        $query_condition = $query_condition . " and content.poster = $userid";
    }
    $number_result = 0;
    $from_number = 0;
    $to_number = 0;
    $offset = $number_limit * ($page-1);
    $from_number = $offset + 1;
    $to_number = $offset;
    $summary_result = 0;
    $query_main = $query_main . $table_group_query . $query_condition . " order by content_process.post_time " . $GLOBALS["sort_dir"] . ", $table_query.$index_id " . $GLOBALS["sort_dir"] . " limit " . $GLOBALS["number_limit"] . " offset " . $offset;
    $query_count_condition = $query_count_condition . $table_group_query . $query_condition;
    $query_count_summary = $query_count_summary . $table_query;
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
    function get_list_contentid($query){
        $result = mysql_query($query,$GLOBALS["con"]);
        if($result==false){echo $query;
            $GLOBALS["from_number"] = 0;$GLOBALS["to_number"] = 0;
            return 0;
        }
        elseif(mysql_num_rows($result)==0){
            $GLOBALS["from_number"] = 0;$GLOBALS["to_number"] = 0;
        }
        else{
            $strreturn = '0';
            $GLOBALS["number_result"] = mysql_num_rows($result);
            while($row = mysql_fetch_array($result)){
                $strreturn = $strreturn . ',' . $row['contentid'];
                $GLOBALS["to_number"] = $GLOBALS["to_number"] + 1;
            }  
            return $strreturn;
        }
    }
    function count_content_in_db($query){
        $result = mysql_query($query,$GLOBALS["con"]);
        if($result==0){
            return 0;
        }
        else{
            $row = mysql_fetch_array($result);
            return $row[0];
        }
    }
    function process_status($status){
        $str_return = '&nbsp;';
        switch($status){
            case 0:
                $str_return = '<img src="' . $GLOBALS["base_folder"] . 'admincp/media/red.png" />';
                break;
            case 1:
                $str_return = '<img src="' . $GLOBALS["base_folder"] . 'admincp/media/green.png" />';
                break;
        }
        return $str_return;
    }
    function process_showinmenu($status){
        $str_return = '&nbsp;';
        switch($status){
            case 0:
                $str_return = '&nbsp;';
                break;
            case 1:
                $str_return = '<img src="' . $GLOBALS["base_folder"] . 'admincp/media/select.png" />';
                break;
        }
        return $str_return;
    }
    function process_published($input){
        $str_return = '&nbsp;';
        switch($input){
            case 0:
                $str_return = '<img src="' . $GLOBALS["base_folder"] . 'admincp/media/unpublished.png" />';
                break;
            case 1:
                $str_return = '<img src="' . $GLOBALS["base_folder"] . 'admincp/media/published.png" />';
                break;
        }
        return $str_return;
    }   
    function ajax_function_process($page,$limit,$mode,$other){
        return 'ajax_load_content(\'' . $GLOBALS["hyper_tag"] . '\',' . $page . ',' . $limit . ',\'' . $mode . '\',\'' . $other . '\');';
    }
    function check_active_of_mode_menu($input,$check){
        if($input==$check){
            return ' class="active"';
        }
        else{
            return '';
        }
    }
    function process_href_of_a_tag($hyper_tag,$ajax,$page,$limit,$mode,$other){
        $strreturn = '#' . $hyper_tag . '?ajax=0';
        if($page!=''){
            $strreturn = $strreturn . '&page=' . $page;
        }
        if($limit!=''){
            $strreturn = $strreturn . '&limit=' . $limit;
        }
        if($mode!=''){
            $strreturn = $strreturn . '&mode=' . $mode;
        }
        $strreturn = $strreturn . $other;
        return $strreturn;
    }
    function show_header_of_content(){
        if($GLOBALS["ajax"]==0){
            include($_SERVER['DOCUMENT_ROOT'] . $GLOBALS["base_folder"] . "admincp/modules/content_left.php");
            echo '<div id="content_right"><div class="content">';
            if(isset($GLOBALS["home_access"])){
                include("home_counter.php");
                include("home_admin_message.php");
            }
            echo '<div class="listnews">
                        <div class="menu" id="tab_mode_menu">
                            <ul>
                                <li' . check_active_of_mode_menu($GLOBALS["mode"],'all') . ' mode="all&content_group='.$GLOBALS["content_group"] .'" name="' . $GLOBALS["hyper_tag"] . '"><a href="'.process_href_of_a_tag($GLOBALS["hyper_tag"],1,1,$GLOBALS["limit"],'all&content_group='.$GLOBALS["content_group"],'').'">Tất cả</a></li>
                                <li' . check_active_of_mode_menu($GLOBALS["mode"],'published') . ' mode="published&content_group='.$GLOBALS["content_group"] .'" name="' . $GLOBALS["hyper_tag"] . '"><a href="'.process_href_of_a_tag($GLOBALS["hyper_tag"],1,1,$GLOBALS["limit"],'published&content_group='.$GLOBALS["content_group"],'').'">Đã xuất bản</a></li>
                                <li' . check_active_of_mode_menu($GLOBALS["mode"],'unpublished') . ' mode="unpublished&content_group='.$GLOBALS["content_group"] .'" name="' . $GLOBALS["hyper_tag"] . '"><a href="'.process_href_of_a_tag($GLOBALS["hyper_tag"],1,1,$GLOBALS["limit"],'unpublished&content_group='.$GLOBALS["content_group"],'').'">Chưa xuất bản</a></li>';
                                if($GLOBALS["content_group"]==2){
                                    echo '<li' . check_active_of_mode_menu($GLOBALS["mode"],'newproduct') . ' mode="newproduct&content_group='.$GLOBALS["content_group"] .'" name="' . $GLOBALS["hyper_tag"] . '"><a href="'.process_href_of_a_tag($GLOBALS["hyper_tag"],1,1,$GLOBALS["limit"],'newproduct&content_group='.$GLOBALS["content_group"],'').'">Dự án mới</a></li>
                                        <li' . check_active_of_mode_menu($GLOBALS["mode"],'newproduct') . ' mode="bestseller&content_group='.$GLOBALS["content_group"] .'" name="' . $GLOBALS["hyper_tag"] . '"><a href="'.process_href_of_a_tag($GLOBALS["hyper_tag"],1,1,$GLOBALS["limit"],'bestseller&content_group='.$GLOBALS["content_group"],'').'">Dự án tiêu biểu</a></li>
                                        <li style="display:none;"' . check_active_of_mode_menu($GLOBALS["mode"],'deal') . ' mode="deal&content_group='.$GLOBALS["content_group"] .'" name="' . $GLOBALS["hyper_tag"] . '"><a href="'.process_href_of_a_tag($GLOBALS["hyper_tag"],1,1,$GLOBALS["limit"],'deal&content_group='.$GLOBALS["content_group"],'').'">Vé khuyến mại</a></li>
                                        <li style="display:none;"' . check_active_of_mode_menu($GLOBALS["mode"],'todaysale') . ' mode="todaysale&content_group='.$GLOBALS["content_group"] .'" name="' . $GLOBALS["hyper_tag"] . '"><a href="'.process_href_of_a_tag($GLOBALS["hyper_tag"],1,1,$GLOBALS["limit"],'todaysale&content_group='.$GLOBALS["content_group"],'').'">Giá sốc trong ngày</a></li>';
                                }
                                elseif($GLOBALS["content_group"]==1){
                                    echo '<li' . check_active_of_mode_menu($GLOBALS["mode"],'highlightnews') . ' mode="highlightnews&content_group='.$GLOBALS["content_group"] .'" name="' . $GLOBALS["hyper_tag"] . '"><a href="'.process_href_of_a_tag($GLOBALS["hyper_tag"],1,1,$GLOBALS["limit"],'highlightnews&content_group='.$GLOBALS["content_group"],'').'">Tin nổi bật</a></li>';
                                    echo '<li' . check_active_of_mode_menu($GLOBALS["mode"],'hotnews') . ' mode="hotnews&content_group='.$GLOBALS["content_group"] .'" name="' . $GLOBALS["hyper_tag"] . '"><a href="'.process_href_of_a_tag($GLOBALS["hyper_tag"],1,1,$GLOBALS["limit"],'hotnews&content_group='.$GLOBALS["content_group"],'').'">Tin Hot</a></li>';
                                }
                            echo '</ul>
                        </div>
                        <div id="admin_content_list">';
        }
    }
    function show_bottom_of_content(){
        if($GLOBALS["ajax"]==0){
            echo '</div></div></div></div>';
            include($_SERVER['DOCUMENT_ROOT'] . $GLOBALS["base_folder"] . "admincp/modules/other_info.php");
            echo '</div>';
        }
    }
    function show_function_bar(){
        echo '<div class="function">';
        echo '<div class="col4"><ul class="root"><li>';
        if($GLOBALS["content_group"]==2){
            echo '<a class="add" onclick="main_menu_click(\'' . $GLOBALS["hyper_tag"] . '_add?id=0&content_group=2&mn=mn_product\',\'' . $GLOBALS["mn_menu"] . '\',\'#admin_content\',\'' . $GLOBALS["hyper_tag"] . '_add.php?id=0&content_group=2&mn=mn_product\',\'\');"><span>Tạo dự án mới</span></a>';
        }
        elseif($GLOBALS["content_group"]==6){
            echo '<a class="add" onclick="main_menu_click(\'' . $GLOBALS["hyper_tag"] . '_add?id=0&content_group=6&mn=mn_room\',\'' . $GLOBALS["mn_menu"] . '\',\'#admin_content\',\'' . $GLOBALS["hyper_tag"] . '_add.php?id=0&content_group=6&mn=mn_room\',\'\');"><span>Tạo sản phẩm mới</span></a>';
        }
        elseif($GLOBALS["content_group"]==4){
            echo '<a class="add" onclick="main_menu_click(\'' . $GLOBALS["hyper_tag"] . '_add?id=0&content_group=4&mn=mn_tour\',\'' . $GLOBALS["mn_menu"] . '\',\'#admin_content\',\'' . $GLOBALS["hyper_tag"] . '_add.php?id=0&content_group=4&mn=mn_tour\',\'\');"><span>Tạo sơ đồ căn hộ mới</span></a>';
        }
        else{
            echo '<a class="add" onclick="main_menu_click(\'' . $GLOBALS["hyper_tag"] . '_add?id=0&content_group=1&mn=mn_content\',\'' . $GLOBALS["mn_menu"] . '\',\'#admin_content\',\'' . $GLOBALS["hyper_tag"] . '_add.php?id=0&content_group=1&mn=mn_content\',\'\');"><span>Tạo mới bài viết</span></a>';
        }
        
        echo '</li></ul></div>';
        echo '<div class="col4">
                <ul class="root">
                    <li>
                        <a><span class="have_sub">Thay đổi trạng thái</span></a>
                        <ul id="change_status_of_content" page="' . $GLOBALS["page"] . '" number_limit="' . $GLOBALS["number_limit"] . '" mode="' . $GLOBALS["mode"] . '" content_group="' . $GLOBALS["content_group"] . '" catid="' . $GLOBALS["catid"] . '&search_text=' . $GLOBALS["search_text"] . '&mn=' . $GLOBALS["mn_menu"] . '" style="width:120px;">
                            <li function="' . $GLOBALS["hyper_tag"] . '" process="_process" request="&rq=publish"><a class="publish">Xuất bản</a></li>
                            <li function="' . $GLOBALS["hyper_tag"] . '" process="_process" request="&rq=republish"><a class="republish">Tái xuất bản</a></li>
                            <li function="' . $GLOBALS["hyper_tag"] . '" process="_process" request="&rq=down"><a class="down">Gỡ</a></li>
                            <li function="' . $GLOBALS["hyper_tag"] . '" process="_process" request="&rq=delete"><a class="delete">Xoá</a></li>
                            <li function="' . $GLOBALS["hyper_tag"] . '" process="_process" request="&rq=delete_all"><a class="delete">Xoá (Bao gồm ảnh)</a></li>
                        </ul>
                    </li>
                </ul>
              </div>';
        $column = ','.$_COOKIE[$GLOBALS["cookie_list_column_name"]] . ',';
        echo '<div class="col4">
                <ul class="root">
                    <li>
                        <a><span class="have_sub">Hiển thị cột</span></a>
                        <ul id="change_column_of_list" page="' . $GLOBALS["page"] . '" number_limit="' . $GLOBALS["number_limit"] . '" mode="' . $GLOBALS["mode"] . '" product_group="' . $GLOBALS["product_group"] . '" catid="' . $GLOBALS["catid"] . '&search_text=' . $GLOBALS["search_text"] . '" cookie_name="'.$GLOBALS["cookie_list_column_name"].'" style="width:110px;">';
                        if($GLOBALS["content_group"]==2 || $GLOBALS["content_group"]==6){
                            echo '<li><a class="'.show_value_by_compare2(strpos($column,',0,'),false,'tick','tick_active').'">Chọn</a></li>
                                <li><a class="'.show_value_by_compare2(strpos($column,',1,'),false,'tick','tick_active').'">Tình trạng</a></li>
                                <li><a class="'.show_value_by_compare2(strpos($column,',2,'),false,'tick','tick_active').'">ID</a></li>
                                <li><a class="'.show_value_by_compare2(strpos($column,',3,'),false,'tick','tick_active').'">Ảnh đại diện</a></li>
                                <li><a class="'.show_value_by_compare2(strpos($column,',4,'),false,'tick','tick_active').'">Tên sản phẩm</a></li>
                                <li><a class="'.show_value_by_compare2(strpos($column,',5,'),false,'tick','tick_active').'">Chuyên mục</a></li>
                                <li><a class="'.show_value_by_compare2(strpos($column,',6,'),false,'tick','tick_active').'">Giá</a></li>
                                <li><a class="'.show_value_by_compare2(strpos($column,',7,'),false,'tick','tick_active').'">Số lượng đọc</a></li>
                                <li><a class="'.show_value_by_compare2(strpos($column,',8,'),false,'tick','tick_active').'">Thời gian tạo</a></li>
                                <li><a class="'.show_value_by_compare2(strpos($column,',9,'),false,'tick','tick_active').'">Google Indexed</a></li>
                                <li><a class="'.show_value_by_compare2(strpos($column,',10,'),false,'tick','tick_active').'">Time Indexed</a></li>';
                        }
                        else{
                            echo '<li><a class="'.show_value_by_compare2(strpos($column,',0,'),false,'tick','tick_active').'">Chọn</a></li>
                                <li><a class="'.show_value_by_compare2(strpos($column,',1,'),false,'tick','tick_active').'">Tình trạng</a></li>
                                <li><a class="'.show_value_by_compare2(strpos($column,',2,'),false,'tick','tick_active').'">ID</a></li>
                                <li><a class="'.show_value_by_compare2(strpos($column,',3,'),false,'tick','tick_active').'">Ảnh đại diện</a></li>
                                <li><a class="'.show_value_by_compare2(strpos($column,',4,'),false,'tick','tick_active').'">Tiêu đề</a></li>
                                <li><a class="'.show_value_by_compare2(strpos($column,',5,'),false,'tick','tick_active').'">Chuyên mục</a></li>
                                <li><a class="'.show_value_by_compare2(strpos($column,',6,'),false,'tick','tick_active').'">Số lượng search</a></li>
                                <li><a class="'.show_value_by_compare2(strpos($column,',7,'),false,'tick','tick_active').'">Số lượng đọc</a></li>
                                <li><a class="'.show_value_by_compare2(strpos($column,',8,'),false,'tick','tick_active').'">Thời gian tạo</a></li>
                                <li><a class="'.show_value_by_compare2(strpos($column,',9,'),false,'tick','tick_active').'">Google Indexed</a></li>
                                <li><a class="'.show_value_by_compare2(strpos($column,',10,'),false,'tick','tick_active').'">Time Indexed</a></li>';
                        }
                echo '</ul>
                    </li>
                </ul>
              </div>';
        echo '<div class="col4">
                <input type="text" value="' . $GLOBALS["search_text"] . '" onkeypress="search_text_content_submit(this,event,this.value);" name="fSearch_text" style="width:100px;float:left;height:17px;border:1px solid #cccccc;font-size:12px;color:#444444;" function="content" page="' . $GLOBALS["page"] . '" number_limit="' . $GLOBALS["number_limit"] . '" mode="' . $GLOBALS["mode"] . '" content_group="' . $GLOBALS["content_group"] . '" catid="' . $GLOBALS["catid"] . '" languageid="' . $GLOBALS["languageid"] . '">
              </div>';
        echo '<div class="col3">';
        catefory_directory_process($GLOBALS["catid"]);
        echo '</div>';
        echo '</div>';
    }
    // Catefory_directory_process
    function catefory_directory_process($id){
        $table_query = 'catalog';
        $function_js = 'change_catalogs_ajax';
        if($GLOBALS["content_group"]==0){
            $content_group = get_content_group($id,$table_query);
        }
        else{
            $content_group = $GLOBALS["content_group"];
        }
        $catalog_level_array = array();
        $strshow = '';
        $catid = $id;
        $parentid = get_parent_id($id,$table_query);
        $i = 0;
        while($parentid!=0&&$i<10){
            $catalog_level_array[$i] = get_catalog_option($catid,$parentid,$content_group,$table_query);
            $catid = $parentid;
            $parentid = get_parent_id($parentid,$table_query);
            $i = $i + 1;
        }
        $catalog_level_array[$i] = get_catalog_option($catid,$parentid,$content_group,$table_query);
        //$strshow = $strshow . show_category_directory($k); // get category directory
        $strshow = $strshow . show_language_list($GLOBALS["languageid"]); // get language list
        $strshow = $strshow . show_content_group($content_group,$function_js); // get product_group
        $k = 1;
        for($j=$i;$j>=0;$j--){
            if($catalog_level_array[$j]!=""){
                $strshow = $strshow . '<span id="category_' . $k . '" class="category_level_in_content"><select onchange="'.$function_js.'(this.value,' . $k . ',0,'.$content_group.');">' . $catalog_level_array[$j] . '</select></span>'; // get list parent
                $k = $k + 1;                
            }
        }
        $sub_catalog = get_catalog_option(0,$id,$content_group,$table_query);
        if($sub_catalog!=""){
            $strshow = $strshow . '<span id="category_' . $k . '" class="category_level_in_content"><select onchange="'.$function_js.'(this.value,' . $k . ',0,'.$content_group.');">' . $sub_catalog . '</select></span>'; // get sub catalogs of current id
            $k = $k + 1;
        }
        while($k<=10){
            $strshow = $strshow . '<span id="category_' . $k . '" class="category_level_in_content"></span>';
            $k++;
        }
        echo $strshow;
    }
    function show_language_list($languageid){
        $query = "select id,name from language where status = 1 order by name ASC";
        $result = mysql_query($query,$GLOBALS["con"]);
        if($result==false||mysql_num_rows($result)<=0){
            return '';
        }
        else{
            $class = '';
            if($GLOBALS["meta_multi_language"]!=1){$class = ' style="display:none;"';}
            $strreturn = '<span id="category" class="category_level_in_content">
                            <select onchange="change_catalogs_ajax(\'0\',0,0,0);" name="fLanguage"'.$class.'>';
            while($row = mysql_fetch_array($result)){
                $selected = '';
                if($languageid==$row['id']){
                    $selected = ' selected="selected"';
                }
                $strreturn = $strreturn . '<option' . $selected . ' value="' . $row['id'] . '">' . substring($row['name'],30) . '</option>';
            }
            $strreturn = $strreturn . '</select></span>';
            return $strreturn;
        }
    }
    function show_content_group($content_group,$function_js){
        $query = "select id,name from content_group where status = 1 and languageid = 1 order by name ASC";
        $result = mysql_query($query,$GLOBALS["con"]);
        if($result==false||mysql_num_rows($result)<=0){
            return '';
        }
        else{
            $strreturn = '<span id="category_0" class="category_level_in_content" style="display:none;">
                            <select onchange="'.$function_js.'(this.value,0,0,this.value);">
                                <option value="0"' . show_value_by_compare($content_group,0,' selected="selected"','') . '>[---Chọn danh mục---]</option>';
            while($row = mysql_fetch_array($result)){
                $selected = '';
                if($content_group==$row['id']){
                    $selected = ' selected="selected"';
                }
                $strreturn = $strreturn . '<option' . $selected . ' value="' . $row['id'] . '">' . substring($row['name'],30) . '</option>';
            }
            $strreturn = $strreturn . '</select>';
            if($content_group==0){
                $strreturn = $strreturn . '<span id="category_1" class="category_level_in_content"></span>
                        <span id="category_2" class="category_level_in_content"></span>
                        <span id="category_3" class="category_level_in_content"></span>
                        <span id="category_4" class="category_level_in_content"></span>
                        <span id="category_5" class="category_level_in_content"></span>
                        <span id="category_6" class="category_level_in_content"></span>
                        <span id="category_7" class="category_level_in_content"></span>
                        <span id="category_8" class="category_level_in_content"></span>
                        <span id="category_9" class="category_level_in_content"></span>
                        <span id="category_10" class="category_level_in_content"></span>';
            }
            return $strreturn . '</span>';
        }
    }
    function get_content_group($id,$table_query){
        $query = "select content_group from $table_query where catid = $id";
        $result = mysql_query($query,$GLOBALS["con"]);
        if($result==false||mysql_num_rows($result)<=0){
            return -1;
        }
        else{
            $row = mysql_fetch_array($result);
            return $row['content_group'];
        }
    }
    function get_catalog_option($catid,$parentid,$content_group,$table_query){
        $query = "select catid,catalog_name from $table_query where parentid = $parentid and content_group = $content_group and languageid = " . $GLOBALS["languageid"] . " order by catalog_name ASC";
        $result = mysql_query($query,$GLOBALS["con"]);
        if($result==false||mysql_num_rows($result)<=0){
            return '';
        }
        else{
            if($parentid==0){
                $parentid = "all";
            }
            $strreturn = '<option value="false_'.$parentid.'">[---Danh mục---]</option>';
            while($row = mysql_fetch_array($result)){
                $selected = '';
                if($catid==$row['catid']){
                    $selected = ' selected="selected"';
                }
                $strreturn = $strreturn . '<option' . $selected . ' value="' . check_finish($row['catid'],$table_query) . '_' . $row['catid'] . '" title="' . $row['catalog_name'] . '">' . substring($row['catalog_name'],30) . '</option>';
            }
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
    function check_finish_boolean($id,$table_query){
        $query = "select catid from $table_query where parentid = $id";
        $result = mysql_query($query,$GLOBALS["con"]);
        if($result==false||mysql_num_rows($result)<=0){
            return true;
        }
        else{
            return false;
        }
    }
    function check_finish($id,$table_query){
        $query = "select catid from $table_query where parentid = $id order by catalog_name ASC";
        $result = mysql_query($query,$GLOBALS["con"]);
        if($result==false||mysql_num_rows($result)<=0){
            return "true";
        }
        else{
            return "false";
        }
    }
    function get_content_list($table_query,$query_input){
        $column = ','.$_COOKIE[$GLOBALS["cookie_list_column_name"]] . ',';
        $column0 = show_value_by_compare2(strpos($column,',0,'),false,' style="display:none;"','');
        $column1 = show_value_by_compare2(strpos($column,',1,'),false,' style="display:none;"','');
        $column2 = show_value_by_compare2(strpos($column,',2,'),false,' style="display:none;"','');
        $column3 = show_value_by_compare2(strpos($column,',3,'),false,' style="display:none;"','');
        $column4 = show_value_by_compare2(strpos($column,',4,'),false,' style="display:none;"','');
        $column5 = show_value_by_compare2(strpos($column,',5,'),false,' style="display:none;"','');
        $column6 = show_value_by_compare2(strpos($column,',6,'),false,' style="display:none;"','');
        $column7 = show_value_by_compare2(strpos($column,',7,'),false,' style="display:none;"','');
        $column8 = show_value_by_compare2(strpos($column,',8,'),false,' style="display:none;"','');
        $column9 = show_value_by_compare2(strpos($column,',9,'),false,' style="display:none;"','');
        $column10 = show_value_by_compare2(strpos($column,',10,'),false,' style="display:none;"','');
        $next_sort = ($GLOBALS["sort_by"] == "time_desc") ? "time_asc" : "time_desc";
        $sort_arrow = ($GLOBALS["sort_by"] == "time_asc") ? " &#9650;" : " &#9660;";
        $sort_tip = ($GLOBALS["sort_by"] == "time_desc") ? "Mới nhất trước (Bấm để xếp Cũ nhất trước)" : "Cũ nhất trước (Bấm để xếp Mới nhất trước)";
        $create_time_header = '<span class="create_time sortable_col"'.$column8.' onclick="sort_content_by_time(\''.$next_sort.'\');" title="'.$sort_tip.'" style="cursor:pointer;user-select:none;">Thời gian tạo<span style="font-size:10px;margin-left:3px;color:#0284c7;">'.$sort_arrow.'</span></span>';

        echo '<div class="listnews_content">';
        if($GLOBALS["content_group"]==6){
            echo '<div class="header">
                    <span class="chk"'.$column0.'><input name="selectall" type="checkbox" onclick="check_all_checkbox();" /></span>
                    <span class="chk"'.$column1.'>&nbsp;</span>
                    <span class="id"'.$column2.'>ID</span>
                    <span class="image"'.$column3.'>Ảnh đại diện</span>
                    <span class="title"'.$column4.'>Tên sản phẩm</span>
                    <span class="catalog"'.$column5.'>Chuyên mục</span>
                    <span class="price"'.$column6.'>Giá</span>
                    <span class="view_number"'.$column7.'>Số lượng đọc</span>
                    ' . $create_time_header . '
                    <span class="google_index"'.$column9.'>Google Indexed</span>
                    <span class="time_google_index"'.$column10.'>Time<br />(Google Indexed)</span>
                </div>';
        }
        elseif($GLOBALS["content_group"]==2){
            echo '<div class="header">
                    <span class="chk"'.$column0.'><input name="selectall" type="checkbox" onclick="check_all_checkbox();" /></span>
                    <span class="chk"'.$column1.'>&nbsp;</span>
                    <span class="id"'.$column2.'>ID</span>
                    <span class="image"'.$column3.'>Ảnh</span>
                    <span class="title"'.$column4.'>Tên dự án</span>
                    <span class="catalog"'.$column5.'>Danh mục</span>
                    <span class="price"'.$column6.'>Giá</span>
                    <span class="view_number"'.$column7.'>Số lượng đọc</span>
                    ' . $create_time_header . '
                    <span class="google_index"'.$column9.'>Google Indexed</span>
                    <span class="time_google_index"'.$column10.'>Time<br />(Google Indexed)</span>
                </div>';
        }
        else{
            echo '<div class="header">
                    <span class="chk"'.$column0.'><input name="selectall" type="checkbox" onclick="check_all_checkbox();" /></span>
                    <span class="chk"'.$column1.'>&nbsp;</span>
                    <span class="id"'.$column2.'>ID</span>
                    <span class="image"'.$column3.'>Ảnh đại diện</span>
                    <span class="title"'.$column4.'>Tiêu đề</span>
                    <span class="catalog"'.$column5.'>Chuyên mục</span>
                    <span class="search_number"'.$column6.'>Số lượng search</span>
                    <span class="view_number"'.$column7.'>Số lượng đọc</span>
                    ' . $create_time_header . '
                    <span class="google_index"'.$column9.'>Google Indexed</span>
                    <span class="time_google_index"'.$column10.'>Time<br />(Google Indexed)</span>
                </div>';
        }
        
        echo '<div class="lc_content">';
        $query = "select content.contentid,content.catid,content.content_group,content.search_number,content.view,content.google_index,content.google_index_time,content.auto_publish
                        ,content_process.published,content_process.post_time
                        ,content_info.price,content_info.ticket_airline
                        ,content_info.hotel_image
                        ,content_info.tour_image
                        ,content_meta.title,content_meta.image,catalog.catalog_name 
                    from content LEFT JOIN catalog ON content.catid = catalog.catid, content_meta, content_info, content_process 
                    where content.contentid = content_meta.contentid and content.contentid = content_process.contentid and content.contentid = content_info.contentid and content.contentid in(" . get_list_contentid($query_input) . ") order by content_process.post_time " . $GLOBALS["sort_dir"] . ", content.contentid " . $GLOBALS["sort_dir"];
        $result = mysql_query($query,$GLOBALS["con"]);
        if($result==false||mysql_num_rows($result)<=0){
            
        }
        else{
            $GLOBALS["number_result"] = mysql_num_rows($result);
            while($row = mysql_fetch_array($result)){
                $mn = 'mn_catalog';
                $image = $row['image'];
                if($image==''){$image = 'images/avatars/no_avatar.gif';}
                $image = image_process_http($image);
                if($row["content_group"]==2){
                    $image = $row['image'];
					//fn_get_column_of_table_with_query("select image from catalog_config where catid = " . $row['ticket_airline'],"","");
                    if($image==''){$image = 'images/avatars/no_avatar.gif';}
                    $image = image_process_http($image);
                    echo '<div class="rows">';
                    echo '<span class="chk"'.$column0.'><input type="checkbox" name="select" value="' . $row['contentid'] . '" /></span>';
                    echo '<span class="chk"'.$column1.'>' . process_status($row['published']) . '</span>';
                    echo '<span class="id"'.$column2.'>' . $row['contentid'] . '</span>';
                    echo '<span class="image"'.$column3.'><a><img src="'.$image.'"></a></span>';
                    echo '<span class="title"'.$column4.'><a href="#content_add?id=' . $row['contentid'] . '&content_group=2&mn=mn_product" onclick="main_menu_click(\'content_add?id=' . $row['contentid'] . '&content_group=2&mn=mn_product\',\'mn_product\',\'#admin_content\',\'content_add.php?id=' . $row['contentid'] . '&content_group=2&mn=mn_product\',\'\');">' . substring($row['title'],60) . '</a></span>';
                    echo '<span class="catalog"'.$column5.'><a class="catalog_title2" href="#catalog_add?id=' . $row['catid'] . '" onclick="main_menu_click(\'catalog_add\',\'mn_catalog\',\'#admin_content\',\'catalog_add.php?id=' . $row['catid'] . '\',\'\');">' . $row['catalog_name'] . '</a></span>';
                    echo '<span class="price"'.$column6.'>' . format_number_thousand($row['price']) . '</span>';
                    echo '<span class="view_number"'.$column7.'>'  . format_number_thousand($row['view']) . '</span>';
                    echo '<span class="create_time"'.$column8.'>'  . format_full_time($row['post_time'],'HH:mm DD/MM/YYYY') . '</span>';
                    echo '<span class="google_index"'.$column9.'>'  . process_published($row['google_index']) . '</span>';
                    echo '<span class="time_google_index"'.$column10.'>'  . format_full_time($row['google_index_time'],'HH:mm DD/MM/YYYY') . '</span>';
                    echo '</div>';
                }
                elseif($row["content_group"]==6){
                    $image = $row['image'];
                    if($image==''){$image = 'images/avatars/no_avatar.gif';}
                    $image = image_process_http($image);
                    echo '<div class="rows">';
                    echo '<span class="chk"'.$column0.'><input type="checkbox" name="select" value="' . $row['contentid'] . '" /></span>';
                    echo '<span class="chk"'.$column1.'>' . process_status($row['published']) . '</span>';
                    echo '<span class="id"'.$column2.'>' . $row['contentid'] . '</span>';
                    echo '<span class="image"'.$column3.'><a rel="tooltip"><img src="'.$image.'"></a></span>';
                    echo '<div class="hidden"><img src="'.$image.'"></div>';
                    echo '<span class="title"'.$column4.'><a href="#content_add?id=' . $row['contentid'] . '&content_group=6&mn=mn_room" onclick="main_menu_click(\'content_add?id=' . $row['contentid'] . '&content_group=6&mn=mn_room\',\'mn_room\',\'#admin_content\',\'content_add.php?id=' . $row['contentid'] . '&content_group=6&mn=mn_room\',\'\');">' . substring($row['title'],60) . '</a></span>';
                    echo '<span class="catalog"'.$column5.'><a class="catalog_title2" href="#catalog_add?id=' . $row['catid'] . '" onclick="main_menu_click(\'catalog_add\',\'mn_catalog\',\'#admin_content\',\'catalog_add.php?id=' . $row['catid'] . '\',\'\');">' . $row['catalog_name'] . '</a></span>';
                    echo '<span class="price"'.$column6.'>' . format_number_thousand($row['price']) . '</span>';
                    echo '<span class="view_number"'.$column7.'>'  . format_number_thousand($row['view']) . '</span>';
                    echo '<span class="create_time"'.$column8.'>'  . format_full_time($row['post_time'],'HH:mm DD/MM/YYYY') . '</span>';
                    echo '<span class="google_index"'.$column9.'>'  . process_published($row['google_index']) . '</span>';
                    echo '<span class="time_google_index"'.$column10.'>'  . format_full_time($row['google_index_time'],'HH:mm DD/MM/YYYY') . '</span>';
                    echo '</div>';
                }
                elseif($row["content_group"]==7){
                    $image = $row['tour_image'];
                    if($image==''){$image = 'images/avatars/no_avatar.gif';}
                    $image = image_process_http($image);
                    echo '<div class="rows">';
                    echo '<span class="chk"'.$column0.'><input type="checkbox" name="select" value="' . $row['contentid'] . '" /></span>';
                    echo '<span class="chk"'.$column1.'>' . process_status($row['published']) . '</span>';
                    echo '<span class="id"'.$column2.'>' . $row['contentid'] . '</span>';
                    echo '<span class="image"'.$column3.'><a rel="tooltip"><img src="'.$image.'"></a></span>';
                    echo '<div class="hidden"><img src="'.$image.'"></div>';
                    echo '<span class="title"'.$column4.'><a href="#content_add?id=' . $row['contentid'] . '&content_group=' . $row['content_group'] . '&mn=mn_tour" onclick="main_menu_click(\'content_add?id=' . $row['contentid'] . '&content_group=' . $row['content_group'] . '&mn=mn_tour\',\'mn_tour\',\'#admin_content\',\'content_add.php?id=' . $row['contentid'] . '&content_group=' . $row['content_group'] . '&mn=mn_tour\',\'\');">' . substring($row['title'],60) . '</a></span>';
                    echo '<span class="catalog"'.$column5.'><a class="catalog_title2" href="#catalog_add?id=' . $row['catid'] . '" onclick="main_menu_click(\'catalog_add\',\'mn_catalog\',\'#admin_content\',\'catalog_add.php?id=' . $row['catid'] . '\',\'\');">' . $row['catalog_name'] . '</a></span>';
                    echo '<span class="price"'.$column6.'>' . format_number_thousand($row['price']) . '</span>';
                    echo '<span class="view_number"'.$column7.'>'  . format_number_thousand($row['view']) . '</span>';
                    echo '<span class="create_time"'.$column8.'>'  . format_full_time($row['post_time'],'HH:mm DD/MM/YYYY') . '</span>';
                    echo '<span class="google_index"'.$column9.'>'  . process_published($row['google_index']) . '</span>';
                    echo '<span class="time_google_index"'.$column10.'>'  . format_full_time($row['google_index_time'],'HH:mm DD/MM/YYYY') . '</span>';
                    echo '</div>';
                }
                else{
                    echo '<div class="rows">';
                    echo '<span class="chk"'.$column0.'><input type="checkbox" name="select" value="' . $row['contentid'] . '" /></span>';
                    echo '<span class="chk"'.$column1.'>' . process_status($row['published']) . '</span>';
                    echo '<span class="id"'.$column2.'>' . $row['contentid'] . '</span>';
                    echo '<span class="image"'.$column3.'><a rel="tooltip"><img src="'.$image.'"></a></span>';
                    echo '<div class="hidden"><div class="image"><img src="'.$image.'"></div></div>';
                    echo '<span class="title"'.$column4.'><a href="#content_add?id=' . $row['contentid'] . '&content_group=' . $row['content_group'] . '&mn=mn_content" onclick="main_menu_click(\'content_add?id=' . $row['contentid'] . '&content_group=' . $row['content_group'] . '&mn=mn_content\',\'mn_content\',\'#admin_content\',\'content_add.php?id=' . $row['contentid'] . '&content_group=' . $row['content_group'] . '&mn=mn_content\',\'\');">' . substring($row['title'],60) . '</a></span>';
                    echo '<span class="catalog"'.$column5.'><a class="catalog_title2" href="#catalog_add?id=' . $row['catid'] . '" onclick="main_menu_click(\'catalog_add\',\'mn_catalog\',\'#admin_content\',\'catalog_add.php?id=' . $row['catid'] . '\',\'\');">' . $row['catalog_name'] . '</a></span>';
                    echo '<span class="search_number"'.$column6.'>' . format_number_thousand($row['search_number']) . '</span>';
                    echo '<span class="view_number"'.$column7.'>'  . format_number_thousand($row['view']) . '</span>';
                    echo '<span class="create_time"'.$column8.'>'  . format_full_time($row['post_time'],'HH:mm DD/MM/YYYY') . '</span>';
                    echo '<span class="google_index"'.$column9.'>'  . process_published($row['google_index']) . '</span>';
                    echo '<span class="time_google_index"'.$column10.'>'  . format_full_time($row['google_index_time'],'HH:mm DD/MM/YYYY') . '</span>';
                    echo '</div>';
                } 
            }
            
        }
        echo '</div>';
        //echo '</div>';
        show_page_of_content();
        return true;
    }
    function show_page_of_content(){
        echo '<div class="page"><div class="page_number_from">Đang hiển thị từ <b>' . $GLOBALS["from_number"] . '</b> tới <b>' . $GLOBALS["to_number"] . '</b> trong <b>' . $GLOBALS["summary_result"] . '</b> kết quả</div>';
        echo '<div class="number_of_page">
                Hiển thị hàng: 
                <select name="fPage" onchange="' . ajax_function_process($GLOBALS["page"],'this.value',$GLOBALS["mode"],'&catid='.$GLOBALS["catid"].'&search_text='.$GLOBALS["search_text"].'&content_group='.$GLOBALS["content_group"].'&languageid='.$GLOBALS["languageid"].'&sort_by='.$GLOBALS["sort_by"]) . '">
                    <option' . show_value_by_compare($GLOBALS["number_limit"],5,' selected="selected"','') . ' value="5">5</option>
                    <option' . show_value_by_compare($GLOBALS["number_limit"],10,' selected="selected"','') . ' value="10">10</option>
                    <option' . show_value_by_compare($GLOBALS["number_limit"],15,' selected="selected"','') . ' value="15">15</option>
                    <option' . show_value_by_compare($GLOBALS["number_limit"],20,' selected="selected"','') . ' value="20">20</option>
                    <option' . show_value_by_compare($GLOBALS["number_limit"],30,' selected="selected"','') . ' value="30">30</option>
                    <option' . show_value_by_compare($GLOBALS["number_limit"],40,' selected="selected"','') . ' value="40">40</option>
                    <option' . show_value_by_compare($GLOBALS["number_limit"],50,' selected="selected"','') . ' value="50">50</option>
                    <option' . show_value_by_compare($GLOBALS["number_limit"],60,' selected="selected"','') . ' value="60">60</option>
                    <option' . show_value_by_compare($GLOBALS["number_limit"],70,' selected="selected"','') . ' value="70">70</option>
                    <option' . show_value_by_compare($GLOBALS["number_limit"],80,' selected="selected"','') . ' value="80">80</option>
                    <option' . show_value_by_compare($GLOBALS["number_limit"],90,' selected="selected"','') . ' value="90">90</option>
                    <option' . show_value_by_compare($GLOBALS["number_limit"],100,' selected="selected"','') . ' value="100">100</option>
                </select>
                </div>';
        echo '<div class="page_number">Trang:';
        if ($GLOBALS["page"] > 1){
            $previous = $GLOBALS["page"] - 1;
            if ($GLOBALS["page"] >= 3){
                echo '<a onclick="' . ajax_function_process(1,$GLOBALS["number_limit"],$GLOBALS["mode"],'&catid='.$GLOBALS["catid"].'&search_text='.$GLOBALS["search_text"].'&content_group='.$GLOBALS["content_group"].'&languageid='.$GLOBALS["languageid"].'&sort_by='.$GLOBALS["sort_by"]) . '">1</a>';
            }
            if ($GLOBALS["page"] > 3){
                echo '...';
            }
            echo '<a onclick="' . ajax_function_process($previous,$GLOBALS["number_limit"],$GLOBALS["mode"],'&catid='.$GLOBALS["catid"].'&search_text='.$GLOBALS["search_text"].'&content_group='.$GLOBALS["content_group"].'&languageid='.$GLOBALS["languageid"].'&sort_by='.$GLOBALS["sort_by"]) . '">' . $previous . '</a>';
            echo '<a class="current" onclick="' . ajax_function_process($GLOBALS["page"],$GLOBALS["number_limit"],$GLOBALS["mode"],'&catid='.$GLOBALS["catid"].'&search_text='.$GLOBALS["search_text"].'&content_group='.$GLOBALS["content_group"].'&languageid='.$GLOBALS["languageid"].'&sort_by='.$GLOBALS["sort_by"]) . '">' . $GLOBALS["page"] . '</a>';
        }
        else
        {
            echo '<a class="current" onclick="' . ajax_function_process(1,$GLOBALS["number_limit"],$GLOBALS["mode"],'&catid='.$GLOBALS["catid"].'&search_text='.$GLOBALS["search_text"].'&content_group='.$GLOBALS["content_group"].'&languageid='.$GLOBALS["languageid"].'&sort_by='.$GLOBALS["sort_by"]) . '">1</a>';
        }
        
        $to = $GLOBALS["to_number"];
        $next = $GLOBALS["page"];$i=0;
        while($to<$GLOBALS["summary_result"]&&$i<=10){
            $next += 1;
            echo '<a onclick="' . ajax_function_process($next,$GLOBALS["number_limit"],$GLOBALS["mode"],'&catid='.$GLOBALS["catid"].'&search_text='.$GLOBALS["search_text"].'&content_group='.$GLOBALS["content_group"].'&languageid='.$GLOBALS["languageid"].'&sort_by='.$GLOBALS["sort_by"]) . '">' . $next . '</a>';
            $to+=$GLOBALS["number_limit"];$i+=1;
        }
        if($GLOBALS["to_number"]<$GLOBALS["summary_result"]){
            $next = $GLOBALS["page"] + 1;
            echo '<a onclick="' . ajax_function_process($next,$GLOBALS["number_limit"],$GLOBALS["mode"],'&catid='.$GLOBALS["catid"].'&search_text='.$GLOBALS["search_text"].'&content_group='.$GLOBALS["content_group"].'&languageid='.$GLOBALS["languageid"].'&sort_by='.$GLOBALS["sort_by"]) . '">&gt;</a>';
        }
        echo '</div></div>';
        return true;
    }
    $summary_result = count_content_in_db($query_count_condition);
    show_header_of_content();
    show_function_bar();
    get_content_list($table_query,$query_main);
    show_bottom_of_content();
?>