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
    $languageid = 1;
    $id = 0;$mode='add';
    $catid = 0;
    $parentid = 0;
    $create_time = 0;
    $poster = 0;$creator = 0;
    $content_group =0;if(isset($_GET["content_group"])){$content_group = $_GET["content_group"];}
    $note = 0;$content_type = 0;$note1 = 0;$note2 = 0;$note3 = 0;$note4 = 0;
    $can_comment = 0;
    $showinhome = $GLOBALS["meta_showinhome_content"];
    $title = $alias = '';
    $image = '';$hotimage = '';$image_large = '';
    $description = '';$hotdescription = '';
    $meta_title = '';$meta_description = '';
    $keywords = '';$video_url = '';$download_url = '';$hyper_link = '';
    $body = '';$image_list = '';$color_list = '';
    $published = $GLOBALS["meta_auto_publish_content"];
    $edit_number = 0;$editor = 0;$update_time = 0;$publish_time = 0;
    $remover = 0;$remove_time = 0;
    $publisher = 0;
    $auto_publish = 0;
    $google_index = 0;$google_index_time = 0;
    $catalog_name = '';$product_field = 0;$product_materials = 0;$areaid = 0;
    // Content_info variable
    $regionid = 0;$size = '';$product_field = 0;$product_materials = 0;$price = 0;$units = '';$price_basic = 0;$code = '';$product_manufacturer = '';$product_warranty = 0;$product_status = 0;$brandid=0;
    $other_info = '';$product_discount = '';$recruitment_salary=0;$recruitment_deadline=0;$recruitment_region='';$product_vat_is = 0;
    $product_delivery = '';$rate = 0;
    $product_warranty_text = '';
    $product_inch = 0;$product_weight = 0;$product_os = 0;$product_cd = 0;$product_card = 0;
    $product_cpu = 0;$product_ram = 0;$product_hdd = 0;$product_pin = 0;$colorid = 0;
    $ticket_type = 0;$ticket_from = 0;$ticket_to = 0;$ticket_day = '';
    $hour_leave = 0;$minute_leave = 0;$hour_down = 0;$minute_down = 0;
    $round_trip = 0;$ticket_seat = '';
    $tax = 0;$tax_child = 0;$tax_baby = 0;$price_discount = 0;
    $is_discount = 0;$ticket_airline = 0;$flight_code = '';
    $ticket_airport_start = '';$ticket_airport_end = '';
    
    $hotel_image = '';$hotel_address = '';$hotel_discount_percent = 0;$hotel_price_min = 0;$hotel_star = 0;
    $hotel_discount = 0;$hotel_region = 0;$hotel_region_parent = 0;
    $hotel_policy = '';$hotel_detail = '';$hotel_about = '';
    
    $tour_image = '';$tour_time = '';$tour_start_address = '';$tour_end_address = '';$tour_vehicle = '';$tour_schedule = '';$tour_address = '';$tour_price = 0;$tour_units = '';$tour_everyday = 0;$tour_isdiscount = '';$tour_detail = '';$tour_type = 0;
    $tour_address_detail = '';
    $table_query = 'catalog';
    if(isset($_GET["id"])){
        $id = $_GET["id"];
        if($id!=0){
            $mode = 'edit';
        }
        get_content_from_db($id);
        get_content_from_content_info($id);
        $hotel_region_parent = fn_get_column_of_table_with_query("select parentid from catalog where catid = $hotel_regionid",0,0);
    }
    if($languageid==1){$language_alias = 'vn';}
    elseif($languageid==2){$language_alias = 'en';}
    function get_content_from_db($contentid){
        $query = "select content.catid,content.parentid,content.create_time,content.content_group,content.note,content.note1,content.note2,content.note3,content.note4,content.content_type,content.can_comment,content.showinhome,content.languageid
                        ,content.google_index,content.google_index_time,content.auto_publish
                        ,content_meta.title,content_meta.alias,content_meta.image,content_meta.hotimage,content_meta.hotdescription,content_meta.image_large,content_meta.description,content_meta.meta_title,content_meta.meta_description,content_meta.keywords,content_meta.video_url,content_meta.download_url,content_meta.hyper_link
                        ,content_body.body
                        ,content_process.published,content_process.publish_time,content_process.publisher,content_process.poster,edit_number,editor,edit_time,remover,remove_time
                        ,catalog.catalog_name 
                    from content,content_process,content_meta,content_body,catalog 
                    where content.contentid = content_meta.contentid 
                            and content.catid = catalog.catid 
                            and content.contentid = content_process.contentid 
                            and content.contentid = content_body.contentid 
                            and content.contentid = $contentid";//echo $query;
        $result = mysql_query($query,$GLOBALS["con"]);
        if(mysql_num_rows($result) > 0){
            $row = mysql_fetch_array($result);
            $GLOBALS['catid'] = $row['catid'];$GLOBALS['languageid'] = $row['languageid'];
            $GLOBALS['parentid'] = $row['parentid'];
            $GLOBALS['create_time'] = $row['create_time'];
            $GLOBALS['content_group'] = $row['content_group'];
            $GLOBALS['note'] = $row['note'];
            $GLOBALS['note1'] = $row['note1'];$GLOBALS['note2'] = $row['note2'];
            $GLOBALS['note3'] = $row['note3'];$GLOBALS['note4'] = $row['note4'];
            $GLOBALS['content_type'] = $row['content_type'];
            $GLOBALS["can_comment"] = $row['can_comment'];
            $GLOBALS["showinhome"] = $row['showinhome'];
            $GLOBALS["title"] = $row['title'];$GLOBALS["alias"] = $row['alias'];
            $GLOBALS["image"] = $row['image'];$GLOBALS["hotimage"] = $row['hotimage'];$GLOBALS["image_large"] = $row['image_large'];
            $GLOBALS["description"] = $row['description'];$GLOBALS["hotdescription"] = $row['hotdescription'];
            $GLOBALS["meta_title"] = $row['meta_title'];$GLOBALS["meta_description"] = $row['meta_description'];$GLOBALS["keywords"] = $row['keywords'];
            $GLOBALS["video_url"] = $row['video_url'];$GLOBALS["download_url"] = $row['download_url'];
            $GLOBALS["hyper_link"] = $row['hyper_link'];
            $GLOBALS["body"] = $row['body']; 
            $GLOBALS["published"] = $row['published'];$GLOBALS["publish_time"] = $row['publish_time'];
            $GLOBALS["edit_number"] = $row['edit_number'];$GLOBALS["editor"] = $row['editor'];$GLOBALS["edit_time"] = $row['edit_time'];
            $GLOBALS["publisher"] = $row['publisher'];
            $GLOBALS['poster'] = $row['poster'];$GLOBALS['creator'] = $row['poster'];
            $GLOBALS['remover'] = $row['remover'];$GLOBALS['remove_time'] = $row['remove_time'];
            $GLOBALS["catalog_name"] = $row['catalog_name'];
            mysql_free_result($result);  
            return true;
        }
        else{
            //Header("Location: " . $GLOBALS['base_folder']);
            return false;
        }
    }
    
    function get_content_from_content_info($contentid){
        $query = "select * from content_info where contentid = $contentid";
        $result= mysql_query($query,$GLOBALS["con"]);
        if($result==false||mysql_num_rows($result)<=0){return false;}
        else{
            $row = mysql_fetch_array($result);
            $GLOBALS['regionid'] = $row['regionid'];$GLOBALS['size'] = $row['size'];$GLOBALS['image_list'] = $row['image_list'];$GLOBALS['color_list'] = $row['color_list'];$GLOBALS['areaid'] = $row['areaid'];
            $GLOBALS['product_field'] = $row['product_field'];$GLOBALS['product_materials'] = $row['product_materials'];
            $GLOBALS['price'] = $row['price'];$GLOBALS['units'] = $row['units'];
            $GLOBALS['price_basic'] = $row['price_basic'];
            $GLOBALS['code'] = $row['code'];$GLOBALS['product_manufacturer'] = $row['product_manufacturer'];
            $GLOBALS['product_warranty'] = $row['product_warranty'];$GLOBALS['product_status'] = $row['product_status'];$GLOBALS['product_vat_is'] = $row['product_vat_is'];
            $GLOBALS['other_info'] = $row['other_info'];$GLOBALS['product_discount'] = $row['product_discount'];
            $GLOBALS['recruitment_salary'] = $row['recruitment_salary'];$GLOBALS['recruitment_deadline'] = $row['recruitment_deadline'];$GLOBALS['brandid'] = $row['brandid'];
            $GLOBALS['recruitment_region'] = str_ireplace('<br>',chr(13),$row['recruitment_region']);
            $GLOBALS['product_delivery'] = $row['product_delivery'];
            $GLOBALS['rate'] = $row['rate'];$GLOBALS['product_warranty_text'] = $row['product_warranty_text'];
            $GLOBALS['product_inch'] = $row['product_inch'];$GLOBALS['product_weight'] = $row['product_weight'];
            $GLOBALS['product_os'] = $row['product_os'];$GLOBALS['product_cd'] = $row['product_cd'];
            $GLOBALS['product_card'] = $row['product_card'];$GLOBALS['product_cpu'] = $row['product_cpu'];
            $GLOBALS['product_ram'] = $row['product_ram'];$GLOBALS['product_hdd'] = $row['product_hdd'];$GLOBALS['colorid'] = $row['colorid'];
            $GLOBALS['product_pin'] = $row['product_pin'];
            
            $GLOBALS['ticket_type'] = $row['ticket_type'];$GLOBALS['ticket_from'] = $row['ticket_from'];
            $GLOBALS['ticket_to'] = $row['ticket_to'];$GLOBALS['ticket_day'] = $row['ticket_day'];
            $GLOBALS['hour_leave'] = $row['hour_leave'];$GLOBALS['minute_leave'] = $row['minute_leave'];
            $GLOBALS['hour_down'] = $row['hour_down'];$GLOBALS['minute_down'] = $row['minute_down'];
            $GLOBALS['round_trip'] = $row['round_trip'];$GLOBALS['ticket_seat'] = $row['ticket_seat'];
            $GLOBALS['tax'] = $row['tax'];$GLOBALS['tax_child'] = $row['tax_child'];
            $GLOBALS['tax_baby'] = $row['tax_baby'];$GLOBALS['price_discount'] = $row['price_discount'];
            $GLOBALS['is_discount'] = $row['is_discount'];$GLOBALS['ticket_airline'] = $row['ticket_airline'];
            $GLOBALS['flight_code'] = $row['flight_code'];
            $GLOBALS['ticket_airport_start'] = $row['ticket_airport_start'];
            $GLOBALS['ticket_airport_end'] = $row['ticket_airport_end'];
            
            $GLOBALS['hotel_image'] = $row['hotel_image'];$GLOBALS['hotel_address'] = $row['hotel_address'];
            $GLOBALS['hotel_discount_percent'] = $row['hotel_discount_percent'];
            $GLOBALS['hotel_price_min'] = $row['hotel_price_min'];
            $GLOBALS['hotel_star'] = $row['hotel_star'];$GLOBALS['hotel_regionid'] = $row['hotel_regionid'];
            $GLOBALS['hotel_discount'] = $row['hotel_discount'];
            $GLOBALS['hotel_policy'] = $row['hotel_policy'];$GLOBALS['hotel_detail'] = $row['hotel_detail'];
            $GLOBALS['hotel_about'] = $row['hotel_about'];
            
            $GLOBALS['tour_image'] = $row['tour_image'];$GLOBALS['tour_time'] = $row['tour_time'];
            $GLOBALS['tour_start_address'] = $row['tour_start_address'];
            $GLOBALS['tour_end_address'] = $row['tour_end_address'];
            $GLOBALS['tour_vehicle'] = $row['tour_vehicle'];$GLOBALS['tour_schedule'] = $row['tour_schedule'];
            $GLOBALS['tour_address'] = $row['tour_address'];
            $GLOBALS['tour_price'] = $row['tour_price'];
            $GLOBALS['tour_units'] = $row['tour_units'];
            $GLOBALS['tour_everyday'] = $row['tour_everyday'];$GLOBALS['tour_isdiscount'] = $row['tour_isdiscount'];
            $GLOBALS['tour_detail'] = $row['tour_detail'];$GLOBALS['tour_type'] = $row['tour_type'];
            mysql_free_result($result);  
            return true;
        }
    }
    
    function show_keywords($keywords){
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
    function get_subcatalogs($parentid,$name){
        if($parentid==0){return "";}
        $query = "select catid,catalog_name from catalogs where parentid = $parentid order by catalog_name ASC";
        $result = mysql_query($query,$GLOBALS["con"]);
        if($result==false||mysql_num_rows($result)<=0){
            return "";
        }
        else{
            $strreturn = '<div class="sub_catalog"' . $name . '>';
            while($row = mysql_fetch_array($result)){
                $GLOBALS["menu_number"] = $GLOBALS["menu_number"] + 1;
                $sub_name = ' name="expand' . $row['catid'] . '"';
                $sub_cat = get_subcatalogs($row['catid'],$sub_name);
                $strreturn = $strreturn . '<div>';
                if($sub_cat!=""){
                    $strreturn = $strreturn . '<span' . $sub_name . '>+</span> ';
                }
                $strreturn = $strreturn . '<a value="' . $row['catid'] . '">' . $row['catalog_name'] . '</a></div>';
                $strreturn = $strreturn . $sub_cat;
            }
            $strreturn = $strreturn . '</div>';
            return $strreturn;
        }
    }
    function get_catalogs($catalog_type){
        $query = "select catid,catalog_name from catalogs where parentid = 0 and type = $catalog_type order by catalog_name ASC";
        $result = mysql_query($query,$GLOBALS["con"]);
        if($result==false||mysql_num_rows($result)<=0){
            return false;
        }
        else{
            echo '<div id="mn_content_add">';
            while($row = mysql_fetch_array($result)){
                $GLOBALS["menu_number"] = $GLOBALS["menu_number"] + 1;
                $name = ' name="expand' . $row['catid'] . '"';
                $title = ' title="expand' . $row['catid'] . '"';
                $class = '';
                $sub_cat = get_subcatalogs($row['catid'],$name);
                echo '<div class="parent">';
                if($sub_cat!=""){
                    echo '<span' . $title . '>+</span>';
                }
                else{
                    echo '<span></span>';
                }
                if($GLOBALS["catid"]==$row['catid']){
                    $class = ' class="active"';
                }
                echo '<a' . $class . ' value="' . $row['catid'] . '">' . $row['catalog_name'] . '</a></div>';
                echo $sub_cat;
            }
            echo '</div>';
            return true;
        }
    }
    function show_directory_post($id,$content_group){
        $table_query = $GLOBALS["table_query"];
        if($id != 0 || $content_group != 0){
            echo '<div class="post_select_category">';
            $catalog_level_array = array();
            $strshow = '';
            $strshow = $strshow . show_content_group($content_group);
            $i = 0;$k = 1;$last = false;
            if($id!=0){
                $catid = $id;
                $parentid = get_parent_id($catid,$table_query);
                while($parentid!=0&&$i<10){
                    $catalog_level_array[$i] = get_catalog_option($catid,$parentid,$content_group,$table_query,$last);
                    $catid = $parentid;
                    $parentid = get_parent_id($parentid,$table_query);
                    $i = $i + 1;
                }
                
                $catalog_level_array[$i] = get_catalog_option($catid,$parentid,$content_group,$table_query,$last);
                for($j=$i;$j>=0;$j--){
                    $strshow = $strshow . '<div id="category_' . $k . '" class="category_level"><div class="current_level">Cấp ' . $k . '</div><select onclick="change_catalogs_of_content_add(this.value,' . $k . ',0,0);" multiple="multiple">' . $catalog_level_array[$j] . '</select></div>'; // get list parent
                    $k = $k + 1;
                }
            }
            $str_current_level = get_catalog_option(0,$id,$content_group,$table_query,false);
            if($str_current_level!=''){
                $strshow = $strshow . '<div id="category_' . $k . '" class="category_level"><div class="current_level">Cấp ' . $k . '</div><select onclick="change_catalogs_of_content_add(this.value,' . $k . ',0,0);" multiple="multiple">' . get_catalog_option(0,$id,$content_group,$table_query,false) . '</select></div>'; // get sub catalogs of current id 
                $k = $k + 1;
            }
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
    function show_content_group($content_group){
        $query = "select id,name from content_group where status = 1 and languageid = 1 and id not in (10) order by ordering ASC";
        $result = mysql_query($query,$GLOBALS["con"]);
        if($result==false||mysql_num_rows($result)<=0){
            return '';
        }
        else{
            $display = '';
            if($content_group==2){
                //$display = ' style="display:none;"';
            }
            $strreturn = '<div'.$display.' id="category_0" class="category_level category_first"><div class="current_level">Loại</div>
                            <select class="select_product_category" multiple="multiple" onclick="change_catalogs_of_content_add(this.value,0,0,1);">';
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
    function get_catalog_option($catid,$parentid,$content_group,$table_query,$last){
        $query = "select catid,catalog_name from $table_query where parentid = $parentid and languageid = ".$GLOBALS["languageid"]." and content_group = $content_group order by catalog_name ASC";
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
        echo 'Bạn đang chọn chuyên mục: ';
        $content_group = $GLOBALS["content_group"];
        echo '<a class="catalog_text">'.get_content_group_name_from_db($content_group) . '</a>';
        $directory_return = '';
        $parentid = get_parent_id($id,$table_query);
        if($parentid==0){
        }
        else{
            $i = 0;
            while($parentid!=0&&$i<10){
                if($i==0){
                    $directory_return = ' &gt; ' . get_catalog_name_from_id($parentid,$table_query);
                }
                else{
                    $directory_return = ' &gt; ' . get_catalog_name_from_id($parentid,$table_query) . ' &gt; ' . $directory_return;
                }
                $parentid = get_parent_id($parentid,$table_query);
                $i = $i + 1;
            }
            //$directory_return = $directory_return . ' > ';
        }
        
        echo $directory_return . ' &gt; ' . get_catalog_name_from_id($id,$table_query);
        echo '</div>';
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
    function get_catalog_name_from_id($id,$table_query){
        $query = "select content_group,catalog_name from $table_query where catid = $id";
        $result = mysql_query($query,$GLOBALS["con"]);
        if($result==false||mysql_num_rows($result)<=0){
            return "";
        }
        else{
            $row = mysql_fetch_array($result);
            $hyper_tag = 'catalog';
            return '<a class="catalog_text" href="#catalog_add?id=' . $id . '&mn=mn_' . $hyper_tag . '&content_group=' . $row['content_group'] . '" onclick="main_menu_click(\'' . $hyper_tag . '_add\',\'mn_' . $hyper_tag . '\',\'#admin_content\',\'' . $hyper_tag . '_add.php?id=' . $id . '\',\'\');">' . $row['catalog_name'] . '</a>';
        }
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
    
    function show_image_list($image_list){
        $count = 0;
        echo '<div class="image_list_content"><div id="image_list">';
        if($image_list!=""){
            $list = explode(';', $image_list);
            for($i=0;$i<sizeof($list);$i++){
                $value = trim($list[$i]);
                $image = substr($value,1);
                $image = substr($image,0,strpos($image,']'));
                $name = substr($value,0,strrpos($value,']'));
                $name = substr($name,strrpos($name,'[')+1);
                $image_process = image_process_http($image);
                if($image!=""){
                    $image = image_process_http($image);
                    $count = $count + 1;
                    //$color_code = fn_get_column_of_table_with_query("select code from content_type where id = $name",'','');
                    echo '<span class="image_number">';
                    //echo '<a class="color" onclick="change_color_of_product_previous($(this),\''.$image.'\',\'['.$image.']['.$name.']\');" style="background:'.$color_code.'">&nbsp;</a>';
                    echo '<input class="input_name" value="'.$name.'">';
                    echo '<a class="title" title="'.$name.'">'.$name.'</a><img src="' . $image_process . '"><a onclick="delete_image_from_content(\'' . $image . '\')" class="delete">Xóa</a><a class="view" target="_blank" href="' . $image . '" title="'.$name.'">Xem</a></span>';
                }
            }
        }
        echo '</div><div id="count_image_upload">'.$count.'</div>';
        echo '</div>';
    }
    
    function show_color_list($image_list){
        $count = 0;
        echo '<div class="color_list_content"><div id="color_list">';
        if($image_list!=""){
            $list = explode(';', $image_list);
            for($i=0;$i<sizeof($list);$i++){
                $value = trim($list[$i]);
                $image = substr($value,1);
                $image = substr($image,0,strpos($image,']'));
                $name = substr($value,0,strrpos($value,']'));
                $name = substr($name,strrpos($name,'[')+1);
                $image = image_process_http($image);
                if($image!=""){
                    $image = image_process_http($image);
                    $count = $count + 1;
                    echo '<span class="color_number"><a class="title" title="'.$name.'">'.$name.'</a><img src="' . $image . '"><a onclick="delete_color_from_content(\'' . $image . '\')" class="delete">Xóa</a></span>';
                }
            }
        }
        echo '</div><div id="count_color_upload">'.$count.'</div>';
        echo '</div>';
    }
    
    function show_region_directory_post($id){
        $table_query = 'region';
        if($id!=0){
            $content_group = 1;
            echo '<div class="post_select_category">';
            $catalog_level_array = array();
            $strshow = '';
            $catid = $id;
            $parentid = get_region_parent_id($catid,$table_query);
            $i = 0;
            while($parentid!=0&&$i<10){
                $last = false;
                //if($i==0){
                    //$last = true;
                //}
                $catalog_level_array[$i] = get_region_option($catid,$parentid,$content_group,$table_query,$last);
                $catid = $parentid;
                $parentid = get_region_parent_id($parentid,$table_query);
                $i = $i + 1;
            }
            $last = false;
            //if($i==0){
                //$last = true;
            //}
            $catalog_level_array[$i] = get_region_option($catid,$parentid,$content_group,$table_query,$last);
            $strshow = $strshow . show_region_choose($content_group); // get content_group
            $k = 1;
            for($j=$i;$j>=0;$j--){
                $strshow = $strshow . '<div id="region_choose_' . $k . '" class="category_level"><select onclick="change_region_of_content_add(this.value,' . $k . ',0,0);" multiple="multiple">' . $catalog_level_array[$j] . '</select></div>'; // get list parent
                $k = $k + 1;
            }
            $strlast = get_region_option(0,$id,$content_group,$table_query,false); // get sub region of current region
            if($strlast!=""){
                $strshow = $strshow . '<div id="region_choose_' . $k . '" class="category_level"><select onclick="change_region_of_content_add(this.value,' . $k . ',0,0);" multiple="multiple">' . $strlast . '</select></div>';
                $k = $k + 1;
            }
            while($k<=10){
                $strshow = $strshow . '<div id="region_choose_' . $k . '" class="category_level"></div>';
                $k++;
            }
            echo $strshow;
            echo '</div>';
        }
        else{
            echo show_region_choose(0);
        }
    }
    function get_region_option($catid,$parentid,$content_group,$table_query,$last){
        $query = "select id,region_name from $table_query where region_parent = $parentid order by region_name ASC";
        $result = mysql_query($query,$GLOBALS["con"]);
        if($result==false||mysql_num_rows($result)<=0){
            return '';
        }
        else{
            $strreturn = '';
            while($row = mysql_fetch_array($result)){
                $selected = '';
                if($catid==$row['id']&&$last==false){
                    $selected = ' selected="selected"';
                }
                $strreturn = $strreturn . '<option' . $selected . ' value="' . check_region_finish($row['id'],$table_query) . '_' . $row['id'] . '">' . substring($row['region_name'],30) . '</option>';
            }
            return $strreturn;
        }
    }
    function check_region_finish($id,$table_query){
        $query = "select id from $table_query where region_parent = $id order by region_name ASC";
        $result = mysql_query($query,$GLOBALS["con"]);
        if($result==false||mysql_num_rows($result)<=0){
            return "true";
        }
        else{
            return "false";
        }
    }
    function get_region_parent_id($id,$table_query){
        $query = "select region_parent from $table_query where id = $id";
        $result = mysql_query($query,$GLOBALS["con"]);
        if($result==false||mysql_num_rows($result)<=0){
            return 0;
        }
        else{
            $row = mysql_fetch_array($result);
            return $row[0];
        }
    }
    function show_region_choose($id){
        $strreturn = '<div id="region_choose_0" class="category_level category_first">
                    <select class="select_product_category" multiple="multiple" onclick="change_region_of_content_add(this.value,0,0,1);">';
        
        if($id==0){
            $strreturn = $strreturn . '<option value="1">Chọn tỉnh</option></select></div>';
            $strreturn = $strreturn . '<div id="region_choose_1" class="category_level"></div>
                        <div id="region_choose_2" class="category_level"></div>
                        <div id="region_choose_3" class="category_level"></div>
                        <div id="region_choose_4" class="category_level"></div>
                        <div id="region_choose_5" class="category_level"></div>
                        <div id="region_choose_6" class="category_level"></div>
                        <div id="region_choose_7" class="category_level"></div>
                        <div id="region_choose_8" class="category_level"></div>
                        <div id="region_choose_9" class="category_level"></div>
                        <div id="region_choose_10" class="category_level"></div>';
        }
        else{
            $strreturn = $strreturn . '<option selected="selected" value="1">Chọn tỉnh</option></select></div>';
        }
        return $strreturn;
    }
    // Product field
    function get_product_field_list($currentid,$selectname,$type){
        echo '<select name="'.$selectname.'" style="margin: 0;">';
        echo '<option value="0">Chưa chọn</option>';
        $query = "select * from support_list where status = 1 and type = $type order by name ASC";
        $result = mysql_query($query,$GLOBALS["con"]);
        if($result==false || mysql_num_rows($result)<=0){
            
        }
        else{
            $i = 0;
            echo '';
            while($row = mysql_fetch_array($result)){
                $selected = '';
                if($currentid==$row['id']){
                    $selected = ' selected="selected"';
                }
                echo '<option'.$selected.' value="'.$row['id'].'">'.$row['name'].'</option>';
                $i = $i + 1;
            }
        }
        echo '</select>';
        return true;
    }
?>
<div class="div_upload_fast">
    <form id="frmUpload_image" action="<?php echo $GLOBALS["base_folder"];?>modules/upload_image_fast.php" method="POST" ENCTYPE="multipart/form-data" target="upload_target">
        <input name="userfile" type="file" onchange="upload_image_fast();" />
        <input name="fMode" type="hidden" value="1">
        <iframe name="upload_target" src="#" style="width:0px;height:0px;border:0px;display:none;"></iframe>
    </form>
</div>
<?php include($_SERVER['DOCUMENT_ROOT'] . $base_folder . "admincp/modules/content_left.php");?>
<style type="text/css">
    .colorChoose{margin: 0;padding: 0;list-style: none;}
    .colorChoose li{float:left;margin:3px;-webkit-border-radius:4px;-moz-border-radius:4px;border-radius:4px;border:1px solid #E6E6E6;overflow:hidden;}
    .colorChoose li a{float:left;width:23px;height:23px;}
    .colorChoose li:hover{border:1px solid #000000;cursor:pointer;}
    .colorChoose li.active{box-shadow:#666666 0px 0px 2px;}
    .colorBoxBg{position: fixed;float:left;width:100%;height:100%;left:0;top:0;z-index: 500;background:url(../admincp/media/dark_transparent.png) top left repeat;display: none;}
    .colorBoxChoose{position: fixed;top:50%;left:50%;float:left;width:300px;padding:10px 0;margin:-150px 0 0 -50px;background-color: #f9f9f9;box-shadow:0 0 6px #EEEEEE;z-index:600;display: none;}
 
.sizeIDProducts{}
.sizeIDProducts .color{float:left;height:15px;margin:0 5px 7px 0;padding:5px;background-color:#FFFFFF;border:1px solid #F1F1F1;box-shadow:0 0 2px #999999;text-align: center;}
.sizeIDProducts .color:hover{float:left;height:15px;margin:0 5px 7px 0;padding:5px;border:1px solid #ffffff;box-shadow: 1px 2px 3px #333333;cursor: pointer;text-align: center;}
.sizeIDProducts .colorSelect{float:left;height:15px;margin:-3px 5px 10px 0;padding:5px;border:1px solid #ffffff;box-shadow: 1px 2px 3px #000000;cursor: pointer;text-align: center;color:#1FAB04;}

#colorIDChooseProducts{}
#colorIDChooseProducts .color{float:left;height:15px;margin:0 5px 7px 0;padding:5px;background-color:#FFFFFF;border:1px solid #F1F1F1;box-shadow:0 0 2px #999999;text-align: center;}
#colorIDChooseProducts .color:hover{float:left;height:15px;margin:0 5px 7px 0;padding:5px;border:1px solid #ffffff;box-shadow: 1px 2px 3px #333333;cursor: pointer;text-align: center;}
#colorIDChooseProducts .colorSelect{float:left;height:15px;margin:-3px 5px 10px 0;padding:5px;border:1px solid #ffffff;box-shadow: 1px 2px 3px #000000;cursor: pointer;text-align: center;color:#1FAB04;}

 
.ticketType{max-width:725px;}
.ticketType a{display: inline-block;background-color: #ffffff;border:1px solid #CCCCCC;padding:6px 12px;margin:1px 10px
 6px 0;}
 .ticketType a:hover{box-shadow:1px 1px 2px #AAAAAA;cursor: pointer;color:#000000;}
 .ticketType a.active{box-shadow:0 0 3px #000000;cursor: default;color:#000000;font-weight: bold;}
 
.ticketGoto{max-width:725px;}
.ticketGoto a{width:80px;display: inline-block;background-color: #ffffff;border:1px solid #CCCCCC;padding:5px 8px;margin:1px 5px 5px 0;border-radius:2px;}
 .ticketGoto a:hover{box-shadow:0 0 2px #AAAAAA;cursor: pointer;color:#000000;}
 .ticketGoto a.active{box-shadow:0 0 2px #1FAB04;cursor: default;color:#1FAB04;}
 
.ticketDay{max-width:725px;}
.ticketDay a{width:80px;display: inline-block;background-color: #ffffff;border:1px solid #CCCCCC;padding:5px 8px 3px 8px;margin:1px 5px 5px 0;border-radius:0;}
.ticketDay a:hover{box-shadow:0 0 2px #AAAAAA;cursor: pointer;color:#000000;}
.ticketDay a.active{box-shadow:0 0 2px #1FAB04;cursor: pointer;color:#1FAB04;}

.ticketArlines{max-width:725px;}
.ticketArlines a{width:100px;display: inline-block;background-color: #ffffff;border:1px solid #CCCCCC;padding:5px 8px 4px 8px;margin:1px 5px 5px 0;border-radius:0;vertical-align: top;}
.ticketArlines .logo{display: table-cell;width:100px;height:30px;text-align: center;vertical-align: middle;}
.ticketArlines .logo img{max-width:100px;max-height:30px;}
.ticketArlines .name{display: block;text-align: center;height:15px;overflow: hidden;white-space: nowrap;}
.ticketArlines a:hover{box-shadow:0 0 2px #AAAAAA;cursor: pointer;color:#000000;}
.ticketArlines a.active{box-shadow:0 0 2px #1FAB04;cursor: pointer;color:#1FAB04;}

.hotel_room_list_tbl{}
.hotel_room_list_tbl .fnc{}
.hotel_room_list_tbl .fnc .add{display: inline-block;background:url(media/add-icon16x16.png) 0 0 no-repeat;width:16px;height:16px;cursor: pointer;text-indent: -9999px;}
.hotel_room_list_tbl .fnc .remove{display: inline-block;background:url(media/remove.png) 0 0 no-repeat;width:16px;height:16px;cursor: pointer;text-indent: -9999px;}
</style>
<script type="text/javascript">
$(document).ready(function(){
    $( "#image_list" ).sortable({ opacity: 0.6, cursor: "move" });
});
$(".sizeIDProducts").find(".color").live("click", function(){
    var parentObj = $(this).parent().parent().parent();
    var colorid = parentObj.find("input.sizeList").val();
    var data = $(this).attr("idata");
    colorid += ',' + data;
    if(colorid.indexOf(",")==0){colorid = colorid.substring(1);}
    parentObj.find("input.sizeList").val(colorid);
    $(this).attr("class","colorSelect");
});
$(".sizeIDProducts").find(".colorSelect").live("click", function(){
    var parentObj = $(this).parent().parent().parent();
    var colorid = parentObj.find("input.sizeList").val();
    var data = $(this).attr("idata");
    colorid = ',' + colorid + ',';
    colorid = colorid.replace(','+data+',',',');
    if(colorid.indexOf(",")==0){colorid = colorid.substring(1);}
    if(colorid.lastIndexOf(",")==colorid.length-1){colorid = colorid.substring(0,colorid.length-1);}
    parentObj.find("input.sizeList").val(colorid);
    $(this).attr("class","color");
});
$("#colorIDChooseProducts").find(".color").live("click", function(){
    var colorid = $("#coloridList").val();
    var data = $(this).attr("idata");
    colorid += ',' + data;
    if(colorid.indexOf(",")==0){colorid = colorid.substring(1);}
    $("#coloridList").val(colorid);
    $(this).attr("class","colorSelect");
});
$("#colorIDChooseProducts").find(".colorSelect").live("click", function(){
    var colorid = $("#coloridList").val();
    var data = $(this).attr("idata");
    colorid = ',' + colorid + ',';
    colorid = colorid.replace(','+data+',',',');
    if(colorid.indexOf(",")==0){colorid = colorid.substring(1);}
    if(colorid.lastIndexOf(",")==colorid.length-1){colorid = colorid.substring(0,colorid.length-1);}
    $("#coloridList").val(colorid);
    $(this).attr("class","color");
});
var colorObj;
function change_color_of_product_previous(obj,url_image,strChange){
    $("#upload_image_color_status").val(1);
    $("#upload_image_color_message").val(url_image);
    $("#upload_image_color_url_return").val(strChange);
    $("#upload_image_color_mode").val(1);
    colorObj = obj;
    $(".colorBoxChoose").show();
    $(".colorBoxBg").show();
}
function change_color_of_product(colorid,colorcode){
    try{
        if($("#upload_image_color_mode").val()==0 || $("#upload_image_color_mode").val()=='0'){
            $("[name='fImage_color_choose']").val(colorid);
            $("[name='fImage_color_choose']").attr("colorcode",colorcode);
            $(".colorBoxChoose").hide();
            $(".colorBoxBg").hide();
            process_after_choose_color_of_product($("#upload_image_color_status").val(),$("#upload_image_color_message").val(),$("#upload_image_color_url_return").val());
        }
        else{
            $("[name='fImage_color_choose']").val(colorid);
            $("[name='fImage_color_choose']").attr("colorcode",colorcode);
            /*
            var str = '['+$("#upload_image_color_message").val()+']['+colorid+']';
            var str_change = $("#upload_image_color_url_return").val();
            var strOriginal = $("[name='fImage_list']").val();
            strOriginal = strOriginal.replace(str_change,str);
            $("[name='fImage_list']").val(strOriginal);
            */
            colorObj.css("background",colorcode);
            colorObj.parent().find(".input_name").val(colorid);
            $(".colorBoxChoose").hide();
            $(".colorBoxBg").hide();
            get_slide_content_from_image_list();
        }
    }
    catch(err){
        alert(err);
    }
    //obj.parent().find("li").removeAttr("class");
    //obj.attr("class","active");
}
function process_after_choose_color_of_product(status,message,url_return){
    var name = $("[name='fImage_color_choose']").val();
    var add_value = '<span class="image_number">';
    add_value += '<a class="color" onclick="change_color_of_product_previous($(this),\''+url_return+'\',\'['+url_return+']['+name+']\');" style="background:'+$("[name='fImage_color_choose']").attr("colorcode")+'">&nbsp;</a>';
    add_value += '<input class="input_name" value="'+name+'"><img src="' + base_folder + url_return + '">';
    add_value += '<a class="delete" onclick="delete_image_from_content(\'' + base_folder + url_return + '\')">Xóa</a>';
    add_value += '<a class="view" target="_blank" href="'+base_folder+url_return+'" title="'+name+'">Xem</a>';
    add_value += '</span>';
    add_value = $("#image_list").html() + add_value;
    $("#image_list").html(add_value);
    
    $( "#image_list" ).sortable({ opacity: 0.6, cursor: "move" });
    
    $("#uploading_status").html('<font color="green">Tải thành công!</font>');
    var count_image = parseInt($("#count_image_upload").html()) + 1;
    $("#count_image_upload").html(count_image);
    get_slide_content_from_image_list();
}
/*
$(".regionPosOfContent").find("a").live("click",function(){
    var parentObj = $(this).parent().parent();
    var obj = $(this);
    var inputObj = parentObj.find(".inputVal");
    var idata = obj.attr("idata");
    inputObj.val(idata);
    parentObj.find("a").removeAttr("class");
    obj.attr("class","active");
});
$("#ticketFromRegion").find("a").live("click",function(){
    var parentObj = $(this).parent();
    var obj = $(this);
    var inputObj = parentObj.find(".inputVal");
    var idata = obj.attr("idata");
    inputObj.val(idata);
    parentObj.find("a").removeAttr("class");
    obj.attr("class","active");
    $("#regionFromList").find(".ticketGoto").hide();
    $("#regionFromList").find("[name='ticketGoto"+idata+"']").show();
});
*/
$("#ticketType").find("a").live("click",function(){
    var parentObj = $(this).parent();
    var obj = $(this);
    var inputObj = parentObj.find(".inputVal");
    var idata = obj.attr("idata");
    inputObj.val(idata);
    parentObj.find("a").removeAttr("class");
    obj.attr("class","active");
});
$("#flight_schedules_container").find("a").live("click",function(){
    try{
        var parentObj = $(this).parent();
        var obj = $(this);
        var inputObj = parentObj.find(".inputVal");
        
        var state = obj.attr("class");
        if(state=='active'){
            obj.removeAttr("class");
        }
        else{
            obj.attr("class","active");
        }
        var str = '';
        parentObj.find("a").each(function(index){
            if($(this).attr("class")=='active'){
                str += ',' +$(this).attr("idata") ;
            }
        });
        if(str.indexOf(",")==0){str=str.substring(1);}
        inputObj.val(str);
    }
    catch(err){
        alert(err);
    }
});
$("#airlineList").find("a").live("click",function(){
    var parentObj = $(this).parent().parent();
    var obj = $(this);
    var inputObj = parentObj.find(".inputVal");
    var idata = obj.attr("idata");
    inputObj.val(idata);
    parentObj.find("a").removeAttr("class");
    obj.attr("class","active");
});

$("#regionOfHotel").find("[name='hotel_region']").live("change",function(){
    var obj = $(this);
    var idata = obj.val();
    var currentid = obj.attr("currentid");
    var reqData = "act=get_region_list_for_select&currentid="+currentid+"&parentid="+idata+"&default_value=0&default_text=-- Chọn Quận/Huyện --";
    var request = jQuery.ajax({
        url: base_folder+"ajax/ajax.php",
        type: "POST",
        data: reqData,
        cache: false,
        success: function(result){
            $("#regionOfHotel").find("[name='hotel_region_sub']").html(result);
        }
    });
});

$("[name='removeHotelRoomNewBtn']").live("click",function(){
    var obj = $(this);
    var tableObj = $("[name='hotel_room_list_tbl']");
    var rowObj = $(this).parent().parent();
    rowObj.remove();
    var totel_room_number = $("[name='hotel_room_total_number']").val();
    totel_room_number = parseInt(totel_room_number)-1;
    $("[name='hotel_room_total_number']").val(totel_room_number);
    
    var rowNumber = 1;
    tableObj.find("tr.item").each(function(index){
        var row_item = $(this);
        row_item.find(".stt").find("input").val(rowNumber);
        row_item.find(".hotel_room_id").attr("name","hotel_room_id"+rowNumber);
        row_item.find(".hotel_room_stt").attr("name","hotel_room_stt"+rowNumber);
        row_item.find(".hotel_room_name").attr("name","hotel_room_name"+rowNumber);
        row_item.find(".hotel_room_image").attr("name","hotel_room_image"+rowNumber);
        row_item.find(".fileupload_container").find("input").attr("onclick","choose_file_upload_fast(2000,'hotel_room_image"+rowNumber+"','');");
        row_item.find(".hotel_room_person").attr("name","hotel_room_person"+rowNumber);
        row_item.find(".hotel_room_price").attr("name","hotel_room_price"+rowNumber);
        row_item.find(".hotel_room_price_basic").attr("name","hotel_room_price_basic"+rowNumber);
        row_item.find(".hotel_room_number").attr("name","hotel_room_number"+rowNumber);
        rowNumber+=1;
    });
});

function add_new_room_to_hotel(obj){
    var parentObj = obj.parent().parent().parent();
    var tr = '<tr class="item">';
    tr += parentObj.find(".hotel_room_example").html();
    tr += '</tr>';
    parentObj.append(tr);
    
    
    var totel_room_number = $("[name='hotel_room_total_number']").val();
    totel_room_number = parseInt(totel_room_number)+1;
    $("[name='hotel_room_total_number']").val(totel_room_number);
    
    
    var row_lastest = parentObj.find("tr.item:last");
    row_lastest.find(".stt").find("input").val(totel_room_number);
    row_lastest.find(".hotel_room_id").attr("name","hotel_room_id"+totel_room_number);
    row_lastest.find(".hotel_room_stt").attr("name","hotel_room_stt"+totel_room_number);
    row_lastest.find(".hotel_room_name").attr("name","hotel_room_name"+totel_room_number);
    row_lastest.find(".hotel_room_image").attr("name","hotel_room_image"+totel_room_number);
    row_lastest.find(".fileupload_container").find("input").attr("onclick","choose_file_upload_fast(2000,'hotel_room_image"+totel_room_number+"','');");
    row_lastest.find(".hotel_room_person").attr("name","hotel_room_person"+totel_room_number);
    row_lastest.find(".hotel_room_price").attr("name","hotel_room_price"+totel_room_number);
    row_lastest.find(".hotel_room_price_basic").attr("name","hotel_room_price_basic"+totel_room_number);
    row_lastest.find(".hotel_room_number").attr("name","hotel_room_number"+totel_room_number);
}
/*
$("[name='addHotelRoomNewBtn']").live("click",function(){
    var obj = $(this);
    
});
*/
//Chọn điểm đi điểm đến
var chooseRegionBox1_hover = false;
$(document).ready(function(){
    $("body").click(function(){
        if(!chooseRegionBox1_hover){
            $("[name='chooseRegionBox']").find(".chooseList").hide();
            $("[name='chooseRegionBox']").find(".chooseList").attr("state","hide");
        }
    });
});
$("[name='chooseRegionBox']")
    .mouseenter(function() {
        chooseRegionBox1_hover = true;
    })
    .mouseleave(function() {
        chooseRegionBox1_hover = false;
    }
);
$("[name='search_text_ticket_go']").live("keyup",function(){
    var obj = $(this);
    var parentObj = obj.parent().parent();
    var keyword = obj.val();
    if(keyword==""){
        parentObj.find(".chooseListTicketOutsideSearchResult").hide();
    }
    else{
        var reqData = "act=search_region_from_keyword_filter&keyword="+keyword;
        var request = jQuery.ajax({
            url: base_folder+"ajax/ajax.php",
            type: "POST",
            data: reqData,
            cache: false,
            success: function(result){
                if(result==""){
                    parentObj.find(".chooseListTicketOutsideSearchResult").hide();
                }
                else{
                    parentObj.find(".chooseListTicketOutsideSearchResult").find("ul").html(result);
                    parentObj.find(".chooseListTicketOutsideSearchResult").show();
                }
            }
        });
    }
});
function show_choose_region_box(obj){
    var chooseBoxObj = obj.parent();
    var state = chooseBoxObj.find(".chooseList:first").attr("state");
    $("[name='chooseRegionBox']").find(".chooseList:first").hide(); // HIDE ALL CHOOSE LIST BOX
    $("[name='chooseRegionBox']").find(".chooseList:first").attr("state","hide");
    if(state=='show'){
        chooseBoxObj.find(".chooseList").hide();
        chooseBoxObj.find(".chooseList").attr("state","hide");
    }
    else{
        chooseBoxObj.find(".chooseList").show();
        chooseBoxObj.find(".chooseList").attr("state","show");
    }
}
$("[name='chooseTicketFromItem']").live("click",function(){
    var obj = $(this);
    var parentObj = $(this).parent().parent().parent();
    var chooseBoxObj = $(this).parent().parent().parent().parent().parent().parent().parent();
    var idata = obj.attr("idata");
    var str = obj.attr("show_text");
    chooseBoxObj.find(".inputVal").val(idata);
    chooseBoxObj.find(".currentValue").html(str);
    chooseBoxObj.find(".chooseListTicketOutsideSearchResult").hide();
    chooseBoxObj.find(".chooseList").hide();
    chooseBoxObj.find(".chooseList").attr("state","hide");
});
</script>
<div id="content_right">
    <div class="content">
        <div class="colorBoxBg">&nbsp;</div>
        <div class="colorBoxChoose">
            <table cellpadding="5" cellspacing="0" align="center">
                <tr>
                    <td align="center" style="color:#1FAB04;font-weight:bold;font-size:15px;font-family:Arial, Helvetica, sans-serif;">Chọn màu sắc</td>
                </tr>
                <tr>
                    <td align="center">
                        <ul class="colorChoose">
                            <?php 
                                $result = fn_get_array_with_query("select id,code from content_type where type = 1 and status = 1 order by name,id ASC");
                                if($result!=false && mysql_num_rows($result)>0){
                                    while($row = mysql_fetch_array($result)){
                                        $class='';if($product_color==$row['id']){$class=' class="active"';}
                                        echo '<li'.$class.' onclick="change_color_of_product('.$row['id'].',\''.$row['code'].'\');"><a style="background-color:'.$row['code'].'">&nbsp;</a></li>';
                                    }
                                }
                            ?>
                        </ul>
                    </td>
                </tr>
            </table>
            <input type="hidden" value="0" id="upload_image_color_status">
            <input type="hidden" value="0" id="upload_image_color_mode">
            <input type="hidden" value="0" id="upload_image_color_message">
            <input type="hidden" value="0" id="upload_image_color_url_return">
        </div>
        <div class="image_list_upload_container">
            <form id="frmUpload_list_image" name="frmUpload_list_image" action="<?php echo $GLOBALS["base_folder"];?>admincp/modules/upload_image_fast.php" method="POST" ENCTYPE="multipart/form-data" target="upload_target">
                <iframe name="upload_target" src="<?php echo $GLOBALS["base_folder"];?>global/process_target.png" style="width:0px;height:0px;border:0px;display:none;"></iframe>
                <div class="name"><b>Tải ảnh</b> (gif, png, jpg &lt; <font color="red"><b>2MB</b></font> - <u>320 x 320 pixels</u>).</div>
                <div id="uploading_photo"><img src="<?php echo $GLOBALS["base_folder"];?>admincp/media/loading2.gif"> <span onclick="cancel_uploading_photo();" class="cancel_upload">Hủy</span></div>
                <div id="uploading_photo_input">
                    <textarea name="fFunction" style="display: none;">user_post_upload_image_status</textarea>
                    <input type="file" name="userfile" onchange="user_post_upload_image();">
                    <input type="hidden" name="fMaxsize" value='2048'  /><!--Max size is 2MB-->
                    <input type="hidden" name="fTitle" value=''  />
                </div>
                <div id="uploading_status">Tải thành công!</div>
                <?php show_image_list($image_list);?>
            </form>
        </div>
        <div class="color_list_upload_container">
            <form id="frmUpload_color_image" name="frmUpload_color_image" action="<?php echo $GLOBALS["base_folder"];?>admincp/modules/upload_image_fast.php" method="POST" ENCTYPE="multipart/form-data" target="upload_target">
                <iframe name="upload_target" src="<?php echo $GLOBALS["base_folder"];?>global/process_target.png" style="width:0px;height:0px;border:0px;display:none;"></iframe>
                <div class="name"><b>Tải ảnh màu sản phẩm</b> (gif, png, jpg &lt; <font color="red"><b>2MB</b></font>.</div>
                <div id="uploading_color_photo"><img src="<?php echo $GLOBALS["base_folder"];?>admincp/media/loading2.gif"> <span onclick="cancel_uploading_color_photo();" class="cancel_color_upload">Hủy</span></div>
                <div id="uploading_color_photo_input">
                    <textarea name="fFunction" style="display: none;">user_post_upload_color_status</textarea>
                    <input type="file" name="userfile" onchange="user_post_upload_color_image();">
                    <input type="hidden" name="fMaxsize" value='2048'  /><!--Max size is 2MB-->
                    <input type="hidden" name="fTitle" value=''  />
                </div>
                <div id="uploading_color_status">Tải thành công!</div>
                <?php show_color_list($color_list);?>
            </form>
        </div>
        <div class="form_add" id="form_add" style="position: relative;">
            <form action="<?php echo $base_folder;?>admincp/modules/content_insert.php" onsubmit="return frmProcess_before_submit();" name="frmProcess" target="processing_target" method="POST">
                <iframe name="processing_target" src="<?php echo $base_folder;?>global/process_target.php" style="width:0;height:0;border:0px;display:none;"></iframe>
                <input type="hidden" default="0" reset="true" colorcode="" name="fImage_color_choose" value="0">
                <table cellpadding="5" cellspacing="0" width="600" class="table_add">
                    <tr>
                        <td colspan="4" align="center" class="function_name">
                        <?php 
                            if($content_group==2){
                                if($id==0){echo 'Tạo mới dự án';}else{echo 'Cập nhật dự án: ' . $title;}
                            }
                            elseif($content_group==6){
                                if($id==0){echo 'Tạo mới sản phẩm';}else{echo 'Cập nhật sản phẩm: ' . $title;}
                            }
                            elseif($content_group==7){
                                if($id==0){echo 'Tạo sơ đồ căn hộ mới';}else{echo 'Cập nhật sơ đồ căn hộ: ' . $title;}
                            }
                            else{
                                if($id==0){echo 'Tạo mới bài viết';}else{echo 'Cập nhật bài viết: ' . $title;}
                            }
                        ?>
                        </td>
                    </tr>
                </table>
                <div class="menu" name="content_menu">
                    <ul>
                        <li name="mn_content_base" class="active"><a onclick="show_content_info($(this));" funct_name="hide_image_upload_fast" funct_param="">Thông tin cơ bản</a></li>
                        <li name="mn_content_body"><a onclick="show_content_info($(this));" funct_name="show_image_upload_fast" funct_param=""><?php if($content_group==2){echo 'Ảnh dự án';}elseif($content_group==6){echo 'Ảnh sản phẩm';}else{echo 'Ảnh bài viết';}?></a></li>
                        <li name="mn_content_body"><a onclick="show_content_info($(this));" funct_name="hide_image_upload_fast" funct_param="" style="display: none;">Sản phẩm</a></li>
                        <li name="mn_content_body"<?php if($content_group==2 || $content_group==1 || $content_group==6 || $content_group==7){echo ' style="display: none;"';}?>><a onclick="show_content_info($(this));" funct_name="hide_image_upload_fast" funct_param=""><?php if($content_group==6){echo 'Giới thiệu sản phẩm nội thất';}elseif($content_group==7){echo 'Giới thiệu sơ đồ căn hộ';}else{echo 'Nội dung';}?></a></li>
                        <?php if($id!=0){echo '<li><a onclick="show_content_info($(this));" funct_name="hide_image_upload_fast" funct_param="">Thông tin chi tiết</a></li>';}?>
                    </ul>
                </div>
                <div id="content_button" style="float:none;width:auto;position: absolute;right:10px;top:60px;z-index: 100;">
                    <?php 
                        if($id==0){
                            echo '<button type="submit" class="button_style1"><span>Tạo mới</span></button>';
                        }
                        else{
                            echo '<span style="float:left;margin-left:10px;">';
                            if($published==0){
                                echo '<button type="button" class="button_style1" onclick="content_process(\'admincp/modules/content_process.php?id='.$id.'&rq=publish\',true);"><span><a class="publish_article">&nbsp;</a>Xuất bản</span></button>';
                                echo '<button type="button" class="button_style2" onclick="content_process(\'admincp/modules/content_process.php?id='.$id.'&rq=delete\',false);" style="margin-left:5px;"><span><a class="delete_article">&nbsp;</a>Xoá bài</span></button>';
                                echo '<button type="button" class="button_style2" onclick="content_process(\'admincp/modules/content_process.php?id='.$id.'&rq=delete_all\',false);" style="margin-left:5px;"><span><a class="delete_article">&nbsp;</a>Xoá (Bao gồm ảnh)</span></button>';
                            }
                            else{
                                echo '<button type="button" class="button_style3" onclick="content_process(\'admincp/modules/content_process.php?id='.$id.'&rq=republish\',true);"><span><a class="republish_article">&nbsp;</a>Tái xuất bản</span></button>';
                                echo '<button type="button" class="button_style4" onclick="content_process(\'admincp/modules/content_process.php?id='.$id.'&rq=down\',true);" style="margin-left:5px;"><span><a class="down_article">&nbsp;</a>Gỡ bài</span></button>';
                            }
                            echo '</span>';
                            echo '<button type="submit" class="button_style1"><span>Cập nhật</span></button>';
                        }
                    ?>
                    <button class="button_style1" onclick="return cancel_process('<?php if($content_group==2){echo '#content?content_group=2&mn=mn_product';}else{echo '#content?content_group=1&mn=mn_content';}?>');" style="margin-left:5px;"><span>Hủy</span></button>
                </div>
                <div class="tab_content_info">
                    <table cellpadding="5" cellspacing="0" class="table_add">
                        <?php
                            if($catid!=0){
                                echo '<tr><td colspan="4">';
                                show_category_post_input($catid,'catalog');
                                if($published==1){
                                    echo '&nbsp;&nbsp;&nbsp;&nbsp;' . show_link_article($GLOBALS["id"],$GLOBALS["title"],$GLOBALS["alias"],' target="_blank"','(Xem)',$GLOBALS["hyper_link"]);
                                }
                                echo '</td></tr>';
                                
                            }
                        ?>
                        <tr<?php if($GLOBALS["meta_multi_language"]==0){echo ' style="display:none;"';}?>>
                            <td>Ngôn ngữ</td>
                            <td colspan="3"><?php show_language_list($languageid);?></td>
                        </tr>
                        <tr><td colspan="4"><?php show_directory_post($catid,$content_group);?></td></tr>
                        <tr style="display: none;">
                            <td valign="top">ID</td>
                            <td colspan="3">
                                <input type="text" default="0" reset="true" value="<?php echo $id;?>" name="fID" />
                                <input type="hidden" value="<?php echo $mode;?>" name="fMode" />
                            </td>
                        </tr>
                        <tr>
                            <td style="width: 115px;">
                                <?php 
                                    $require = 'tiêu đề bài viết';
                                    if($content_group==2){
                                        echo 'Tên dự án';
                                        $require = 'Tên dự án';
                                    }
                                    elseif($content_group==6){
                                        echo 'Tên sản phẩm';
                                        $require = 'Tên sản phẩm';
                                    }
                                    elseif($content_group==7){
                                        echo 'Tên sơ đồ căn hộ';
                                        $require = 'Tên sơ đồ căn hộ';
                                    }
                                    else{
                                        echo 'Tiêu đề';
                                    }
                                ?>
                            </td>
                            <td colspan="3">
                                <input type="text" require="true" compare_require="" name_require="<?php echo $require;?>" default="" reset="true" value="<?php echo $title;?>" name="fTitle" style="width:720px;" />
                                <!--<textarea name="fTitle" default="" reset="true" style="width:720px;height:16px;max-width:720px;max-height:16px;min-width:720px;min-height:16px;" require="true" compare_require="" name_require="tiêu đề bài viết"><?php //echo $title;?></textarea>-->
                                <input type="hidden" value="<?php echo $catid;?>" name="fCatid" require="true" compare_require="0" name_require="chuyên mục" />
                                <input type="hidden" value="<?php echo $catid;?>" name="fOld_Catid" />
                                <input type="hidden" value="<?php echo $poster;?>" name="fPoster" />
                                <input type="hidden" value="<?php echo $content_group;?>" name="fContent_group" />
                            </td>
                        </tr>
                        <!--Ảnh đại diện-->
                        <tr>
                            <td>Ảnh đại diện</td>
                            <td colspan="3">
                                <input type="text" default="" reset="true" value="<?php echo $image;?>" name="fImage" style="width:450px;" />
                                <?php 
                                    if($image!=''){
                                        echo '<a style="margin:0 0 0 4px;" target="_blank" href="'.image_process_http($image).'" rel="tooltip" title="Xem ảnh"><img style="vertical-align:top;margin-top:4px;" border="0" src="'.$base_folder.'admincp/media/picture-icon.png"></a>';
                                        echo '<div class="hidden"><div class="image"><img src="'.image_process_http($image).'"></div></div>';
                                    }
                                ?>
                                <a title="300x210 pixels" style="cursor:help;"><img style="vertical-align:top;margin-top:2px;" border="0" src="<?php echo $base_folder;?>admincp/media/question_icon.gif"></a>
                                <div class="fileupload_container" style="float:right;"><input type="button" value="Browse..." style="height:21px;font-size:11px;margin-left:5px;padding:1px;" onclick="choose_file_upload_fast(2000,'fImage','');" ></div>
                                
                            </td>
                        </tr>
                        <tr <?php //if($content_group!=1){echo ' style="display: none;"';}?>>
                            <td colspan="4">
                                <div class="openMoreSettingBox">
                                <div class="openMoreSettingBtn"><a name="openMoreSettingBtn" idata="otherInfoOfContent">Thông tin khác</a></div>
                                <div class="openMoreSettingContent" id="otherInfoOfContent" style="display: none;">
                                    <table style="padding:10px;" cellpadding="0" cellspacing="0" align="left" width="100%">
                                        <tr<?php if($content_group==7){echo ' style="display: none;"';}?>>
                                            <td class="col1">Ảnh hot</td>
                                            <td class="col2">
                                                <input type="text" default="" reset="true" value="<?php echo $hotimage;?>" name="fHotimage" style="width:450px;" />
                                                <?php 
                                                    if($hotimage!=''){
                                                        echo '<a style="margin:0 0 0 4px;" target="_blank" href="'.image_process_http($hotimage).'" rel="tooltip" title="Xem ảnh"><img style="vertical-align:top;margin-top:4px;" border="0" src="'.$base_folder.'admincp/media/picture-icon.png"></a>';
                                                        echo '<div class="hidden"><div class="image"><img src="'.image_process_http($hotimage).'"></div></div>';
                                                    }
                                                ?>
                                                <a title="1000x350 pixels" style="cursor:help;"><img style="vertical-align:top;margin-top:2px;" border="0" src="<?php echo $base_folder;?>admincp/media/question_icon.gif"></a>
                                                <div class="fileupload_container" style="float:right;"><input type="button" value="Browse..." style="height:21px;font-size:11px;margin-left:5px;padding:1px;" onclick="choose_file_upload_fast(2000,'fHotimage','');" ></div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td class="col1">Video URL</td>
                                            <td class="col2">
                                                <input type="text" default="" reset="true" value="<?php echo $video_url;?>" name="fVideo_url" style="width:560px;" />
                                            </td>
                                        </tr>
                                        <tr style="display: none;">
                                            <td class="col1">File đính kèm</td>
                                            <td class="col2">
                                                <input type="text" default="" reset="true" value="<?php echo $download_url;?>" name="fDownload_url" style="width:450px;" /> <?php if($download_url!=''){echo '&nbsp;&nbsp;&nbsp;<a target="_blank" href="'.$download_url.'">(Tải về)</a>';}?>
                                                <a title="Chấp nhận các loại file jpg,png,gif,doc,docx,pdf,xls,xlxs,zip,rar và có dung lượng nhỏ hơn 2MB" style="cursor:help;"><img style="vertical-align:top;margin-top:2px;" border="0" src="<?php echo $base_folder;?>admincp/media/question_icon.gif"></a>
                                                <div class="fileupload_container" style="float:right;"><input type="button" value="Browse..." style="height:21px;font-size:11px;margin-left:5px;padding:1px;" onclick="choose_file_upload_fast(2000,'fDownload_url','');" ></div>
                                            </td>
                                        </tr>
                                        <tr<?php if($content_group!=1){echo ' style="display: none;"';}?>>
                                            <td class="col1">Hyper link</td>
                                            <td class="col2">
                                                <input type="text" default="" reset="true" value="<?php echo $hyper_link;?>" name="fHyper_link" style="width:590px;" />
                                            </td>
                                        </tr>
                                    </table>
                                </div>
                                </div>
                            </td>
                        </tr>
                        <tr<?php if($content_group!=15){echo ' style="display: none;"';}?>>
                            <td colspan="4">
                                <div class="openMoreSettingBox">
                                <div class="openMoreSettingBtn"><a name="openMoreSettingBtn" idata="requirementOfCatalog">Tuyển dụng</a></div>
                                <div class="openMoreSettingContent" id="requirementOfCatalog" style="display: none;">
                                    <table style="padding:10px;" cellpadding="0" cellspacing="0" align="left">
                                        <tr>
                                            <td class="col1">Mức lương</td>
                                            <td class="col2">
                                                <input type="text" default="0" reset="true" value="<?php echo $recruitment_salary;?>" name="fRecruitment_salary" style="width:100px;text-align: right;" onblur="if(this.value=='') this.value='0'" onfocus="if(this.value=='0') this.value=''" /> (Vui lòng nhập số)
                                            </td>
                                        </tr>
                                        <tr>
                                            <td class="col1">Hạn nộp hồ sơ</td>
                                            <td class="col2">
                                                <input type="text" id="fRecruitment_deadline" name="fRecruitment_deadline" value="<?php echo format_full_time($recruitment_deadline.'000000','DD/MM/YYYY');?>" onclick="popUpCalendar(this,document.getElementById('fRecruitment_deadline'), 'dd/mm/yyyy', fnSetDate);" style="width:100px;text-align:right;position:relative;" readonly="readonly" autocomlete="off" />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td class="col1">Nơi làm việc</td>
                                            <td class="col2">
                                                <input default="" reset="true" type="text" value="<?php echo $recruitment_region;?>" name="fRecruitment_region" style="width:530px;" />
                                            </td>
                                        </tr>
                                    </table>
                                </div>
                                </div>
                            </td>
                        </tr>
                        <tr<?php if($content_group!=1){echo ' style="display: none;"';}?>>
                            <td colspan="4">
                                <div class="openMoreSettingBox">
                                <div class="openMoreSettingBtn"><a<?php if($description!=''){echo ' class="active"';}?> name="openMoreSettingBtn" idata="descriptionOfContent">Mô tả</a></div>
                                <div class="openMoreSettingContent" id="descriptionOfContent"<?php if($description==''){echo ' style="display: none;"';}?>>
                                    <table style="padding:10px;" cellpadding="0" cellspacing="0" align="left">
                                        <tr>
                                            <td>
                                                <textarea default="" reset="true" name="fDescription" editor_format="true" mini_control="false" width="800" height="200" style="width:590px;height:80px;margin-left:10px;"><?php echo $description;?></textarea>
                                            </td>
                                        </tr>
                                    </table>
                                </div>
                                </div>
                            </td>
                        </tr>
                        <tr<?php if($content_group!=1){echo ' style="display: none;"';}?>>
                            <td colspan="4">
                                <div class="openMoreSettingBox">
                                <div class="openMoreSettingBtn"><a<?php if($body!=''){echo ' class="active"';}?> name="openMoreSettingBtn" idata="bodyOfContent">Nội dung</a></div>
                                <div class="openMoreSettingContent" id="bodyOfContent"<?php if($body==''){echo ' style="display: none;"';}?>>
                                    <table style="padding:10px;" cellpadding="0" cellspacing="0" align="left">
                                        <tr>
                                            <td>
                                                <textarea fill_height="false" fill_width="false" default="" reset="true" name="editor1" editor_format="true" mini_control="false" width="800" height="400" cols="100" rows="15"><?php echo $body;?></textarea>
                                            </td>
                                        </tr>
                                    </table>
                                </div>
                                </div>
                            </td>
                        </tr>
                        <tr<?php if($content_group!=4){echo ' style="display: none;"';}?>>
                            <td colspan="4">
                                <div class="openMoreSettingBox">
                                <div class="openMoreSettingBtn"><a<?php if($content_group==4){echo ' class="active"';}?> name="openMoreSettingBtn" idata="tourInfoOfContent">Thông tin tour</a></div>
                                <div class="openMoreSettingContent" id="tourInfoOfContent" style="<?php if($content_group==4){echo 'display: block;';}else{echo 'display: none;';}?>">
                                    <table style="padding:10px;" cellpadding="0" cellspacing="0" align="left">
                                        <tr>
                                            <td class="col1" style="width:110px;">Ảnh tour</td>
                                            <td class="col2">
                                                <input type="text" default="" reset="true" value="<?php echo $tour_image;?>" name="tour_image" style="width:450px;" />
                                                <?php 
                                                    if($tour_image!=''){
                                                        echo '<a rel="tooltip" title="Xem ảnh"><img style="vertical-align:top;margin-top:3px;" border="0" src="'.$base_folder.'admincp/media/picture-icon.png"></a>';
                                                        echo '<div class="hidden"><div class="image"><img src="'.image_process_http($tour_image).'"></div></div>';
                                                    }
                                                ?>
                                                <a title="450x300 pixels" style="cursor:help;"><img style="vertical-align:top;" border="0" src="<?php echo $base_folder;?>admincp/media/question_icon.gif"></a>
                                                <div class="fileupload_container" style="float:right;"><input type="button" value="Browse..." style="height:21px;font-size:11px;margin-left:5px;padding:1px;" onclick="choose_file_upload_fast(2000,'tour_image','');" ></div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td class="col1">Thời gian đi</td>
                                            <td class="col2">
                                                <input type="text" default="" reset="true" value="<?php echo $tour_time;?>" name="tour_time" style="width:300px;" />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td class="col1">Đi hàng ngày</td>
                                            <td class="col2" style="padding-top: 7px;">
                                                <div style="float:left;">
                                                    <span style="float:left;padding:0;">
                                                        <span class="check_box_style1" state="<?php if($tour_everyday==1){echo 'on';}else{echo 'off';}?>">
                                                            <span class="<?php if($tour_everyday==1){echo 'check_box_on1';}else{echo 'check_box_off1';}?>">
                                                                <span class="check_box_on"></span>
                                                                <span class="check_box_bar"></span>
                                                                <input type="checkbox" name="tour_everyday"<?php if($tour_everyday==1){echo ' checked="checked"';}?> />
                                                            </span>
                                                        </span>
                                                    </span>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td class="col1">Khởi hành</td>
                                            <td class="col2">
                                                <input type="text" default="" reset="true" value="<?php echo $tour_schedule;?>" name="tour_schedule" style="width:300px;" />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td class="col1">Điểm khởi hành</td>
                                            <td class="col2">
                                                <input type="text" default="" reset="true" value="<?php echo $tour_start_address;?>" name="tour_start_address" style="width:300px;" />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td class="col1">Điểm đến</td>
                                            <td class="col2">
                                                <input type="text" default="" reset="true" value="<?php echo $tour_end_address;?>" name="tour_end_address" style="width:300px;" />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td class="col1">Phương tiện</td>
                                            <td class="col2">
                                                <input type="text" default="" reset="true" value="<?php echo $tour_vehicle;?>" name="tour_vehicle" style="width:300px;" />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td class="col1">Các địa danh đi qua</td>
                                            <td class="col2">
                                                <input type="text" default="" reset="true" value="<?php echo $tour_address;?>" name="tour_address" style="width:550px;" />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td class="col1">Giá tour</td>
                                            <td class="col2">
                                                <input type="text" default="0" reset="true" value="<?php echo $tour_price;?>" name="tour_price" style="width:100px;text-align:right;" onblur="if(this.value=='') this.value='0'" onfocus="if(this.value=='0') this.value=''" /> VNĐ <font style="font-size:11px;">(Vui lòng nhập số)</font>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td class="col1">Đang khuyến mãi</td>
                                            <td class="col2" style="padding-top: 7px;">
                                                <div style="float:left;">
                                                    <span style="float:left;padding:0;">
                                                        <span class="check_box_style1" state="<?php if($tour_isdiscount==1){echo 'on';}else{echo 'off';}?>">
                                                            <span class="<?php if($tour_isdiscount==1){echo 'check_box_on1';}else{echo 'check_box_off1';}?>">
                                                                <span class="check_box_on"></span>
                                                                <span class="check_box_bar"></span>
                                                                <input type="checkbox" name="tour_isdiscount"<?php if($tour_isdiscount==1){echo ' checked="checked"';}?> />
                                                            </span>
                                                        </span>
                                                    </span>
                                                </div>
                                            </td>
                                        </tr>
                                        <!--tr>
                                            <td class="col1">Chủ đề du lịch</td>
                                            <td class="col2">
                                                <select name="tour_type">
                                                    <option value="0">--Chọn chủ đề--</option>
                                                    <?php 
                                                       /* $result = fn_get_array_with_query("select * from catalog,catalog_config where catalog.catid = catalog_config.catid and content_group = 4 and parentid = 66 order by orderingmenu,catalog_name ASC",false,false);
                                                        if($result!=false && mysql_num_rows($result)>0){
                                                            while($row=mysql_fetch_array($result)){
                                                                $selected = '';
                                                                if($tour_type==$row["catid"]){
                                                                    $selected = ' selected="selected"';
                                                                }
                                                                echo '<option'.$selected.' value="'.$row["catid"].'">'.$row["catalog_name"].'</option>';
                                                            }
                                                            mysql_free_result($result);
                                                        }*/
                                                    ?>
                                                </select>
                                            </td>
                                        </tr-->
                                        <tr>
                                            <td colspan="2" style="padding:7px 5px;font-weight: bold;">Lịch trình chi tiết</td>
                                        </tr>
                                        <tr>
                                            <td colspan="2" style="padding:5px;">
                                                <textarea name="tour_address_detail" default="" reset="true" editor_format="true" mini_control="false" width="810" height="250" style="width:795px;height:80px;"><?php echo $tour_address_detail;?></textarea>
                                            </td>
                                        </tr>
                                    </table>
                                </div>
                                </div>
                            </td>
                        </tr>
                        <tr<?php if($content_group!=3){echo ' style="display: none;"';}?>>
                            <td colspan="4">
                                <div class="openMoreSettingBox">
                                <div class="openMoreSettingBtn"><a<?php if($content_group==3){echo ' class="active"';}?> name="openMoreSettingBtn" idata="hotelInfoOfContent">Thông tin khách sạn</a></div>
                                <div class="openMoreSettingContent" id="hotelInfoOfContent" style="<?php if($content_group==3){echo 'display: block;';}else{echo 'display: none;';}?>">
                                    <table style="padding:10px;" cellpadding="0" cellspacing="0" align="left">
                                        <tr>
                                            <td class="col1" style="width:110px;">Ảnh khách sạn</td>
                                            <td class="col2">
                                                <input type="text" default="" reset="true" value="<?php echo $hotel_image;?>" name="hotel_image" style="width:450px;" />
                                                <?php 
                                                    if($hotel_image!=''){
                                                        echo '<a rel="tooltip" title="Xem ảnh"><img style="vertical-align:top;margin-top:3px;" border="0" src="'.$base_folder.'admincp/media/picture-icon.png"></a>';
                                                        echo '<div class="hidden"><div class="image"><img src="'.image_process_http($hotel_image).'"></div></div>';
                                                    }
                                                ?>
                                                <a title="450x300 pixels" style="cursor:help;"><img style="vertical-align:top;" border="0" src="<?php echo $base_folder;?>admincp/media/question_icon.gif"></a>
                                                <div class="fileupload_container" style="float:right;"><input type="button" value="Browse..." style="height:21px;font-size:11px;margin-left:5px;padding:1px;" onclick="choose_file_upload_fast(2000,'hotel_image','');" ></div>
                                            </td>
                                        </tr>
                                        <!--tr>
                                            <td class="col1">Địa chỉ</td>
                                            <td class="col2">
                                                <input type="text" default="" reset="true" value="<?php //echo $hotel_address;?>" name="hotel_address" style="width:550px;" />
                                            </td>
                                        </tr-->
                                        <tr>
                                            <td class="col1">Giảm giá đến</td>
                                            <td class="col2">
                                                <input type="text" default="0" reset="true" value="<?php echo $hotel_discount_percent;?>" name="hotel_discount_percent" style="width:100px;text-align:right;" onblur="if(this.value=='') this.value='0'" onfocus="if(this.value=='0') this.value=''" /> %
                                            </td>
                                        </tr>
                                        <tr>
                                            <td class="col1">Giá thấp nhất</td>
                                            <td class="col2">
                                                <input type="text" default="0" reset="true" value="<?php echo $hotel_price_min;?>" name="hotel_price_min" style="width:100px;text-align:right;" onblur="if(this.value=='') this.value='0'" onfocus="if(this.value=='0') this.value=''" /> VNĐ <font style="font-size:11px;">(Vui lòng nhập số)</font>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td class="col1">Xếp hạng</td>
                                            <td class="col2">
                                                <select name="hotel_star">
                                                    <option<?php if($hotel_star==0){echo ' selected="selected"';}?> value="0">Chọn</option>
                                                    <option<?php if($hotel_star==1){echo ' selected="selected"';}?> value="1">1 sao</option>
                                                    <option<?php if($hotel_star==2){echo ' selected="selected"';}?> value="2">2 sao</option>
                                                    <option<?php if($hotel_star==3){echo ' selected="selected"';}?> value="3">3 sao</option>
                                                    <option<?php if($hotel_star==4){echo ' selected="selected"';}?> value="4">4 sao</option>
                                                    <option<?php if($hotel_star==5){echo ' selected="selected"';}?> value="5">5 sao</option>
                                                    <option<?php if($hotel_star==6){echo ' selected="selected"';}?> value="6">6 sao</option>
                                                </select>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td class="col1">Đang khuyến mãi</td>
                                            <td class="col2" style="padding-top: 7px;">
                                                <div style="float:left;">
                                                    <span style="float:left;padding:0;">
                                                        <span class="check_box_style1" state="<?php if($hotel_discount==1){echo 'on';}else{echo 'off';}?>">
                                                            <span class="<?php if($hotel_discount==1){echo 'check_box_on1';}else{echo 'check_box_off1';}?>">
                                                                <span class="check_box_on"></span>
                                                                <span class="check_box_bar"></span>
                                                                <input type="checkbox" name="hotel_discount"<?php if($hotel_discount==1){echo ' checked="checked"';}?> />
                                                            </span>
                                                        </span>
                                                    </span>
                                                </div>
                                            </td>
                                        </tr>
                                        
                                        <tr>
                                            <td colspan="2" style="padding:5px;">Phòng khách sạn</td>
                                        </tr>
                                        <tr>
                                            <td colspan="2" style="padding:5px;">
                                                <?php 
                                                    $hotel_room_total_number = 0;
                                                    $hotel_room_result = fn_get_array_with_query("select * from hotel_room where hotelid = $id order by orderingroom ASC",0,0);
                                                ?>
                                                <table class="hotel_room_list_tbl" name="hotel_room_list_tbl" cellpadding="5" cellspacing="0" width="100%">
                                                    <tr style="font-weight: bold;">
                                                        <td class="stt">STT</td>
                                                        <td class="name">Tên phòng</td>
                                                        <td class="image">Ảnh</td>
                                                        <td class="person">Số người</td>
                                                        <td class="price">Giá 1 đêm</td>
                                                        <td class="price_basic">Giá gốc</td>
                                                        <td class="roomnumber">Số phòng</td>
                                                        <td class="fnc"><a onclick="add_new_room_to_hotel($(this));" class="add" name="addHotelRoomNewBtn">Thêm</a></td>
                                                    </tr>
                                                    <?php 
                                                        if($hotel_room_result!=false && mysql_num_rows($hotel_room_result)>0){
                                                            $j = 1;
                                                            $hotel_room_total_number = mysql_num_rows($hotel_room_result);
                                                            while($row_hotel_room = mysql_fetch_array($hotel_room_result)){
                                                                echo '<tr class="item">';
                                                                echo '<td class="id" style="display: none;">
                                                                        <input type="text" default="0" reset="true" class="hotel_room_id" name="hotel_room_id" value="'.$row_hotel_room["roomid"].'" style="width:15px;text-align: center;">
                                                                    </td>';
                                                                echo '<td class="stt">
                                                                        <input type="text" default="0" reset="true" class="hotel_room_stt" name="hotel_room_stt'.$j.'" value="'.$row_hotel_room["orderingroom"].'" style="width:15px;text-align: center;" onblur="if(this.value==\'\') this.value=\'0\'" onfocus="if(this.value==\'0\') this.value=\'\'">
                                                                    </td>';
                                                                echo '<td class="name">
                                                                        <input type="text" default="0" reset="true" class="hotel_room_name" name="hotel_room_name'.$j.'" value="'.$row_hotel_room["name"].'" style="width:150px;text-align: left;">
                                                                    </td>';
                                                                echo '<td class="image">
                                                                    <input type="text" default="0" reset="true" class="hotel_room_image" name="hotel_room_image'.$j.'" value="'.$row_hotel_room["image"].'" style="width:150px;text-align: left;">';
                                                                if($row_hotel_room["image"]!=''){
                                                                    echo '<a target="_blank" href="'.image_process_http($row_hotel_room["image"]).'" rel="tooltip" style="margin-left:4px;" title="Xem ảnh"><img style="vertical-align:top;margin-top:4px;" border="0" src="'.$base_folder.'admincp/media/picture-icon.png"></a>';
                                                                    echo '<div class="hidden"><div class="image"><img src="'.image_process_http($row_hotel_room["image"]).'"></div></div>';
                                                                }
                                                                echo '<div class="fileupload_container" style="float:right;margin-top:2px;"><input type="button" value="Browse..." style="height:21px;font-size:11px;margin-left:5px;padding:1px;" onclick="choose_file_upload_fast(2000,\'hotel_room_image'.$j.'\',\'\');" ></div>
                                                                </td>';
                                                                echo '<td>
                                                                        <input type="text" default="0" reset="true" class="hotel_room_person" name="hotel_room_person'.$j.'" value="'.$row_hotel_room["max_person"].'" style="width:43px;text-align: center;" onblur="if(this.value==\'\') this.value=\'0\'" onfocus="if(this.value==\'0\') this.value=\'\'">
                                                                    </td>';
                                                                echo '<td>';
                                                                echo '<input type="text" default="0" reset="true" class="hotel_room_price" name="hotel_room_price'.$j.'" value="'.format_number_thousand($row_hotel_room["price"]).'" style="width:70px;text-align: left;" onblur="if(this.value==\'\') this.value=\'0\'" onfocus="if(this.value==\'0\') this.value=\'\'">';
                                                                echo '</td>';
                                                                echo '<td>';
                                                                echo '<input type="text" default="0" reset="true" class="hotel_room_price_basic" name="hotel_room_price_basic'.$j.'" value="'.format_number_thousand($row_hotel_room["price_basic"]).'" style="width:70px;text-align: left;" onblur="if(this.value==\'\') this.value=\'0\'" onfocus="if(this.value==\'0\') this.value=\'\'">';
                                                                echo '</td>';
                                                                echo '</div>';
                                                                echo '<td class="roomnumber">
                                                                        <input type="text" default="0" reset="true" class="hotel_room_number" name="hotel_room_number'.$j.'" value="'.$row_hotel_room["room_number"].'" style="width:43px;text-align: center;" onblur="if(this.value==\'\') this.value=\'0\'" onfocus="if(this.value==\'0\') this.value=\'\'">
                                                                    </td>';
                                                                echo '<td class="fnc"><a class="remove" name="removeHotelRoomNewBtn">Bỏ</a></td>';
                                                                echo '</tr>';
                                                                $j+=1;
                                                            }
                                                        }
                                                    ?>
                                                    <tr class="hotel_room_example" style="display: none;">
                                                        <td class="id" style="display: none;">
                                                            <input type="text" default="0" reset="true" class="hotel_room_id" name="hotel_room_id" value="0" style="width:15px;text-align: center;">
                                                        </td>
                                                        <td class="stt">
                                                            <input type="text" default="0" reset="true" class="hotel_room_stt" name="hotel_room_stt" value="0" style="width:15px;text-align: center;" onblur="if(this.value=='') this.value='0'" onfocus="if(this.value=='0') this.value=''">
                                                        </td>
                                                        <td class="name">
                                                            <input type="text" default="0" reset="true" class="hotel_room_name" name="hotel_room_name" value="" style="width:150px;text-align: left;">
                                                        </td>
                                                        <td class="image">
                                                            <input type="text" default="0" reset="true" class="hotel_room_image" name="hotel_room_image" value="" style="width:150px;text-align: left;">
                                                            <div class="fileupload_container" style="float:right;margin-top:2px;"><input type="button" value="Browse..." style="height:21px;font-size:11px;margin-left:5px;padding:1px;" onclick="choose_file_upload_fast(2000,'hotel_room_image','');" ></div>
                                                        </td>
                                                        <td>
                                                            <input type="text" default="0" reset="true" class="hotel_room_person" name="hotel_room_person" value="0" style="width:43px;text-align: center;" onblur="if(this.value=='') this.value='0'" onfocus="if(this.value=='0') this.value=''">
                                                        </td>
                                                        <td>
                                                            <input type="text" default="0" reset="true" class="hotel_room_price" name="hotel_room_price" value="0" style="width:70px;text-align: left;" onblur="if(this.value=='') this.value='0'" onfocus="if(this.value=='0') this.value=''">
                                                        </td>
                                                        <td>
                                                            <input type="text" default="0" reset="true" class="hotel_room_price_basic" name="hotel_room_price_basic" value="0" style="width:70px;text-align: left;" onblur="if(this.value=='') this.value='0'" onfocus="if(this.value=='0') this.value=''">
                                                        </td>
                                                        <td class="roomnumber">
                                                            <input type="text" default="0" reset="true" class="hotel_room_number" name="hotel_room_number" value="0" style="width:43px;text-align: center;" onblur="if(this.value=='') this.value='0'" onfocus="if(this.value=='0') this.value=''">
                                                        </td>
                                                        <td class="fnc"><a class="remove" name="removeHotelRoomNewBtn">Bỏ</a></td>
                                                    </tr>
                                                </table>
                                                <input type="hidden" name="hotel_room_total_number" value="<?php echo $hotel_room_total_number;?>">
                                            </td>
                                        </tr>
                                        <tr>
                                            <td colspan="2" style="padding:5px;">Chính sách khách sạn</td>
                                        </tr>
                                        <tr>
                                            <td colspan="2" style="padding:5px;">
                                                <textarea name="hotel_policy" default="" reset="true" editor_format="true" mini_control="false" width="810" height="200" style="width:795px;height:80px;"><?php echo $hotel_policy;?></textarea>
                                            </td>
                                        </tr>
                                        
                                    </table>
                                </div>
                                </div>
                            </td>
                        </tr>
                        <tr style="display: none;">
                            <td colspan="4">
                                <div class="openMoreSettingBox">
                                <div class="openMoreSettingBtn"><a<?php if($content_group==2){echo ' class="active"';}?> name="openMoreSettingBtn" idata="productInfoOfContent">Thông tin sản phẩm</a></div>
                                <div class="openMoreSettingContent" id="productInfoOfContent" style="<?php if($content_group==2){echo 'display: block;';}else{echo 'display: none;';}?>">
                                    <table style="padding:10px;" cellpadding="0" cellspacing="0" align="left">
                                        
                                        <tr>
                                            <td class="col1" style="font-weight: bold;">Tiêu đề</td>
                                            <td class="col2">
                                                <?php 
                                                    $check_ticket_type_to = $ticket_type;
                                                    $list_to = array();
                                                    $result1 = fn_get_array_with_query("select * from catalog,catalog_config where catalog.catid = catalog_config.catid and content_group = 10 and parentid = 0 order by orderingmenu,catalog_name ASC",false,false);
                                                    if($result1!=false && mysql_num_rows($result1)>0){
                                                        echo '<div class="ticketType" id="ticketType">';
                                                        $j = 0;
                                                        while($row1 = mysql_fetch_array($result1)){
                                                            $list_to[$j] = $row1["catid"];
                                                            $class = '';
                                                            if($check_ticket_type_to==0 && $j==0){
                                                                $check_ticket_type_to = $list_to[$j];
                                                                $class=' class="active"';
                                                            }
                                                            elseif($ticket_type==$row1["catid"]){
                                                                $class=' class="active"';
                                                            }
                                                            echo '<a'.$class.' idata="'.$row1["catid"].'">';
                                                            echo 'Vé '.strtolower($row1["catalog_name"]);
                                                            echo '</a>';
                                                            
                                                            $j+=1;
                                                        }
                                                        // if($content_group!=2){$check_ticket_type_to=0;}
                                                        echo '<input type="hidden" class="inputVal" name="ticket_type" value="'.$check_ticket_type_to.'">';
                                                        echo '</div>';
                                                        mysql_free_result($result1);
                                                    }
                                                ?>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td class="col2" colspan="2">
                                                <div class="ticketChooseGo">
                                                    <!--START Điểm đi-->
                                                    <div class="col1">
                                                        <div class="col1_title">Điểm đi</div>
                                                        <div class="col1_content">
                                                            <div class="chooseBox" name="chooseRegionBox">
                                                                <?php 
                                                                    $query = "select catalog.catid,catalog.catalog_name,region_code from catalog,catalog_config where catalog.catid = catalog_config.catid and catalog_config.note1 = 1 order by orderingmenu,catalog_name ASC limit 1";
                                                                    if($ticket_from>0){
                                                                        $query = "select catalog.catid,catalog.catalog_name,region_code from catalog,catalog_config where catalog.catid = catalog_config.catid and catalog_config.catid = $ticket_from order by orderingmenu,catalog_name ASC limit 1";
                                                                    }
                                                                    $row_current = fn_get_feed_of_array_with_query($query,false,false);
                                                                ?>
                                                                <input type="hidden" class="inputVal" name="ticket_from" value="<?php echo $row_current["catid"];?>" />
                                                                <span class="currentValue" onclick="show_choose_region_box($(this));">
                                                                    <?php 
                                                                        echo $row_current["catalog_name"];
                                                                        if($row_current["region_code"]!=''){echo ' ('.$row_current["region_code"].')';}
                                                                    ?>
                                                                </span>
                                                                <div class="chooseList">
                                                                    <div class="chooseListTicketType">
                                                                        <div class="chooseListTicketTypeTitle"><span>Lựa chọn thành phố hoặc sân bay xuất phát</span></div>
                                                                        <div class="chooseListTicketInside">
                                                                            <div class="chooseListTicketInsideCol">
                                                                                <div class="chooseListTicketInsideTitle">Miền Bắc</div>
                                                                                <ul class="ticketTypeChoose">
                                                                                    <?php 
                                                                                        $result_filter1 = fn_get_array_with_query("select catalog.catid,catalog_name,region_code from catalog,catalog_config where catalog.catid = catalog_config.catid and parentid = 211 and ticket_seach_show = 1 order by ticket_seach_ordering ASC",false,false);
                                                                                        if($result_filter1!=false && mysql_num_rows($result_filter1)>0){
                                                                                            while($row_filter1 = mysql_fetch_array($result_filter1)){
                                                                                                $str_name = $row_filter1["catalog_name"];
                                                                                                if($row_filter1["region_code"]!=''){
                                                                                                    $str_name .= ' ('.$row_filter1["region_code"].')';
                                                                                                }
                                                                                                echo '<li name="chooseTicketFromItem" show_text="'.$str_name.'" idata="'.$row_filter1["catid"].'"><a>'.$row_filter1["catalog_name"].'</a></li>';
                                                                                            }
                                                                                            mysql_free_result($result_filter1);
                                                                                        }
                                                                                    ?>
                                                                                </ul>
                                                                            </div>
                                                                            <div class="chooseListTicketInsideCol">
                                                                                <div class="chooseListTicketInsideTitle">Miền Trung</div>
                                                                                <ul class="ticketTypeChoose">
                                                                                    <?php 
                                                                                        $result_filter1 = fn_get_array_with_query("select catalog.catid,catalog_name,region_code from catalog,catalog_config where catalog.catid = catalog_config.catid and parentid = 212 and ticket_seach_show = 1 order by ticket_seach_ordering ASC",false,false);
                                                                                        if($result_filter1!=false && mysql_num_rows($result_filter1)>0){
                                                                                            while($row_filter1 = mysql_fetch_array($result_filter1)){
                                                                                                $str_name = $row_filter1["catalog_name"];
                                                                                                if($row_filter1["region_code"]!=''){
                                                                                                    $str_name .= ' ('.$row_filter1["region_code"].')';
                                                                                                }
                                                                                                echo '<li show_text="'.$str_name.'" name="chooseTicketFromItem" idata="'.$row_filter1["catid"].'"><a>'.$row_filter1["catalog_name"].'</a></li>';
                                                                                            }
                                                                                            mysql_free_result($result_filter1);
                                                                                        }
                                                                                    ?>
                                                                                </ul>
                                                                            </div>
                                                                        </div>
                                                                        
                                                                        <div class="chooseListTicketInside">
                                                                            <div class="chooseListTicketInsideCol">
                                                                                <div class="chooseListTicketInsideTitle">Miền Nam</div>
                                                                                <ul class="ticketTypeChoose">
                                                                                    <?php 
                                                                                        $result_filter1 = fn_get_array_with_query("select catalog.catid,catalog_name,region_code from catalog,catalog_config where catalog.catid = catalog_config.catid and parentid = 213 and ticket_seach_show = 1 order by ticket_seach_ordering ASC",false,false);
                                                                                        if($result_filter1!=false && mysql_num_rows($result_filter1)>0){
                                                                                            while($row_filter1 = mysql_fetch_array($result_filter1)){
                                                                                                $str_name = $row_filter1["catalog_name"];
                                                                                                if($row_filter1["region_code"]!=''){
                                                                                                    $str_name .= ' ('.$row_filter1["region_code"].')';
                                                                                                }
                                                                                                echo '<li show_text="'.$str_name.'" name="chooseTicketFromItem" idata="'.$row_filter1["catid"].'"><a>'.$row_filter1["catalog_name"].'</a></li>';
                                                                                            }
                                                                                            mysql_free_result($result_filter1);
                                                                                        }
                                                                                    ?>
                                                                                </ul>
                                                                            </div>
                                                                        </div>
                                                                        
                                                                        <div class="chooseListTicketOutside">
                                                                            <div class="chooseListTicketOutsideTitle">Quốc tế</div>
                                                                            <div class="chooseListTicketOutsideTutorial">Hãy nhập tên hoặc mã sân bay</div>
                                                                            <div class="chooseListTicketOutsideSearch">
                                                                                <div class="chooseListTicketOutsideSearchInput">
                                                                                    <input class="search_text" type="text" name="search_text_ticket_go" value="" autocomplete="off">
                                                                                </div>
                                                                                <div class="chooseListTicketOutsideSearchResult">
                                                                                    <ul>
                                                                                        
                                                                                    </ul>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <!--END Điểm đi-->
                                                    
                                                    <!--START Điểm đến-->
                                                    <div class="col1" style="margin-left:15px;">
                                                        <div class="col1_title">Điểm đến</div>
                                                        <div class="col1_content">
                                                            <div class="chooseBox" name="chooseRegionBox">
                                                                <?php 
                                                                    $query = "select catalog.catid,catalog.catalog_name,region_code from catalog,catalog_config where catalog.catid = catalog_config.catid and catalog_config.note2 = 1 order by orderingmenu,catalog_name ASC limit 1";
                                                                    if($ticket_to>0){
                                                                        $query = "select catalog.catid,catalog.catalog_name,region_code from catalog,catalog_config where catalog.catid = catalog_config.catid and catalog_config.catid = $ticket_to order by orderingmenu,catalog_name ASC limit 1";
                                                                    }
                                                                    $row_current_to = fn_get_feed_of_array_with_query($query,false,false);
                                                                ?>
                                                                <input type="hidden" class="inputVal" name="ticket_to" value="<?php echo $row_current_to["catid"];?>" />
                                                                <span class="currentValue" onclick="show_choose_region_box($(this));">
                                                                    <?php 
                                                                        echo $row_current_to["catalog_name"];
                                                                        if($row_current_to["region_code"]!=''){echo ' ('.$row_current_to["region_code"].')';}
                                                                    ?>
                                                                </span>
                                                                
                                                                <div class="chooseList">
                                                                    <div class="chooseListTicketType">
                                                                        <div class="chooseListTicketTypeTitle"><span>Lựa chọn thành phố hoặc sân bay đến</span></div>
                                                                        <div class="chooseListTicketInside">
                                                                            <div class="chooseListTicketInsideCol">
                                                                                <div class="chooseListTicketInsideTitle">Miền Bắc</div>
                                                                                <ul class="ticketTypeChoose">
                                                                                    <?php 
                                                                                        $result_filter1 = fn_get_array_with_query("select catalog.catid,catalog_name,region_code from catalog,catalog_config where catalog.catid = catalog_config.catid and parentid = 211 and ticket_seach_show = 1 order by ticket_seach_ordering ASC",false,false);
                                                                                        if($result_filter1!=false && mysql_num_rows($result_filter1)>0){
                                                                                            while($row_filter1 = mysql_fetch_array($result_filter1)){
                                                                                                $str_name = $row_filter1["catalog_name"];
                                                                                                if($row_filter1["region_code"]!=''){
                                                                                                    $str_name .= ' ('.$row_filter1["region_code"].')';
                                                                                                }
                                                                                                echo '<li name="chooseTicketFromItem" show_text="'.$str_name.'" idata="'.$row_filter1["catid"].'"><a>'.$row_filter1["catalog_name"].'</a></li>';
                                                                                            }
                                                                                            mysql_free_result($result_filter1);
                                                                                        }
                                                                                    ?>
                                                                                </ul>
                                                                            </div>
                                                                            <div class="chooseListTicketInsideCol">
                                                                                <div class="chooseListTicketInsideTitle">Miền Trung</div>
                                                                                <ul class="ticketTypeChoose">
                                                                                    <?php 
                                                                                        $result_filter1 = fn_get_array_with_query("select catalog.catid,catalog_name,region_code from catalog,catalog_config where catalog.catid = catalog_config.catid and parentid = 212 and ticket_seach_show = 1 order by ticket_seach_ordering ASC",false,false);
                                                                                        if($result_filter1!=false && mysql_num_rows($result_filter1)>0){
                                                                                            while($row_filter1 = mysql_fetch_array($result_filter1)){
                                                                                                $str_name = $row_filter1["catalog_name"];
                                                                                                if($row_filter1["region_code"]!=''){
                                                                                                    $str_name .= ' ('.$row_filter1["region_code"].')';
                                                                                                }
                                                                                                echo '<li show_text="'.$str_name.'" name="chooseTicketFromItem" idata="'.$row_filter1["catid"].'"><a>'.$row_filter1["catalog_name"].'</a></li>';
                                                                                            }
                                                                                            mysql_free_result($result_filter1);
                                                                                        }
                                                                                    ?>
                                                                                </ul>
                                                                            </div>
                                                                        </div>
                                                                        
                                                                        <div class="chooseListTicketInside">
                                                                            <div class="chooseListTicketInsideCol">
                                                                                <div class="chooseListTicketInsideTitle">Miền Nam</div>
                                                                                <ul class="ticketTypeChoose">
                                                                                    <?php 
                                                                                        $result_filter1 = fn_get_array_with_query("select catalog.catid,catalog_name,region_code from catalog,catalog_config where catalog.catid = catalog_config.catid and parentid = 213 and ticket_seach_show = 1 order by ticket_seach_ordering ASC",false,false);
                                                                                        if($result_filter1!=false && mysql_num_rows($result_filter1)>0){
                                                                                            while($row_filter1 = mysql_fetch_array($result_filter1)){
                                                                                                $str_name = $row_filter1["catalog_name"];
                                                                                                if($row_filter1["region_code"]!=''){
                                                                                                    $str_name .= ' ('.$row_filter1["region_code"].')';
                                                                                                }
                                                                                                echo '<li show_text="'.$str_name.'" name="chooseTicketFromItem" idata="'.$row_filter1["catid"].'"><a>'.$row_filter1["catalog_name"].'</a></li>';
                                                                                            }
                                                                                            mysql_free_result($result_filter1);
                                                                                        }
                                                                                    ?>
                                                                                </ul>
                                                                            </div>
                                                                        </div>
                                                                        
                                                                        <div class="chooseListTicketOutside">
                                                                            <div class="chooseListTicketOutsideTitle">Quốc tế</div>
                                                                            <div class="chooseListTicketOutsideTutorial">Hãy nhập tên hoặc mã sân bay</div>
                                                                            <div class="chooseListTicketOutsideSearch">
                                                                                <div class="chooseListTicketOutsideSearchInput">
                                                                                    <input class="search_text" type="text" name="search_text_ticket_go" value="" autocomplete="off">
                                                                                </div>
                                                                                <div class="chooseListTicketOutsideSearchResult">
                                                                                    <ul>
                                                                                        
                                                                                    </ul>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        
                                                                    </div>
                                                                </div>
                                                                
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <!--END Điểm đến-->
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td class="col1">Sân bay xuất phát</td>
                                            <td class="col2">
                                                <input type="text" default="" reset="true" name="ticket_airport_start" value="<?php echo $ticket_airport_start;?>" style="width:265px;">
                                            </td>
                                        </tr>
                                        <tr>
                                            <td class="col1">Sân bay đến</td>
                                            <td class="col2">
                                                <input type="text" default="" reset="true" name="ticket_airport_end" value="<?php echo $ticket_airport_end;?>" style="width:265px;">
                                            </td>
                                        </tr>
                                        <tr>
                                            <td class="col1">Hãng máy bay</td>
                                            <td class="col2">
                                                <div class="airlineOfContent" id="airlineList">
                                                    <input type="hidden" class="inputVal" name="ticket_airline" value="<?php echo $ticket_airline;?>">
                                                <?php 
                                                    $result1 = fn_get_array_with_query("select * from catalog,catalog_config where catalog.catid = catalog_config.catid and content_group = 5 order by orderingmenu,catalog_name ASC",false,false);
                                                    if($result1!=false && mysql_num_rows($result1)>0){
                                                        echo '<div class="ticketArlines" name="ticketArlines">';
                                                        while($row1 = mysql_fetch_array($result1)){
                                                            $class = '';
                                                            if($ticket_airline==$row1["catid"]){
                                                                $class = ' class="active"';
                                                            }
                                                            echo '<a'.$class.' idata="'.$row1["catid"].'">';
                                                            echo '<span class="logo">';
                                                            echo '<img src="'.image_process_http($row1["image"]).'">';
                                                            echo '</span>';
                                                            echo '<span class="name">';
                                                            echo $row1["catalog_name"];
                                                            echo '</span>';
                                                            echo '</a>';
                                                        }
                                                        echo '</div>';
                                                        mysql_free_result($result1);
                                                    } 
                                                ?>
                                                </div>
                                            </td>
                                        </tr>
                                        
                                        <tr>
                                            <td class="col1">Thời gian</td>
                                            <td class="col2" style="padding-top: 7px;">
                                                <span style="float:left;padding:4px 0;">Đi</span>
                                                <span style="float:left;margin-left:10px;">
                                                    <select name="fHour_leave" style="width: 60px;text-align: center;">
                                                        <?php 
                                                            for($i=0;$i<24;$i++){
                                                                $number = $i;
                                                                if($i<10){
                                                                    $number = '0'.$i;
                                                                }
                                                                $selected = '';
                                                                if($number==$hour_leave){$selected = ' selected="selected"';}
                                                                echo '<option'.$selected.' value="'.$number.'">'.$number.'</option>';
                                                            }
                                                        ?>
                                                    </select>
                                                </span>
                                                <span style="float:left;padding:4px;">:</span>
                                                <span style="float:left;">
                                                    <select name="fMinute_leave" style="width: 60px;text-align: center;">
                                                        <?php 
                                                            for($i=0;$i<60;$i++){
                                                                $number = $i;
                                                                if($i<10){
                                                                    $number = '0'.$i;
                                                                }
                                                                $selected = '';
                                                                if($number==$minute_leave){$selected = ' selected="selected"';}
                                                                echo '<option'.$selected.' value="'.$number.'">'.$number.'</option>';
                                                            }
                                                        ?>
                                                    </select>
                                                </span>
                                                
                                                <span style="float:left;padding:4px 0;margin-left:40px;">Về</span>
                                                <span style="float:left;margin-left:10px;">
                                                    <select name="fHour_down" style="width: 60px;text-align: center;">
                                                        <?php 
                                                            for($i=0;$i<24;$i++){
                                                                $number = $i;
                                                                if($i<10){
                                                                    $number = '0'.$i;
                                                                }
                                                                $selected = '';
                                                                if($number==$hour_down){$selected = ' selected="selected"';}
                                                                echo '<option'.$selected.' value="'.$number.'">'.$number.'</option>';
                                                            }
                                                        ?>
                                                    </select>
                                                </span>
                                                <span style="float:left;padding:4px;">:</span>
                                                <span style="float:left;">
                                                    <select name="fMinute_down" style="width: 60px;text-align: center;">
                                                        <?php 
                                                            for($i=0;$i<60;$i++){
                                                                $number = $i;
                                                                if($i<10){
                                                                    $number = '0'.$i;
                                                                }
                                                                $selected = '';
                                                                if($number==$minute_down){$selected = ' selected="selected"';}
                                                                echo '<option'.$selected.' value="'.$number.'">'.$number.'</option>';
                                                            }
                                                        ?>
                                                    </select>
                                                </span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td class="col1">Lịch bay</td>
                                            <td class="col2">
                                                <div id="flight_schedules_container" class="ticketDay">
                                                <input type="hidden" class="inputVal" name="ticket_day" value="<?php echo $ticket_day;?>">
                                                <?php 
                                                    $time_flight_schedules_array = array("Thứ 2","Thứ 3","Thứ 4","Thứ 5","Thứ 6","Thứ 7","Chủ nhật");
                                                    for($j=0;$j<sizeof($time_flight_schedules_array);$j++){
                                                        $k = $j+1;
                                                        $class = '';
                                                        if(strpos(','.$ticket_day.',',','.$k.',')!==false){
                                                            $class = ' class="active"';
                                                        }
                                                        echo '<a'.$class.' idata="'.$k.'">'.$time_flight_schedules_array[$j].'</a>';
                                                    }
                                                ?>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr style="display: none;">
                                            <td class="col1">Khứ hồi</td>
                                            <td class="col2" style="padding-top: 7px;">
                                                <div style="float:left;">
                                                    <span style="float:left;padding:0;">
                                                        <span class="check_box_style1" state="<?php if($round_trip==1){echo 'on';}else{echo 'off';}?>">
                                                            <span class="<?php if($round_trip==1){echo 'check_box_on1';}else{echo 'check_box_off1';}?>">
                                                                <span class="check_box_on"></span>
                                                                <span class="check_box_bar"></span>
                                                                <input type="checkbox" name="fRound_trip"<?php if($round_trip==1){echo ' checked="checked"';}?> />
                                                            </span>
                                                        </span>
                                                    </span>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td class="col1">Mã chuyến bay</td>
                                            <td class="col2">
                                                <input type="text" default="" reset="true" name="flight_code" value="<?php echo $flight_code;?>" style="width:100px;">
                                            </td>
                                        </tr>
                                        <tr>
                                            <td class="col1">Loại vé<br>/Chỗ ngồi</td>
                                            <td class="col2">
                                                <input type="text" default="" reset="true" name="ticket_seat" value="<?php echo $ticket_seat;?>" style="width:265px;">
                                            </td>
                                        </tr>
                                        <tr>
                                            <td class="col1">Giá mỗi vé</td>
                                            <td class="col2">
                                                <!--input type="text" default="0" reset="true" name="fPrice" value="<?php echo $price;?>" style="width:100px;text-align: right;" onblur="if(this.value=='') this.value='0'" onfocus="if(this.value=='0') this.value=''"> <font style="font-size:11px;">(vnđ. Vui lòng nhập số)</font-->
                                            </td>
                                        </tr>
                                        <tr>
                                            <td class="col1">Thuế & Phí</td>
                                            <td class="col2">
                                                
                                                <span style="background:#ffffff;float:left;padding:5px 5px 4px 5px;box-shadow:0 0 2px #CCCCCC;width:120px;border:1px solid #DDDDDD;position: relative;color:#AAAAAA;">
                                                    Người lớn
                                                    <input type="text" default="0" reset="true" name="fTax" value="<?php echo $tax;?>" style="background:transparent;padding:0;width:120px;text-align: right;box-shadow:0 0 0 0;border:0;position: absolute;right:5px;" onblur="if(this.value=='') this.value='0'" onfocus="if(this.value=='0') this.value=''">
                                                </span>
                                                <span style="margin-left:10px;background:#ffffff;float:left;padding:5px 5px 4px 5px;box-shadow:0 0 2px #CCCCCC;width:120px;border:1px solid #DDDDDD;position: relative;color:#AAAAAA;">
                                                    Trẻ em
                                                    <input type="text" default="0" reset="true" name="fTax_child" value="<?php echo $tax_child;?>" style="background:transparent;padding:0;width:120px;text-align: right;box-shadow:0 0 0 0;border:0;position: absolute;right:5px;" onblur="if(this.value=='') this.value='0'" onfocus="if(this.value=='0') this.value=''">
                                                </span>
                                                <span style="margin-left:10px;background:#ffffff;float:left;padding:5px 5px 4px 5px;box-shadow:0 0 2px #CCCCCC;width:120px;border:1px solid #DDDDDD;position: relative;color:#AAAAAA;">
                                                    Em bé
                                                    <input type="text" default="0" reset="true" name="fTax_baby" value="<?php echo $tax_baby;?>" style="background:transparent;padding:0;width:120px;text-align: right;box-shadow:0 0 0 0;border:0;position: absolute;right:5px;" onblur="if(this.value=='') this.value='0'" onfocus="if(this.value=='0') this.value=''">
                                                </span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td class="col1">Giá giảm</td>
                                            <td class="col2">
                                                <input type="text" default="0" reset="true" name="fPrice_discount" value="<?php echo $price_discount;?>" style="width:100px;text-align: right;" onblur="if(this.value=='') this.value='0'" onfocus="if(this.value=='0') this.value=''"> <font style="font-size:11px;">(vnđ. Vui lòng nhập số.)</font>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td class="col1">Đang khuyến mãi</td>
                                            <td class="col2" style="padding-top: 7px;">
                                                <div style="float:left;">
                                                    <span style="float:left;padding:0;">
                                                        <span class="check_box_style1" state="<?php if($is_discount==1){echo 'on';}else{echo 'off';}?>">
                                                            <span class="<?php if($is_discount==1){echo 'check_box_on1';}else{echo 'check_box_off1';}?>">
                                                                <span class="check_box_on"></span>
                                                                <span class="check_box_bar"></span>
                                                                <input type="checkbox" name="is_discount"<?php if($is_discount==1){echo ' checked="checked"';}?> />
                                                            </span>
                                                        </span>
                                                    </span>
                                                </div>
                                            </td>
                                        </tr>
                                     
                                    </table>
                                </div>
                                </div>
                            </td>
                        </tr>
                        <tr <?php if($content_group==1){echo ' style="display: none;"';}?>>
                            <td colspan="4" bgcolor="#f1f1f1" style="padding-left:15px;padding-right:15px;">
                                <table cellpadding="5" cellspacing="0">
                                    <tr>
										<?php
											if($content_group==2){ 
												echo '<td colspan="4" align="center" style="color:#100000;text-transform: uppercase;font-weight: bold;">Thông tin Dự án</td>';
											}
											elseif($content_group==6){
												echo '<td colspan="4" align="center" style="color:#100000;text-transform: uppercase;font-weight: bold;">Thông tin sản phẩm</td>';
											}
											elseif($content_group==7){
												echo '<td colspan="4" align="center" style="color:#100000;text-transform: uppercase;font-weight: bold;">Thông tin sơ đồ căn hộ</td>';
											}
										?>
                                        
                                    </tr>
									
                                    <tr <?php if($content_group!=7){ echo ' style="display:none;"';}?>>
                                        <td>Thuộc dự án:</td>
                                        <td colspan="3">
											<select name="tour_type">
												<option <?php if($tour_type==0){echo ' selected="selected"';}?> value="0">--Chọn dự án--</option>
												<?php 
													$result = fn_get_array_with_query("select content_temp.contentid,content_meta.title from content_meta,content_temp where content_temp.contentid = content_meta.contentid and content_group = 2 order by orderingtime DESC");
													if($result!=false && mysql_num_rows($result)>0){
														while($row=mysql_fetch_array($result)){
															$selected='';if($tour_type==$row['contentid']){$selected=' selected="selected"';}
															echo '<option'.$selected.' value="'.$row["contentid"].'">'.$row["title"].'</option>';
														}
													}
												?>
											</select>
                                        </td>
                                    </tr>
									<tr <?php if($content_group==7){ echo ' style="display:none;"';}?>>
                                        <td>Mã hàng:</td>
                                        <td colspan="3">
                                            <input type="text" default="" reset="true" name="fCode" value="<?php echo $code;?>" style="width:200px;">
                                        </td>
                                    </tr>
									<tr style="display:none;">
                                        <td>Màu sắc</td>
											<!--input type="hidden" id="coloridList" name="fColorid" value="<?php echo $colorid;?>">
                                            <div id="colorIDChooseProducts">
                                                <?php 
                                                    $colorid_check = ','.$colorid.',';
                                                    $query = "select * from content_type where type = 1 and status = 1 order by name ASC";
                                                    $result = mysql_query($query,$GLOBALS["con"]);
                                                    if($result!=false && mysql_num_rows($result)>0){
                                                        while($row = mysql_fetch_array($result)){
                                                            $class = 'color';
                                                            if(strpos($colorid_check,','.$row['id'].',')!==false){
                                                                $class = 'colorSelect';
                                                            }
                                                            echo '<div class="'.$class.'" idata="'.$row['id'].'">'.$row['code'].'</div>';
                                                        }
                                                        mysql_free_result($result);
                                                    }
                                                ?>
                                            </div-->
                                            
                                        </td>
                                    </tr>
                                    <tr style="display:none;">
                                        <td>Hãng sản xuất</td>
                                        <td colspan="3">
                                            <select name="fProduct_os">
                                                <option <?php if($product_os==0){echo ' selected="selected"';}?> value="0">Chọn</option>
                                                <?php 
                                                    $result = fn_get_array_with_query("select id,code from content_type where type = 6 and status = 1 order by name,id ASC");
                                                    if($result!=false && mysql_num_rows($result)>0){
                                                        while($row = mysql_fetch_array($result)){
                                                            $selected='';if($product_os==$row['id']){$selected=' selected="selected"';}
                                                            echo '<option'.$selected.' value="'.$row['id'].'">'.$row['code'].'</option>';
                                                        }
                                                    }
                                                            
                                                ?>
                                            </select>
                                        </td>
                                    </tr>
									<tr style="display:none;">
										<td>Khu vực</td>
										<td colspan="3">
											
											<select name="fRegionid">
                                                <option <?php if($regionid==0){echo ' selected="selected"';}?> value="0">Chọn</option>
                                                <?php 
                                                    $result = fn_get_array_with_query("select id,code from content_type where type = 3 and status = 1 order by name,id ASC");
                                                    if($result!=false && mysql_num_rows($result)>0){
                                                        while($row = mysql_fetch_array($result)){
                                                            $selected='';if($regionid==$row['id']){$selected=' selected="selected"';}
                                                            echo '<option'.$selected.' value="'.$row['id'].'">'.$row['code'].'</option>';
                                                        }
                                                    }      
                                                ?>
                                            </select>
											<select name="fProduct_cd">
                                                <option <?php if($product_cd==0){echo ' selected="selected"';}?> value="0">Chọn</option>
                                                <?php 
                                                    $result = fn_get_array_with_query("select id,code from content_type where type = 2 and status = 1 order by name,id ASC");
                                                    if($result!=false && mysql_num_rows($result)>0){
                                                        while($row = mysql_fetch_array($result)){
                                                            $selected='';if($product_cd==$row['id']){$selected=' selected="selected"';}
                                                            echo '<option'.$selected.' value="'.$row['id'].'">'.$row['code'].'</option>';
                                                        }
                                                    }      
                                                ?>
                                            </select>
                                        </td>
									</tr>
									<tr style="display:none;">
                                        <td>Diện tích</td>
                                        <td colspan="3">
											<select name="fProduct_weight">
                                                <option<?php if($product_weight==0){echo ' selected="selected"';}?> value="0">Chọn</option>
                                                <?php 
													if($content_group==4)
                                                    $result = fn_get_array_with_query("select id,code from content_type where type = 4 and status = 1 order by name,id ASC");
													elseif($content_group==6){
														$result = fn_get_array_with_query("select id,code from content_type where type = 8 and status = 1 order by name,id ASC");
													}
                                                    if($result!=false && mysql_num_rows($result)>0){
                                                        while($row = mysql_fetch_array($result)){
                                                            $selected='';if($product_weight==$row['id']){$selected=' selected="selected"';}
                                                            echo '<option'.$selected.' value="'.$row['id'].'">'.$row['code'].'</option>';
                                                        }
                                                    }
                                                            
                                                ?>
                                            </select>
                                        </td>
                                    </tr>
                                    
									<tr>
                                        <td>Giá</td>
                                        <td colspan="3">
                                            <input type="text" default="0" reset="true" name="fPrice" value="<?php echo $price;?>" style="width:100px;text-align: right;" onblur="if(this.value=='') this.value='0'" onfocus="if(this.value=='0') this.value=''"> <font style="font-size:11px;">(vnđ. Vui lòng nhập số)</font>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Giá (Có VAT)</td>
                                        <td colspan="3">
                                            <input type="text" default="0" reset="true" name="fPrice_basic" value="<?php echo $price_basic;?>" style="width:100px;text-align: right;" onblur="if(this.value=='') this.value='0'" onfocus="if(this.value=='0') this.value=''"> <font style="font-size:11px;">(vnđ. Vui lòng nhập số)</font>
                                        </td>
                                    </tr> 
									<tr style="display:none;">
                                        <td>Chọn giá</td>
                                        <td colspan="3">
											<select name="fProduct_card">
                                                <option <?php if($product_card==0){echo ' selected="selected"';}?> value="0">Chọn</option>
                                                <?php 
                                                    $result = fn_get_array_with_query("select id,code from content_type where type = 5 and status = 1 order by name,id ASC");
													if($content_group==6){
														$result = fn_get_array_with_query("select id,code from content_type where type = 10 and status = 1 order by name,id ASC");
													}
                                                    if($result!=false && mysql_num_rows($result)>0){
                                                        while($row = mysql_fetch_array($result)){
                                                            $selected='';if($product_card==$row['id']){$selected=' selected="selected"';}
                                                            echo '<option'.$selected.' value="'.$row['id'].'">'.$row['code'].'</option>';
                                                        }
                                                    }
                                                            
                                                ?>
                                            </select>
                                            <!--input type="text" default="0" reset="true" name="fPrice" value="<?php echo $price;?>" style="width:200px;text-align: right;" onblur="if(this.value=='') this.value='0'" onfocus="if(this.value=='0') this.value=''"> <font style="font-size:11px;">(vnđ. Vui lòng nhập số.)</font-->
                                        </td>
                                    </tr>
									<tr style="display: none;">
                                        <td>Kích thước</td>
                                        <td colspan="3">
                                            <input type="text" default="" reset="true" name="fProduct_manufacturer" value="<?php echo $product_manufacturer;?>" style="width:200px;">
                                        </td>
                                    </tr>
									<tr style="display:none;">
                                        <td>Số tầng</td>
                                        <td colspan="3">
                                            <select name="fProduct_cpu">
                                                <option<?php if($product_cpu==0){echo ' selected="selected"';}?> value="0">Chọn</option>
                                                <?php 
                                                    $result = fn_get_array_with_query("select id,code from content_type where type = 7 and status = 1 order by name,id ASC");
													if($content_group==6){
														$result = fn_get_array_with_query("select id,code from content_type where type = 9 and status = 1 order by name,id ASC");
													}
                                                    if($result!=false && mysql_num_rows($result)>0){
                                                        while($row = mysql_fetch_array($result)){
                                                            $selected='';if($product_cpu==$row['id']){$selected=' selected="selected"';}
                                                            echo '<option'.$selected.' value="'.$row['id'].'">'.$row['code'].'</option>';
                                                        }
                                                    }
                                                ?>
                                            </select>
                                        </td>
                                    </tr>
									
									<tr style="display:none;">
                                        <td>Tầng hầm</td>
										<td colspan="3">
                                            <span style="float:left;border:0px solid #CCCCCC; padding:0px 0px;">
                                                <span class="check_box_style1" state="<?php if($product_status==1){echo 'on';}else{echo 'off';}?>">
                                                    <span class="<?php if($product_status==1){echo 'check_box_on1';}else{echo 'check_box_off1';}?>">
                                                        <span class="check_box_on"></span>
                                                        <span class="check_box_bar"></span>
                                                        <input type="checkbox" name="fProduct_status"<?php if($product_status==1){echo ' checked="checked"';}?> />
                                                    </span>
                                                </span>
                                            </span>
                                        </td>
                                    </tr>									
                                    <tr style="display:none;">
                                        <td>Giá trên đã bao gồm VAT?</td>
                                        <td colspan="3">
                                            <span style="float:left;border:0px solid #CCCCCC; padding:0px 0px;">
                                                
                                                <span class="check_box_style1" state="<?php if($product_vat_is==1){echo 'on';}else{echo 'off';}?>">
                                                    <span class="<?php if($product_vat_is==1){echo 'check_box_on1';}else{echo 'check_box_off1';}?>">
                                                        <span class="check_box_on"></span>
                                                        <span class="check_box_bar"></span>
                                                        <input type="checkbox" name="fProduct_vat_is"<?php if($product_vat_is==1){echo ' checked="checked"';}?> />
                                                    </span>
                                                </span>
                                            </span>
                                        </td>
                                    </tr>
									<tr>
                                        <td>Phí VAT</td>
                                        <td colspan="3">
											<input type="text" default="" reset="true" name="fProduct_hdd" value="<?php echo $product_hdd;?>" style="width:100px;"><font style="font-size:11px;">(%. Vui lòng nhập số)</font>
                                            
                                        </td>
                                    </tr>
									<tr style="display: none;" <?php //if($content_group==7){ echo ' style="display:none;"';}?>>
										<td colspan="4">Chú ý: </td>
                                    <tr style="display: none;" <?php //if($content_group==7){ echo ' style="display:none;"';}?>>
										<td colspan="4">
											<textarea name="hotel_about" reset="true" default="" editor_format="true" mini_control="true" width="810" height="120" style="width:650px;height:80px;" maxlength="1000" ><?php echo $hotel_about;?></textarea>
										</td>
									</tr>
									<tr<?php if($content_group==7){ echo ' style="display:none;"';}?>>
										<td colspan="4">Mô tả: </td>
									<tr<?php if($content_group==7){ echo ' style="display:none;"';}?>>
                                        <td colspan="4">
                                            <textarea name="fOther_info" default="" reset="true" editor_format="true" mini_control="true" width="810" height="120" style="width:795px;height:80px;"><?php echo $other_info;?></textarea>
											<textarea name="fMeta_description" reset="true" default="" style="width:650px;height:80px;display: none;" maxlength="1000"><?php echo $meta_description;?></textarea>
										</td>
									</tr>
									 <tr>
                                        <td>Bảo hành</td>
                                        <td colspan="3">
                                            <input type="text" default="0" reset="false" name="fProduct_warranty" value="<?php echo $product_warranty;?>" style="width:100px;text-align: right;" onblur="if(this.value=='') this.value='0'" onfocus="if(this.value=='0') this.value=''"> <font style="font-size:11px;">(Tháng. Vui lòng nhập số)</font>
                                        </td>
                                    </tr>
                                    <tr style="display:none;">
                                        <td>Đánh giá</td>
                                        <td colspan="3">
                                            <select name="fRate">
                                                <option<?php if($rate==0){echo ' selected="selected"';}?> value="0">Chọn</option>
                                                <option<?php if($rate==1){echo ' selected="selected"';}?> value="1">1 sao</option>
                                                <option<?php if($rate==2){echo ' selected="selected"';}?> value="2">2 sao</option>
                                                <option<?php if($rate==3){echo ' selected="selected"';}?> value="3">3 sao</option>
                                                <option<?php if($rate==4){echo ' selected="selected"';}?> value="4">4 sao</option>
                                                <option<?php if($rate==5){echo ' selected="selected"';}?> value="5">5 sao</option>
                                            </select>
                                        </td>
                                    </tr>  
                                    <tr style="display: none;">
                                        <td>Bộ nhớ RAM</td>
                                        <td colspan="3">
                                            <select name="fProduct_ram">
                                                <option<?php if($product_ram==0){echo ' selected="selected"';}?> value="0">Chọn</option>
                                                <?php 
                                                    $result = fn_get_array_with_query("select id,code from content_type where type = 10 and status = 1 order by name,id ASC");
                                                    if($result!=false && mysql_num_rows($result)>0){
                                                        while($row = mysql_fetch_array($result)){
                                                            $selected='';if($product_ram==$row['id']){$selected=' selected="selected"';}
                                                            echo '<option'.$selected.' value="'.$row['id'].'">'.$row['code'].'</option>';
                                                        }
                                                    }
                                                            
                                                ?>
                                            </select>
                                        </td>
                                    </tr>
                                   
                                    <tr style="display: none;">
                                        <td>Pin</td>
                                        <td colspan="3">
                                            <select name="fProduct_pin">
                                                <option<?php if($product_pin==0){echo ' selected="selected"';}?> value="0">Chọn</option>
                                                <?php 
                                                    $result = fn_get_array_with_query("select id,code from content_type where type = 12 and status = 1 order by name,id ASC");
                                                    if($result!=false && mysql_num_rows($result)>0){
                                                        while($row = mysql_fetch_array($result)){
                                                            $selected='';if($product_pin==$row['id']){$selected=' selected="selected"';}
                                                            echo '<option'.$selected.' value="'.$row['id'].'">'.$row['code'].'</option>';
                                                        }
                                                    }
                                                            
                                                ?>
                                            </select>
                                        </td>
                                    </tr>
                                    <tr style="display: none;">
                                        <td>Mặt tiền</td>
                                        <td colspan="3">
                                            <select name="fProduct_materials">
                                                <option<?php if($product_materials==0){echo ' selected="selected"';}?> value="0">Chọn</option>
                                                <?php 
                                                    $result = fn_get_array_with_query("select id,code from content_type where type = 3 and status = 1 order by name,id ASC");
                                                    if($result!=false && mysql_num_rows($result)>0){
                                                        while($row = mysql_fetch_array($result)){
                                                            $selected='';if($product_materials==$row['id']){$selected=' selected="selected"';}
                                                            echo '<option'.$selected.' value="'.$row['id'].'">'.$row['code'].'</option>';
                                                        }
                                                    }
                                                            
                                                ?>
                                            </select>
                                        </td>
                                    </tr>
                                   
                                    
                                    <tr <?php if($content_group==7){ echo ' style="display:none;"';}?>>
                                        <td colspan="4">
                                            <span style="float:left;border:1px solid #CCCCCC; padding:3px 8px;margin-right:5px;">
                                                <span style="float:left;margin:2px 6px 0 0;">Sản phẩm mới</span>
                                                <span class="check_box_style1" state="<?php if($note1==1){echo 'on';}else{echo 'off';}?>">
                                                    <span class="<?php if($note1==1){echo 'check_box_on1';}else{echo 'check_box_off1';}?>">
                                                        <span class="check_box_on"></span>
                                                        <span class="check_box_bar"></span>
                                                        <input type="checkbox" name="fNote1"<?php if($note1==1){echo ' checked="checked"';}?> />
                                                    </span>
                                                </span>
                                            </span>
                                            <span style="float:left;border:1px solid #CCCCCC; padding:3px 8px;margin-left:5px;<?php if($content_group!=2){echo 'display:none;';}?>">
                                                <span style="float:left;margin:2px 6px 0 0;">Sản phẩm bán chạy</span>
                                                <span class="check_box_style1" state="<?php if($note2==1){echo 'on';}else{echo 'off';}?>">
                                                    <span class="<?php if($note2==1){echo 'check_box_on1';}else{echo 'check_box_off1';}?>">
                                                        <span class="check_box_on"></span>
                                                        <span class="check_box_bar"></span>
                                                        <input type="checkbox" name="fNote2"<?php if($note2==1){echo ' checked="checked"';}?> />
                                                    </span>
                                                </span>
                                            </span>
											<span style="float:left;border:1px solid #CCCCCC; padding:3px 8px;margin-left:5px;<?php if($content_group==7){echo 'display:none;';}?>">
												<span style="float:left;margin:2px 6px 0 0;">Sản phẩm bán chạy</span>
												<span class="check_box_style1" state="<?php if($note3==1){echo 'on';}else{echo 'off';}?>">
													<span class="<?php if($note3==1){echo 'check_box_on1';}else{echo 'check_box_off1';}?>">
														<span class="check_box_on"></span>
														<span class="check_box_bar"></span>
														<input type="checkbox" name="fNote3"<?php if($note3==1){echo ' checked="checked"';}?> />
													</span>
												</span>
											</span>
                                            <span style="float:left;border:1px solid #CCCCCC; padding:3px 8px;<?php if($content_group!=2){echo 'display:none;';}?>">
                                                <span style="float:left;margin:2px 6px 0 0;">Công trình tiêu biểu</span>
                                                <span class="check_box_style1" state="<?php if($note4==1){echo 'on';}else{echo 'off';}?>">
                                                    <span class="<?php if($note4==1){echo 'check_box_on1';}else{echo 'check_box_off1';}?>">
                                                        <span class="check_box_on"></span>
                                                        <span class="check_box_bar"></span>
                                                        <input type="checkbox" name="fNote4"<?php if($note4==1){echo ' checked="checked"';}?> />
                                                    </span>
                                                </span>
                                            </span>
                                        </td>
                                    </tr>
									<tr style="display:none;" >
										<td colspan="4" style="padding:5px;">Sơ đồ chi tiết</td>
									</tr>
									<tr style="<?php if($content_group!=7){echo 'display:none;';}?>" >
										<td colspan="4" style="padding:5px;">
											 <textarea name="tour_detail" default="" reset="true" editor_format="true" mini_control="false" width="810" height="250" style="width:795px;height:80px;"><?php echo $tour_detail;?></textarea>
										</td>
									</tr>
									<tr style="<?php if($content_group!=6){echo 'display:none;';}?>" >
										<td colspan="4" style="padding:5px;">Mô tả chi tiết</td>
									</tr>
									<tr style="<?php if($content_group!=6){echo 'display:none;';}?>" >
										<td colspan="4" style="padding:5px;">
											<textarea name="hotel_detail" default="" reset="true" editor_format="true" mini_control="false" width="810" height="200" style="width:795px;height:80px;"><?php echo $hotel_detail;?></textarea>
										</td>
									</tr>
								   <tr style="<?php if($content_group!=2){echo 'display:none;';}?>">
								   <td colspan="4"><b>Giới thiệu</b></td></tr>
                                    <tr style="<?php if($content_group!=2){echo 'display:none;';}?>">
                                        <td colspan="4">
                                            <textarea name="fProduct_warranty_text" default="" reset="true" editor_format="true" mini_control="false" width="810" height="200" style="width:795px;height:80px;"><?php echo $product_warranty_text;?></textarea>
                                        </td>
                                    </tr>
									
									<tr style="display:none;">
										<td colspan="4"><b>Sơ đồ căn hộ</b></td>
									</tr>
									<tr style="display:none">
										<td colspan="4" style="padding:5px;">
											<textarea name="fProduct_delivery" default="" reset="true" editor_format="true" mini_control="false" width="810" height="200" style="width:795px;height:80px;"><?php echo $product_delivery;?></textarea>
										</td>
									</tr>
									<tr style="<?php if($content_group!=2){echo 'display:none;';}?>">
										<td colspan="4"><b>Thanh toán</b></td>
									</tr>
									<tr style="<?php if($content_group!=2){echo 'display:none;';}?>">
										<td colspan="4" style="padding:5px;">
											
										</td>
									</tr>
                                </table>
                            </td>
                        </tr>
						
                        <tr>
                            <td colspan="4">
                                <div class="openMoreSettingBox">
                                <div class="openMoreSettingBtn"><a name="openMoreSettingBtn" idata="seoOfContent">SEO</a></div>
                                <div class="openMoreSettingContent" id="seoOfContent" style="display: none;">
                                    <table style="padding:10px 0;margin-left:15px;" cellpadding="0" cellspacing="0" align="left">
                                        <tr>
                                            <td class="col1">Meta Alias</td>
                                            <td class="col2">
                                                <input type="text" default="" reset="true" name="fAlias" value="<?php echo $alias;?>" style="width:680px;">
                                            </td>
                                        </tr>
                                        <tr>
                                            <td class="col1">Meta Title</td>
                                            <td class="col2">
                                                <textarea name="fMeta_title" default="" reset="true" style="width:680px;height:16px;"><?php echo $meta_title;?></textarea>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td class="col1">Từ khoá</td>
                                            <td class="col2">
                                                <textarea name="fKeywords" default="" reset="true" style="width:680px;height:50px;"><?php show_keywords($keywords);?></textarea>
                                            </td>
                                        </tr>
                                    </table>
                                </div>
                                </div>
                            </td>
                        </tr>     
                        <tr <?php if($content_group==7){ echo ' style="display:none;"';}?>>
                            <td colspan="4">
                                <span style="float:left;border:1px solid #CCCCCC; padding:3px 8px;">
                                    <span style="float:left;margin:2px 6px 0 0;">Bài Hot</span>
                                    <span class="check_box_style1" state="<?php if($note==1){echo 'on';}else{echo 'off';}?>">
                                        <span class="<?php if($note==1){echo 'check_box_on1';}else{echo 'check_box_off1';}?>">
                                            <span class="check_box_on"></span>
                                            <span class="check_box_bar"></span>
                                            <input type="checkbox" name="fNote"<?php if($note==1){echo ' checked="checked"';}?> />
                                        </span>
                                    </span>
                                </span>
								
                                <span style="float:left;border:1px solid #CCCCCC; padding:3px 8px;margin-left:5px;<?php if($content_group==2){echo 'display:none;';}?>">
                                    <span style="float:left;margin:2px 6px 0 0;">Tin mới nhất</span>
                                    <span class="check_box_style1" state="<?php if($content_type==1){echo 'on';}else{echo 'off';}?>">
                                        <span class="<?php if($content_type==1){echo 'check_box_on1';}else{echo 'check_box_off1';}?>">
                                            <span class="check_box_on"></span>
                                            <span class="check_box_bar"></span>
                                            <input type="checkbox" name="fContent_type"<?php if($content_type==1){echo ' checked="checked"';}?> />
                                        </span>
                                    </span>
                                </span>
                                <span style="margin-left:10px;float:right;border: 1px solid #CCCCCC; padding:3px 8px;<?php if($id!=0){echo 'display: none;';}?>">
                                    <span style="float:left;margin:2px 6px 0 0;">Xuất bản ngay</span>
                                    <span class="check_box_style1" state="<?php if($published==1){echo 'on';}else{echo 'off';}?>">
                                        <span class="<?php if($published==1){echo 'check_box_on1';}else{echo 'check_box_off1';}?>">
                                            <span class="check_box_on"></span>
                                            <span class="check_box_bar"></span>
                                            <input type="checkbox" name="fPublish"<?php if($published==1){echo ' checked="checked"';}?> />
                                        </span>
                                    </span>
                                </span>
                                <span style="float:right;border:1px solid #CCCCCC; padding:3px 8px;">
                                    <span style="float:left;margin:2px 6px 0 0;">Hiện ở trang chủ</span>
                                    <span class="check_box_style1" state="<?php if($showinhome==1){echo 'on';}else{echo 'off';}?>">
                                        <span class="<?php if($showinhome==1){echo 'check_box_on1';}else{echo 'check_box_off1';}?>">
                                            <span class="check_box_on"></span>
                                            <span class="check_box_bar"></span>
                                            <input type="checkbox" name="fShowinhome"<?php if($showinhome==1){echo ' checked="checked"';}?> />
                                        </span>
                                    </span>
                                </span>
                            </td>
                        </tr>
                    </table>
                </div>
                <div class="tab_content_info" style="display:none;padding-top:700px;">
                    <table cellpadding="5" cellspacing="0" class="table_add">
                        <tr>
                            <td>
                                <textarea name="fImage_list" default="" reset="true" style="width:706px;height:200px;display:none;"><?php echo $image_list;?></textarea>
                                <textarea name="fColor_list" default="" reset="true" style="width:706px;height:200px;display:none;"><?php echo $color_list;?></textarea>
                            </td>
                        </tr>
                    </table>
                </div>
                <?php 
                    if($id!=0){
                        echo '<div class="tab_content_info" style="display:none;">
                            <table cellpadding="6" cellspacing="0" class="table_add">
                                <tr>
                                    <td valign="top">Người tạo : </td>
                                    <td colspan="3"><a class="user_text" target="_blank" href="'.$base_folder.'admincp/#user_add?id='.$creator.'">'.get_colum_of_table_from_db('user_info','showname','id',$creator).'</a></td>
                                </tr>
                                <tr>
                                    <td valign="top">Ngày tạo : </td>
                                    <td colspan="3">'.format_full_time($create_time,'HH:mm DD/MM/YYYY').'</td>
                                </tr>
                                <tr>
                                    <td valign="top">Số lần cập nhật : </td>
                                    <td colspan="3">'.format_number_thousand($edit_number).'</td>
                                </tr>
                                <tr>
                                    <td valign="top">Cập nhật lần cuối : </td>
                                    <td colspan="3">'.show_value_by_compare($edit_time,0,'Chưa từng cập nhật',format_full_time($edit_time,'HH:mm DD/MM/YYYY').' bởi <a target="_blank" href="'.$base_folder.'admincp/#user_add?id='.$editor.'" class="user_text">' . get_colum_of_table_from_db('user_info','showname','id',$editor)).'</a></td>
                                </tr>
                                <tr>
                                    <td valign="top">Xuất bản lúc : </td>
                                    <td colspan="3">'.show_value_by_compare($published,0,'Chưa được xuất bản',format_full_time($publish_time,'HH:mm DD/MM/YYYY').' bởi <a target="_blank" href="'.$base_folder.'admincp/#user_add?id='.$publisher.'" class="user_text">' . get_colum_of_table_from_db('user_info','showname','id',$publisher)).'</a></td>
                                </tr>
                                <tr>
                                    <td valign="top">Gỡ xuống lúc : </td>
                                    <td colspan="3">'.show_value_by_compare($remover,0,'Chưa từng gỡ xuống',format_full_time($remove_time,'HH:mm DD/MM/YYYY').' bởi <a target="_blank" href="'.$base_folder.'admincp/#user_add?id='.$remover.'" class="user_text">' . get_colum_of_table_from_db('user_info','showname','id',$remover)).'</a></td>
                                </tr>
                                <tr>
                                    <td valign="top">Tự động xuất bản : </td>
                                    <td colspan="3">'.show_value_by_compare($auto_publish,0,'Không tự động','Tự động').'</td>
                                </tr>
                                <tr>
                                    <td valign="top">Google indexed : </td>
                                    <td colspan="3">'.show_value_by_compare($google_index,0,'Chưa',format_full_time($google_index_time,'HH:mm DD/MM/YYYY')).'</td>
                                </tr>
                            </table>
                        </div>';
                    }
                ?>
                <div id="content_button" style="width: 704px;">
                    <?php 
                        if($id==0){
                            echo '<button type="submit" class="button_style1"><span>Tạo mới</span></button>';
                        }
                        else{
                            echo '<span style="float:left;margin-left:10px;">';
                            if($published==0){
                                echo '<button type="button" class="button_style1" onclick="content_process(\'admincp/modules/content_process.php?id='.$id.'&rq=publish\',true);"><span><a class="publish_article">&nbsp;</a>Xuất bản</span></button>';
                                echo '<button type="button" class="button_style2" onclick="content_process(\'admincp/modules/content_process.php?id='.$id.'&rq=delete\',false);" style="margin-left:5px;"><span><a class="delete_article">&nbsp;</a>Xoá bài</span></button>';
                                echo '<button type="button" class="button_style2" onclick="content_process(\'admincp/modules/content_process.php?id='.$id.'&rq=delete_all\',false);" style="margin-left:5px;"><span><a class="delete_article">&nbsp;</a>Xoá (Bao gồm ảnh)</span></button>';
                            }
                            else{
                                echo '<button type="button" class="button_style3" onclick="content_process(\'admincp/modules/content_process.php?id='.$id.'&rq=republish\',true);"><span><a class="republish_article">&nbsp;</a>Tái xuất bản</span></button>';
                                echo '<button type="button" class="button_style4" onclick="content_process(\'admincp/modules/content_process.php?id='.$id.'&rq=down\',true);" style="margin-left:5px;"><span><a class="down_article">&nbsp;</a>Gỡ bài</span></button>';
                            }
                            echo '</span>';
                            echo '<button type="submit" class="button_style1"><span>Cập nhật</span></button>';
                        }
                    ?>
                    <button class="button_style1" onclick="return cancel_process('<?php if($content_group==2){echo '#content?content_group=2&mn=mn_product';}else{echo '#content?content_group=1&mn=mn_content';}?>');" style="margin-left:5px;"><span>Hủy</span></button>
                </div>
            </form>
        </div>
    </div>
    <?php include($_SERVER['DOCUMENT_ROOT'] . $base_folder . "admincp/modules/other_info.php");?>
</div>
