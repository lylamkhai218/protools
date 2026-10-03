<?php 
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
    $number_google_index = 0;
    $catid = 'all';
    $content_group = 0;
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
    $mode_name = 'phản hồi';
    $table_query = 'comment';
    $table_group_query = 'comment,comment_body';
    $hyper_tag = 'comment';
    $select_field = 'comment.commentid';
    $query_main = "select $select_field from ";
    $index_id = 'commentid';
    $query_count_condition = "select count($table_query.$index_id) from ";
    $query_count_summary = "select count($index_id) from ";
    $query_condition = ' where comment.commentid = comment_body.commentid';
    $mode = "all";
    if(isset($_GET["mode"])){
        $mode = $_GET["mode"];
        if($mode=="published"){
            $query_condition = $query_condition . " and published = 1";
        }
        elseif($mode=="unpublished"){
            $query_condition = $query_condition . " and published = 0";
        }
    }
    $filter = "all";
    /*if(isset($_GET["filter"])){
        $filter = $_GET["filter"];
        if($filter=="comment"){
            $query_condition = $query_condition . " and contentid <> 0";
        }
        elseif($filter=="reply"){
            $query_condition = $query_condition . " and contentid = 0";
        }
    }*/
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
                $strreturn = $strreturn . ',' . $row['commentid'];
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
                                <li' . check_active_of_mode_menu($GLOBALS["mode"],'all') . ' mode="all" name="' . $GLOBALS["hyper_tag"] . '"><a href="'.process_href_of_a_tag($GLOBALS["hyper_tag"],1,1,$GLOBALS["limit"],'all','').'">Tất cả</a></li>
                                <li' . check_active_of_mode_menu($GLOBALS["mode"],'published') . ' mode="published" name="' . $GLOBALS["hyper_tag"] . '"><a href="'.process_href_of_a_tag($GLOBALS["hyper_tag"],1,1,$GLOBALS["limit"],'published','').'">Đã xuất bản</a></li>
                                <li' . check_active_of_mode_menu($GLOBALS["mode"],'unpublished') . ' mode="unpublished" name="' . $GLOBALS["hyper_tag"] . '"><a href="'.process_href_of_a_tag($GLOBALS["hyper_tag"],1,1,$GLOBALS["limit"],'unpublished','').'">Chưa xuất bản</a></li>
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
        
        echo '<div class="col4">
                <ul class="root">
                    <li>
                        <a><span class="have_sub">Thay đổi trạng thái</span></a>
                        <ul id="change_status_of_content" page="' . $GLOBALS["page"] . '" number_limit="' . $GLOBALS["number_limit"] . '" mode="' . $GLOBALS["mode"] . '" content_group="' . $GLOBALS["content_group"] . '" catid="' . $GLOBALS["catid"] . '&search_text=' . $GLOBALS["search_text"] . '" style="width:120px;">
                            <li function="' . $GLOBALS["hyper_tag"] . '" process="_process" request="&rq=publish"><a class="publish">Xuất bản</a></li>
                            <li function="' . $GLOBALS["hyper_tag"] . '" process="_process" request="&rq=republish"><a class="republish">Tái xuất bản</a></li>
                            <li function="' . $GLOBALS["hyper_tag"] . '" process="_process" request="&rq=down"><a class="down">Gỡ</a></li>
                            <li function="' . $GLOBALS["hyper_tag"] . '" process="_process" request="&rq=delete"><a class="delete">Xoá</a></li>
                        </ul>
                    </li>
                </ul>
              </div>';
        
        /*echo '<div class="col2">
                <ul>
                    <li>
                        <a>Thay đổi trạng thái</a>
                        <ul id="change_status_of_content">
                            <li function="' . $GLOBALS["hyper_tag"] . '" process="_process" request="&rq=publish" page="' . $GLOBALS["page"] . '" number_limit="' . $GLOBALS["number_limit"] . '" mode="' . $GLOBALS["mode"] . '&filter='.$GLOBALS["filter"].'"><a>Xuất bản</a></li>
                            <li function="' . $GLOBALS["hyper_tag"] . '" process="_process" request="&rq=republish" page="' . $GLOBALS["page"] . '" number_limit="' . $GLOBALS["number_limit"] . '" mode="' . $GLOBALS["mode"] . '&filter='.$GLOBALS["filter"].'"><a>Tái xuất bản</a></li>
                            <li function="' . $GLOBALS["hyper_tag"] . '" process="_process" request="&rq=down" page="' . $GLOBALS["page"] . '" number_limit="' . $GLOBALS["number_limit"] . '" mode="' . $GLOBALS["mode"] . '&filter='.$GLOBALS["filter"].'"><a>Gỡ</a></li>
                            <li function="' . $GLOBALS["hyper_tag"] . '" process="_process" request="&rq=delete" page="' . $GLOBALS["page"] . '" number_limit="' . $GLOBALS["number_limit"] . '" mode="' . $GLOBALS["mode"] . '&filter='.$GLOBALS["filter"].'"><a class="warning">Xoá</a></li>
                        </ul>
                    </li>
                </ul>
              </div>';*/
        
        echo '</div>';
    }
    // category_directory_process
    function category_directory_process($id){
        $table_query = 'catalogs';
        $function_js = 'change_catalogs_ajax';
        if($GLOBALS["product_group"]==0){
            $product_group = get_product_group($id,$table_query);
        }
        else{
            $product_group = $GLOBALS["product_group"];
        }
        $catalog_level_array = array();
        $strshow = '';
        $catid = $id;
        $parentid = get_parent_id($id,$table_query);
        $i = 0;
        while($parentid!=0&&$i<10){
            $catalog_level_array[$i] = get_catalog_option($catid,$parentid,$product_group,$table_query);
            $catid = $parentid;
            $parentid = get_parent_id($parentid,$table_query);
            $i = $i + 1;
        }
        $catalog_level_array[$i] = get_catalog_option($catid,$parentid,$product_group,$table_query);
        //$strshow = $strshow . show_category_directory($k); // get category directory
        $strshow = $strshow . show_product_group($product_group,$function_js); // get product_group
        $k = 1;
        for($j=$i;$j>=0;$j--){
            if($catalog_level_array[$j]!=""){
                $strshow = $strshow . '<span id="category_' . $k . '" class="category_level_in_content"><select onchange="'.$function_js.'(this.value,' . $k . ',0,'.$product_group.');">' . $catalog_level_array[$j] . '</select></span>'; // get list parent
                $k = $k + 1;                
            }
        }
        $sub_catalog = get_catalog_option(0,$id,$product_group,$table_query);
        if($sub_catalog!=""){
            $strshow = $strshow . '<span id="category_' . $k . '" class="category_level_in_content"><select onchange="'.$function_js.'(this.value,' . $k . ',0,'.$product_group.');">' . $sub_catalog . '</select></span>'; // get sub catalogs of current id
            $k = $k + 1;
        }
        while($k<=10){
            $strshow = $strshow . '<span id="category_' . $k . '" class="category_level_in_content"></span>';
            $k++;
        }
        echo $strshow;
    }
    function show_product_group($product_group,$function_js){
        $strreturn = '<span id="category_0" class="category_level_in_content">
                            <select onchange="'.$function_js.'(this.value,0,0,this.value);">
                                <option value="0"' . show_value_by_compare($product_group,0,' selected="selected"','') . '>[---Chọn---]</option>
                                <option value="1"' . show_value_by_compare($product_group,1,' selected="selected"','') . '>Tin tức</option>
                                <option value="2"' . show_value_by_compare($product_group,2,' selected="selected"','') . '>Sản phẩm</option>
                            </select>
                        </span>';
        if($product_group==0){
            $strreturn = $strreturn . '<span id="category_1" class="category_level_in_content"></span>
                        <span id="category_2" class="category_level_in_content"></span>
                        <span id="category_3" class="category_level_in_content"></span>
                        <span id="category_4" class="category_level_in_content"></span>
                        <span id="category_5" class="category_level_in_content"></span>';
        }
        return $strreturn;
    }
    function get_product_group($id,$table_query){
        $query = "select product_group from $table_query where catid = $id";
        $result = mysql_query($query,$GLOBALS["con"]);
        if($result==false||mysql_num_rows($result)<=0){
            return -1;
        }
        else{
            $row = mysql_fetch_array($result);
            return $row['product_group'];
        }
    }
    function get_catalog_option($catid,$parentid,$product_group,$table_query){
        $query = "select catid,catalog_name from $table_query where parentid = $parentid and product_group = $product_group order by catalog_name ASC";
        $result = mysql_query($query,$GLOBALS["con"]);
        if($result==false||mysql_num_rows($result)<=0){
            return '';
        }
        else{
            if($parentid==0){
                $parentid = "all";
            }
            $strreturn = '<option value="false_'.$parentid.'">[---Chọn---]</option>';
            while($row = mysql_fetch_array($result)){
                $selected = '';
                if($catid==$row['catid']){
                    $selected = ' selected="selected"';
                }
                $strreturn = $strreturn . '<option' . $selected . ' value="' . check_finish($row['catid'],$table_query) . '_' . $row['catid'] . '">' . substring($row['catalog_name'],30) . '</option>';
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
    function get_catalog_parent() {
        $query = "select catid,catalog_name from catalogs where parentid = 0 order by catalog_name ASC";
        $result = mysql_query($query,$GLOBALS["con"]); 
        if($result==0){
            return false;
        }
        else{
            echo '<select>';
            while($row = mysql_fetch_array($result)){
                echo '<option value="'.$row['catid'].'">'.$row['catalog_name'].'</option>';
            }  
            echo '</select>';
            return true;
        }
    }
    function get_column_from_db($query){
        $result = mysql_query($query,$GLOBALS["con"]);
        if($result==false||mysql_num_rows($result)<=0){
            return "";
        }
        else{
            $row = mysql_fetch_array($result);
            return $row[0];
        }
    }
    function get_content_list($table_query,$query_input){
        echo '<div class="listnews_content"><div class="header">
                                    <span class="chk"><input name="selectall" type="checkbox" onclick="check_all_checkbox();" /></span>
                                    <span class="chk">&nbsp;</span>
                                    <span class="id">ID</span>
                                    <span class="title">Nội dung</span>
                                    <span class="title">Bài viết</span>
                                    <span class="username">Thành viên</span>
                                    <span class="showinmenu">Xuất bản</span>
                                    <span class="create_time">Thời gian tạo</span>
                                </div>';
        $query = "select comment.commentid,comment.published,comment.create_time,comment.poster,comment.fullname,comment.contentid,comment_body.body 
                    from comment,comment_body 
                    where comment.commentid = comment_body.commentid 
                            and comment.commentid in(" . get_list_contentid($query_input) . ") order by commentid DESC";
        $result = mysql_query($query,$GLOBALS["con"]);
        if($result==false||mysql_num_rows($result)<=0){
            
        }
        else{
            echo '<div class="lc_content">';
            $GLOBALS["number_result"] = mysql_num_rows($result);
            while($row = mysql_fetch_array($result)){
                echo '<div class="rows">';
                echo '<span class="chk"><input type="checkbox" name="select" value="' . $row['commentid'] . '" /></span>';
                echo '<span class="chk">' . process_status($row['published']) . '</span>';
                echo '<span class="id">' . $row['commentid'] . '</span>';
                echo '<span class="title"><a href="#comment_add?id=' . $row['commentid'] . '" onclick="main_menu_click(\'comment_add\',\'mn_content\',\'#admin_content\',\'comment_add.php?id=' . $row['commentid'] . '\',\'\');">' . substring($row['body'],60) . '</a></span>';
                $title = get_column_from_db("select title from content_meta where contentid = " . $row['contentid']);
                $alias = get_column_from_db("select alias from content_meta where contentid = " . $row['contentid']);
                $fullname = get_column_from_db("select fullname from user_info where id = " . $row['poster']);
                
                echo '<span class="title">'.show_link_article($row['contentid'],$title,$alias,' target="_blank"',substring($title,60),'').'</span>';
                //echo '<span class="title"><a style="color:#0100FE;" href="#content_add?id=' . $row['contentid'] . '" onclick="main_menu_click(\'content_add\',\'mn_content\',\'#admin_content\',\'content_add.php?id=' . $row['contentid'] . '\',\'\');">' . substring($title,60) . '</a></span>';
                if($row['poster']==0){
                    echo '<span class="username">' . $row['fullname'] . '&nbsp;</span>';
                }
                else{
                    echo '<span class="username"><a href="#user_add?id=' . $row['poster'] . '" onclick="main_menu_click(\'user_add\',\'mn_user\',\'#admin_content\',\'user_add.php?id=' . $row['poster'] . '\',\'\');">' . $fullname. '&nbsp;</a></span>';
                }
                
                echo '<span class="showinmenu">' . process_published($row['published']) . '</span>';
                echo '<span class="create_time">'  . format_full_time($row['create_time'],'HH:mm DD/MM/YYYY') . '</span>';
                echo '</div>';
            }
        }
        show_page_of_content();
        echo '</div>';
        return true;
    }
    function show_page_of_content(){
        echo '<div class="page"><div class="page_number_from">' . $GLOBALS["from_number"] . ' - ' . $GLOBALS["to_number"] . ' trong ' . $GLOBALS["summary_result"] . '</div>';
        echo '<div class="number_of_page">
                Hiển thị hàng: 
                <select name="fPage" onchange="' . ajax_function_process($GLOBALS["page"],'this.value',$GLOBALS["mode"],'&filter='.$GLOBALS["filter"]) . '">
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
            if ($GLOBALS["page"] > 3){
                echo '<a href="javascript:;" onclick="' . ajax_function_process(1,$GLOBALS["number_limit"],$GLOBALS["mode"],'&filter='.$GLOBALS["filter"]) . '">1</a>...';
            }
            echo '<a href="javascript:;" onclick="' . ajax_function_process($previous,$GLOBALS["number_limit"],$GLOBALS["mode"],'&filter='.$GLOBALS["filter"]) . '">' . $previous . '</a>';
            echo '<a class="current" href="javascript:;" onclick="' . ajax_function_process($GLOBALS["page"],$GLOBALS["number_limit"],$GLOBALS["mode"],'&filter='.$GLOBALS["filter"]) . '">' . $GLOBALS["page"] . '</a>';
        }
        else
        {
            echo '<a class="current" href="javascript:;" onclick="' . ajax_function_process(1,$GLOBALS["number_limit"],$GLOBALS["mode"],'&filter='.$GLOBALS["filter"]) . '">1</a>';
        }
        if($GLOBALS["to_number"]<$GLOBALS["summary_result"]){
            $next = $GLOBALS["page"] + 1;
            echo '<a href="javascript:;" onclick="' . ajax_function_process($next,$GLOBALS["number_limit"],$GLOBALS["mode"],'&filter='.$GLOBALS["filter"]) . '">' . $next . '</a>';
            echo '<a href="javascript:;" onclick="' . ajax_function_process($next,$GLOBALS["number_limit"],$GLOBALS["mode"],'&filter='.$GLOBALS["filter"]) . '">&gt;</a>';
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
