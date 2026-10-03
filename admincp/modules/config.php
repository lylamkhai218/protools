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
    if(isset($_COOKIE[$GLOBALS['rootuser']])==false || isset($_COOKIE[$GLOBALS['rootpass']])==false){
        exit;
    }
    $id = 0;$tab = 0;if(isset($_GET["tab"])){$tab = $_GET["tab"];}
    $config_title = '';
    $default_homeicon = 'template/images/homeicon.png';
    $default_background = '';
    $default_background_color = '';    
    $default_logo = '/favicon.ico';
    $hotnews = 3;
    $news_in_catalog = 10;
    $column_home = 5;
    $num_catalog_home = 20;
    $title = '';
    $description = '';
    $keywords = '';$keyword_tags = '';
    $homeicon = '';$logo = '';$logo_bottom = '';$map = '';
    $background = '';$background_color = '';$background_left = '';$background_top = '';$background_repeat = '';$background_attachment = '';
    $contact = '';$hotline = '';$footer = '';
    $email_sender = '';$email_booking = '';$email_sender_pass = '';
    $send_email_type = 0;
    $create_time = date("YmdHis");$update_time = 0;
    $address = '';$yahoo_number = 0;$skype_number = 0;$email_number=0;$phone_number = 0;$money_type = '';$slogan = '';$facebook_url = '';$twitter_url = '';$youtube_url='';$googleplus_url='';
    $languageid = 1;$help1 = '';$help2 = '';$yahoo = '';$counter_code = '';$newsnumberinright = 6;$productnumberinright = 6;$copyright = '';$roe = 0;
    if(isset($_GET["languageid"])){$languageid = $_GET["languageid"];}
    get_config_info();
    function get_config_info() {
        $query ="select * from website_config,website_contact,website_seo where website_config.id = website_contact.id and website_config.id = website_seo.id and website_config.languageid = ".$GLOBALS['languageid']." order by website_config.id ASC limit 1";
        $result = mysql_query($query,$GLOBALS["con"]);
        if($result==false){return false;}
        else{
            if(mysql_num_rows($result)<=0){
                $GLOBALS['id'] = insert_into_website();
                $GLOBALS['background'] = $GLOBALS['default_background'];
                $GLOBALS['homeicon'] = $GLOBALS['default_homeicon'];
                $GLOBALS['logo'] = $GLOBALS['default_logo'];
                return false;
            }
            else{
                $row = mysql_fetch_array($result);
                $GLOBALS['id'] = $row['id'];$GLOBALS['map'] = $row['map'];$GLOBALS['title'] = $row['title'];$GLOBALS['description'] = $row['description'];$GLOBALS['keywords'] = $row['keywords'];$GLOBALS["keyword_tags"] = $row['keyword_tags'];
                $GLOBALS['hotnews'] = $row['hotnews'];$GLOBALS['news_in_catalog'] = $row['news_in_catalog'];
				$GLOBALS['column_home'] = $row['column_home'];
				$GLOBALS['num_catalog_home'] = $row['num_catalog_home'];
                $GLOBALS['icon'] = $row['icon'];$GLOBALS['logo'] = $row['logo'];$GLOBALS['logo_bottom'] = $row['logo_bottom'];$GLOBALS['slogan'] = $row['slogan'];
                $GLOBALS['background'] = $row['background'];$GLOBALS['background_color'] = $row['background_color'];$GLOBALS['background_left'] = $row['background_left'];$GLOBALS['background_top'] = $row['background_top'];
                $GLOBALS['background_repeat'] = $row['background_repeat'];$GLOBALS['background_attachment'] = $row['background_attachment'];
                $GLOBALS['email_sender'] = $row['email_sender'];$GLOBALS['email_sender_pass'] = decode_password($row['email_sender_pass'],$row['salt']);
                $GLOBALS['send_email_type'] = $row['send_email_type'];$GLOBALS['email_booking'] = $row['email_booking'];
                $GLOBALS['create_time'] = $row['create_time'];$GLOBALS['update_time'] = $row['update_time'];
                $GLOBALS['contact'] = $row['contact'];$GLOBALS['footer'] = $row['footer'];$GLOBALS['hotline'] = $row['hotline'];
                $GLOBALS['address'] = $row['address'];$GLOBALS['help1'] = $row['help1'];$GLOBALS['help2'] = $row['help2'];$GLOBALS['money_type'] = $row['money_type'];$GLOBALS['yahoo'] = $row['yahoo'];$GLOBALS['counter_code'] = $row['counter_code'];
                
                $GLOBALS['newsnumberinright'] = $row['newsnumberinright'];$GLOBALS['productnumberinright'] = $row['productnumberinright'];
                
                $GLOBALS['facebook_url'] = $row['facebook_url'];$GLOBALS['twitter_url'] = $row['twitter_url'];
                $GLOBALS['youtube_url'] = $row['youtube_url'];$GLOBALS['googleplus_url'] = $row['googleplus_url'];
                $GLOBALS['copyright'] = $row['copyright'];$GLOBALS['roe'] = $row['roe'];
                mysql_free_result($result);  
                return true;
            }
        }
    }
    function insert_into_website() {
        $websiteid = fn_get_column_of_table_with_query("select max(id)+1 from website_config",1,1);
        $query = "insert into website_config(id,create_time,languageid) values('$websiteid','" . $GLOBALS['create_time'] . "','" . $GLOBALS['languageid'] . "')";
        fn_process_query($query);
        $query = "insert into website_contact(id) values('$websiteid')";
        fn_process_query($query);
        $query = "insert into website_seo(id,title,description,keywords) values('$websiteid','Protools.com.vn','Protools.com.vn','Protools.com.vn')";
        fn_process_query($query);
        return $websiteid;
    }
    // Get contact list
    function get_support_list($nick,$name,$type){
        $query = "select * from support_list where type = $type order by id ASC";
        $result = mysql_query($query,$GLOBALS["con"]);
        if($result==false||mysql_num_rows($result)<=0){
            return 0;
        }
        else{
            $number = mysql_num_rows($result);
            $i = 0;$stt = 1;
            while($row = mysql_fetch_array($result)){
                $status = $row['status'];
                echo '<tr>';
                echo '<td><a onclick="remove_support_list_from_list($(this));" href="javascript:;" idata="'.$row['id'].'"><img align="absMiddle" src="'.$GLOBALS["base_folder"].'admincp/media/remove.png"></a></td>';
                echo '<td><b id="support_list_number_'.$stt.'">'.$stt.'.</b></td>';
                echo '<td>'.$nick.'</td>';
                echo '<td><input type="hidden" id="support_id_'.$i.'" name="fSupport_list_'.$type.'_id'.$i.'" value="'.$row['id'].'"><input id="support_nick_'.$i.'" name="fSupport_list_'.$type.'_nick'.$i.'" type="text" value="'.$row['nick'].'" style="width:150px;" /></td>';
                echo '<td>'.$name.'</td>';
                echo '<td><input id="support_name_'.$i.'" name="fSupport_list_'.$type.'_name'.$i.'" type="text" value="'.$row['name'].'" style="width:150px;" /></td>';
                echo '<td>
                    <span class="check_box_style1" state="'.show_value_by_compare($status,1,'on','off').'">
                        <span class="'.show_value_by_compare($status,1,'check_box_on1','check_box_off1').'">
                            <span class="check_box_on"></span>
                            <span class="check_box_bar"></span>
                            <input type="checkbox" id="support_status_'.$i.'" name="fSupport_list_'.$type.'_status'.$i.'"'.show_value_by_compare($status,1,' checked="checked"','').' />
                        </span>
                    </span>
                </td>';
                echo '<td><a href="javascript:;" onclick="add_support_list_new($(this));"><img src="'.$GLOBALS["base_folder"].'admincp/media/add.png"></a></td>';
                echo '</tr>';
                $stt = $stt + 1;$i = $i + 1;
            }
            return $number;
        }
    }
