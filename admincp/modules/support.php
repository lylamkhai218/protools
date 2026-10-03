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
    $id = 0;$tab = 0;if(isset($_GET["tab"])){$tab = $_GET["tab"];}
    $config_title = '';
    $default_homeicon = 'template/images/homeicon.png';
    $default_background = '';
    $default_background_color = '';    
    $default_logo = '/favicon.ico';
    $hotnews = 3;
    $news_in_catalog = 10;
    $title = '';
    $description = '';
    $keywords = '';$keyword_tags = '';
    $homeicon = '';$logo = '';$logo_bottom = '';$map = '';$other_contact = '';
    $background = '';$background_color = '';$background_left = '';$background_top = '';$background_repeat = '';$background_attachment = '';
    $contact = '';$hotline = '';$footer = '';$hour_support = '';
    $email_sender = '';$email_booking = '';$email_sender_pass = '';
    $send_email_type = 0;
    $create_time = date("YmdHis");$update_time = 0;
    $address = '';$yahoo_number = 0;$skype_number = 0;$email_number=0;$phone_number = 0;$money_type = '';$slogan = '';
    $languageid = 1;$help1 = '';$help2 = '';
    $yahoo = '';$skype = '';
    $counter_code = '';
    $meta_support1 = '';$meta_support2 = '';
    // if($languageid==1){$language_alias = 'vn';}
    // elseif($languageid==2){$language_alias = 'en';}
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
                $GLOBALS['id'] = $row['id'];
                $GLOBALS['hotline'] = $row['hotline'];
                $GLOBALS['yahoo'] = $row['yahoo'];
                $GLOBALS['skype'] = $row['skype'];
                $GLOBALS['hour_support'] = $row['hour_support'];$GLOBALS['other_contact'] = $row['other_contact'];
                $GLOBALS['email_sender'] = $row['email_sender'];$GLOBALS['email_sender_pass'] = decode_password($row['email_sender_pass'],$row['salt']);
                $GLOBALS['send_email_type'] = $row['send_email_type'];$GLOBALS['email_booking'] = $row['email_booking'];
                $GLOBALS['create_time'] = $row['create_time'];$GLOBALS['update_time'] = $row['update_time'];
                $GLOBALS['meta_support1'] = $row['meta_support1'];$GLOBALS['meta_support2'] = $row['meta_support2'];
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
    function get_support_list($nick,$name,$type){//and support_list.languageid = ".$GLOBALS['languageid']." 
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
                <form action="<?php echo $base_folder;?>admincp/modules/support_update.php" onsubmit="return frmProcess_before_submit();" name="frmProcess" target="processing_target" method="POST">
                    <input type="hidden" value="<?php echo $languageid;?>" name="fLanguage">
                    <input type="hidden" value="<?php echo $id;?>" name="fID">
                    <iframe name="processing_target" src="#" style="width:0;height:0;border:0px;display:none;"></iframe>
                    <table cellpadding="5" cellspacing="0" width="600" class="table_add">
                        <tr>
                            <td colspan="4" align="center" class="function_name">Hỗ trợ</td>
                        </tr>
                    </table>
                    <div class="menu" name="content_menu">
                        <ul>
                            <li><a href="javascript:;" onclick="show_content_info($(this));">Yahoo</a></li>
                            <li style="display:none;"><a href="javascript:;" onclick="show_content_info($(this));">Skype</a></li>
                            <li><a href="javascript:;" onclick="show_content_info($(this));">Hỗ trợ mua hàng</a></li>
                            <li><a href="javascript:;" onclick="show_content_info($(this));">Phone</a></li>
                            <li style="display:none;"><a href="javascript:;" onclick="show_content_info($(this));">Hỗ trợ</a></li>
                            <li><a href="javascript:;" onclick="show_content_info($(this));">Thông tin khác</a></li>
                        </ul>
                    </div>
                    <div class="tab_content_info">
                        <div style="float:left;width:100%;"></div>
                        <table cellpadding="5" cellspacing="0" class="table_add">
							<tr style="display:none;">
                                <td>Ngôn ngữ</td>
                                <td colspan="3"><?php show_language_list($GLOBALS["languageid"]);?></td>
                            </tr>
                            <tr>
                                <td colspan="8">
									<?php //show_language_list($GLOBALS["languageid"]);?>
                                    <a href="javascript:;" onclick="add_support_list_new($(this));"><img style="vertical-align:middle;" src="<?php echo $GLOBALS["base_folder"];?>admincp/media/add.png"></a>
                                    <font style="margin-left: 10px;font-weight: bold;color:#6AB731;">Hệ thống sẽ tự động loại bỏ các phần bỏ trống</font>
                                </td>
                            </tr>
                            <?php $yahoo_number = get_support_list('Nick','Tên',1);?>
                            <tr class="hidden">
                                <td colspan="8">
                                    <input type="hidden" class="cf_support_list_number" name="fYahoo_number" value="<?php echo $yahoo_number;?>">
                                    <input type="hidden" class="cf_support_list_type" value="1">
                                    <input type="hidden" class="cf_support_list_type_nick" value="Nick">
                                    <input type="hidden" class="cf_support_list_type_name" value="Tên">
                                </td>
                            </tr>
                        </table>
                    </div>
                    <div class="tab_content_info" style="display:none;">
                        <div style="float:left;width:100%;"></div>
                        <table cellpadding="5" cellspacing="0" class="table_add">
							<tr style="display:none;">
                                <td>Ngôn ngữ</td>
                                <td colspan="3"><?php show_language_list($GLOBALS["languageid"]);?></td>
                            </tr>
                            <tr>
                                <td colspan="8">
                                    <a href="javascript:;" onclick="add_support_list_new($(this));"><img style="vertical-align:middle;" src="<?php echo $GLOBALS["base_folder"];?>admincp/media/add.png"></a>
                                    <font style="margin-left: 10px;font-weight: bold;color:#6AB731;">Hệ thống sẽ tự động loại bỏ các phần bỏ trống</font>
                                </td>
                            </tr>
                            <?php $skype_number = get_support_list('Skype','Tên',2);?>
                            <tr class="hidden">
                                <td colspan="8">
                                    <input type="hidden" class="cf_support_list_number" name="fSkype_number" value="<?php echo $skype_number;?>">
                                    <input type="hidden" class="cf_support_list_type" value="2">
                                    <input type="hidden" class="cf_support_list_type_nick" value="Skype">
                                    <input type="hidden" class="cf_support_list_type_name" value="Tên">
                                </td>
                            </tr>
                        </table>
                    </div>
                    <div class="tab_content_info" style="display:none;">
                        <div style="float:left;width:100%;"></div>
                        <table cellpadding="5" cellspacing="0" class="table_add">
							<tr style="display:none;">
                                <td>Ngôn ngữ</td>
                                <td colspan="3"><?php show_language_list($GLOBALS["languageid"]);?></td>
                            </tr>
							
                            <tr>
                                <td colspan="8">
                                    <a href="javascript:;" onclick="add_support_list_new($(this));"><img style="vertical-align:middle;" src="<?php echo $GLOBALS["base_folder"];?>admincp/media/add.png"></a>
                                    <font style="margin-left: 10px;font-weight: bold;color:#6AB731;">Hệ thống sẽ tự động loại bỏ các phần bỏ trống</font>
                                </td>
                            </tr>
                            <?php $email_number = get_support_list('Số điện thoại hỗ trợ','Tên',4);?>
                            <tr class="hidden">
                                <td colspan="8">
                                    <input type="hidden" class="cf_support_list_number" name="fEmail_number" value="<?php echo $email_number;?>">
                                    <input type="hidden" class="cf_support_list_type" value="4">
                                    <input type="hidden" class="cf_support_list_type_nick" value="Số điện thoại hỗ trợ">
                                    <input type="hidden" class="cf_support_list_type_name" value="Tên">
                                </td>
                            </tr>
                        </table>
                    </div>
                    <div class="tab_content_info" style="display:none;">
                        <div style="float:left;width:100%;"></div>
                        <table cellpadding="5" cellspacing="0" class="table_add">
							<tr style="display:none;">
                                <td>Ngôn ngữ</td>
                                <td colspan="3"><?php show_language_list($GLOBALS["languageid"]);?></td>
                            </tr>
                            <tr>
                                <td colspan="8">
                                    <a href="javascript:;" onclick="add_support_list_new($(this));"><img style="vertical-align:middle;" src="<?php echo $GLOBALS["base_folder"];?>admincp/media/add.png"></a>
                                    <font style="margin-left: 10px;font-weight: bold;color:#6AB731;">Hệ thống sẽ tự động loại bỏ các phần bỏ trống</font>
                                </td>
                            </tr>
                            <?php $phone_number = get_support_list('Điện thoại','Tên',3);?>
                            <tr class="hidden">
                                <td colspan="8">
                                    <input type="hidden" class="cf_support_list_number" name="fPhone_number" value="<?php echo $phone_number;?>">
                                    <input type="hidden" class="cf_support_list_type" value="3">
                                    <input type="hidden" class="cf_support_list_type_nick" value="Điện thoại">
                                    <input type="hidden" class="cf_support_list_type_name" value="Tên">
                                </td>
                            </tr>
                        </table>
                    </div>
                    <div class="tab_content_info" style="display:none;">
                        <table cellpadding="5" cellspacing="0" class="table_add">
                            <tr>
                            <td colspan="4">
                                <div class="openMoreSettingBox">
                                <div class="openMoreSettingBtn"><a class="active" name="openMoreSettingBtn" idata="supportDetailOfSupport">Hình thức thanh toán</a></div>
                                <div class="openMoreSettingContent" id="supportDetailOfSupport" style="display: block;">
                                    <table style="padding:10px;" cellpadding="0" cellspacing="0" align="left">
                                        <tr>
                                            <td>
                                                <textarea default="" reset="true" name="meta_support1" editor_format="true" mini_control="false" width="800" height="300" style="width:590px;height:80px;margin-left:10px;"><?php echo $meta_support1;?></textarea>
                                            </td>
                                        </tr>
                                    </table>
                                </div>
                                </div>
                                </td>
                            </tr>
                        </table>
                    </div>
                    
                    <div id="content_other" class="tab_content_info">
                        <table cellpadding="5" cellspacing="0" class="table_add">
                            <tr>
                                <td>Thời gian hỗ trợ</td>
                                <td colspan="3">
                                    <input type="text" name="fHour_support" value="<?php echo $hour_support;?>" style="width:200px;">
                                </td>
                            </tr>
                            <tr>
                                <td>Yahoo</td>
                                <td colspan="3">
                                    <input type="text" name="fYahoo" value="<?php echo $yahoo;?>" style="width:200px;">
                                </td>
                            </tr>
                            <tr>
                                <td>Skype</td>
                                <td colspan="3">
                                    <input type="text" name="fSkype" value="<?php echo $skype;?>" style="width:200px;">
                                </td>
                            </tr>
                            <tr>
                                <td>Hotline</td>
                                <td colspan="3">
                                    <input type="text" name="fHotline" value="<?php echo $hotline;?>" style="width:200px;">
                                </td>
                            </tr>
                            <tr style="display: none;">
                                <td valign="top">Travel Agent</td>
                                <td colspan="3">
                                    <textarea name="fOther_contact" editor_format="false" mini_control="false" width="800" height="250" style="width:500px;height:50px;"><?php echo $other_contact;?></textarea>
                                </td>
                            </tr>
                            <tr>
                                <td>Email nhận dịch vụ</td>
                                <td colspan="3">
                                    <input type="text" name="fEmail_booking" value="<?php echo $email_booking;?>" style="width:200px;">
                                </td>
                            </tr>
                            <tr>
                                <td>Sử dụng SMTP Gmail</td>
                                <td>
                                    <input name="fSend_email_type"<?php if($send_email_type==1){echo ' checked="checked"';}?> style="height: 20px; margin: 0;padding: 0;" type="checkbox" />
                                </td>
                                <td colspan="2"><font style="font-size:11px;">(Khuyến khích khách hàng sử dụng SMTP Gmail để gửi. Vui lòng nhập Email và Mật khẩu)</font></td>
                            </tr>
                            <tr>
                                <td>Email gửi liên hệ</td>
                                <td colspan="3">
                                    <div style="">
                                        <input name="fEmail_sender" type="text" value="<?php echo $email_sender;?>" style="width:150px;" />
                                        <span style="margin-left:10px;">Mật khẩu: <input name="fEmail_sender_pass" type="password" value="<?php echo $email_sender_pass;?>" style="width:150px;" /></span>
                                        <span style="margin-left:20px;"><a style="display:inline-block;padding:3px 10px;background-color:#1FAB04;color:#ffffff;cursor: pointer;" onclick="send_email_smtp_test();">Gửi Email test</a></span>
                                    </div>
                                    <div style="">
                                        <iframe scrolling="true" frameborder="0" id="iframeSendEmailTest" name="iframeSendEmailTest" src="#" style="width:300px;height:250px;border:0px;display: none;"></iframe>
                                    </div>
                                </td>
                            </tr>
                        </table>
                    </div>
                    <div id="content_button" style="width:730px;">
                        <button type="submit" class="button_style1"><span>Cập nhật</span></button>
                    </div>
                </form>
        </div>
    </div>
    <?php include($_SERVER['DOCUMENT_ROOT'] . $base_folder . "admincp/modules/other_info.php");?>
</div>
<script type="text/javascript">
function send_email_smtp_test(){
    $("#iframeSendEmailTest").attr("src",base_folder+"modules/send_mail_test_smtp.php");
    $("#iframeSendEmailTest").show();
}
</script>