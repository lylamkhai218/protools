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
    $number_view_summary = 0;
    $number_active_view_summary = 0;
    $ajax = 0;
    if(isset($_GET["ajax"])){
        $ajax = $_GET["ajax"];
    }
    $page = 1;
    if(isset($_GET["page"])){
        $page = $_GET["page"];
    }
    if($page==""||$page==0){$page=1;}
    $number_limit = $_COOKIE["number_limit"];
    $mode_name = 'đăng ký dịch vụ';
    $table_query = 'service_require';
    $table_group_query = 'service_require';
    $hyper_tag = 'service';
    $select_field = 'service_require.id';
    $query_main = "select $select_field from ";
    $index_id = 'id';
    $query_count_condition = "select count($table_query.$index_id) from ";
    $query_count_summary = "select count($index_id) from ";
    $query_condition = ' where 1 = 1';
    $mode = "all";
    if(isset($_GET["mode"])){
        $mode = $_GET["mode"];
        
    }
    
    $number_result = 0;
    $from_number = 0;
    $to_number = 0;
    $offset = $GLOBALS["number_limit"] * ($GLOBALS["page"]-1);
    $from_number = $offset + 1;
    $to_number = $offset;
    $summary_result = 0;
    $query_main = $query_main . $table_group_query . $query_condition . " order by $table_query.$index_id DESC limit " . $GLOBALS["number_limit"] . " offset " . $offset;
    $query_count_condition = $query_count_condition . $table_group_query . $query_condition;
    $query_count_summary = $query_count_summary . $table_query;
    function get_list_contentid($query){
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
                $strreturn = $strreturn . ',' . $row['id'];
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
            case 2:
                $str_return = '<img src="' . $GLOBALS["base_folder"] . 'admincp/media/yellow.png" />';
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
                                <li' . check_active_of_mode_menu($GLOBALS["mode"],'all') . ' mode="all" name="' . $GLOBALS["hyper_tag"] . '"><a href="'.process_href_of_a_tag($GLOBALS["hyper_tag"],1,1,$GLOBALS["limit"],'all','').'">Tất cả</a></li>
                            </ul>
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
        //echo '<div class="col4"><ul class="root"><li><a class="add" href="javascript:;" onclick="main_menu_click(\'' . $GLOBALS["hyper_tag"] . '_add\',\'mn_' . $GLOBALS["hyper_tag"] . '\',\'#admin_content\',\'' . $GLOBALS["hyper_tag"] . '_add.php?id=0\',\'\');"><span>Tạo mới</span></a></li></ul></div>';
        /*echo '<div class="col4">
                <ul class="root">
                    <li>
                        <a><span class="have_sub">Thay đổi trạng thái</span></a>
                        <ul id="change_status_of_content" page="' . $GLOBALS["page"] . '" number_limit="' . $GLOBALS["number_limit"] . '" mode="' . $GLOBALS["mode"] . '" style="width:120px;">
                            <li function="' . $GLOBALS["hyper_tag"] . '" process="_process" request="&rq=active"><a class="publish">Kích hoạt</a></li>
                            <li function="' . $GLOBALS["hyper_tag"] . '" process="_process" request="&rq=lock"><a class="lock">Khoá</a></li>
                            <li function="' . $GLOBALS["hyper_tag"] . '" process="_process" request="&rq=delete"><a class="delete">Xoá</a></li>
                        </ul>
                    </li>
                </ul>
              </div>';*/
        echo '</div>';
    }
    function get_content_list($table_query,$query_input){
        echo '<div class="listnews_content"><div class="header">
                                    <span class="chk"><input name="selectall" type="checkbox" onclick="check_all_checkbox();" /></span>
                                    <span class="chk">&nbsp;</span>
                                    <span class="id">ID</span>
                                    <span class="adv_title">Họ và tên</span>
                                    <span class="title">Đặc điểm, công dụng</span>
                                    <span class="create_time">Thời gian gửi</span>
                                </div>';
        $query = "select * from service_require where id in(" . get_list_contentid($query_input) . ") order by id DESC";
        $result = mysql_query($query,$GLOBALS["con"]);
        if($result==false||mysql_num_rows($result)<=0){
            
        }
        else{
            echo '<div class="lc_content">';
            $GLOBALS["number_result"] = mysql_num_rows($result);
            while($row = mysql_fetch_array($result)){
                echo '<div class="rows">';
                echo '<span class="chk"><input type="checkbox" name="select" value="' . $row['id'] . '" /></span>';
                echo '<span class="chk">' . process_status($row['status']) . '</span>';
                echo '<span class="id">' . $row['id'] . '</span>';
                echo '<span class="adv_title"><a href="#' . $GLOBALS["hyper_tag"] . '_add?id=' . $row['id'] . '" onclick="main_menu_click(\'' . $GLOBALS["hyper_tag"] . '_add\',\'mn_' . $GLOBALS["hyper_tag"] . '\',\'#admin_content\',\'' . $GLOBALS["hyper_tag"] . '_add.php?id=' . $row['id'] . '\',\'\');">' . $row['fullname'] . '&nbsp;</a></span>';
                
                echo '<span class="title"><a href="#' . $GLOBALS["hyper_tag"] . '_add?id=' . $row['id'] . '" onclick="main_menu_click(\'' . $GLOBALS["hyper_tag"] . '_add\',\'mn_' . $GLOBALS["hyper_tag"] . '\',\'#admin_content\',\'' . $GLOBALS["hyper_tag"] . '_add.php?id=' . $row['id'] . '\',\'\');">' . substring(strip_tags($row['content']),80) . '&nbsp;</a></span>';
                echo '<span class="create_time">'  . format_full_time($row['create_time'],'HH:mm DD/MM/YYYY') . '</span>';
                echo '</div>';
            }
            echo '</div>';
        }
        
        show_page_of_content();
        return true;
    }
    function show_page_of_content(){
        echo '<div class="page"><div class="page_number_from">' . $GLOBALS["from_number"] . ' - ' . $GLOBALS["to_number"] . ' trong ' . $GLOBALS["summary_result"] . '</div>';
        echo '<div class="number_of_page">
                Hiển thị hàng: 
                <select name="fPage" onchange="' . ajax_function_process($GLOBALS["page"],'this.value',$GLOBALS["mode"],'') . '">
                    <option' . show_value_by_compare($GLOBALS["number_limit"],5,' selected="selected"','') . ' value="5">5</option>
                    <option' . show_value_by_compare($GLOBALS["number_limit"],10,' selected="selected"','') . ' value="10">10</option>
                    <option' . show_value_by_compare($GLOBALS["number_limit"],15,' selected="selected"','') . ' value="15">15</option>
                    <option' . show_value_by_compare($GLOBALS["number_limit"],20,' selected="selected"','') . ' value="20">20</option>
                </select>
                </div>';
        echo '<div class="page_number">Page:';
        if ($GLOBALS["page"] > 1)
        {
            $previous = $GLOBALS["page"] - 1;
            if ($GLOBALS["page"] > 3){
                echo '<a href="javascript:;" onclick="' . ajax_function_process(1,$GLOBALS["number_limit"],$GLOBALS["mode"],'') . '">1</a>...';
            }
            echo '<a href="javascript:;" onclick="' . ajax_function_process($previous,$GLOBALS["number_limit"],$GLOBALS["mode"],'') . '">' . $previous . '</a>';
            echo '<a class="current" href="javascript:;" onclick="' . ajax_function_process($GLOBALS["page"],$GLOBALS["number_limit"],$GLOBALS["mode"],'') . '">' . $GLOBALS["page"] . '</a>';
        }
        else
        {
            echo '<a class="current" href="javascript:;" onclick="' . ajax_function_process(1,$GLOBALS["number_limit"],$GLOBALS["mode"],'') . '">1</a>';
        }
        if($GLOBALS["to_number"]<$GLOBALS["summary_result"]){
            $next = $GLOBALS["page"] + 1;
            echo '<a href="javascript:;" onclick="' . ajax_function_process($next,$GLOBALS["number_limit"],$GLOBALS["mode"],'') . '">' . $next . '</a>';
            echo '<a href="javascript:;" onclick="' . ajax_function_process($next,$GLOBALS["number_limit"],$GLOBALS["mode"],'') . '">&gt;</a>';
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