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
    // Content variable
    $contentid = $_POST["fID"];$mode = $_POST["fMode"];
    $catid = $_POST["fCatid"];
    $parentid = get_parentid($catid);
    $old_catid = $_POST["fOld_Catid"];
    $poster = trim($_POST["fPoster"]);
    $create_time = date("YmdHis");
    $post_time = $create_time;
    $approved = 0;
    $approver = 0;
    $approve_time = 0;
    $published = 0;if($_POST["fPublish"]=="on"){$published = 1;}
    $publisher = 0;
    $publish_time = 0;
    $can_comment = 0;
    $content_group = trim($_POST["fContent_group"]);
    $view = 0;
    $note = 0;if($_POST["fNote"]=="on"){$note = 1;}
    $note1 = 0;if($_POST["fNote1"]=="on"){$note1 = 1;}$note2 = 0;if($_POST["fNote2"]=="on"){$note2 = 1;}
    $note3 = 0;if($_POST["fNote3"]=="on"){$note3 = 1;}$note4 = 0;if($_POST["fNote4"]=="on"){$note4 = 1;}
    $content_type = 0;if($_POST["fContent_type"]=="on"){$content_type = 1;}
    $status = 1;
    $languageid = $_POST["fLanguage"];
    $showinhome = 0;if($_POST["fShowinhome"]=="on"){$showinhome = 1;}
    // Content_meta variable
    $title = trim($_POST["fTitle"]);
    $alias = post_submit_object_process('fAlias','',false);
    if($alias==''){
        $alias = $title;
        if(strlen($alias)>150){
            $alias = substr($alias,0,150);
            if(strpos($alias,' ')>0){
                $alias = trim(substr($alias,0,strrpos($alias,' ')));
            }
        }
    }
    $alias = fn_export_alias_from_title($alias);
    $description = trim($_POST["fDescription"]);$hotdescription = trim($_POST["fHotdescription"]);
    $image = trim($_POST["fImage"]);
    $hotimage = '';if(isset($_POST["fHotimage"])){$hotimage = trim($_POST["fHotimage"]);}
    $image_large = post_submit_object_process('fImage_large','',false);
    $video_url = '';if(isset($_POST["fVideo_url"])){$video_url = trim($_POST["fVideo_url"]);}
    $download_url = '';if(isset($_POST["fDownload_url"])){$download_url = trim($_POST["fDownload_url"]);}
    $hyper_link = '';if(isset($_POST["fHyper_link"])){$hyper_link = trim($_POST["fHyper_link"]);}
    // SEO
    $keywords = "";
    $keyword_list = trim($_POST["fKeywords"]);
    if($keyword_list==""){$keyword_list = extract_meta_keywords($title);}
    $keyword_list = strtolower($keyword_list);
    $meta_title = trim($_POST["fMeta_title"]);
    $meta_description = trim($_POST["fMeta_description"]);
    if($meta_title==""){$meta_title = $title;}
    if($meta_description==""){$meta_description = $description;}
    $meta_description = substring(strip_tags($meta_description),230);
    $meta_keywords = $keyword_list;
    // Content_body variable
    $body = trim($_POST["editor1"]);
    // Content_info variable
    $price = post_submit_object_process('fPrice',0,true);
    $units = post_submit_object_process('units','',false);
    $price_basic = post_submit_object_process('fPrice_basic',0,true);$areaid = post_submit_object_process('fAreaid',0,true);
    $code = post_submit_object_process('fCode','',false);$image_list = post_submit_object_process('fImage_list','',false);$color_list = post_submit_object_process('fColor_list','',false);
    $other_info = post_submit_object_process('fOther_info','',false);
    $product_vat = post_submit_object_process('fProduct_vat','',false);
    $product_model = post_submit_object_process('fProduct_model','',false);
    $product_status = 0;if($_POST["fProduct_status"]=="on"){$product_status = 1;}
    $product_vat_is = 0;if($_POST["fProduct_vat_is"]=="on"){$product_vat_is = 1;}
    $product_manufacturer = post_submit_object_process('fProduct_manufacturer','',false);
    $product_warranty = post_submit_object_process('fProduct_warranty',0,true);
    $product_discount = post_submit_object_process('fProduct_discount','',false);$regionid = post_submit_object_process('fRegionid',0,true);$rate = post_submit_object_process('fRate',0,true);
    $size = post_submit_object_process('fSize','',false);$product_field = post_submit_object_process('fProduct_field',0,true);$product_materials = post_submit_object_process('fProduct_materials',0,true);
    // Content special
    $content_special_array = array();
    $content_special_array[1] = trim($_POST["fSize_number"]);
    $customer_selected = post_submit_object_process('fCustomer_selected','',false);
    $recruitment_salary = post_submit_object_process('fRecruitment_salary',0,true);
    $brandid = post_submit_object_process('fBrandid',0,true);
    
    $product_inch = post_submit_object_process('fProduct_inch',0,true);
    $product_weight = post_submit_object_process('fProduct_weight',0,true);
    $product_os = post_submit_object_process('fProduct_os',0,true);
    $product_cd = post_submit_object_process('fProduct_cd',0,true);
    $product_card = post_submit_object_process('fProduct_card',0,true);
    $product_cpu = post_submit_object_process('fProduct_cpu',0,true);
    $product_ram = post_submit_object_process('fProduct_ram',0,true);
    $product_hdd = post_submit_object_process('fProduct_hdd',0,true);
    $product_pin = post_submit_object_process('fProduct_pin',0,true);
    $colorid = post_submit_object_process('fColorid',0,true);
    
    // Ticket
    $ticket_type = post_submit_object_process('ticket_type',0,true);
    $ticket_from = post_submit_object_process('ticket_from',0,true);
    $ticket_to = post_submit_object_process('ticket_to',0,true);
    $old_ticket_from = post_submit_object_process('old_ticket_from',0,true);
    $old_ticket_to = post_submit_object_process('old_ticket_to',0,true);
    $ticket_airline = post_submit_object_process('ticket_airline',0,true);
    $hour_leave = post_submit_object_process('fHour_leave','0',false);
    $minute_leave = post_submit_object_process('fMinute_leave','0',false);
    $hour_down = post_submit_object_process('fHour_down','0',false);
    $minute_down = post_submit_object_process('fMinute_down','0',false);
    $ticket_day = post_submit_object_process('ticket_day','',false);
    $round_trip = 0;if($_POST["fRound_trip"]=="on"){$round_trip = 1;}
    $ticket_seat = post_submit_object_process('ticket_seat','',false);
    $ticket_airport_start = post_submit_object_process('ticket_airport_start','',false);
    $ticket_airport_end = post_submit_object_process('ticket_airport_end','',false);
    $tax = post_submit_object_process('fTax',0,true);
    $tax_child = post_submit_object_process('fTax_child',0,true);
    $tax_baby = post_submit_object_process('fTax_baby',0,true);
    $price_discount = post_submit_object_process('fPrice_discount',0,true);
    $is_discount = 0;if($_POST["is_discount"]=="on"){$is_discount = 1;}
    $flight_code = post_submit_object_process('flight_code','',false);
    
    $time_leave = '0';$time_down = '0';
    if($hour_leave>0 || $minute_leave >0){
        $time_leave = $hour_leave . '' . $minute_leave;
    }
    if($hour_down>0 || $minute_down >0){
        $time_down = $hour_down . '' . $minute_down;
    }
    
    // Hotel
    $hotel_image                = post_submit_object_process('hotel_image','',false);
    $hotel_address              = post_submit_object_process('hotel_address','',false);
    $hotel_discount_percent     = post_submit_object_process('hotel_discount_percent',0,true);
    $hotel_price_min            = post_submit_object_process('hotel_price_min',0,true);
    $hotel_star                 = post_submit_object_process('hotel_star',0,true);
    $hotel_discount = 0;if($_POST["hotel_discount"]=="on"){$hotel_discount = 1;}
    $old_hotel_regionid         = post_submit_object_process('old_hotel_regionid',0,true);
    $hotel_regionid             = post_submit_object_process('hotel_region',0,true);
    $hotel_region_sub           = post_submit_object_process('hotel_region_sub',0,true);
    if($hotel_region_sub>0){$hotel_regionid = $hotel_region_sub;}
    $hotel_room_total_number    = post_submit_object_process('hotel_room_total_number',0,true);
    $hotel_about                = post_submit_object_process('hotel_about','',false);
    $hotel_policy               = post_submit_object_process('hotel_policy','',false);
    $hotel_detail               = post_submit_object_process('hotel_detail','',false);
    
    // Tour
    $tour_image         = post_submit_object_process('tour_image','',false);
    $tour_time          = post_submit_object_process('tour_time','',false);
    $tour_schedule      = post_submit_object_process('tour_schedule','',false);
    $tour_start_address = post_submit_object_process('tour_start_address','',false);
    $tour_end_address   = post_submit_object_process('tour_end_address','',false);
    $tour_vehicle       = post_submit_object_process('tour_vehicle','',false);
    $tour_address       = post_submit_object_process('tour_address','',false);
    $tour_price         = post_submit_object_process('tour_price',0,true);
    $tour_everyday = 0;if($_POST["tour_everyday"]=="on"){$tour_everyday = 1;}
    $tour_isdiscount = 0;if($_POST["tour_isdiscount"]=="on"){$tour_isdiscount = 1;}
    $tour_type          = post_submit_object_process('tour_type',0,true);
    $tour_detail        = post_submit_object_process('tour_detail','',false);
    $tour_address_detail= post_submit_object_process('tour_address_detail','',false);
    $tour_image             = fn_escapse_string($tour_image);
    $tour_time              = fn_escapse_string($tour_time);
    $tour_schedule          = fn_escapse_string($tour_schedule);
    $tour_start_address     = fn_escapse_string($tour_start_address);
    $tour_end_address       = fn_escapse_string($tour_end_address);
    $tour_vehicle           = fn_escapse_string($tour_vehicle);
    $tour_address           = fn_escapse_string($tour_address);
    $tour_detail            = fn_escapse_string($tour_detail);
    $tour_address_detail    = fn_escapse_string($tour_address_detail);
    
    $hotel_image            = fn_escapse_string($hotel_image);
    $hotel_address          = fn_escapse_string($hotel_address);
    $hotel_about            = fn_escapse_string($hotel_about);
    $hotel_policy           = fn_escapse_string($hotel_policy);
    $hotel_detail           = fn_escapse_string($hotel_detail);
    
    $recruitment_deadline = post_submit_object_process('fRecruitment_deadline','',false);$product_delivery = post_submit_object_process('fProduct_delivery','',false);
    $product_warranty_text = post_submit_object_process('fProduct_warranty_text','',false);
    if($recruitment_deadline!=0 && $recruitment_deadline!='' && strlen($recruitment_deadline)==10){
        $recruitment_deadline = substr($recruitment_deadline,6) . substr($recruitment_deadline,3,2) . substr($recruitment_deadline,0,2);
    }
    else{
        $recruitment_deadline = 0;
    }
    $recruitment_region = trim($_POST["fRecruitment_region"]);
    $recruitment_region = str_replace(chr(13),'<br>',$recruitment_region);
    $recruitment_region = str_replace(chr(10),'',$recruitment_region);
    
     // Other variable
    $userid = 0;
    $query_error = '';
    if($web_mysql_escape_boolean){
        $title = mysql_escape_string($title);$description = mysql_escape_string($description);$hotdescription = mysql_escape_string($hotdescription);$body = mysql_escape_string($body);
        $meta_title = mysql_escape_string($meta_title);$meta_description = mysql_escape_string($meta_description);$meta_keywords = mysql_escape_string($meta_keywords);
        $video_url = mysql_escape_string($video_url);$hyper_link = mysql_escape_string($hyper_link);$other_info = mysql_escape_string($other_info);$image_list = mysql_escape_string($image_list);
        $product_vat = mysql_escape_string($product_vat);$product_model = mysql_escape_string($product_model);$product_manufacturer = mysql_escape_string($product_manufacturer);$color_list = mysql_escape_string($color_list);
        $product_discount = mysql_escape_string($product_discount);
        $recruitment_region = mysql_escape_string($recruitment_region);$product_delivery = mysql_escape_string($product_delivery);
        $product_warranty_text = mysql_escape_string($product_warranty_text);
        $units = mysql_escape_string($units);
    }
    
    $ticket_day = fn_escapse_string($ticket_day);
    $ticket_seat = fn_escapse_string($ticket_seat);
    $flight_code = fn_escapse_string($flight_code);
    $ticket_airport_start = fn_escapse_string($ticket_airport_start);
    $ticket_airport_end = fn_escapse_string($ticket_airport_end);
    
    
    $publish_permit = 0;
    $message_return = '';
    $status_return = 0;
    $url_return = '';
    if(checklogin()){
        $publish_permit_require = 13;
        $publish_permit = get_column_of_table("select value from user_permit where permitid = $publish_permit_require and userid = $userid");
        if($mode=='add'){
            $poster = $userid;
            $user_permit_require = 10;
            $user_permit_require_name = get_list_colum_of_table_from_db('permit','name','id',$user_permit_require);
            $user_permit_value = get_column_of_table("select value from user_permit where permitid = $user_permit_require and userid = $userid");
            if($user_permit_value==1){
                if($published==1 && $publish_permit==1){
                    $approved = 1;$approver = $poster;$approve_time = $create_time;
                    $publisher = $poster;$publish_time = $create_time;
                }
                if($contentid==0 || is_numeric($contentid)==false){
                    $contentid = get_max_of_column('content','contentid') + 1;
                }
                $orderingtime = get_max_of_column('content','orderingtime') + 1;
                if($keyword_list != ""){process_keywords($contentid,$keyword_list);}
                if($web_mysql_escape_boolean){$keywords = mysql_escape_string($keywords);}
                $query_content = "insert into content(contentid,catid,parentid,content_group,poster,create_time,can_comment,note,note1,note2,note3,note4,content_type,languageid,showinhome,orderingtime,status) values('$contentid','$catid','$parentid','$content_group','$poster','$create_time','$can_comment','$note','$note1','$note2','$note3','$note4','$content_type','$languageid','$showinhome','$orderingtime','$status')";
                $query_content_process = "insert into content_process(contentid,poster,post_time,approved,approver,approve_time,published,publisher,publish_time) values($contentid,$poster,$post_time,$approved,$approver,$approve_time,$published,$publisher,$publish_time)";
                $query_content_info = "insert into content_info(contentid,code,price,units,price_basic,image_list,color_list,other_info,product_vat,product_vat_is,product_model,product_status,product_manufacturer,product_warranty,product_warranty_text,product_discount,size,product_field,product_materials,regionid,areaid,recruitment_salary,recruitment_deadline,recruitment_region,brandid,product_delivery,rate,product_inch,product_weight,product_os,product_cd,product_card,product_cpu,product_ram,product_hdd,product_pin,colorid,ticket_type,ticket_from,ticket_to,ticket_day,round_trip,ticket_seat,tax,tax_child,tax_baby,price_discount,is_discount,hour_leave,minute_leave,hour_down,minute_down,time_leave,time_down,ticket_airline,flight_code,ticket_airport_start,ticket_airport_end,hotel_image,hotel_address,hotel_discount_percent,hotel_price_min,hotel_star,hotel_regionid,hotel_discount,hotel_about,hotel_policy,hotel_detail,hotel_room_total_number,tour_image,tour_time,tour_start_address,tour_end_address,tour_vehicle,tour_schedule,tour_address,tour_price,tour_everyday,tour_isdiscount,tour_detail,tour_type,tour_address_detail) values('$contentid','$code','$price','$units','$price_basic','$image_list','$color_list','$other_info','$product_vat','$product_vat_is','$product_model','$product_status','$product_manufacturer','$product_warranty','$product_warranty_text','$product_discount','$size','$product_field','$product_materials','$regionid','$areaid','$recruitment_salary','$recruitment_deadline','$recruitment_region','$brandid','$product_delivery','$rate','$product_inch','$product_weight','$product_os','$product_cd','$product_card','$product_cpu','$product_ram','$product_hdd','$product_pin','$colorid','$ticket_type','$ticket_from','$ticket_to','$ticket_day','$round_trip','$ticket_seat','$tax','$tax_child','$tax_baby','$price_discount','$is_discount','$hour_leave','$minute_leave','$hour_down','$minute_down','$time_leave','$time_down','$ticket_airline','$flight_code','$ticket_airport_start','$ticket_airport_end','$hotel_image','$hotel_address','$hotel_discount_percent','$hotel_price_min','$hotel_star','$hotel_regionid','$hotel_discount','$hotel_about','$hotel_policy','$hotel_detail','$hotel_room_total_number','$tour_image','$tour_time','$tour_start_address','$tour_end_address','$tour_vehicle','$tour_schedule','$tour_address','$tour_price','$tour_everyday','$tour_isdiscount','$tour_detail','$tour_type','$tour_address_detail')";
                $query_content_meta = "insert into content_meta(contentid,title,alias,description,hotdescription,image,hotimage,image_large,keywords,meta_title,meta_description,meta_keywords,video_url,download_url,hyper_link) values('$contentid','$title','$alias','$description','$hotdescription','$image','$hotimage','$image_large','$keywords','$meta_title','$meta_description','$meta_keywords','$video_url','$download_url','$hyper_link')";
                $query_content_body = "insert into content_body(contentid,body) values('$contentid','$body')";
                if(process_non_query_in_db($query_content)){
                    if(process_non_query_in_db($query_content_process)){
                        if(process_non_query_in_db($query_content_info)){
                            if(process_non_query_in_db($query_content_meta)){
                                if(process_non_query_in_db($query_content_body)){
                                    //Content_catalog process
                                    content_color_process($contentid,$image_list);
                                    catalog_content_process($contentid,$catid,$published);
                                    content_schedule_process($contentid,$ticket_day);
                                    if($content_group==2){
                                        region_content_process($contentid,$ticket_from,$published,1);
                                        region_content_process($contentid,$ticket_to,$published,2);
                                    }
                                    elseif($content_group==3){
                                        region_content_process($contentid,$hotel_regionid,$published,3);
                                    }
									content_size_process($contentid,$size);
                                    hotel_room_process($contentid,$hotel_room_total_number);
                                    // Content special process
                                    //customer_selected_process($contentid,$customer_selected);
                                    //content_special_list_process($content_special_array[1],$userid,1,$contentid);
                                    $query_user = "update user set news_number = news_number + 1 where id = $userid";
                                    if($published==1){
                                        // Incre news_number of user
                                        $query_user = "update user set news_number = news_number + 1,approve_number = approve_number + 1,publish_number = publish_number + 1 where id = $userid";
                                        $query_content_temp = "insert into content_temp(contentid,catid,parentid,content_group,poster,showinhome,note,note1,note2,note3,note4,content_type,orderingtime,languageid) values('$contentid','$catid','$parentid','$content_group','$poster','$showinhome','$note','$note1','$note2','$note3','$note4','$content_type','$orderingtime','$languageid')";
                                        process_non_query_in_db($query_content_temp);
                                        if($note==1){
                                            $query_content_hot = "insert into content_hot(contentid,catid,parentid,content_group,poster,showinhome,note,note1,note2,note3,note4,content_type,orderingtime,languageid) values('$contentid','$catid','$parentid','$content_group','$poster','$showinhome','$note','$note1','$note2','$note3','$note4','$content_type','$orderingtime','$languageid')";
                                            process_non_query_in_db($query_content_hot);
                                        }
                                    }
                                    process_non_query_in_db($query_user);
                                    insert_into_system_log($userid,$create_time,get_list_colum_of_table_from_db('permit','groupid','id',$user_permit_require),'Tạo mới "' . $title . '"','admincp/#content_add?id='.$contentid,1);
                                    sync_status_to_production_catalog($contentid, $published);
                                    $message_return = 'Tạo thành công: ' . $title;
                                    $status_return = 10; // Reset to default
                                }
                            }
                        }
                    }
                }
                if($status_return==0){
                    insert_into_system_log($userid,$create_time,$system_id,'Tạo mới "' . $title . '" không thành công.','admincp/#content_add?id='.$contentid,2);
                }
            }
            else{
                $message_return = 'Bạn không có quyền ' . $user_permit_require_name;
            }
        }
        else{
            $user_permit_require = 11;
            $user_permit_require_name = get_list_colum_of_table_from_db('permit','name','id',$user_permit_require);
            $user_permit_value = get_column_of_table("select value from user_permit where permitid = $user_permit_require and userid = $userid");
            if($user_permit_value==1){
                if($keyword_list != ""){process_keywords($contentid,$keyword_list);}
                if($web_mysql_escape_boolean){$keywords = mysql_escape_string($keywords);}
                $query_content = "update content set catid = '$catid',parentid = '$parentid',content_group = '$content_group',can_comment = '$can_comment',note = '$note',note1 = '$note1',note2 = '$note2',note3 = '$note3',note4 = '$note4',content_type = '$content_type',showinhome = '$showinhome',languageid = '$languageid' where contentid = $contentid";
                $query_content_process = "update content_process set edit_number = edit_number + 1, editor = '$userid',edit_time = '$create_time' where contentid = $contentid";
                $query_content_info = "update content_info set code = '$code',price = '$price',units='$units',price_basic = '$price_basic',image_list = '$image_list',color_list='$color_list',other_info = '$other_info',product_vat = '$product_vat',product_vat_is='$product_vat_is',product_model = '$product_model',product_status = '$product_status',product_manufacturer = '$product_manufacturer',product_warranty = '$product_warranty',product_warranty_text = '$product_warranty_text',product_discount = '$product_discount',size='$size',product_field='$product_field',product_materials='$product_materials',regionid='$regionid',areaid='$areaid',recruitment_salary='$recruitment_salary',recruitment_deadline='$recruitment_deadline',recruitment_region='$recruitment_region',brandid='$brandid',product_delivery='$product_delivery',rate='$rate',product_inch='$product_inch',product_weight='$product_weight',product_os='$product_os',product_cd='$product_cd',product_card='$product_card',product_cpu='$product_cpu',product_ram='$product_ram',product_hdd='$product_hdd',product_pin='$product_pin',colorid='$colorid',ticket_type='$ticket_type',ticket_from='$ticket_from',ticket_to='$ticket_to',ticket_day='$ticket_day',round_trip='$round_trip',ticket_seat='$ticket_seat',tax='$tax',tax_child='$tax_child',tax_baby='$tax_baby',price_discount='$price_discount',is_discount='$is_discount',hour_leave='$hour_leave',minute_leave='$minute_leave',hour_down='$hour_down',minute_down='$minute_down',time_leave='$time_leave',time_down='$time_down',ticket_airline='$ticket_airline',flight_code='$flight_code',ticket_airport_start='$ticket_airport_start',ticket_airport_end='$ticket_airport_end',hotel_image='$hotel_image',hotel_address='$hotel_address',hotel_discount_percent='$hotel_discount_percent',hotel_price_min='$hotel_price_min',hotel_star='$hotel_star',hotel_regionid='$hotel_regionid',hotel_discount='$hotel_discount',hotel_about='$hotel_about',hotel_policy='$hotel_policy',hotel_detail='$hotel_detail',hotel_room_total_number='$hotel_room_total_number',tour_image='$tour_image',tour_time='$tour_time',tour_start_address='$tour_start_address',tour_end_address='$tour_end_address',tour_vehicle='$tour_vehicle',tour_schedule='$tour_schedule',tour_address='$tour_address',tour_price='$tour_price',tour_everyday='$tour_everyday',tour_isdiscount='$tour_isdiscount',tour_detail='$tour_detail',tour_type='$tour_type',tour_address_detail='$tour_address_detail' where contentid = $contentid";
                $query_content_meta = "update content_meta set title = '$title',alias = '$alias',description = '$description',hotdescription = '$hotdescription',image = '$image',hotimage = '$hotimage',image_large = '$image_large',keywords = '$keywords',meta_title = '$meta_title',meta_description = '$meta_description',meta_keywords = '$meta_keywords',video_url = '$video_url',download_url = '$download_url',hyper_link = '$hyper_link' where contentid = $contentid";
                $query_content_body = "update content_body set body = '$body' where contentid = $contentid";
                if(process_non_query_in_db($query_content)){
                    if(process_non_query_in_db($query_content_process)){
                        if(process_non_query_in_db($query_content_info)){
                            if(process_non_query_in_db($query_content_meta)){
                                if(process_non_query_in_db($query_content_body)){
                                    // Deincre news_number
                                    deincre_catalog_content_process($contentid,$old_catid,$published);
                                    //Content_catalog process
                                    catalog_content_process($contentid,$catid,$published);
                                    
                                    if($content_group==2){
                                        deincre_region_content_process($contentid,$old_ticket_from,$published,1);
                                        deincre_region_content_process($contentid,$old_ticket_to,$published,2);
                                        
                                        region_content_process($contentid,$ticket_from,$published,1);
                                        region_content_process($contentid,$ticket_to,$published,2);
                                    }
                                    elseif($content_group==3){
                                        deincre_region_content_process($contentid,$old_hotel_regionid,$published,3);
                                        region_content_process($contentid,$hotel_regionid,$published,3);
                                    }
									content_size_process($contentid,$size);
                                    hotel_room_process($contentid,$hotel_room_total_number);
                                    // Content special process
                                    //customer_selected_process($contentid,$customer_selected);
                                    //content_special_list_process($content_special_array[1],$userid,1,$contentid);
                                    // Delete from content_hot
                                    content_color_process($contentid,$image_list);
                                    
                                    content_schedule_process($contentid,$ticket_day);
                                    
                                    $query_delete_hot = "delete from content_hot where contentid = $contentid";
                                    process_non_query_in_db($query_delete_hot);
                                    $orderingtime = get_column_of_table("select orderingtime from content where contentid = $contentid");
                                    if($publish_permit==1){
                                        $query_content_temp = "update content_temp set catid = '$catid',parentid = '$parentid',content_group = '$content_group',note = '$note',note1 = '$note1',note2 = '$note2',note3 = '$note3',note4 = '$note4',content_type = '$content_type',showinhome = '$showinhome',languageid = '$languageid' where contentid = $contentid";
                                        process_non_query_in_db($query_content_temp);
                                        if($note==1){
                                            $query_content_hot = "insert into content_hot(contentid,catid,parentid,content_group,poster,showinhome,note,note1,note2,note3,note4,content_type,orderingtime,languageid) values('$contentid','$catid','$parentid','$content_group','$poster','$showinhome','$note','$note1','$note2','$note3','$note4','$content_type','$orderingtime','$languageid')";
                                            process_non_query_in_db($query_content_hot);
                                        }
                                        $message_return = 'Cập nhật thành công: ' . $title;
                                        $status_return = 5;
                                    }
                                    else{
                                        $query_delete_temp = "delete from content_temp where contentid = $contentid";
                                        process_non_query_in_db($query_delete_temp);
                                        $message_return = 'Cập nhật thành công. Hệ thống đang chờ duyệt!';
                                        $status_return = 5;
                                    }
                                    insert_into_system_log($userid,$create_time,get_list_colum_of_table_from_db('permit','groupid','id',$user_permit_require),'Cập nhật bài viết "' . $title . '"','admincp/#content_add?id='.$contentid,1);
                                    sync_status_to_production_catalog($contentid, $published);
                                }
                            }
                        }
                    }
                }
                if($status_return==0){
                    insert_into_system_log($userid,$create_time,get_list_colum_of_table_from_db('permit','groupid','id',$user_permit_require),'Cập nhật bài viết "' . $title . '" không thành công.','admincp/#content_add?id='.$contentid,2);
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
    $message_return = str_ireplace('\\','',$message_return);
    $message_return = str_ireplace("'","\'",$message_return);
    $message_return = str_ireplace('"','\"',$message_return);
    echo "<script language=\"javascript\" type=\"text/javascript\">window.top.window.frmProcess_after_submit('$message_return',$status_return,'$url_return','');</script>";
	// Size process
	function content_size_process($contentid,$size){
		fn_process_query("delete from content_size where contentid = $contentid");
		$list = explode(',', $size);
		for($i=0;$i<sizeof($list);$i++){
			$value = trim($list[$i]);
			if(is_numeric($value)==true && $value!='0'){
				fn_process_query("insert into content_size(contentid,sizeid) values('$contentid','$value')");
			}
		}
	}
    // Hotel room process
    function hotel_room_process($hotelid,$totel_room_number){
        fn_process_query("delete from hotel_room where hotelid = $hotelid");
        for($i=1;$i<=$totel_room_number;$i++){
            $roomid         = post_submit_object_process('hotel_room_id'.$i,0,true);
            $orderingroom   = post_submit_object_process('hotel_room_stt'.$i,0,true);
            $name           = post_submit_object_process('hotel_room_name'.$i,'',false);
            $image          = post_submit_object_process('hotel_room_image'.$i,'',false);
            $max_person     = post_submit_object_process('hotel_room_person'.$i,0,true);
            $price          = post_submit_object_process('hotel_room_price'.$i,0,true);
            $price_basic    = post_submit_object_process('hotel_room_price_basic'.$i,0,true);
            $room_number    = post_submit_object_process('hotel_room_number'.$i,0,true);
            if($roomid>0){ // Update
                $query = "update hotel_room set name = $name
                                                ,image = $image
                                                ,max_person = $max_person
                                                ,price = $price
                                                ,price_basic = $price_basic
                                                ,room_number = $room_number
                                                ,orderingroom = $orderingroom 
                                                where roomid = $roomid";
                fn_process_query($query);
            }
            else{ // Add new
                $roomid = fn_get_column_of_table_with_query("select max(roomid)+1 from hotel_room",0,0);
                if(!is_numeric($roomid) || $roomid =='0'){$roomid=1;}
                $query = "insert into hotel_room(roomid,hotelid,name,image,max_person,price,price_basic,room_number,orderingroom) values('$roomid','$hotelid','$name','$image','$max_person','$price','$price_basic','$room_number','$orderingroom')";
                fn_process_query($query);
            }
        }
    }
    // Content special
    function content_schedule_process($contentid,$schedule_list){
        fn_process_query("delete from content_schedule where contentid = $contentid");
        $list = explode(',', $schedule_list);
        for($i=0;$i<sizeof($list);$i++){
            $schedule_day = trim($list[$i]);
            if($schedule_day>0){
                fn_process_query("insert into content_schedule(contentid,schedule_day) values('$contentid','$schedule_day')");
            }
        }
    }
    function content_color_process($contentid,$image_list){
        process_non_query_in_db("delete from content_color where contentid = $contentid");
        $list = explode(';', $image_list);
        for($i=0;$i<sizeof($list);$i++){
            $value = trim($list[$i]);
            $name = substr($value,0,strrpos($value,']'));
            $name = substr($name,strrpos($name,'[')+1);
            if(is_numeric($name)==true && $name!=0){
                if(fn_get_column_of_table_with_query("select contentid from content_color where contentid = $contentid and colorid = $name",0,0)==0){
                    process_non_query_in_db("insert into content_color(contentid,colorid) values('$contentid','$name')");
                }
            }
        }
    }
    function content_special_list_process($list_number,$userid,$type,$contentid){
        if($list_number<=0){
            $query_delete = "delete from size_list where type = $type and contentid = $contentid";
            process_non_query_in_db($query_delete);
        }
        else{
            $time_create = date("YmdHis");
            $list_id = '0';
            for($i=0;$i<$list_number;$i++){
                $id = trim($_POST['fSize_list_'.$type.'_id'.$i]);
                $name = trim($_POST['fSize_list_'.$type.'_nick'.$i]);
                $price = post_submit_object_process('fSize_list_'.$type.'_name'.$i,0,true);
                $status = 0;
                if($_POST['fSize_list_'.$type.'_status'.$i]=="on"){$status=1;}
                if($nick != ''||$name != ''){
                    $query = '';
                    if($id==0){
                        $id = get_max_of_column('size_list','id') + 1;
                        $query = "insert into size_list(id,contentid,name,price,creator,create_time,type,status) values('$id','$contentid','$name','$price','$userid','$time_create','$type','$status')";
                    }
                    else{
                        $query = "update size_list set name = '$name',price = '$price',editor = '$userid',edit_time = '$time_create',status = '$status' where id = $id";
                    }
                    $list_id = $list_id . ',' . $id;
                    process_non_query_in_db($query);
                }
            }
            $query = "delete from size_list where id not in ($list_id) and type = $type and contentid = $contentid";
            process_non_query_in_db($query);
        }
    }
    function customer_selected_process($contentid,$customer_list){
        $query_delete = "delete from content_customer where contentid = $contentid";
        process_non_query_in_db($query_delete);
        $list = explode(',', $customer_list);
        for($i=0;$i<sizeof($list);$i++){
            $customerid = trim($list[$i]);
            if($customerid!=""&&$customerid!=0){
                $query1 = "insert into content_customer(contentid,customerid) values($contentid,$customerid)";
                process_non_query_in_db($query1);
            }
        }
    }
    function deincre_catalog_content_process($contentid,$catid,$published){
        $query1 = "update catalog_info set news_number = news_number - 1 where news_number > 0 and catid = $catid";
        process_non_query_in_db($query1);
        if($published==1){
            $query1 = "update catalog_info set approve_number = approve_number - 1 where approve_number > 0 and catid = $catid";
            process_non_query_in_db($query1);
            $query1 = "update catalog_info set publish_number = publish_number - 1 where publish_number > 0 and catid = $catid";
            process_non_query_in_db($query1);
        }
        $parent_insert = get_parent_id($catid,'catalog');
        $i = 0;
        while($parent_insert!=0&&$i<20){
            $query1 = "update catalog_info set news_number = news_number - 1 where news_number > 0 and catid = $parent_insert";
            process_non_query_in_db($query1);
            if($published==1){
                $query1 = "update catalog_info set approve_number = approve_number - 1 where approve_number > 0 and catid = $parent_insert";
                process_non_query_in_db($query1);
                $query1 = "update catalog_info set publish_number = publish_number - 1 where publish_number > 0 and catid = $parent_insert";
                process_non_query_in_db($query1);
            }
            $parent_insert = get_parent_id($parent_insert,'catalog');
            $i = $i + 1;
        }
        $query_delete = "delete from content_catalog where contentid = $contentid";
        process_non_query_in_db($query_delete);
        return true;
    }
    function catalog_content_process($contentid,$catid,$published){
        $query_insert = "insert into content_catalog(contentid,catid) values('$contentid','$catid')";
        process_non_query_in_db($query_insert);
        // Incre news number
        $query1 = "update catalog_info set news_number = news_number + 1 where catid = $catid";
        if($published==1){
            $query1 = "update catalog_info set news_number = news_number + 1,approve_number = approve_number + 1,publish_number = publish_number + 1 where catid = $catid";
        }
        process_non_query_in_db($query1);
        $parent_insert = get_parent_id($catid,'catalog');
        $i = 0;
        while($parent_insert!=0&&$i<20){
            $query_insert = "insert into content_catalog(contentid,catid) values('$contentid','$parent_insert')";
            process_non_query_in_db($query_insert);
            $query1 = "update catalog_info set news_number = news_number + 1 where catid = $parent_insert";
            if($published==1){
                $query1 = "update catalog_info set news_number = news_number + 1,approve_number = approve_number + 1,publish_number = publish_number + 1 where catid = $parent_insert";
            }
            process_non_query_in_db($query1);
            $parent_insert = get_parent_id($parent_insert,'catalog');
            $i = $i + 1;
        }
        return true;
    }
    
    function deincre_region_content_process($contentid,$regionid,$published,$type=0){
        if($regionid==0){return true;}
        $query = "update catalog_info set news_number = news_number - 1 where catid = $regionid";
        if($published==1){
            $query = "update catalog_info set news_number = news_number - 1,publish_number = publish_number - 1 where catid = $regionid";
        }
        fn_process_query($query);
        $parent_insert = fn_get_column_of_table_with_query("select parentid from catalog where catid = $regionid",0,0);
        while($parent_insert!=0&&$i<20){
            $query = "update catalog_info set news_number = news_number - 1 where catid = $parent_insert";
            if($published==1){
                $query = "update catalog_info set news_number = news_number - 1,publish_number = publish_number - 1 where catid = $parent_insert";
            }
            fn_process_query($query);
            $parent_insert = fn_get_column_of_table_with_query("select parentid from catalog where catid = $parent_insert",0,0);
        }
        
        $query_delete = "delete from content_region where contentid = $contentid and type = $type";
        fn_process_query($query_delete);
        return true;
    }
    function region_content_process($contentid,$regionid,$published,$type=0){
        if($regionid==0){return true;}
        $query = "insert into content_region(contentid,regionid,type) values('$contentid','$regionid','$type')";
        fn_process_query($query);
        $query = "update catalog_info set news_number = news_number + 1 where catid = $regionid";
        if($published==1){
            $query = "update catalog_info set news_number = news_number + 1,publish_number = publish_number + 1 where catid = $regionid";
        }
        fn_process_query($query);
        $parent_insert = fn_get_column_of_table_with_query("select parentid from catalog where catid = $regionid",0,0);
        while($parent_insert!=0&&$i<20){
            $query_insert = "insert into content_region(contentid,regionid,type) values('$contentid','$parent_insert','$type')";
            fn_process_query($query_insert);
            $query = "update catalog_info set news_number = news_number + 1 where catid = $parent_insert";
            if($published==1){
                $query = "update catalog_info set news_number = news_number + 1,publish_number = publish_number + 1 where catid = $parent_insert";
            }
            fn_process_query($query);
            $parent_insert = fn_get_column_of_table_with_query("select parentid from catalog where catid = $parent_insert",0,0);
        }
        return true;
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
            insert_into_system_log($GLOBALS["userid"],date("YmdHis"),'30','Hệ thống có lỗi khi tạo bài viết. Error: "' . $GLOBALS["message_return"] . '". Query: ' . $query,'',0);
        }
        return $result;
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
    function get_parentid($catid) {
        if($catid==0){return 0;}
        $query = "select parentid from catalog where catid = $catid";
        $result= mysql_query($query,$GLOBALS["con"]);   
        $row = mysql_fetch_array($result);                                
        return $row[0];
    }
    function process_keywords($contentid,$keyword_list){
        delete_from_tags($contentid);
            if(strrpos($keyword_list,",")>0){
                $list = explode(',', $keyword_list);
                for($i=0;$i<sizeof($list);$i++){
                    if(trim($list[$i]) != ""){
                        $id = check_keyword_exists(trim($list[$i]));
                        if($id == "0"){
                            insert_into_keyword(trim($list[$i]));
                            $keywordid = get_keywordid();
                            if(check_tags_exists($contentid,$keywordid)==false){
                                $GLOBALS["keywords"] = $GLOBALS["keywords"] . ";" . $keywordid . "," . trim($list[$i]);
                                insert_into_tags($contentid,$keywordid);
                            }
                        }
                        else{
                            if(check_tags_exists($contentid,$id)==false){
                                $GLOBALS["keywords"] = $GLOBALS["keywords"] . ";" . $id . "," . trim($list[$i]);
                                insert_into_tags($contentid,$id);
                            }
                        }
                    }
                }
                if(strpos($GLOBALS["keywords"],";")==0){
                    $GLOBALS["keywords"] = substr($GLOBALS["keywords"],1);
                }
            }
            else{
                $id = check_keyword_exists($keyword_list);
                if($id == "0"){
                    insert_into_keyword($keyword_list);
                    $keywordid = get_keywordid();
                    if(check_tags_exists($contentid,$keywordid)==false){
                        $GLOBALS["keywords"] = $keywordid . "," . $keyword_list;
                        insert_into_tags($contentid,$keywordid);
                    }
                }
                else{
                    if(check_tags_exists($contentid,$id)==false){
                        $GLOBALS["keywords"] = $id . "," . $keyword_list;
                        insert_into_tags($contentid,$id);
                    }
                }
            }
            
    }
    function delete_from_tags($contentid) {
        $query = "delete from content_keyword where contentid = $contentid";
        $result = mysql_query($query,$GLOBALS["con"]);
        return $result;
    }
    function get_keywordid() {
        $query = "select max(id) from keyword";
        $result= mysql_query($query,$GLOBALS["con"]);   
        $row = mysql_fetch_array($result);                                
        return $row[0];
    }
    function check_tags_exists($contentid,$keywordid) {
        $query = "select contentid from content_keyword where contentid = $contentid and keywordid = $keywordid";
        $result= mysql_query($query,$GLOBALS["con"]);   
        if($result==false || mysql_num_rows($result)<=0){
            return false;
        }
        else{
            return true;
        }
    }
    function check_keyword_exists($text) {
        if($GLOBALS["web_mysql_escape_boolean"]){
            $text = mysql_escape_string($text);
        }
        $query = "select id,text from keyword where text = '$text'";
        $result= mysql_query($query,$GLOBALS["con"]);   
        if($result==false || mysql_num_rows($result)<=0){
            return 0;
        }
        else{
            while($row = mysql_fetch_array($result)){
                if(strcmp(trim(mb_strtolower($text)),trim(mb_strtolower($row["text"])))==0){
                    return $row["id"];
                }
            }
            return 0;
        }
    }
    function insert_into_keyword($text) {
        if($GLOBALS["web_mysql_escape_boolean"]){
            $text = mysql_escape_string($text);
        }
        $query = "insert into keyword(text) values('$text')";
        $result = mysql_query($query,$GLOBALS["con"]);
        return $result;
    }
    function insert_into_tags($contentid,$keywordid) {
        $query = "insert into content_keyword(contentid,keywordid) values('$contentid','$keywordid')";
        $result = mysql_query($query,$GLOBALS["con"]);
        return $result;
    }
    function extract_meta_keywords($str){
        $meta_keyword = "";
        $str = filter_keyword($str);
        while(strpos($str," ") > 0){ 
            $pos = strpos($str," ");
            $suggestiontext = substr($str,0,$pos);
            if(trim($suggestiontext) != ''){
                $meta_keyword =  $meta_keyword . ',' . trim($suggestiontext);
            }
            $str = substr($str,$pos+1);
        }
        if(trim($str) != ''){
            $meta_keyword = $meta_keyword . ',' . trim($str);
        }
        if(strpos($meta_keyword,",") == 0){
            $meta_keyword = substr($meta_keyword,1);
        }
        return trim($meta_keyword);
    }
    function filter_keyword($keyword){
        $keyword = str_ireplace("-"," ",$keyword);
        $keyword = str_ireplace("/"," ",$keyword);
        $keyword = str_ireplace("“","",$keyword);
        $keyword = str_ireplace("”","",$keyword);
        $keyword = str_ireplace("'","",$keyword);
        $keyword = str_ireplace("\'","",$keyword);
        $keyword = str_ireplace('"','',$keyword);
        $keyword = str_ireplace('-',' ',$keyword);
        $keyword = str_ireplace(',','',$keyword);
        $keyword = str_ireplace('.','',$keyword);
        $keyword = str_ireplace(':','',$keyword);
        $keyword = str_ireplace(';','',$keyword);
        $keyword = str_ireplace('?','',$keyword);
        $keyword = str_ireplace('!','',$keyword);
        $keyword = str_ireplace('`','',$keyword);
        $keyword = str_ireplace('~','',$keyword);
        $keyword = str_ireplace('#','',$keyword);
        $keyword = str_ireplace('$','',$keyword);
        $keyword = str_ireplace('%','',$keyword);
        $keyword = str_ireplace('^','',$keyword);
        $keyword = str_ireplace('&','',$keyword);
        $keyword = str_ireplace('*','',$keyword);
        $keyword = str_ireplace('(','',$keyword);
        $keyword = str_ireplace(')','',$keyword);
        $keyword = str_ireplace('+',' ',$keyword);
        $keyword = str_ireplace('=',' ',$keyword);
        $keyword = str_ireplace('[','',$keyword);
        $keyword = str_ireplace(']','',$keyword);
        $keyword = str_ireplace('{','',$keyword);
        $keyword = str_ireplace('}','',$keyword);
        $keyword = str_ireplace('|','',$keyword);
        $keyword = str_ireplace('\\','',$keyword);
        $keyword = str_ireplace('<','',$keyword);
        $keyword = str_ireplace('>','',$keyword);
        $keyword = trim($keyword);
        while(strpos($keyword,"  ") > 0){
            $keyword = str_ireplace("  "," ",$keyword);
        }
        return $keyword;
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