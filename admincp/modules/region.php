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
    $page = 1;
    if(isset($_GET["page"])){
        $page = $_GET["page"];
    }
    $ajax = 0;
    if(isset($_GET["ajax"])){
        $ajax = $_GET["ajax"];
    }
    $catid = 'all';$content_group=1;
    $languageid = 1;
    if($page==""||$page==0){$page=1;}
    $number_limit = $_COOKIE["number_limit"];
    $query = "select * from region where 1=1";
    $mode_name = 'khu vực';
    $table_query = 'region';
    $table_group_query = 'region';
    $hyper_tag = 'region';
    $select_field = 'region.id';
    $query_main = "select $select_field from ";
    $index_id = 'id';
    $order_field = 'region_name';
    $orderby = ' order by ' . $table_query . '.' . $order_field;
    $query_count_condition = "select count($table_query.$index_id) from ";
    $query_count_summary = "select count($index_id) from ";
    $query_condition = ' where 1 = 1';
    $mode = "all";
    $cookie_column_list = 'region_list_column';
    if(isset($_GET["mode"])){
        $mode = $_GET["mode"];
        if($mode=="activity"){
            $query_condition = $query_condition . " and status = 1";
        }
        elseif($mode=="lock"){
            $query_condition = $query_condition . " and status = 0";
        }
    }
    if(isset($_GET["content_group"])){
        $content_group = $_GET["content_group"];
    }
    if(isset($_GET["catid"])){
        $catid = $_GET["catid"];
        if($catid != "all"){
            $query_condition = $query_condition . " and region_parent = $catid";
        }
    }
    if(isset($_GET["languageid"])){
        $languageid = $_GET["languageid"];
        $query_condition = $query_condition . " and languageid = $languageid";
    }
    $number_result = 0;
    $from_number = 0;
    $to_number = 0;
    $offset = $GLOBALS["number_limit"] * ($GLOBALS["page"]-1);
    $from_number = $offset + 1;
    $to_number = $offset;
    $query_main = $query_main . $table_group_query . $query_condition . " order by $table_query.$index_id DESC limit " . $GLOBALS["number_limit"] . " offset " . $offset;
    $query_count_condition = $query_count_condition . $table_group_query . $query_condition;
    $query_count_summary = $query_count_summary . $table_query;
    function count_catalog_in_db($query){
        $result= mysql_query($query,$GLOBALS["con"]);
        if($result==0){
            return 0;
        }
        else{
            $row = mysql_fetch_array($result);
            return $row[0];
        }
    }
    function count_article_in_catalog_in_db(){
        $query = "select sum(news_number) from region";
        $result= mysql_query($query,$GLOBALS["con"]);
        if($result==0){
            return 0;
        }
        else{
            $row = mysql_fetch_array($result);
            return $row[0];
        }
    }
    function get_list_contentid($query,$index_id){
        $result = mysql_query($query,$GLOBALS["con"]);
        if($result==false||mysql_num_rows($result)<=0){
            $GLOBALS["from_number"] = 0;
            $GLOBALS["to_number"] = 0;
            return 0;
        }
        else{
            $strreturn = '0';
            $GLOBALS["number_result"] = mysql_num_rows($result);
            while($row = mysql_fetch_array($result)){
                $strreturn = $strreturn . ',' . $row[$index_id];
                $GLOBALS["to_number"] = $GLOBALS["to_number"] + 1;
            }  
            return $strreturn;
        }
    }
    function get_catalogs($table_query,$index_id,$query_input,$orderby){
        $column = ','.$_COOKIE[$GLOBALS["cookie_column_list"]] . ',';
        $column0 = show_value_by_compare2(strpos($column,',0,'),false,' style="display:none;"','');
        $column1 = show_value_by_compare2(strpos($column,',1,'),false,' style="display:none;"','');
        $column2 = show_value_by_compare2(strpos($column,',2,'),false,' style="display:none;"','');
        $column3 = show_value_by_compare2(strpos($column,',3,'),false,' style="display:none;"','');
        $column4 = show_value_by_compare2(strpos($column,',4,'),false,' style="display:none;"','');
        $column5 = show_value_by_compare2(strpos($column,',5,'),false,' style="display:none;"','');
        $column6 = show_value_by_compare2(strpos($column,',6,'),false,' style="display:none;"','');
        $column7 = show_value_by_compare2(strpos($column,',7,'),false,' style="display:none;"','');
        $column8 = show_value_by_compare2(strpos($column,',8,'),false,' style="display:none;"','');
        echo '<div class="listnews_content"><div class="header">
                                <span class="chk"'.$column0.'><input name="selectall" type="checkbox" onclick="check_all_checkbox();" /></span>
                                <span class="chk"'.$column1.'>&nbsp;</span>
                                <span class="id"'.$column2.'>ID</span>
                                <span class="catalog"'.$column3.'>Khu vực</span>
                                <span class="catalog"'.$column4.'>Khu vực cha</span>
                                <span class="showinmenu"'.$column5.'>Hiện trên Menu</span>
                                <span class="ordering"'.$column6.'>Thứ tự</span>
                                <span class="view_number"'.$column7.'>Dự án</span>
                                <span class="view_number"'.$column8.'>Tin rao</span>
                            </div><div class="lc_content">';
        $query = "select * from region,region_info where region.id = region_info.id and $table_query.$index_id in (".get_list_contentid($query_input,$index_id).") $orderby";
        $result= mysql_query($query,$GLOBALS["con"]);
        if($result==false||mysql_num_rows($result)<=0){
            
        }
        else{
            $GLOBALS["number_result"] = mysql_num_rows($result);
            while($row = mysql_fetch_array($result)){
                echo '<div class="rows">';
                echo '<span class="chk"'.$column0.'><input type="checkbox" name="select" value="' . $row['id'] . '" /></span>';
                echo '<span class="chk"'.$column1.'>' . process_status($row['status']) . '</span>';
                echo '<span class="id"'.$column2.'>' . $row['id'] . '</span>';
                echo '<span class="catalog"'.$column3.'><a href="#' . $GLOBALS["hyper_tag"] . '_add?id=' . $row['id'] . '" onclick="main_menu_click(\'' . $GLOBALS["hyper_tag"] . '_add\',\'mn_' . $GLOBALS["hyper_tag"] . '\',\'#admin_content\',\'' . $GLOBALS["hyper_tag"] . '_add.php?id=' . $row['id'] . '\',\'\');">' . $row['region_name'] . '</a></span>';
                echo '<span class="catalog"'.$column4.'>' . get_parent_from_db($row['region_parent']) . '</span>';
                echo '<span class="showinmenu"'.$column5.'>' . process_showinmenu($row['showinmenu']) . '</span>';
                echo '<span class="ordering"'.$column6.'>' . $row['orderingmenu'] . '</span>';
                echo '<span class="view_number"'.$column7.'>'  . format_number_thousand($row['project_number']) . '</span>';
                echo '<span class="view_number"'.$column8.'>'  . format_number_thousand($row['news_number']) . '</span>';
                echo '</div>';
            }
            echo '<div class="rows_summary">
                                    <span class="chk">&nbsp;</span>
                                    <span class="id">&nbsp;</span>
                                    <span class="summary_auto">Tổng số bài viết trong các khu vực: ' . format_number_thousand(count_article_in_catalog_in_db()) . '</span>
                                </div>';
        }
        echo '</div>';
        show_page_of_content();
        return true;
    }
    function get_parent_from_db($id){
        if($id==0){return '&nbsp;';}
        $query = "select id,region_name from region where id = $id";
        $result= mysql_query($query,$GLOBALS["con"]);
        if($result==false||mysql_num_rows($result)<=0){
            return '&nbsp;';
        }
        else{
            $row = mysql_fetch_array($result);
            return '<a href="#' . $GLOBALS["hyper_tag"] . '_add?id=' . $row[0] . '" onclick="main_menu_click(\'' . $GLOBALS["hyper_tag"] . '_add\',\'mn_' . $GLOBALS["hyper_tag"] . '\',\'#admin_content\',\'' . $GLOBALS["hyper_tag"] . '_add.php?id=' . $row['catid'] . '\',\'\');">' . $row[1] . '</a>';
        }
    }
    function get_colum_of_table_from_db($table,$column,$id,$input){
        $query = "select $column from $table where $id = '$input'";
        $result = mysql_query($query,$GLOBALS["con"]);
        if($result==false||mysql_num_rows($result)<=0){
            return '&nbsp;';
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
    // Catefory_directory_process
    function ajax_function_process($page,$limit,$mode,$other){
        return 'ajax_load_content(\'' . $GLOBALS["hyper_tag"] . '\',' . $page . ',' . $limit . ',\'' . $mode . '\',\'' . $other . '\');';
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
    function get_parent_id($id,$table_query){
        $query = "select region_parent from $table_query where id = $id";
        $result = mysql_query($query,$GLOBALS["con"]);
        if($result==false||mysql_num_rows($result)<=0){
            return -1;
        }
        else{
            $row = mysql_fetch_array($result);
            return $row[0];
        }
    }
    function check_finish_boolean($id,$table_query){
        $query = "select id from $table_query where region_parent = $id";
        $result = mysql_query($query,$GLOBALS["con"]);
        if($result==false||mysql_num_rows($result)<=0){
            return true;
        }
        else{
            return false;
        }
    }
    function check_finish($id,$table_query){
        $query = "select id from $table_query where region_parent = $id";
        $result = mysql_query($query,$GLOBALS["con"]);
        if($result==false||mysql_num_rows($result)<=0){
            return "true";
        }
        else{
            return "false";
        }
    }
    function get_catalog_option($catid,$parentid,$content_group,$table_query){
        $query = "select id,region_name from $table_query where region_parent = $parentid order by orderingmenu,region_name ASC";
        $result = mysql_query($query,$GLOBALS["con"]);
        if($result==false||mysql_num_rows($result)<=0){
            return '';
        }
        else{
            if($parentid==0){
                $parentid = "all";
            }
            $strreturn = '<option value="false_'.$parentid.'">[------Chọn------]</option>';
            while($row = mysql_fetch_array($result)){
                $selected = '';
                if($catid==$row['id']){
                    $selected = ' selected="selected"';
                }
                $strreturn = $strreturn . '<option' . $selected . ' value="' . check_finish($row['id'],$table_query) . '_' . $row['id'] . '">' . substring($row['region_name'],30) . '</option>';
            }
            return $strreturn;
        }
    }
    function show_language_list($languageid){
        $query = "select id,name from language where status = 1 order by name ASC";
        $result = mysql_query($query,$GLOBALS["con"]);
        if($result==false||mysql_num_rows($result)<=0){
            return '';
        }
        else{
            $strreturn = '<span id="category" class="category_level_in_content">
                            <select onchange="load_catalog_ajax_by_language();" name="fLanguage" style="display:none;">';
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
        $strreturn = '<span id="category_0" class="category_level_in_content">
                            <select onchange="'.$function_js.'(this.value,0,0,this.value);" style="display:none;">
                                <option value="0"' . show_value_by_compare($content_group,0,' selected="selected"','') . '>[---Tất cả---]</option>
                                <option value="1"' . show_value_by_compare($content_group,1,' selected="selected"','') . '>[---Chọn Tỉnh/TP---]</option></select></span>';
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
        return $strreturn;
    }
    function catefory_directory_process($id){
        $table_query = 'region';
        $function_js = 'load_region_ajax';
        $content_group = $GLOBALS["content_group"];
        /*if($GLOBALS["content_group"]==0){
            $content_group = get_content_group($id,$table_query);
        }
        else{
            $content_group = $GLOBALS["content_group"];
        }*/
        $catalog_level_array = array();
        $strshow = '';
        $catid = $id;
        $parentid = get_parent_id($id,$table_query);
        if($parentid==-1){$parentid=0;}
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
    function show_page_of_content(){
        echo '<div class="page"><div class="page_number_from">' . $GLOBALS["from_number"] . ' - ' . $GLOBALS["to_number"] . ' trong ' . $GLOBALS["summary_result"] . '</div>';
        echo '<div class="number_of_page">
                Hiển thị hàng: 
                <select name="fPage" onchange="' . ajax_function_process($GLOBALS["page"],'this.value',$GLOBALS["mode"],'&catid='.$GLOBALS["catid"].'&content_group='.$GLOBALS["content_group"]) . '">
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
        echo '<div class="page_number">Page:';
        if ($GLOBALS["page"] > 1)
        {
            $previous = $GLOBALS["page"] - 1;
            if ($GLOBALS["page"] >= 3){
                echo '<a href="javascript:;" onclick="' . ajax_function_process(1,$GLOBALS["number_limit"],$GLOBALS["mode"],'&catid='.$GLOBALS["catid"].'&content_group='.$GLOBALS["content_group"]) . '">1</a>';
            }
            if ($GLOBALS["page"] > 3){
                echo '...';
            }
            echo '<a href="javascript:;" onclick="' . ajax_function_process($previous,$GLOBALS["number_limit"],$GLOBALS["mode"],'&catid='.$GLOBALS["catid"].'&content_group='.$GLOBALS["content_group"]) . '">' . $previous . '</a>';
            echo '<a class="current" href="javascript:;" onclick="' . ajax_function_process($GLOBALS["page"],$GLOBALS["number_limit"],$GLOBALS["mode"],'&catid='.$GLOBALS["catid"].'&content_group='.$GLOBALS["content_group"]) . '">' . $GLOBALS["page"] . '</a>';
        }
        else
        {
            echo '<a class="current" href="javascript:;" onclick="' . ajax_function_process(1,$GLOBALS["number_limit"],$GLOBALS["mode"],'&catid='.$GLOBALS["catid"].'&content_group='.$GLOBALS["content_group"]) . '">1</a>';
        }
        if($GLOBALS["to_number"]<$GLOBALS["summary_result"]){
            $next = $GLOBALS["page"] + 1;
            echo '<a href="javascript:;" onclick="' . ajax_function_process($next,$GLOBALS["number_limit"],$GLOBALS["mode"],'&catid='.$GLOBALS["catid"].'&content_group='.$GLOBALS["content_group"]) . '">' . $next . '</a>';
            echo '<a href="javascript:;" onclick="' . ajax_function_process($next,$GLOBALS["number_limit"],$GLOBALS["mode"],'&catid='.$GLOBALS["catid"].'&content_group='.$GLOBALS["content_group"]) . '">&gt;</a>';
        }
        echo '</div></div>';
        return true;
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
                                <li' . check_active_of_mode_menu($GLOBALS["mode"],'all') . ' mode="all" name="' . $GLOBALS["hyper_tag"] . '"><a href="'.process_href_of_a_tag($GLOBALS["hyper_tag"],1,1,$GLOBALS["limit"],'all','').'">Tất cả</a></li>
                                <li' . check_active_of_mode_menu($GLOBALS["mode"],'activity') . ' mode="activity" name="' . $GLOBALS["hyper_tag"] . '"><a href="'.process_href_of_a_tag($GLOBALS["hyper_tag"],1,1,$GLOBALS["limit"],'activity','').'">Đang hoạt động</a></li>
                                <li' . check_active_of_mode_menu($GLOBALS["mode"],'lock') . ' mode="lock" name="' . $GLOBALS["hyper_tag"] . '"><a href="'.process_href_of_a_tag($GLOBALS["hyper_tag"],1,1,$GLOBALS["limit"],'lock','').'">Đã khoá</a></li>
                            </ul>
                        </div>
                        <div id="admin_content_list">';
        }
    }
    function show_bottom_of_content(){
        if($GLOBALS["ajax"]==0){
            echo '</div></div></div>';
            include($_SERVER['DOCUMENT_ROOT'] . $GLOBALS["base_folder"] . "admincp/modules/other_info.php");
            echo '</div>';
        }
    }
    function show_function_bar(){
        echo '<div class="function">';
        echo '<div class="col4"><ul class="root"><li><a class="add" href="javascript:;" onclick="main_menu_click(\'' . $GLOBALS["hyper_tag"] . '_add\',\'mn_' . $GLOBALS["hyper_tag"] . '\',\'#admin_content\',\'' . $GLOBALS["hyper_tag"] . '_add.php?id=0\',\'\');"><span>Tạo mới</span></a></li></ul></div>';
        echo '<div class="col4">
                <ul class="root">
                    <li>
                        <a><span class="have_sub">Thay đổi trạng thái</span></a>
                        <ul id="change_status_of_content" catid="' . $GLOBALS["catid"] . '" product_group="' . $GLOBALS["product_group"] . '" page="' . $GLOBALS["page"] . '" number_limit="' . $GLOBALS["number_limit"] . '" mode="' . $GLOBALS["mode"] . '" style="width:120px;">
                            <li function="' . $GLOBALS["hyper_tag"] . '" process="_process" request="&rq=active"><a class="publish">Kích hoạt</a></li>
                            <li function="' . $GLOBALS["hyper_tag"] . '" process="_process" request="&rq=lock"><a class="lock">Khoá</a></li>
                            <li function="' . $GLOBALS["hyper_tag"] . '" process="_process" request="&rq=delete"><a class="delete">Xoá</a></li>
                        </ul>
                    </li>
                </ul>
              </div>';
        $column = ','.$_COOKIE[$GLOBALS["cookie_column_list"]] . ',';
        echo '<div class="col4">
                <ul class="root">
                    <li>
                        <a><span class="have_sub">Hiển thị cột</span></a>
                        <ul id="change_column_of_list" page="' . $GLOBALS["page"] . '" number_limit="' . $GLOBALS["number_limit"] . '" mode="' . $GLOBALS["mode"] . '" product_group="' . $GLOBALS["product_group"] . '" catid="' . $GLOBALS["catid"] . '" cookie_name="region_list_column" style="width:110px;">
                            <li><a class="'.show_value_by_compare2(strpos($column,',0,'),false,'tick','tick_active').'">Chọn</a></li>
                            <li><a class="'.show_value_by_compare2(strpos($column,',1,'),false,'tick','tick_active').'">Tình trạng</a></li>
                            <li><a class="'.show_value_by_compare2(strpos($column,',2,'),false,'tick','tick_active').'">ID</a></li>
                            <li><a class="'.show_value_by_compare2(strpos($column,',3,'),false,'tick','tick_active').'">Khu vực</a></li>
                            <li><a class="'.show_value_by_compare2(strpos($column,',4,'),false,'tick','tick_active').'">Khu vực cha</a></li>
                            <li><a class="'.show_value_by_compare2(strpos($column,',5,'),false,'tick','tick_active').'">Hiện trên Menu</a></li>
                            <li><a class="'.show_value_by_compare2(strpos($column,',6,'),false,'tick','tick_active').'">Thứ tự</a></li>
                            <li><a class="'.show_value_by_compare2(strpos($column,',7,'),false,'tick','tick_active').'">Dự án</a></li>
                            <li><a class="'.show_value_by_compare2(strpos($column,',8,'),false,'tick','tick_active').'">Tin rao</a></li>
                        </ul>
                    </li>
                </ul>
              </div>';
        //echo '<div style="float:left;margin-left:20px;margin-top:3px;"><a style="text-decoration:none;font-size:12px;" href="javascript:;" onclick="export_product_catalog();">EXPORT</a></div>';
        echo '<div class="col3">';
        catefory_directory_process($GLOBALS["catid"]);
        echo '</div>';
        echo '</div>';
    }
    $summary_result = count_catalog_in_db($query_count_condition);
    show_header_of_content();
    show_function_bar();
    get_catalogs($table_query,$index_id,$query_main,$orderby);
    show_bottom_of_content();
?>