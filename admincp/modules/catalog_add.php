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
    $catid = 0;$parentid = 0;
    $catalog_name = "";$first_name = '';$last_name = '';$pagetext = '';
    $catalog_alias = '';
    $catalog_title = '';$catalog_description = '';$meta_description = '';$meta_keywords = '';
    $hyper_link = '';$languageid = 1;$status = 1;
    //catalog_info
    $creator = 0;$create_time = 0;
    $update_time = 0;$news_number = 0;$approve_number = 0;$publish_number = 0;
    //Content config
    $image = '';$image_list = '';$icon = '';$default_redirect = '';$news_limit = $GLOBALS["meta_news_in_catalog"];
    $style = 1;$style_in_catalog = 1;$special = 0;$type = 0;$note = 0;$video_url = '';$video_name = '';
    $showinmenu = 0;$orderingmenu = 1;
    $showinhome = 0;$orderinghome = 1;$style_in_home = 1;
    $showinmenutop = 0;$orderingmenutop = 1;
    $showinmenuleft = 0;$orderingmenuleft = 1;
    $showinmenubottom = 0;$orderingmenubottom = 1;
    $showincontentleft = 0;$orderingcontentleft = 1;$style_in_content_left = 1;
    $showincontentright = 0;$orderingcontentright = 1;$style_in_content_right = 1;
    $showinsearch = 0;$orderingsearch = 1;
    $showinlastest = 0;$orderinglastest = 1;$style_in_lastest = 1;
    $showincontentbottom = 0;$orderingcontentbottom = 1;
    $note1 = 0;$note2 = 0;$note3 = 0;$note4 = 0;$note5 = 0;$other_name = '';
    $region_code = '';
    $ticket_seach_show = 0;$ticket_seach_ordering = 0;
    $contentid = 0;$body = '';
    $catalog_left = '0-0-0';$catalog_left_number = 0;
    $catalog_right = '0-0-0';$catalog_right_number = 0;
    $catalog_center = '0-0-0';$catalog_center_number = 0;
    $content_group = 0;if(isset($_GET["content_group"])){$content_group = $_GET["content_group"];}
    $content_group_text = '';
    if($content_group==5){
        $content_group_text = 'Hãng hàng không';
    }
    elseif($content_group==4){
        $content_group_text = 'Danh mục du lịch';
    }
    elseif($content_group==3){
        $content_group_text = 'Danh mục khách sạn';
    }
    elseif($content_group==2){
        $content_group_text = 'Danh mục vé máy bay';
    }
    elseif($content_group==10){
        $content_group_text = 'Khu vực';
    }
    elseif($content_group==12){
        $content_group_text = 'Sân bay';
    }
    else{
        $content_group_text = 'Danh mục';
    }
    // Global config
    $hyper_tag = 'catalog';$table_query = 'catalog';
    if(isset($_GET["id"])){
        $catid = $_GET["id"];
        get_catalog_info($catid);
        $catalog_left = get_catalog_show($catid,2);
        $catalog_right = get_catalog_show($catid,3);
        $catalog_center = get_catalog_show($catid,4);
    }
    if($languageid==1){$language_alias = 'vn';}
    elseif($languageid==2){$language_alias = 'en';}
    
    function get_catalog_info($catid) {
        $query = "select * 
                     from catalog,catalog_info,catalog_config 
                     where catalog.catid = catalog_info.catid and catalog.catid = catalog_config.catid and catalog.catid = $catid";
        $result = mysql_query($query,$GLOBALS["con"]);
        if($result==false||mysql_num_rows($result)<=0){
            return false;
        }
        else{
            while($row = mysql_fetch_array($result))
            {
                //catalog
                $GLOBALS["parentid"] = $row['parentid'];$GLOBALS["video_url"] = $row['video_url'];$GLOBALS["video_name"] = $row['video_name'];
                $GLOBALS["catalog_name"] = $row['catalog_name'];$GLOBALS["pagetext"] = $row['pagetext'];
                $GLOBALS["first_name"] = $row['first_name'];$GLOBALS["last_name"] = $row['last_name'];
                $GLOBALS["catalog_alias"] = $row['catalog_alias'];
                $GLOBALS["catalog_description"] = $row['catalog_description'];
                $GLOBALS["catalog_title"] = $row['catalog_title'];$GLOBALS["meta_description"] = $row['meta_description'];$GLOBALS["meta_keywords"] = $row['meta_keywords'];
                $GLOBALS["hyper_link"] = $row['hyper_link'];
                $GLOBALS["languageid"] = $row['languageid'];
                $GLOBALS["status"] = $row['status'];
                //catalog_info
                $GLOBALS["creator"] = $row['creator'];$GLOBALS["create_time"] = $row['create_time'];
                $GLOBALS["update_time"] = $row['update_time'];
                $GLOBALS["news_number"] = $row['news_number'];
                $GLOBALS["approve_number"] = $row['approve_number'];$GLOBALS["publish_number"] = $row['publish_number'];
                //Content config
                $GLOBALS["image"] = $row['image'];$GLOBALS["image_list"] = $row['image_list'];$GLOBALS["icon"] = $row['icon'];
                $GLOBALS["style"] = $row['style'];$GLOBALS["style_in_catalog"] = $row['style_in_catalog'];
                $GLOBALS["special"] = $row['special'];
                $GLOBALS["type"] = $row['type'];$GLOBALS["note"] = $row['note'];
                $GLOBALS["content_group"] = $row['content_group'];
                $GLOBALS["news_limit"] = $row['news_limit'];
                $GLOBALS["default_redirect"] = $row['default_redirect'];
                $GLOBALS["showinmenu"] = $row['showinmenu'];$GLOBALS["orderingmenu"] = $row['orderingmenu'];
                $GLOBALS["showinhome"] = $row['showinhome'];$GLOBALS["orderinghome"] = $row['orderinghome'];$GLOBALS["style_in_home"] = $row['style_in_home'];
                $GLOBALS["showinmenutop"] = $row['showinmenutop'];$GLOBALS["orderingmenutop"] = $row['orderingmenutop'];
                $GLOBALS["showinmenuleft"] = $row['showinmenuleft'];$GLOBALS["orderingmenuleft"] = $row['orderingmenuleft'];
                $GLOBALS["showinmenubottom"] = $row['showinmenubottom'];$GLOBALS["orderingmenubottom"] = $row['orderingmenubottom'];
                $GLOBALS["showincontentleft"] = $row['showincontentleft'];$GLOBALS["orderingcontentleft"] = $row['orderingcontentleft'];$GLOBALS["style_in_content_left"] = $row['style_in_content_left'];
                $GLOBALS["showincontentright"] = $row['showincontentright'];$GLOBALS["orderingcontentright"] = $row['orderingcontentright'];
                $GLOBALS["style_in_content_right"] = $row['style_in_content_right'];
                $GLOBALS["showinsearch"] = $row['showinsearch'];$GLOBALS["orderingsearch"] = $row['orderingsearch'];
                $GLOBALS["showinlastest"] = $row['showinlastest'];$GLOBALS["orderinglastest"] = $row['orderinglastest'];$GLOBALS["style_in_lastest"] = $row['style_in_lastest'];
                $GLOBALS["showincontentbottom"] = $row['showincontentbottom'];$GLOBALS["orderingcontentbottom"] = $row['orderingcontentbottom'];
                $GLOBALS["note1"] = $row['note1'];
                $GLOBALS["note2"] = $row['note2'];
                $GLOBALS["note3"] = $row['note3'];
                $GLOBALS["note4"] = $row['note4'];
                $GLOBALS["note5"] = $row['note5'];
                $GLOBALS["other_name"] = $row['other_name'];$GLOBALS["region_code"] = $row['region_code'];
                $GLOBALS["ticket_seach_show"] = $row['ticket_seach_show'];
                $GLOBALS["ticket_seach_ordering"] = $row['ticket_seach_ordering'];
                
            }
            return true;
        }
    }
    function show_directory_post($id){
        $table_query = $GLOBALS["table_query"];
        $content_group = $GLOBALS["content_group"];
        if($content_group != 0){
            echo '<div class="post_select_category">';
            $catalog_level_array = array();
            $strshow = '';
            $catid = $id;
            $parentid = get_parent_id($catid,$table_query);
            $i = 0;
            while($parentid!=0&&$i<10){
                $last = false;
                if($i==0){
                    $last = true;
                }
                $catalog_level_array[$i] = get_catalog_option($catid,$parentid,$content_group,$table_query,$last);
                $catid = $parentid;
                $parentid = get_parent_id($parentid,$table_query);
                $i = $i + 1;
            }
            $last = false;
            if($i==0){
                $last = true;
            }
            $catalog_level_array[$i] = get_catalog_option($catid,$parentid,$content_group,$table_query,$last);
            $strshow = $strshow . show_content_group($content_group); // get content_group
            $k = 1;
            for($j=$i;$j>=0;$j--){
                if($catalog_level_array[$j]!=""){
                    $strshow = $strshow . '<div id="category_' . $k . '" class="category_level"><div class="current_level">Cấp ' . $k . '</div><select onclick="change_product_catalogs(this.value,' . $k . ',0,0);" multiple="multiple">' . $catalog_level_array[$j] . '</select></div>'; // get list parent
                    $k = $k + 1;
                }
            }
            //$strshow = $strshow . '<div id="category_' . $k . '" class="category_level"><select onclick="change_product_catalogs(this.value,' . $k . ',0,0);" multiple="multiple">' . get_catalog_option(0,$id,$product_group,$table_query,false) . '</select></div>'; // get sub catalogs of current id 
            //$k = $k + 1;
            while($k<=10){
                $strshow = $strshow . '<div id="category_' . $k . '" class="category_level"></div>';
                $k++;
            }
            echo $strshow;
            echo '</div>';
        }
        else{
            echo show_content_group(0);
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
    function get_catalog_option($catid,$parentid,$content_group,$table_query,$last){
        $query = "select catid,catalog_name from $table_query where catid <> '".$GLOBALS["catid"]."' and parentid = $parentid and languageid = ".$GLOBALS["languageid"]." and content_group = $content_group order by catalog_name ASC";
        $result = mysql_query($query,$GLOBALS["con"]);
        if($result==false||mysql_num_rows($result)<=0){
            return '';
        }
        else{
            $strreturn = '';
            while($row = mysql_fetch_array($result)){
                $selected = '';
                if($catid==$row['catid']&&$last==false){
                    $selected = ' selected="selected"';
                }
                $strreturn = $strreturn . '<option' . $selected . ' value="' . check_finish($row['catid'],$table_query) . '_' . $row['catid'] . '">' . substring($row['catalog_name'],30) . '</option>';
            }
            return $strreturn;
        }
    }
    function show_content_group($content_group){
        $query = "select id,name from content_group where status = 1 and languageid = 1 order by ordering ASC";
        $result = mysql_query($query,$GLOBALS["con"]);
        if($result==false||mysql_num_rows($result)<=0){
            return '';
        }
        else{
            $strreturn = '<div id="category_0" class="category_level category_first"><div class="current_level">Loại</div>
                            <select class="select_product_category" multiple="multiple" onclick="change_product_catalogs(this.value,0,0,1);">';
            while($row = mysql_fetch_array($result)){
                $selected = '';
                if($content_group==$row['id']){
                    $selected = ' selected="selected"';
                }
                $strreturn = $strreturn . '<option' . $selected . ' value="' . $row['id'] . '">' . substring($row['name'],30) . '</option>';
            }
            $strreturn = $strreturn . '</select></div>';
            if($content_group==0){
                $strreturn = $strreturn . '<div id="category_1" class="category_level"></div>
                            <div id="category_2" class="category_level"></div>
                            <div id="category_3" class="category_level"></div>
                            <div id="category_4" class="category_level"></div>
                            <div id="category_5" class="category_level"></div>
                            <div id="category_6" class="category_level"></div>
                            <div id="category_7" class="category_level"></div>
                            <div id="category_8" class="category_level"></div>
                            <div id="category_9" class="category_level"></div>
                            <div id="category_10" class="category_level"></div>';
            }
            return $strreturn;
        }
    }
    function get_catalog_name_from_id($id,$table_query){
        $query = "select catalog_name from $table_query where catid = $id";
        $result = mysql_query($query,$GLOBALS["con"]);
        if($result==false||mysql_num_rows($result)<=0){
            return "";
        }
        else{
            $row = mysql_fetch_array($result);
            return '<a href="#catalog_add?id=' . $id . '" onclick="main_menu_click(\'' . $GLOBALS["hyper_tag"] . '_add\',\'mn_' . $GLOBALS["hyper_tag"] . '\',\'#admin_content\',\'' . $GLOBALS["hyper_tag"] . '_add.php?id=' . $id . '\',\'\');">' . $row['catalog_name'] . '</a>';
        }
    }
    function get_content_group_name_from_db($id){
        $query = "select name from content_group where id = $id";
        $result = mysql_query($query,$GLOBALS["con"]);
        if($result==false||mysql_num_rows($result)<=0){
            return "";
        }
        else{
            $row = mysql_fetch_array($result);
            return $row['name'];
        }
    }
    function show_category_post_input($id,$table_query){
        echo 'Bạn đang chọn danh mục: ';
        $content_group = $GLOBALS["content_group"];
        echo '<u>'.get_content_group_name_from_db($content_group) . '</u>';
        $directory_return = '';
        $parentid = get_parent_id($id,$table_query);
        if($parentid==0){
        }
        else{
            $i = 0;
            while($parentid!=0&&$i<10){
                if($i==0){
                    $directory_return = ' &gt; <u>' . get_catalog_name_from_id($parentid,$table_query) . '</u>';
                }
                else{
                    $directory_return = ' &gt; <u>' . get_catalog_name_from_id($parentid,$table_query) . '</u> > ' . $directory_return;
                }
                $parentid = get_parent_id($parentid,$table_query);
                $i = $i + 1;
            }
            //$directory_return = $directory_return . ' > ';
        }
        
        echo $directory_return . ' &gt; <u>' . get_catalog_name_from_id($id,$table_query) . '</u>';
        echo '</div>';
    }
    function show_language_list($languageid){
        $query = "select id,name from language where status = 1 order by name ASC";
        $result = mysql_query($query,$GLOBALS["con"]);
        if($result==false||mysql_num_rows($result)<=0){
            return '';
        }
        else{
            $strreturn = '<select name="fLanguage" onchange="change_language_of_catalog();" style="width:150px;">';
            while($row = mysql_fetch_array($result)){
                $selected = '';
                if($languageid==$row['id']){
                    $selected = ' selected="selected"';
                }
                $strreturn = $strreturn . '<option' . $selected . ' value="' . $row['id'] . '">' . substring($row['name'],30) . '</option>';
            }
            echo $strreturn;
            return true;
        }
    }
    function show_style_of_catalog_list($style){
        $query = "select id,name from style_in_catalog where status = 1 order by ordering ASC";
        $result = mysql_query($query,$GLOBALS["con"]);
        if($result==false||mysql_num_rows($result)<=0){
            return '';
        }
        else{
            $strreturn = '<select name="fStyle_in_catalog" style="margin: 0;">';
            while($row = mysql_fetch_array($result)){
                $selected = '';
                if($style==$row['id']){
                    $selected = ' selected="selected"';
                }
                $strreturn = $strreturn . '<option' . $selected . ' value="' . $row['id'] . '">' . substring($row['name'],30) . '</option>';
            }
            echo $strreturn.'</select>';
            return true;
        }
    }
    function get_colum_of_table_from_db($table,$column,$id,$input){
        $query = "select $column from $table where $id = '$input'";
        $result = mysql_query($query,$GLOBALS["con"]);
        if($result==false||mysql_num_rows($result)<=0){
            return false;
        }
        else{
            $row = mysql_fetch_array($result);
            return $row[0];
        }
    }
    
    // Catalog show
    function get_catalog_show($catid,$position){
        $strreturn = '0-0-0';
        $query ="select * from catalog_show where catid = $catid and position = $position order by ordering ASC";
        $result = mysql_query($query,$GLOBALS["con"]);
        if($result==false||mysql_num_rows($result)<=0){
            
        }
        else{
            while($row = mysql_fetch_array($result)){
                $strreturn = $strreturn . ','.$row['catalog_show'].'-'.$row['ordering'].'-'.$row['style'];
            }
            if($position==2){
                $GLOBALS["catalog_left_number"] = mysql_num_rows($result);
            }
            elseif($position==3){
                $GLOBALS["catalog_right_number"] = mysql_num_rows($result);
            }
            elseif($position==4){
                $GLOBALS["catalog_center_number"] = mysql_num_rows($result);
            }
        }
        return $strreturn;
    }
    // Left
    function show_content_group_catalog_left($content_group){
        $query = "select id,name from content_group where status = 1 and languageid = ".$GLOBALS["languageid"]." order by name ASC";
        $result = mysql_query($query,$GLOBALS["con"]);
        if($result==false||mysql_num_rows($result)<=0){
            return '';
        }
        else{
            $strreturn = '<div id="category_left_0" class="category_level category_first">
                            <select class="select_product_category" multiple="multiple" onclick="change_catalogs_left_show_of_catalog_add($(this),this.value,0,0,1);">';
            while($row = mysql_fetch_array($result)){
                $selected = '';
                if($content_group==$row['id']){
                    $selected = ' selected="selected"';
                }
                $strreturn = $strreturn . '<option' . $selected . ' value="' . $row['id'] . '">' . substring($row['name'],30) . '</option>';
            }
            $strreturn = $strreturn . '</select></div>';
            if($content_group==0){
                $strreturn = $strreturn . '<div id="category_left_1" class="category_level"></div>
                            <div id="category_left_2" class="category_level"></div>
                            <div id="category_left_3" class="category_level"></div>
                            <div id="category_left_4" class="category_level"></div>
                            <div id="category_left_5" class="category_level"></div>
                            <div id="category_left_6" class="category_level"></div>
                            <div id="category_left_7" class="category_level"></div>
                            <div id="category_left_8" class="category_level"></div>
                            <div id="category_left_9" class="category_level"></div>
                            <div id="category_left_10" class="category_level"></div>';
            }
            return $strreturn;
        }
    }
    function process_catalog_left_show($catalog_show){
        $list = explode(',', $catalog_show);
        $k = 0;
        for($i=0;$i<sizeof($list);$i++){
            $value = explode('-', trim($list[$i]));
            $id = trim($value[0]);
            $ordering = trim($value[1]);
            $style = trim($value[2]);
            $idata = $id . '-' . $ordering . '-' . $style;
            if($id!=''&&$id!='0'){
                echo '<p><b id="directory_left_'.$k.'">'.($k+1).'. </b> Thứ tự ' . $ordering . ' - Kiểu ' . $style . ' - ' . show_directory_left_show($id).'&nbsp;&nbsp;&nbsp;<a onclick="remove_catalog_left_category($(this));" href="javascript:;" idata="'.$idata.'"><img align="absMiddle" src="'.$GLOBALS["base_folder"].'admincp/media/remove-icon.gif"></a></p>';
                $k = $k + 1;
            }  
        }
    }
    function show_directory_left_show($id){
        if($id==0){return '';}
        $strreturn = '';
        $table_query = 'catalog';
        $catid = $id;
        $content_group = get_content_group($GLOBALS["content_group"]);
        $parentid = get_parent_id($id,$table_query);
        $strreturn = '<u>' . get_catalog_right_name_from_id($catid,$table_query) . '</u>';
        $i = 0;
        while($parentid!=0&&$i<10){
            $strreturn = '<u>' . get_catalog_right_name_from_id($parentid,$table_query) . '</u> &gt; ' . $strreturn;
            $parentid = get_parent_id($parentid,$table_query);
            $i = $i + 1;
        }
        $strreturn = '<u>' . $content_group . '</u> &gt; ' . $strreturn;
        return $strreturn;
    }
    // Right
    function show_content_group_catalog_right($content_group){
        $query = "select id,name from content_group where status = 1 and languageid = ".$GLOBALS["languageid"]." order by name ASC";
        $result = mysql_query($query,$GLOBALS["con"]);
        if($result==false||mysql_num_rows($result)<=0){
            return '';
        }
        else{
            $strreturn = '<div id="category_right_0" class="category_level category_first">
                            <select class="select_product_category" multiple="multiple" onclick="change_catalogs_right_show_of_catalog_add($(this),this.value,0,0,1);">';
            while($row = mysql_fetch_array($result)){
                $selected = '';
                if($content_group==$row['id']){
                    $selected = ' selected="selected"';
                }
                $strreturn = $strreturn . '<option' . $selected . ' value="' . $row['id'] . '">' . substring($row['name'],30) . '</option>';
            }
            $strreturn = $strreturn . '</select></div>';
            if($content_group==0){
                $strreturn = $strreturn . '<div id="category_right_1" class="category_level"></div>
                            <div id="category_right_2" class="category_level"></div>
                            <div id="category_right_3" class="category_level"></div>
                            <div id="category_right_4" class="category_level"></div>
                            <div id="category_right_5" class="category_level"></div>
                            <div id="category_right_6" class="category_level"></div>
                            <div id="category_right_7" class="category_level"></div>
                            <div id="category_right_8" class="category_level"></div>
                            <div id="category_right_9" class="category_level"></div>
                            <div id="category_right_10" class="category_level"></div>';
            }
            return $strreturn;
        }
    }
    function process_catalog_right_show($catalog_show){
        $list = explode(',', $catalog_show);
        $k = 0;
        for($i=0;$i<sizeof($list);$i++){
            $value = explode('-', trim($list[$i]));
            $id = trim($value[0]);
            $ordering = trim($value[1]);
            $style = trim($value[2]);
            $idata = $id . '-' . $ordering . '-' . $style;
            if($id!=''&&$id!='0'){
                echo '<p><b id="directory_right_'.$k.'">'.($k+1).'. </b> Thứ tự ' . $ordering . ' - Kiểu ' . $style . ' - ' . show_directory_right_show($id).'&nbsp;&nbsp;&nbsp;<a onclick="remove_catalog_right_category($(this));" href="javascript:;" idata="'.$idata.'"><img align="absMiddle" src="'.$GLOBALS["base_folder"].'admincp/media/remove-icon.gif"></a></p>';
                $k = $k + 1;
            }  
        }
    }
    function show_directory_right_show($id){
        if($id==0){return '';}
        $strreturn = '';
        $table_query = 'catalog';
        $catid = $id;
        $content_group = get_content_group($GLOBALS["content_group"]);
        $parentid = get_parent_id($id,$table_query);
        $strreturn = '<u>' . get_catalog_right_name_from_id($catid,$table_query) . '</u>';
        $i = 0;
        while($parentid!=0&&$i<10){
            $strreturn = '<u>' . get_catalog_right_name_from_id($parentid,$table_query) . '</u> &gt; ' . $strreturn;
            $parentid = get_parent_id($parentid,$table_query);
            $i = $i + 1;
        }
        $strreturn = '<u>' . $content_group . '</u> &gt; ' . $strreturn;
        return $strreturn;
    }
    // Center
    function show_content_group_catalog_center($content_group){
        $query = "select id,name from content_group where status = 1 and languageid = ".$GLOBALS["languageid"]." order by name ASC";
        $result = mysql_query($query,$GLOBALS["con"]);
        if($result==false||mysql_num_rows($result)<=0){
            return '';
        }
        else{
            $strreturn = '<div id="category_center_0" class="category_level category_first">
                            <select class="select_product_category" multiple="multiple" onclick="change_catalogs_center_show_of_catalog_add($(this),this.value,0,0,1);">';
            while($row = mysql_fetch_array($result)){
                $selected = '';
                if($content_group==$row['id']){
                    $selected = ' selected="selected"';
                }
                $strreturn = $strreturn . '<option' . $selected . ' value="' . $row['id'] . '">' . substring($row['name'],30) . '</option>';
            }
            $strreturn = $strreturn . '</select></div>';
            if($content_group==0){
                $strreturn = $strreturn . '<div id="category_center_1" class="category_level"></div>
                            <div id="category_center_2" class="category_level"></div>
                            <div id="category_center_3" class="category_level"></div>
                            <div id="category_center_4" class="category_level"></div>
                            <div id="category_center_5" class="category_level"></div>
                            <div id="category_center_6" class="category_level"></div>
                            <div id="category_center_7" class="category_level"></div>
                            <div id="category_center_8" class="category_level"></div>
                            <div id="category_center_9" class="category_level"></div>
                            <div id="category_center_10" class="category_level"></div>';
            }
            return $strreturn;
        }
    }
    function process_catalog_center_show($catalog_show){
        $list = explode(',', $catalog_show);
        $k = 0;
        for($i=0;$i<sizeof($list);$i++){
            $value = explode('-', trim($list[$i]));
            $id = trim($value[0]);
            $ordering = trim($value[1]);
            $style = trim($value[2]);
            $idata = $id . '-' . $ordering . '-' . $style;
            if($id!=''&&$id!='0'){
                echo '<p><b id="directory_right_'.$k.'">'.($k+1).'. </b> Thứ tự ' . $ordering . ' - Kiểu ' . $style . ' - ' . show_directory_center_show($id).'&nbsp;&nbsp;&nbsp;<a onclick="remove_catalog_center_category($(this));" href="javascript:;" idata="'.$idata.'"><img align="absMiddle" src="'.$GLOBALS["base_folder"].'admincp/media/remove-icon.gif"></a></p>';
                $k = $k + 1;
            }  
        }
    }
    function show_directory_center_show($id){
        if($id==0){return '';}
        $strreturn = '';
        $table_query = 'catalog';
        $catid = $id;
        $content_group = get_content_group($GLOBALS["content_group"]);
        $parentid = get_parent_id($id,$table_query);
        $strreturn = '<u>' . get_catalog_right_name_from_id($catid,$table_query) . '</u>';
        $i = 0;
        while($parentid!=0&&$i<10){
            $strreturn = '<u>' . get_catalog_right_name_from_id($parentid,$table_query) . '</u> &gt; ' . $strreturn;
            $parentid = get_parent_id($parentid,$table_query);
            $i = $i + 1;
        }
        $strreturn = '<u>' . $content_group . '</u> &gt; ' . $strreturn;
        return $strreturn;
    }
    function get_catalog_right_name_from_id($id,$table_query){
        $query = "select catalog_name from $table_query where catid = $id";
        $result = mysql_query($query,$GLOBALS["con"]);
        if($result==false||mysql_num_rows($result)<=0){
            return "";
        }
        else{
            $row = mysql_fetch_array($result);
            return $row['catalog_name'];
        }
    }
    function get_content_group($content_group){
        $query = "select id,name from content_group where id = $content_group";
        $result = mysql_query($query,$GLOBALS["con"]);
        if($result==false||mysql_num_rows($result)<=0){
            return '';
        }
        else{
            $row = mysql_fetch_array($result);
            return $row['name'];
        }
    }
    function show_image_list($image_list){
        $list = explode(';', $image_list);
        $count = 0;
        echo '<div class="image_list_content"><div id="image_list">';
        for($i=0;$i<sizeof($list);$i++){
            $value = trim($list[$i]);
            $image = substr($value,1);
            $image = substr($image,0,strpos($image,']'));
            $name = substr($value,0,strrpos($value,']'));
            $name = substr($name,strrpos($name,'[')+1);
            if($image!=""){
                $image = image_process_http($image);
                $count = $count + 1;
                echo '<span class="image_number"><a class="title" title="'.$name.'">'.$name.'</a><img src="' . $image . '"><a onclick="delete_image_from_content(\'' . $image . '\')" class="delete">Xóa</a></span>';
            }
        }
        echo '</div><div id="count_image_upload">'.$count.'</div>';
        echo '</div>';
    }
	function show_keywordsCatalog($keywords){
        $list = explode(';', $keywords);
        for($i=0;$i<sizeof($list);$i++){
            $pos = stripos($list[$i],",");
            $keywordid = substr($list[$i],0,$pos);
            $keywordtext = substr($list[$i],$pos + 1);
            $strreturn = $strreturn . ", " . $keywordtext;
        }
        if(strpos($strreturn,",")==0){
            $strreturn = substr($strreturn,1);
        }
        echo trim($strreturn);
    }
?>
<?php include($_SERVER['DOCUMENT_ROOT'] . $base_folder . "admincp/modules/content_left.php");?>
<div id="content_right">
    <div class="content">
        <div class="image_list_upload_container">
            <form id="frmUpload_list_image" name="frmUpload_list_image" action="<?php echo $GLOBALS["base_folder"];?>admincp/modules/upload_image_fast.php" method="POST" ENCTYPE="multipart/form-data" target="upload_target">
                <iframe name="upload_target" src="<?php echo $GLOBALS["base_folder"];?>global/process_target.png" style="width:0px;height:0px;border:0px;display:none;"></iframe>
                <div class="name"><b>Tải ảnh</b> (gif, png, jpg &lt; <font color="red"><b>2MB</b></font>).</div>
                <div id="uploading_photo"><img src="<?php echo $GLOBALS["base_folder"];?>admincp/media/loading2.gif"> <span onclick="cancel_uploading_photo();" class="cancel_upload">Hủy</span></div>
                <div id="uploading_photo_input">
                    <input type="file" id="upload_photo" name="userfile" onchange="user_post_upload_image();">
                    <input type="hidden" name="fMaxsize" value='2048'  /><!--Max size is 2MB-->
                    <input type="hidden" name="fTitle" value="">
                </div>
                <div id="uploading_status">Tải thành công!</div>
                <?php show_image_list($image_list);?>
            </form>
        </div>
        <div class="form_add" id="form_add">
            <form action="<?php echo $base_folder;?>admincp/modules/catalog_insert.php" onsubmit="return frmProcess_before_submit();" name="frmProcess" target="processing_target" method="POST">
                <iframe name="processing_target" src="<?php echo $base_folder;?>global/process_target.php" style="width:0;height:0;border:0px;display:none;"></iframe>
                <div class="menu">
                    <ul>
                        <li class="active">
                            <a href="javascript:;" onclick="show_content_info($(this));" funct_name="hide_image_upload_fast">
                                <?php 
                                    if($catid==0){
                                        echo 'Tạo mới ' . $content_group_text;
                                    }
                                    else{
                                        echo 'Cập nhật: ' . $catalog_name;
                                    }
                                ?>
                            </a>
                        </li>
                        <li<?php if($GLOBALS['meta_sys_catalog_left']==0){echo ' style="display:none;"';}?> style="display:none;"><a href="javascript:;" onclick="show_content_info($(this));" funct_name="hide_image_upload_fast">Cột chi tiết sản phẩm</a></li>
                        <li <?php if($GLOBALS['meta_sys_catalog_right']==0){echo ' style="display:none;"';}?> style="display:none;"><a href="javascript:;" onclick="show_content_info($(this));" funct_name="hide_image_upload_fast">Cột phải</a></li>
                        <li<?php if($GLOBALS['meta_sys_catalog_center']==0){echo ' style="display:none;"';}?>><a href="javascript:;" onclick="show_content_info($(this));" funct_name="hide_image_upload_fast">Cột giữa</a></li>
                        <li name="mn_content_body"><a onclick="show_content_info($(this));" funct_name="show_image_upload_fast" funct_param="" style="display:none;">Ảnh danh mục</a></li>
                        <?php if($catid!=0){echo '<li><a href="javascript:;" onclick="show_content_info($(this));" funct_name="hide_image_upload_fast">Thông tin khác</a></li>';}?>
                    </ul>
                </div>
                <!--Thông tin cơ bản-->
                <div class="tab_content_info">
                    <table cellpadding="5" cellspacing="0" class="table_add">
                        <tr>
                            <td>
                                Tên 
                                <?php 
                                    if($content_group==12){
                                        echo 'sân bay';
                                    }
                                    elseif($content_group==10){
                                        echo 'khu vực';
                                    }
                                ?>
                            </td>
                            <td colspan="3">
                                <input type="text" default="" reset="true" value="<?php echo $catalog_name;?>" name="fCatalog_name" style="width:500px;" autocomlete="off" require="true" compare_require="" name_require="tên danh mục" />
                                <input type="hidden" value="<?php echo $catid;?>" name="fCatid" />
                                <input type="hidden" value="<?php echo $parentid;?>" name="fOld_parentid" />
                                <input type="hidden" value="<?php echo $parentid;?>" name="fParentid" />
                                <input type="hidden" value="<?php echo $content_group;?>" name="fContent_group" require="true" compare_require="0" name_require="phân loại danh mục" />
                                <?php 
                                    if($catid!=0&&$content_group<5){
                                        echo show_link_catalog($GLOBALS["catid"],$GLOBALS["catalog_name"],$GLOBALS["catalog_alias"],' target="_blank"','Xem','');
                                    }
                                ?>
                            </td>
                        </tr>
                        <tr<?php if($GLOBALS["meta_multi_language"]!=1){echo ' class="hidden"';}?>>
                            <td>Ngôn ngữ</td>
                            <td colspan="3"><?php show_language_list($languageid);?></td>
                        </tr>
                        <?php if($catid!=0){echo '<tr><td colspan="4">';show_category_post_input($catid,$table_query);echo '</td></tr>';}?>
                        <tr<?php if($content_group==12){echo ' style="display: none;"';}?>><td colspan="4"><?php show_directory_post($catid);?></td></tr>
                        <tr bgcolor="#eeeeee">
                            <td><b>Hiện/Ẩn</b></td>
                            <td colspan="3">
                                <table cellpadding="5" cellspacing="0">
                                    <tr>
                                        <td><label for="fShowinhome">Hiện trên trang chủ</label></td>
                                        <td><input id="fShowinhome" name="fShowinhome"<?php if($showinhome==1){echo ' checked="checked"';}?> style="margin:0;padding:0;" type="checkbox" /></td>
                                        <td align="right">Thứ tự</td>
                                        <td><input type="text" name="fOrderinghome" style="width:50px;height:15px;text-align:right;" value="<?php echo $orderinghome;?>" onfocus="if(this.value=='0') this.value=''" onblur="if(this.value=='') this.value='0'" autocomplete="off" /></td>
                                        <td style="display:none;">Kiểu</td>
                                        <td colspan="3" style="display:none;">
                                            <select name="fStyle_in_home" style="margin: 0;">
                                                <option<?php if($style_in_home==1){echo ' selected="true"';}?> value="1">Kiểu giới thiệu</option>
                                                <option<?php if($style_in_home==2){echo ' selected="true"';}?> value="2">Kiểu danh mục sản phẩm</option>
                                                <!--option<?php if($style_in_home==3){echo ' selected="true"';}?> value="3">Kiểu 3 (Nhà lắp ghép 1x1)</option>
                                                <option<?php if($style_in_home==4){echo ' selected="true"';}?> value="4">Kiểu 4 (Thi công chống thấm)</option-->
                                            </select>
                                        </td>
                                    </tr>
									<tr<?php if($GLOBALS['meta_sys_top_menu']==0){echo ' style="display:none;"';}?>>
                                        <td><label for="fShowinmenutop">Menu đầu trang</label></td>
                                        <td><input id="fShowinmenutop" name="fShowinmenutop"<?php if($showinmenutop==1){echo ' checked="checked"';}?> style="margin:0;padding:0;" type="checkbox" /></td>
                                        <td align="right">Thứ tự</td>
                                        <td><input type="text" name="fOrderingmenutop" style="width:50px;height:15px;text-align:right;" value="<?php echo $orderingmenutop;?>" onfocus="if(this.value=='0') this.value=''" onblur="if(this.value=='') this.value='0'" autocomplete="off" /></td>
                                    </tr>
                                    <tr<?php if($GLOBALS['meta_sys_main_menu']==0){echo ' style="display:none;"';}?>>
                                        <td><label for="fShowinmenu">Menu chính</label></td>
                                        <td><input id="fShowinmenu" name="fShowinmenu"<?php if($showinmenu==1){echo ' checked="checked"';}?> style="margin:0;padding:0;" type="checkbox" /></td>
                                        <td align="right">Thứ tự</td>
                                        <td><input type="text" name="fOrderingmenu" style="width:50px;height:15px;text-align:right;" value="<?php echo $orderingmenu;?>" onfocus="if(this.value=='0') this.value=''" onblur="if(this.value=='') this.value='0'" autocomplete="off" /></td>
                                    </tr>
                                    <tr<?php if($GLOBALS['meta_sys_left_menu']==0){echo ' style="display:none;"';}?>>
                                        <td><label for="fShowinmenuleft">Menu trái</label></td>
                                        <td><input id="fShowinmenuleft" name="fShowinmenuleft"<?php if($showinmenuleft==1){echo ' checked="checked"';}?> style="margin:0;padding:0;" type="checkbox" /></td>
                                        <td align="right">Thứ tự</td>
                                        <td><input type="text" name="fOrderingmenuleft" style="width:50px;height:15px;text-align:right;" value="<?php echo $orderingmenuleft;?>" onfocus="if(this.value=='0') this.value=''" onblur="if(this.value=='') this.value='0'" autocomplete="off" /></td>
                                    </tr>
									 <tr<?php if($GLOBALS['meta_sys_catalog_left']==0){echo ' style="display:none;"';}?>>
                                        <td><label for="fShowincontentleft">Danh mục chân trang</label></td>
                                        <td><input id="fShowincontentleft" name="fShowincontentleft"<?php if($showincontentleft==1){echo ' checked="checked"';}?> style="margin:0;padding:0;" type="checkbox" /></td>
                                        <td align="right">Thứ tự</td>
                                        <td><input type="text" name="fOrderingcontentleft" style="width:50px;height:15px;text-align:right;" value="<?php echo $orderingcontentleft;?>" onfocus="if(this.value=='0') this.value=''" onblur="if(this.value=='') this.value='0'" autocomplete="off" /></td>
                                        <td style="display: none;">Kiểu</td>
                                        <td style="display: none;" colspan="3">
                                            <select name="fStyle_in_content_left" style="margin: 0;">
                                                <option<?php if($style_in_content_left==1){echo ' selected="true"';}?> value="1">Kiểu 1 (Tìm việc)</option>
                                                <option<?php if($style_in_content_left==2){echo ' selected="true"';}?> value="2">Kiểu 2 (Thông báo)</option>
                                                <option<?php if($style_in_content_left==3){echo ' selected="true"';}?> value="3">Kiểu 3 (Sản phẩm mới)</option>
                                                <option<?php if($style_in_content_left==4){echo ' selected="true"';}?> value="4">Kiểu 4 (Sản phẩm bán chạy)</option>
                                            </select>
                                        </td>
                                    </tr>
                                    <tr<?php if($GLOBALS['meta_sys_right_menu']==0){echo ' style="display:none;"';}?>>
                                        <td><label for="fShowinmenuright">Menu phải</label></td>
                                        <td><input id="fShowinmenuright" name="fShowinmenuright"<?php if($showinmenuright==1){echo ' checked="checked"';}?> style="margin:0;padding:0;" type="checkbox" /></td>
                                        <td align="right">Thứ tự</td>
                                        <td><input type="text" name="fOrderingmenuright" style="width:50px;height:15px;text-align:right;" value="<?php echo $orderingmenuright;?>" onfocus="if(this.value=='0') this.value=''" onblur="if(this.value=='') this.value='0'" autocomplete="off" /></td>
                                    </tr>
									 <tr<?php if($GLOBALS['meta_sys_catalog_right']==0){echo ' style="display:none;"';}?>>
                                        <td><label for="fShowincontentright">Cột phải</label></td>
                                        <td><input id="fShowincontentright" name="fShowincontentright"<?php if($showincontentright==1){echo ' checked="checked"';}?> style="margin:0;padding:0;" type="checkbox" /></td>
                                        <td align="right">Thứ tự</td>
                                        <td><input type="text" name="fOrderingcontentright" style="width:50px;height:15px;text-align:right;" value="<?php echo $orderingcontentright;?>" onfocus="if(this.value=='0') this.value=''" onblur="if(this.value=='') this.value='0'" autocomplete="off" /></td>
                                        <td style="display: none;">Kiểu</td>
                                        <td style="display: none;" colspan="3">
                                            <select name="fStyle_in_content_right" style="margin: 0;">
                                                <option<?php if($style_in_content_right==1){echo ' selected="true"';}?> value="1">Kiểu 1 (4 bài không ảnh)</option>
                                                <option<?php if($style_in_content_right==2){echo ' selected="true"';}?> value="2">Kiểu 2 (Thư viện ảnh)</option>
                                                <option<?php if($style_in_content_right==3){echo ' selected="true"';}?> value="3">Kiểu 3 (6 bài không ảnh)</option>
                                            </select>
                                        </td>
                                    </tr>
									<tr<?php if($GLOBALS['meta_sys_catalog_bottom']==0){echo ' style="display:none;"';}?>>
                                        <td><label for="fShowincontentbottom">Cột chân trang</label></td>
                                        <td><input id="fShowincontentbottom" name="fShowincontentbottom"<?php if($showincontentbottom==1){echo ' checked="checked"';}?> style="margin:0;padding:0;" type="checkbox" /></td>
                                        <td align="right">Thứ tự</td>
                                        <td><input type="text" name="fOrderingcontentbottom" style="width:50px;height:15px;text-align:right;" value="<?php echo $orderingcontentbottom;?>" onfocus="if(this.value=='0') this.value=''" onblur="if(this.value=='') this.value='0'" autocomplete="off" /></td>
                                    </tr>
                                    <tr<?php if($GLOBALS['meta_sys_bottom_menu']==0){echo ' style="display:none;"';}?>>
                                        <td><label for="fShowinmenubottom">Menu chân trang</label></td>
                                        <td><input id="fShowinmenubottom" name="fShowinmenubottom"<?php if($showinmenubottom==1){echo ' checked="checked"';}?> style="margin:0;padding:0;" type="checkbox" /></td>
                                        <td align="right">Thứ tự</td>
                                        <td><input type="text" name="fOrderingmenubottom" style="width:50px;height:15px;text-align:right;" value="<?php echo $orderingmenubottom;?>" onfocus="if(this.value=='0') this.value=''" onblur="if(this.value=='') this.value='0'" autocomplete="off" /></td>
                                        
                                    </tr>
                                    
                                    <tr<?php if($GLOBALS['meta_sys_catalog_search']==0){echo ' style="display:none;"';}?>>
                                        <td><label for="fShowinsearch">Cột tìm kiếm</label></td>
                                        <td><input id="fShowinsearch" name="fShowinsearch"<?php if($showinsearch==1){echo ' checked="checked"';}?> style="margin:0;padding:0;" type="checkbox" /></td>
                                        <td align="right">Thứ tự</td>
                                        <td><input type="text" name="fOrderingsearch" style="width:50px;height:15px;text-align:right;" value="<?php echo $orderingsearch;?>" onfocus="if(this.value=='0') this.value=''" onblur="if(this.value=='') this.value='0'" autocomplete="off" /></td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                        <tr style="display: none;">
                            <td>Loại danh mục</td>
                            <td>
                                <select name="fNote" style="margin: 0;">
                                    <option<?php if($note==0){echo ' selected="true"';}?> value="0">Chọn</option>
                                    <option<?php if($note==1){echo ' selected="true"';}?> value="1">Giới thiệu</option>
                                    <option<?php if($note==2){echo ' selected="true"';}?> value="2">Liên hệ</option>
                                </select>
                            </td>
                            <td style="display: none;" align="right">Hiện box liên hệ</td>
                            <td style="display: none;">
                                <span class="check_box_style1" state="<?php if($special==1){echo 'on';}else{echo 'off';}?>">
                                    <span class="<?php if($special==1){echo 'check_box_on1';}else{echo 'check_box_off1';}?>">
                                        <span class="check_box_on"></span>
                                        <span class="check_box_bar"></span>
                                        <input type="checkbox" name="fSpecial"<?php if($special==1){echo ' checked="checked"';}?> />
                                    </span>
                                </span>
                            </td>
                        </tr><?php //if($content_group>4){echo ' style="display: none;"';}?>
                        <tr>
                            <td>Kiểu liệt kê trong danh mục</td>
                            <td>
                                <?php show_style_of_catalog_list($style_in_catalog);?>
                            </td>
                            <td align="right">Giới hạn bài xuất hiện trong danh mục</td>
                            <td><input type="text" name="fNews_limit" style="width:50px;height:15px;text-align:right;" value="<?php echo $news_limit;?>" onfocus="if(this.value=='0') this.value=''" onblur="if(this.value=='') this.value='<?php echo $news_limit;?>'" autocomplete="off" /></td>
                        </tr>
                        <tr>
                            <td>Kích hoạt</td>
                            <td>
                                <span class="check_box_style1" state="<?php if($status==1){echo 'on';}else{echo 'off';}?>">
                                    <span class="<?php if($status==1){echo 'check_box_on1';}else{echo 'check_box_off1';}?>">
                                        <span class="check_box_on"></span>
                                        <span class="check_box_bar"></span>
                                        <input type="checkbox" name="fStatus"<?php if($status==1){echo ' checked="checked"';}?> />
                                    </span>
                                </span>
                            </td>
                        </tr>
						<tr>
                            <td>Ảnh đại diện</td>
                            <td colspan="3">
                                <input default="" reset="true" type="text" value="<?php echo $image;?>" name="fImage" style="width:400px;vertical-align:text-bottom;" />
                                <?php if($image!=''){echo '<a rel="tooltip"><img border="0" src="'.$base_folder.'admincp/media/picture-icon.png"></a>';};?>
                                <a title="(475x390 pixels)" style="cursor:help;"><img border="0" src="<?php echo $base_folder;?>admincp/media/question_icon.gif"></a>
                                <div class="fileupload_container" style="float:right;">
                                    <input type="button" value="Browse..." style="height:21px;font-size:11px;margin-left:5px;" onclick="choose_file_upload_fast(2000,'fImage','');" >
                                </div>
                                <div class="hidden"><div class="image"><img src="<?php echo image_process_http($image);?>"></div></div>
                            </td>
                        </tr>
                        <tr style="">
                            <td>Icon</td>
                            <td colspan="3">
                                <input type="text" value="<?php echo $icon;?>" name="fIcon" style="width:400px;vertical-align:text-bottom;" />
                                <?php if($icon!=''){echo '<a rel="tooltip"><img border="0" src="'.$base_folder.'admincp/media/picture-icon.png"></a>';};?>
                                <a title="(150 x 150 pixels)" style="cursor:help;"><img border="0" src="<?php echo $base_folder;?>admincp/media/question_icon.gif"></a>
                                <div class="fileupload_container" style="float:right;">
                                    <input type="button" value="Browse..." style="height:21px;font-size:11px;margin-left:5px;" onclick="choose_file_upload_fast(1000,'fIcon','');" >
                                </div>
                                <div class="hidden"><div class="image"><img src="<?php echo image_process_http($icon);?>"></div></div>
                            </td>
                        </tr>
                        <tr<?php if($content_group!=5){echo ' style="display: none;"';}?>>
                            <td colspan="4">
                                <div class="openMoreSettingBox">
                                <div class="openMoreSettingBtn"><a name="openMoreSettingBtn" idata="flyBrandOfCatalog">Thông tin hãng máy bay</a></div>
                                <div class="openMoreSettingContent" id="flyBrandOfCatalog" style="<?php if($content_group==5){echo ' display: block';}else{echo 'display: none;';}?>">
                                    <table style="padding:10px 0;margin-left:15px;" cellpadding="0" cellspacing="0">
                                        <tr>
                                            <td class="col1">Logo hãng</td>
                                            <td class="col2">
                                                <input default="" reset="true" type="text" value="<?php echo $image;?>" name="fImage" style="width:400px;vertical-align:text-bottom;" />
                                                <?php if($image!=''){echo '<a rel="tooltip"><img border="0" src="'.$base_folder.'admincp/media/picture-icon.png"></a>';};?>
                                                <a title="(150x80 pixels)" style="cursor:help;"><img border="0" src="<?php echo $base_folder;?>admincp/media/question_icon.gif"></a>
                                                <div class="fileupload_container" style="float:right;">
                                                    <input type="button" value="Browse..." style="height:21px;font-size:11px;margin-left:5px;padding:1px;" onclick="choose_file_upload_fast(2000,'fImage','');" >
                                                </div>
                                                <div class="hidden"><div class="image"><img src="<?php echo image_process_http($image);?>"></div></div>
                                            </td>
                                        </tr>
                                    </table>
                                </div>
                                </div>
                            </td>
                        </tr>
                        <tr<?php if($content_group!=10){echo ' style="display: none;"';}?>>
                            <td colspan="4">
                                <div class="openMoreSettingBox">
                                <div class="openMoreSettingBtn"><a name="openMoreSettingBtn" idata="regionInfoOfCatalog">Thông tin khu vực</a></div>
                                <div class="openMoreSettingContent" id="regionInfoOfCatalog" style="<?php if($content_group==10){echo ' display: block';}else{echo 'display: none;';}?>">
                                    <table style="padding:10px 0;margin-left:15px;" cellpadding="0" cellspacing="0" align="left">
                                        <tr>
                                            <td class="col1">Mã khu vực</td>
                                            <td class="col2">
                                                <input default="" reset="true" type="text" value="<?php echo $region_code;?>" name="region_code" style="width:300px;" />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td class="col1">Điểm đi mặc định</td>
                                            <td class="col2">
                                                <span class="check_box_style1" state="<?php if($note1==1){echo 'on';}else{echo 'off';}?>">
                                                    <span class="<?php if($note1==1){echo 'check_box_on1';}else{echo 'check_box_off1';}?>">
                                                        <span class="check_box_on"></span>
                                                        <span class="check_box_bar"></span>
                                                        <input type="checkbox" name="note1"<?php if($note1==1){echo ' checked="checked"';}?> />
                                                    </span>
                                                </span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td class="col1">Điểm đến mặc định</td>
                                            <td class="col2">
                                                <span class="check_box_style1" state="<?php if($note2==1){echo 'on';}else{echo 'off';}?>">
                                                    <span class="<?php if($note2==1){echo 'check_box_on1';}else{echo 'check_box_off1';}?>">
                                                        <span class="check_box_on"></span>
                                                        <span class="check_box_bar"></span>
                                                        <input type="checkbox" name="note2"<?php if($note2==1){echo ' checked="checked"';}?> />
                                                    </span>
                                                </span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td class="col1">Hiển thị trong lựa chọn thành phố</td>
                                            <td class="col2">
                                                <span class="check_box_style1" state="<?php if($ticket_seach_show==1){echo 'on';}else{echo 'off';}?>">
                                                    <span class="<?php if($ticket_seach_show==1){echo 'check_box_on1';}else{echo 'check_box_off1';}?>">
                                                        <span class="check_box_on"></span>
                                                        <span class="check_box_bar"></span>
                                                        <input type="checkbox" name="ticket_seach_show"<?php if($ticket_seach_show==1){echo ' checked="checked"';}?> />
                                                    </span>
                                                </span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td class="col1">Thứ tự hiển thị</td>
                                            <td class="col2">
                                                <input default="" reset="true" type="text" value="<?php echo $ticket_seach_ordering;?>" name="ticket_seach_ordering" onfocus="if(this.value=='0') this.value=''" onblur="if(this.value=='') this.value='0'" style="width:60px;" />
                                            </td>
                                        </tr>
                                    </table>
                                </div>
                                </div>
                            </td>
                        </tr>
                        <tr<?php if($content_group!=12){echo ' style="display: none;"';}?>>
                            <td colspan="4">
                                <div class="openMoreSettingBox">
                                <div class="openMoreSettingBtn"><a name="openMoreSettingBtn" idata="airportInfoOfCatalog">Thông tin sân bay</a></div>
                                <div class="openMoreSettingContent" id="airportInfoOfCatalog" style="<?php if($content_group==12){echo ' display: block';}else{echo 'display: none;';}?>">
                                    <table style="padding:10px 0;margin-left:15px;" cellpadding="0" cellspacing="0" align="left">
                                        <tr>
                                            <td class="col1">Thành phố</td>
                                            <td class="col2">
                                                
                                            </td>
                                        </tr>
                                    </table>
                                </div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="4">
                                <div class="openMoreSettingBox">
                                <div class="openMoreSettingBtn"><a name="openMoreSettingBtn" idata="otherInfoOfCatalog">Thông tin khác</a></div>
                                <div class="openMoreSettingContent" id="otherInfoOfCatalog" style="display: none;">
                                    <table style="padding:10px;" cellpadding="0" cellspacing="0" align="left">
                                        <tr>
                                            <td class="col1">Hyper link</td>
                                            <td class="col2"><input default="" reset="true" type="text" value="<?php echo $hyper_link;?>" name="fHyper_link" style="width:530px;" /></td>
                                        </tr>
                                        <tr>
                                            <td class="col1">Tên Video giới thiệu</td>
                                            <td class="col2"><input default="" reset="true" type="text" value="<?php echo $video_name;?>" name="fVideo_name" style="width:530px;" /></td>
                                        </tr>
                                        <tr>
                                            <td class="col1">Video URL</td>
                                            <td class="col2"><input default="" reset="true" type="text" value="<?php echo $video_url;?>" name="fVideo_url" style="width:530px;" /></td>
                                        </tr>
                                    </table>
                                </div>
                                </div>
                            </td>
                        </tr>
                        
                        <tr>
                            <td colspan="4">
                                <div class="openMoreSettingBox">
                                <div class="openMoreSettingBtn"><a name="openMoreSettingBtn" idata="descriptionOfCatalog">Giới thiệu</a></div>
                                <div class="openMoreSettingContent" id="descriptionOfCatalog" style="display: none;">
                                    <table style="padding:10px;" cellpadding="0" cellspacing="0" align="left">
                                        <tr>
                                            <td>
                                                <textarea default="" reset="true" name="fCatalog_description" editor_format="true" mini_control="false" width="800" height="200" style="width:590px;height:80px;margin-left:10px;"><?php echo $catalog_description;?></textarea>
                                            </td>
                                        </tr>
                                    </table>
                                </div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="4">
                                <div class="openMoreSettingBox">
                                <div class="openMoreSettingBtn"><a name="openMoreSettingBtn" idata="pageTextOfCatalog">Nội dung</a></div>
                                <div class="openMoreSettingContent" id="pageTextOfCatalog" style="display: none;">
                                    <table style="padding:10px;" cellpadding="0" cellspacing="0" align="left">
                                        <tr>
                                            <td>
                                                <textarea fill_height="false" fill_width="false" default="" reset="true" name="fPagetext" editor_format="true" mini_control="false" width="800" height="400" cols="100" rows="15"><?php echo $pagetext;?></textarea>
                                            </td>
                                        </tr>
                                    </table>
                                </div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="4">
                                <div class="openMoreSettingBox">
                                <div class="openMoreSettingBtn"><a name="openMoreSettingBtn" idata="seoOfCatalog">SEO</a></div>
                                <div class="openMoreSettingContent" id="seoOfCatalog" style="display: none;">
                                    <table style="padding:10px 0;margin-left:15px;" cellpadding="0" cellspacing="0" align="left">
                                        <tr>
                                            <td class="col1">Tiêu đề</td>
                                            <td class="col2"><textarea default="" reset="true" name="fCatalog_title" style="width:500px;height:50px;"><?php echo $catalog_title;?></textarea></td>
                                        </tr>
                                        <tr>
                                            <td class="col1">Mô tả</td>
                                            <td class="col2"><textarea default="" reset="true" name="fMeta_description" style="width:500px;height:50px;"><?php echo $meta_description;?></textarea></td>
                                        </tr>
                                        <tr>
                                            <td class="col1">Từ khoá</td>
                                            <td class="col2"><textarea default="" reset="true" name="fMeta_keywords" style="width:500px;height:50px;"><?php echo show_keywordsCatalog($meta_keywords);?></textarea></td>
                                        </tr>
                                    </table>
                                </div>
                                </div>
                            </td>
                        </tr>
                    </table>
                </div>
                <!--Cột trái-->
                <div class="tab_content_info" style="display:none;">
                   <table cellpadding="5" cellspacing="0" class="table_add" id="category_show_add">
                        <tr>
                            <td colspan="4">
                                <div style="float:left;">
                                    Danh mục đang chọn
                                </div>
                                <div style="float:left;margin-left:10px;" id="current_left_selected"></div>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="4">
                                <input type="hidden" name="fCatalog_left" value="<?php echo $GLOBALS["catalog_left"];?>">
                                <input type="hidden" name="fCatalog_left_number" value="<?php echo $GLOBALS["catalog_left_number"];?>">
                                <input type="hidden" value="0" id="current_left_select_value">
                                <?php echo show_content_group_catalog_left(0);?>
                                <div style="float:left;width:100%;margin:10px 0;">
                                    <span style="float:left;margin:1px 2px;">
                                        Thứ tự <input type="text" value="<?php echo $GLOBALS["catalog_left_number"];?>" name="fCatalog_left_ordering" onfocus="if(this.value=='0') this.value=''" onblur="if(this.value=='') this.value='0'" style="width:50px;">
                                    </span>
                                    <span style="float:left;margin:0 5px;display: none;">
                                        Kiểu 
                                        <select name="fStyle_in_left" style="margin:0;">
                                            <option value="1">Kiểu 1 (4 bài tin tức có ảnh)</option>
                                            <option value="2">Kiểu 2 (8 bài không ảnh)</option>
                                        </select>
                                    </span>
                                    <span style="float:left;">
                                        <a href="javascript:;" onclick="add_catalog_left_category();"><img style="height:22px;" src="<?php echo $GLOBALS["base_folder"];?>admincp/media/add.png"></a>
                                    </span>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="4">
                                <div style="float:left;width:100%;" id="catalog_left_list">
                                    <?php echo process_catalog_left_show($catalog_left);?>
                                </div>
                            </td>
                        </tr>
                    </table>
                </div>
                <!--Cột phải-->
                <div class="tab_content_info" style="display:none;">
                   <table cellpadding="5" cellspacing="0" class="table_add" id="category_show_add">
                        <tr>
                            <td colspan="4">
                                <div style="float:left;">
                                    Danh mục đang chọn
                                </div>
                                <div style="float:left;margin-left:10px;" id="current_right_selected"></div>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="4">
                                <input type="hidden" name="fCatalog_right" value="<?php echo $GLOBALS["catalog_right"];?>">
                                <input type="hidden" name="fCatalog_right_number" value="<?php echo $GLOBALS["catalog_right_number"];?>">
                                <input type="hidden" value="0" id="current_right_select_value">
                                <?php echo show_content_group_catalog_right(0);?>
                                <div style="float:left;width:100%;margin:10px 0;">
                                    <span style="float:left;margin:1px 2px;">
                                        Thứ tự <input type="text" value="<?php echo $GLOBALS["catalog_right_number"];?>" name="fCatalog_right_ordering" onfocus="if(this.value=='0') this.value=''" onblur="if(this.value=='') this.value='0'" style="width:50px;">
                                    </span>
                                    <span style="float:left;margin:0 5px;">
                                        Kiểu 
                                        <select name="fStyle_in_right" style="margin:0;">
                                            <option value="1">Kiểu 1 (1 video 300x250)</option>
                                            <option value="2">Kiểu 2 (3 bài có ảnh và tiêu đề)</option>
                                        </select>
                                    </span>
                                    <span style="float:left;">
                                        <a href="javascript:;" onclick="add_catalog_right_category();"><img style="height:22px;" src="<?php echo $GLOBALS["base_folder"];?>admincp/media/add.png"></a>
                                    </span>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="4">
                                <div style="float:left;width:100%;" id="catalog_right_list">
                                    <?php echo process_catalog_right_show($catalog_right);?>
                                </div>
                            </td>
                        </tr>
                    </table>
                </div>
                <!--Cột giữa-->
                <div class="tab_content_info" style="display:none;">
                   <table cellpadding="5" cellspacing="0" class="table_add" id="category_show_add">
                        <tr>
                            <td colspan="4">
                                <div style="float:left;">
                                    Danh mục đang chọn
                                </div>
                                <div style="float:left;margin-left:10px;" id="current_center_selected"></div>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="4">
                                <input type="hidden" name="fCatalog_center" value="<?php echo $GLOBALS["catalog_center"];?>">
                                <input type="hidden" name="fCatalog_center_number" value="<?php echo $GLOBALS["catalog_center_number"];?>">
                                <input type="hidden" value="0" id="current_center_select_value">
                                <?php echo show_content_group_catalog_center(0);?>
                                <div style="float:left;width:100%;margin:10px 0;">
                                <span style="float:left;margin:1px 2px;">
                                    Thứ tự <input type="text" value="<?php echo $GLOBALS["catalog_center_number"];?>" name="fCatalog_center_ordering" onfocus="if(this.value=='0') this.value=''" onblur="if(this.value=='') this.value='0'" style="width:50px;">
                                </span>
                                <span style="float:left;margin:0 5px;">
                                    Kiểu 
                                    <select name="fStyle_in_center" style="margin:0;">
                                        <option value="1">Kiểu 1 (Góc báo chí)</option>
                                        <option value="2">Kiểu 2 (Khách hàng)</option>
                                    </select>
                                </span>
                                <span style="float:left;">
                                    <a href="javascript:;" onclick="add_catalog_center_category();"><img style="height:22px;" src="<?php echo $GLOBALS["base_folder"];?>admincp/media/add.png"></a></div>
                                </span>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="4">
                                <div style="float:left;width:100%;" id="catalog_center_list">
                                    <?php echo process_catalog_center_show($catalog_center);?>
                                </div>
                            </td>
                        </tr>
                    </table>
                </div>
                <div class="tab_content_info" style="display:none;padding-top:250px;display:none;">
                    <table cellpadding="5" cellspacing="0" class="table_add">
                        <tr>
                            <td>
                                <textarea name="fImage_list" default="" reset="true" style="width:706px;height:200px;display:none;"><?php echo $image_list;?></textarea>
                            </td>
                        </tr>
                    </table>
                </div>
                <?php 
                    if($catid!=0){
                        echo '<div class="tab_content_info" style="display:none;">
                            <table cellpadding="6" cellspacing="0" class="table_add">
                                <tr>
                                    <td valign="top">Người tạo : </td>
                                    <td colspan="3">'.get_colum_of_table_from_db('user_info','showname','id',$creator).'</td>
                                </tr>
                                <tr>
                                    <td valign="top">Ngày tạo : </td>
                                    <td colspan="3">'.format_full_time($create_time,'HH:mm DD/MM/YYYY').'</td>
                                </tr>
                                <tr>
                                    <td valign="top">Cập nhật lần cuối : </td>
                                    <td colspan="3">'.show_value_by_compare($update_time,0,'Chưa từng cập nhật',format_full_time($update_time,'HH:mm DD/MM/YYYY')).'</td>
                                </tr>
                                <tr>
                                    <td valign="top">Tổng số bài viết : </td>
                                    <td colspan="3">'.format_number_thousand($news_number).'</td>
                                </tr>
                                <tr>
                                    <td valign="top">Số bài viết được phê duyệt : </td>
                                    <td colspan="3">'.format_number_thousand($approve_number).'</td>
                                </tr>
                                <tr>
                                    <td valign="top">Số bài viết được xuất bản : </td>
                                    <td colspan="3">'.format_number_thousand($publish_number).'</td>
                                </tr>
                            </table>
                        </div>';
                    }
                ?>
                <div id="content_button">
                    <button class="button_style1" type="submit"><span><?php if($catid==0){echo 'Tạo mới';}else{echo 'Cập nhật';}?></span></button>
                    <button class="button_style1" onclick="return cancel_process('#catalog');" style="margin-left:5px;"><span>Hủy bỏ</span></button>
                </div>
            </form>
        </div>
    </div>
    <?php include($_SERVER['DOCUMENT_ROOT'] . $base_folder . "admincp/modules/other_info.php");?>
</div>