?>
<script type="text/javascript">
    var tab_menu_active = <?php echo $tab;?>;
    $(document).ready(function() {
        show_content_info($("[name='content_menu']").find("li:eq("+tab_menu_active+")").find("a"));
    });
</script>
<?php include($_SERVER['DOCUMENT_ROOT'] . $base_folder . "admincp/modules/content_left.php");?>
<div id="content_right">
    <div class="content">
        <div class="form_add" id="form_add">
                <form action="<?php echo $base_folder;?>admincp/modules/config_update.php" onsubmit="return frmProcess_before_submit();" name="frmProcess" target="processing_target" method="POST">
                    <input type="hidden" value="<?php echo $languageid;?>" name="fLanguage"> 
                    <iframe name="processing_target" src="#" style="width:0;height:0;border:0px;display:none;"></iframe>
                    <div class="menu" name="content_menu">
                        <ul>
                            <li class="active"><a href="javascript:;" onclick="show_content_info($(this));">Cấu hình chung</a></li>
                        </ul>
                    </div>
                    <div id="content_button" style="float:none;width:auto;position: absolute;right:10px;top:40px;z-index: 100;">
                        <button type="submit" class="button_style1"><span>Cập nhật</span></button>
                    </div>
                    <div class="tab_content_info">
                        <input type="hidden" value="<?php echo $id;?>" name="fID" />
                        <table cellpadding="5" cellspacing="0" class="table_add">
                            <tr>
                                <td colspan="4" style="width: 800px;">
                                    <div class="openMoreSettingBox">
                                    <div class="openMoreSettingBtn"><a class="active" name="openMoreSettingBtn" idata="basicInfoOfConfig">Thông tin website</a></div>
                                    <div class="openMoreSettingContent" id="basicInfoOfConfig" style="display: block;">
                                        <table style="padding:10px;width:100%;" cellpadding="0" cellspacing="0" align="left">
                                            <tr>
                                                <td class="col1">Tiêu đề website</td>
                                                <td class="col2">
                                                    <textarea name="fTitle" style="width:660px;height:45px;max-width:660px;" require="true" compare_require="" name_require="Tiêu đề website"><?php echo $title;?></textarea>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td class="col1">Mô tả</td>
                                                <td class="col2">
                                                    <textarea name="fDescription" style="width:660px;height:40px;max-width:660px;" compare_require="" name_require="Mô tả website"><?php echo $description;?></textarea>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td class="col1">Từ khoá</td>
                                                <td class="col2">
                                                    <textarea name="fKeywords" style="width:660px;height:40px;max-width:660px;" compare_require="" name_require="Từ khoá website"><?php echo $keywords;?></textarea>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td class="col1">Home icon</td>
                                                <td class="col2">
                                                    <input name="fIcon" type="text" value="<?php echo $icon;?>" style="width:450px;" />
                                                    <?php 
                                                        if($icon!=''){
                                                            echo '<a rel="tooltip"><img style="vertical-align:top;margin:3px 0 0 5px;" border="0" src="'.$base_folder.'admincp/media/picture-icon.png"></a>';
                                                            echo '<div class="hidden"><div class="image"><img src="'.image_process_http($icon).'"></div></div>';
                                                        }
                                                    ?>
                                                    <div class="fileupload_container" style="float:right;">
                                                        <input type="button" value="Browse..." style="height:20px;font-size:11px;padding:1px;" onclick="choose_file_upload_fast(500,'fIcon','');" >
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td class="col1">Logo</td>
                                                <td class="col2">
                                                    <input name="fLogo" type="text" value="<?php echo $logo;?>" style="width:450px;" />
                                                    <?php 
                                                        if($logo!=''){
                                                            echo '<a rel="tooltip"><img style="vertical-align:top;margin:3px 0 0 5px;" border="0" src="'.$base_folder.'admincp/media/picture-icon.png"></a>';
                                                            echo '<div class="hidden"><div class="image"><img src="'.image_process_http($logo).'"></div></div>';
                                                        }
                                                    ?>
                                                    <div class="fileupload_container" style="float:right;">
                                                        <input type="button" value="Browse..." style="height:20px;font-size:11px;padding:1px;" onclick="choose_file_upload_fast(2000,'fLogo','');" >
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td class="col1">Logo chân trang</td>
                                                <td class="col2">
                                                    <input name="fLogo_bottom" type="text" value="<?php echo $logo_bottom;?>" style="width:450px;" />
                                                    <?php 
                                                        if($logo_bottom!=''){
                                                            echo '<a rel="tooltip"><img style="vertical-align:top;margin:3px 0 0 5px;" border="0" src="'.$base_folder.'admincp/media/picture-icon.png"></a>';
                                                            echo '<div class="hidden"><div class="image"><img src="'.image_process_http($logo_bottom).'"></div></div>';
                                                        }
                                                    ?>
                                                    <div class="fileupload_container" style="float:right;">
                                                        <input type="button" value="Browse..." style="height:20px;font-size:11px;padding:1px;" onclick="choose_file_upload_fast(2000,'fLogo_bottom','');" >
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td class="col1">Slogan</td>
                                                <td class="col2">
                                                    <input name="fSlogan" type="text" value="<?php echo $slogan;?>" style="width:500px;" />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td class="col1">Copy right</td>
                                                <td class="col2">
                                                    <input name="fCopyright" type="text" value="<?php echo $copyright;?>" style="width:500px;" />
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
                                    <div class="openMoreSettingBtn"><a name="openMoreSettingBtn" idata="backgroundOfConfig">Ảnh nền</a></div>
                                    <div class="openMoreSettingContent" id="backgroundOfConfig" style="display: none;">
                                        <table style="padding:10px;" cellpadding="0" cellspacing="0" align="left">
                                            <tr>
                                                <td class="col1">Ảnh nền</td>
                                                <td class="col2">
                                                    <input name="fBackground" type="text" value="<?php echo $background;?>" style="width:450px;" />
                                                    <?php 
                                                        if($background!=''){
                                                            echo '<a rel="tooltip"><img style="vertical-align:top;margin:3px 0 0 5px;" border="0" src="'.$base_folder.'admincp/media/picture-icon.png"></a>';
                                                            echo '<div class="hidden"><div class="image"><img src="'.image_process_http($background).'"></div></div>';
                                                        }
                                                    ?>
                                                    <div class="fileupload_container" style="float:right;">
                                                        <input type="button" value="Browse..." style="height:20px;font-size:11px;padding:1px;" onclick="choose_file_upload_fast(5000,'fBackground','');" >
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td class="col1">Màu nền</td>
                                                <td class="col2">
                                                    <input name="fBackground_color" type="text" value="<?php echo $background_color;?>" style="width:80px;" />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>&nbsp;</td>
                                                <td>
                                                    <table cellpadding="5" cellspacing="0">
                                                        <tr>
                                                            <td>Căn ngang</td>
                                                            <td>
                                                                <select name="fBackground_left">
                                                                    <option value="left"<?php echo show_value_by_compare($background_left,'left',' selected="selected"','');?>>Từ trái qua phải</option>
                                                                    <option value="right"<?php echo show_value_by_compare($background_left,'right',' selected="selected"','');?>>Từ phải qua trái</option>
                                                                    <option value="center"<?php echo show_value_by_compare($background_left,'center',' selected="selected"','');?>>Căn giữa</option>
                                                                </select>
                                                            </td>
                                                            <td>Căn dọc</td>
                                                            <td>
                                                                <select name="fBackground_top">
                                                                    <option value="top"<?php echo show_value_by_compare($background_top,'top',' selected="selected"','');?>>Từ trên xuống</option>
                                                                    <option value="bottom"<?php echo show_value_by_compare($background_top,'bottom',' selected="selected"','');?>>Từ dưới lên</option>
                                                                    <option value="center"<?php echo show_value_by_compare($background_top,'center',' selected="selected"','');?>>Căn giữa</option>
                                                                </select>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td>Lặp lại ảnh nền</td>
                                                            <td>
                                                                <select name="fBackground_repeat">
                                                                    <option value="no-repeat"<?php echo show_value_by_compare($background_repeat,'no-repeat',' selected="selected"','');?>>Không lặp lại</option>
                                                                    <option value="repeat-x"<?php echo show_value_by_compare($background_repeat,'repeat-x',' selected="selected"','');?>>Lặp lại theo hàng ngang</option>
                                                                    <option value="repeat-y"<?php echo show_value_by_compare($background_repeat,'repeat-y',' selected="selected"','');?>>Lặp lại theo hàng dọc</option>
                                                                    <option value="repeat"<?php echo show_value_by_compare($background_repeat,'repeat',' selected="selected"','');?>>Lặp lại theo cả hàng ngang và hàng dọc</option>
                                                                </select>
                                                            </td>
                                                            <td>Cố định ảnh nền</td>
                                                            <td>
                                                                <select name="fBackground_attachment">
                                                                    <option value=""<?php echo show_value_by_compare($background_attachment,'',' selected="selected"','');?>>Không cố định</option>
                                                                    <option value="fixed"<?php echo show_value_by_compare($background_attachment,'fixed',' selected="selected"','');?>>Cố định</option>
                                                                </select>
                                                            </td>
                                                        </tr>
                                                    </table>
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
                                    <div class="openMoreSettingBtn"><a name="openMoreSettingBtn" idata="otherInfoOfConfig">Thông tin khác</a></div>
                                    <div class="openMoreSettingContent" id="otherInfoOfConfig" style="display: none;">
                                        <table style="padding:10px;" cellpadding="0" cellspacing="0" align="left">
                                            <tr>
                                                <td class="col1">Tỷ giá (1 USD = ? VNĐ)</td>
                                                <td class="col2">
                                                    <input name="fRoe" type="text" value="<?php echo $roe;?>" style="width:150px;" />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td class="col1">Loại tiền sử dụng</td>
                                                <td class="col2">
                                                    <input type="text" name="fMoney_type" value="<?php echo $money_type;?>" style="width:200px;">
                                                </td>
                                            </tr>
                                            <tr>
                                                <td class="col1">Số lượng cột trên trang chủ</td>
                                                <td class="col2">
                                                    <input name="fColumn_home" type="text" value="<?php echo $column_home;?>" style="width:100px;" />
                                                </td>
                                            </tr>
											<tr>
                                                <td class="col1">Số lượng danh mục trên trang chủ</td>
                                                <td class="col2">
                                                    <input name="fNum_catalog_home" type="text" value="<?php echo $num_catalog_home;?>" style="width:100px;" />
                                                </td>
                                            </tr>
                                             <tr>
                                                <td class="col1">Số lượng bài Hot</td>
                                                <td class="col2">
                                                    <input name="fHotnews" type="text" value="<?php echo $hotnews;?>" style="width:100px;" />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td class="col1">Liệt kê trong chuyên mục</td>
                                                <td class="col2">
                                                    <input name="fNews_in_catalog" type="text" value="<?php echo $news_in_catalog;?>" style="width:100px;" /> <font style="font-size:11px;color:#666666;">(Số lượng bài mặc định liệt kê trong chuyên mục)</font>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td class="col1">Số lượng tin tức cột phải</td>
                                                <td class="col2">
                                                    <input name="fNewsNumberInRight" type="text" value="<?php echo $newsnumberinright;?>" style="width:100px;" />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td class="col1">Số lượng sản phẩm cột phải</td>
                                                <td class="col2">
                                                    <input name="fProductNumberInRight" type="text" value="<?php echo $productnumberinright;?>" style="width:100px;" />
                                                </td>
                                            </tr>
                                        </table>
                                    </div>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td colspan="4" style="display:none;">
                                    <div class="openMoreSettingBox">
                                    <div class="openMoreSettingBtn"><a name="openMoreSettingBtn" idata="socialOfConfig">Mạng xã hội</a></div>
                                    <div class="openMoreSettingContent" id="socialOfConfig" style="display: none;">
                                        <table style="padding:10px;" cellpadding="0" cellspacing="0" align="left">
                                            <tr>
                                                <td class="col1">Facebook URL</td>
                                                <td class="col2">
                                                    <input name="fFacebook_url" type="text" value="<?php echo $facebook_url;?>" style="width:500px;" />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td class="col1">Twitter URL</td>
                                                <td class="col2">
                                                    <input name="fTwitter_url" type="text" value="<?php echo $twitter_url;?>" style="width:500px;" />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td class="col1">Youtube URL</td>
                                                <td class="col2">
                                                    <input name="fYoutube_url" type="text" value="<?php echo $youtube_url;?>" style="width:500px;" />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td class="col1">Google Plus URL</td>
                                                <td class="col2">
                                                    <input name="fGoogleplus_url" type="text" value="<?php echo $googleplus_url;?>" style="width:500px;" />
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
                                    <div class="openMoreSettingBtn"><a name="openMoreSettingBtn" idata="addressOfConfig">Địa chỉ liên hệ</a></div>
                                    <div class="openMoreSettingContent" id="addressOfConfig" style="display: none;">
                                        <table style="padding:10px;" cellpadding="0" cellspacing="0" align="left">
                                            <tr>
                                                <td colspan="2">
                                                    <textarea name="fAddress" editor_format="true" mini_control="false" width="800" height="200" style="width:500px;height:50px;"><?php echo $address;?></textarea>
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
                                    <div class="openMoreSettingBtn"><a name="openMoreSettingBtn" idata="mapOfConfig">Bản đồ</a></div>
                                    <div class="openMoreSettingContent" id="mapOfConfig" style="display: none;">
                                        <table style="padding:10px;" cellpadding="0" cellspacing="0" align="left">
                                            <tr>
                                                <td colspan="2">
                                                    <textarea name="fMap" editor_format="true" mini_control="false" width="800" height="200" style="width:500px;height:50px;"><?php echo $map;?></textarea>
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
                                    <div class="openMoreSettingBtn"><a name="openMoreSettingBtn" idata="footerOfConfig">Chân trang</a></div>
                                    <div class="openMoreSettingContent" id="footerOfConfig" style="display: none;">
                                        <table style="padding:10px;" cellpadding="0" cellspacing="0" align="left">
                                            <tr>
                                                <td colspan="2">
                                                    <textarea name="fFooter" editor_format="true" mini_control="false" width="800" height="200" style="width:500px;height:50px;"><?php echo $footer;?></textarea>
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
                                    <div class="openMoreSettingBtn"><a name="openMoreSettingBtn" idata="counterCodeOfConfig">Counter code</a></div>
                                    <div class="openMoreSettingContent" id="counterCodeOfConfig" style="display: none;">
                                        <table align="center" style="padding:10px;" cellpadding="0" cellspacing="0" align="left">
                                            <tr>
                                                <td colspan="2">
                                                    <textarea name="fCounter_code" editor_format="false" mini_control="false" width="800" height="400" style="width:790px;height:100px;"><?php echo $counter_code;?></textarea>
                                                </td>
                                            </tr>
                                            
                                        </table>
                                    </div>
                                    </div>
                                </td>
                            </tr>
							<tr style="display:none;">
                                <td colspan="4">
                                    <div class="openMoreSettingBox">
                                    <div class="openMoreSettingBtn"><a name="openMoreSettingBtn" idata="metahelp2OfConfig">Hướng dẫn mục giỏ hàng</a></div>
                                    <div class="openMoreSettingContent" id="metahelp2OfConfig" style="display: none;">
                                        <table align="center" style="padding:10px;" cellpadding="0" cellspacing="0" align="left">
                                            <tr>
                                                <td colspan="2">
													<textarea name="fHelp2" editor_format="true" mini_control="false" width="800" height="200" style="width:500px;height:50px;"><?php echo $help2;?></textarea>
                                                </td>
                                            </tr>
                                            
                                        </table>
                                    </div>
                                    </div>
                                </td>
                            </tr>
							<tr style="display:none;">
                                <td colspan="4">
                                    <div class="openMoreSettingBox">
                                    <div class="openMoreSettingBtn"><a name="openMoreSettingBtn" idata="metahelp1OfConfig">Điều khoản sử dụng</a></div>
                                    <div class="openMoreSettingContent" id="metahelp1OfConfig" style="display: none;">
                                        <table align="center" style="padding:10px;" cellpadding="0" cellspacing="0" align="left">
                                            <tr>
                                                <td colspan="2">
													<textarea name="fHelp1" editor_format="true" mini_control="false" width="800" height="200" style="width:500px;height:50px;"><?php echo $help1;?></textarea>
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
                                    <div class="openMoreSettingBtn"><a name="openMoreSettingBtn" idata="metakeywordTags1OfConfig">Tags</a></div>
                                    <div class="openMoreSettingContent" id="metakeywordTags1OfConfig" style="display: none;">
                                        <table align="center" style="padding:10px;" cellpadding="0" cellspacing="0" align="left">
                                            <tr>
                                                <td colspan="2">
													<textarea name="fKeyword_tags" editor_format="true" mini_control="true" width="800" height="200" style="width:500px;height:50px;"><?php echo $keyword_tags;?></textarea>
                                                </td>
                                            </tr>
                                            
                                        </table>
                                    </div>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td colspan="4" align="right">
                                    <button type="submit" class="button_style1"><span>Cập nhật</span></button>
                                </td>
                            </tr>
                        </table>
                    </div>
                </form>
        </div>
    </div>
    <?php include($_SERVER['DOCUMENT_ROOT'] . $base_folder . "admincp/modules/other_info.php");?>
</div>