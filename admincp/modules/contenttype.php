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
    $id = 0;$tab = 1;if(isset($_GET["tab"])){$tab = $_GET["tab"];}
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
    $languageid = 1;$help1 = '';$help2 = '';$yahoo = '';$counter_code = '';
    if(isset($_GET["languageid"])){$languageid = $_GET["languageid"];}
    
	function get_content_type_list_by_region($regionid,$nick,$name,$type,$maxid='', $tinycode=''){
        $query = "select * from content_type where type = $type order by id ASC";
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
				
				$str_parent = '';
				if($row['regionstt']==0){$str_parent = ' selected="selected"';}
				echo '<td>'.$regionid.'</td>';
                echo '<td>';
				echo '<select name="fSupport_list_'.$type.'_region'.$i.'">';
				$result1 = fn_get_array_with_query("select id,code from content_type where type = 3 and status = 1 order by name,id ASC");
				if($result1!=false && mysql_num_rows($result1)>0){
					while($row1 = mysql_fetch_array($result1)){
						$selected='';if($row['regionstt']==$row1['id']){$selected=' selected="selected"';}
						echo '<option'.$selected.' value="'.$row1['id'].'">'.$row1['code'].'</option>';
					}
				}
				echo '</select>';
				echo '</td>';
				
                echo '<td>'.$nick.'</td>';
                echo '<td>';
				echo '<input type="hidden" id="support_id_'.$i.'" name="fSupport_list_'.$type.'_id'.$i.'" value="'.$row['id'].'">';
				echo '<input id="support_nick_'.$i.'" name="fSupport_list_'.$type.'_nick'.$i.'" type="text" value="'.$row['code'].'" style="width:200px;" />';
				echo '</td>';
				
                echo '<td>'.$name.'</td>';
                echo '<td><input id="support_name_'.$i.'" name="fSupport_list_'.$type.'_name'.$i.'" type="text" value="'.$row['name'].'" style="width:50px;" /></td>';
                
                if($maxid!=''){
                    echo '<td>'.$maxid.'</td>';
                    echo '<td><input id="support_maxid_'.$i.'" name="fSupport_list_'.$type.'_maxid'.$i.'" type="text" value="'.$row['maxid'].'" style="width:80px;" /></td>';
                }
                if($tinycode!=''){
                    echo '<td>'.$tinycode.'</td>';
                    echo '<td><input id="support_tinycode_'.$i.'" name="fSupport_list_'.$type.'_tinycode'.$i.'" type="text" value="'.$row['tinycode'].'" style="width:100px;" /></td>';
                }
                
                echo '<td>
                    <span class="check_box_style1" state="'.show_value_by_compare($status,1,'on','off').'">
                        <span class="'.show_value_by_compare($status,1,'check_box_on1','check_box_off1').'">
                            <span class="check_box_on"></span>
                            <span class="check_box_bar"></span>
                            <input type="checkbox" id="support_status_'.$i.'" name="fSupport_list_'.$type.'_status'.$i.'"'.show_value_by_compare($status,1,' checked="checked"','').' />
                        </span>
                    </span>
                </td>';
                
                echo '<td><a href="javascript:;" onclick="add_support_list_new_by_region($(this));"><img src="'.$GLOBALS["base_folder"].'admincp/media/add.png"></a></td>';
                echo '</tr>';
                $stt = $stt + 1;$i = $i + 1;
            }
            return $number;
        }
    }
	
    // Get contact list
    function get_content_type_list($nick,$name,$type,$maxid='', $tinycode=''){
        $query = "select * from content_type where type = $type order by id ASC";
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
                echo '<td><input type="hidden" id="support_id_'.$i.'" name="fSupport_list_'.$type.'_id'.$i.'" value="'.$row['id'].'"><input id="support_nick_'.$i.'" name="fSupport_list_'.$type.'_nick'.$i.'" type="text" value="'.$row['code'].'" style="width:200px;" /></td>';
                echo '<td>'.$name.'</td>';
                echo '<td><input id="support_name_'.$i.'" name="fSupport_list_'.$type.'_name'.$i.'" type="text" value="'.$row['name'].'" style="width:50px;" /></td>';
                
                if($maxid!=''){
                    echo '<td>'.$maxid.'</td>';
                    echo '<td><input id="support_maxid_'.$i.'" name="fSupport_list_'.$type.'_maxid'.$i.'" type="text" value="'.$row['maxid'].'" style="width:80px;" /></td>';
                }
                if($tinycode!=''){
                    echo '<td>'.$tinycode.'</td>';
                    echo '<td><input id="support_tinycode_'.$i.'" name="fSupport_list_'.$type.'_tinycode'.$i.'" type="text" value="'.$row['tinycode'].'" style="width:100px;" /></td>';
                }
                
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
        <div class="form_add" id="form_add" style="position: relative;">
                <form action="<?php echo $base_folder;?>admincp/modules/contenttype_update.php" onsubmit="return frmProcess_before_submit();" name="frmProcess" target="processing_target" method="POST">
                    <input type="hidden" value="<?php echo $languageid;?>" name="fLanguage">
                    <input type="hidden" value="<?php echo $id;?>" name="fID">
                    <iframe name="processing_target" src="#" style="width:0;height:0;border:0px;display:none;"></iframe>
                    <table align="center" cellpadding="5" cellspacing="0" class="table_add" style="margin:0 auto;">
                        <tr>
                            <td colspan="4" align="center" class="function_name" style="font-weight: bold;font-size: 18px;color:#1B99CC;padding:10px 0;">Đặc điểm</td>
                        </tr>
                    </table>
                    <div class="menu" name="content_menu">
                        <ul>
							<li><a href="javascript:;" onclick="show_content_info($(this));">Tỉnh/Thành phố</a></li>
							<li><a href="javascript:;" onclick="show_content_info($(this));">Quận/Huyện</a></li>
                            <li><a href="javascript:;" onclick="show_content_info($(this));">Loại bất động sản</a></li>
							<li><a href="javascript:;" onclick="show_content_info($(this));">Diện tích nhà đất bán</a></li>
							<li><a href="javascript:;" onclick="show_content_info($(this));">Số tầng nhà bán</a></li>
                            <li><a href="javascript:;" onclick="show_content_info($(this));">Giá nhà đất bán</a></li>
							
                            <li><a href="javascript:;" onclick="show_content_info($(this));">Diện tích nhà đất cho thuê</a></li>
							<li><a href="javascript:;" onclick="show_content_info($(this));">Số tầng nhà cho thuê</a></li>
                            <li><a href="javascript:;" onclick="show_content_info($(this));">Giá nhà đất cho thuê</a></li>
                            <li style="display: none;"><a href="javascript:;" onclick="show_content_info($(this));">Bộ nhớ RAM</a></li>
                            <li style="display: none;"><a href="javascript:;" onclick="show_content_info($(this));">Dung lượng ổ cứng</a></li>
                            <li style="display: none;"><a href="javascript:;" onclick="show_content_info($(this));">Pin</a></li>
                        </ul>
                    </div>
					<div class="tab_content_info">
                        <table cellpadding="5" cellspacing="0" class="table_add">
                            <tr>
                                <td colspan="8">
                                    <a href="javascript:;" onclick="add_support_list_new($(this));"><img style="vertical-align:middle;" src="<?php echo $GLOBALS["base_folder"];?>admincp/media/add.png"></a>
                                    <font style="margin-left: 10px;font-weight: bold;color:#6AB731;">Hệ thống sẽ tự động loại bỏ các phần bỏ trống</font>
                                </td>
                            </tr>
                            <?php $age_number = get_content_type_list('Tỉnh/Thành phố','Thứ tự',3);?>
                            <tr class="hidden">
                                <td colspan="8">
                                    <input type="hidden" class="cf_support_list_number" name="fAge_number" value="<?php echo $age_number;?>">
                                    <input type="hidden" class="cf_support_list_type" value="3">
                                    <input type="hidden" class="cf_support_list_type_nick" value="Tỉnh/Thành phố">
                                    <input type="hidden" class="cf_support_list_type_name" value="Thứ tự">
                                    <input type="hidden" class="cf_support_list_width_input" value="10,200,50">
                                </td>
                            </tr>
                        </table>
                    </div>
					<div class="tab_content_info">
                        <table cellpadding="5" cellspacing="0" class="table_add">
                            <tr>
                                <td colspan="8">
                                    <a href="javascript:;" onclick="add_support_list_new($(this));"><img style="vertical-align:middle;" src="<?php echo $GLOBALS["base_folder"];?>admincp/media/add.png"></a>
                                    <font style="margin-left: 10px;font-weight: bold;color:#6AB731;">Hệ thống sẽ tự động loại bỏ các phần bỏ trống</font>
                                </td>
                            </tr>
                            <?php $brand_number = get_content_type_list_by_region('Tỉnh/Thành phố','Quận/Huyện','Thứ tự',2);?>
                            <tr class="hidden">
                                <td colspan="8">
                                    <input type="hidden" class="cf_support_list_number" name="fBrand_number" value="<?php echo $brand_number;?>">
                                    <input type="hidden" class="cf_support_list_type" value="2">
                                    <input type="hidden" class="cf_support_list_type_region" value="Tỉnh/Thành phố">
                                    <input type="hidden" class="cf_support_list_type_nick" value="Quận huyện">
                                    <input type="hidden" class="cf_support_list_type_name" value="Thứ tự">
                                    <input type="hidden" class="cf_support_list_width_input" value="10,200,50">
                                </td>
                            </tr>
                        </table>
                    </div>
                     <div class="tab_content_info">
                        <table cellpadding="5" cellspacing="0" class="table_add">
                            <tr>
                                <td colspan="8">
                                    <a href="javascript:;" onclick="add_support_list_new($(this));"><img style="vertical-align:middle;" src="<?php echo $GLOBALS["base_folder"];?>admincp/media/add.png"></a>
                                    <font style="margin-left: 10px;font-weight: bold;color:#6AB731;">Hệ thống sẽ tự động loại bỏ các phần bỏ trống</font>
                                </td>
                            </tr>
                            <?php $content_type6 = get_content_type_list('Loại bất động sản','Thứ tự',6);?>
                            <tr class="hidden">
                                <td colspan="8">
                                    <input type="hidden" class="cf_support_list_number" name="fContent_type6" value="<?php echo $content_type6;?>">
                                    <input type="hidden" class="cf_support_list_type" value="6">
                                    <input type="hidden" class="cf_support_list_type_nick" value="Loại bất động sản">
                                    <input type="hidden" class="cf_support_list_type_name" value="Thứ tự">
                                    <input type="hidden" class="cf_support_list_width_input" value="10,200,50">
                                </td>
                            </tr>
                        </table>
                    </div>
					<div class="tab_content_info">
                        <table cellpadding="5" cellspacing="0" class="table_add">
                            <tr>
                                <td colspan="8">
                                    <a href="javascript:;" onclick="add_support_list_new($(this));"><img style="vertical-align:middle;" src="<?php echo $GLOBALS["base_folder"];?>admincp/media/add.png"></a>
                                    <font style="margin-left: 10px;font-weight: bold;color:#6AB731;">Hệ thống sẽ tự động loại bỏ các phần bỏ trống</font>
                                </td>
                            </tr>
                            <?php $content_type4 = get_content_type_list('Diện tích','Thứ tự',4);?>
                            <tr class="hidden">
                                <td colspan="8">
                                    <input type="hidden" class="cf_support_list_number" name="fContent_type4" value="<?php echo $content_type4;?>">
                                    <input type="hidden" class="cf_support_list_type" value="4">
                                    <input type="hidden" class="cf_support_list_type_nick" value="Số tầng">
                                    <input type="hidden" class="cf_support_list_type_name" value="Thứ tự">
                                    <input type="hidden" class="cf_support_list_width_input" value="10,200,50">
                                </td>
                            </tr>
                        </table>
                    </div>	
					 <div class="tab_content_info">
                        <table cellpadding="5" cellspacing="0" class="table_add">
                            <tr>
                                <td colspan="8">
                                    <a href="javascript:;" onclick="add_support_list_new($(this));"><img style="vertical-align:middle;" src="<?php echo $GLOBALS["base_folder"];?>admincp/media/add.png"></a>
                                    <font style="margin-left: 10px;font-weight: bold;color:#6AB731;">Hệ thống sẽ tự động loại bỏ các phần bỏ trống</font>
                                </td>
                            </tr>
                            <?php $content_type7 = get_content_type_list('Số tầng nhà bán','Thứ tự',7);?>
                            <tr class="hidden">
                                <td colspan="8">
                                    <input type="hidden" class="cf_support_list_number" name="fContent_type7" value="<?php echo $content_type7;?>">
                                    <input type="hidden" class="cf_support_list_type" value="7">
                                    <input type="hidden" class="cf_support_list_type_nick" value="Số tầng nhà bán">
                                    <input type="hidden" class="cf_support_list_type_name" value="Thứ tự">
                                    <input type="hidden" class="cf_support_list_width_input" value="10,200,50">
                                </td>
                            </tr>
                        </table>
                    </div>
					 <div class="tab_content_info">
                        <table cellpadding="5" cellspacing="0" class="table_add">
                            <tr>
                                <td colspan="8">
                                    <a href="javascript:;" onclick="add_support_list_new($(this));"><img style="vertical-align:middle;" src="<?php echo $GLOBALS["base_folder"];?>admincp/media/add.png"></a>
                                    <font style="margin-left: 10px;font-weight: bold;color:#6AB731;">Hệ thống sẽ tự động loại bỏ các phần bỏ trống</font>
                                </td>
                            </tr>
                            <?php $content_type5 = get_content_type_list('Giá bán','Thứ tự',5);?>
                            <tr class="hidden">
                                <td colspan="8">
                                    <input type="hidden" class="cf_support_list_number" name="fContent_type5" value="<?php echo $content_type5;?>">
                                    <input type="hidden" class="cf_support_list_type" value="5">
                                    <input type="hidden" class="cf_support_list_type_nick" value="Giá bán">
                                    <input type="hidden" class="cf_support_list_type_name" value="Thứ tự">
                                    <input type="hidden" class="cf_support_list_width_input" value="10,200,50">
                                </td>
                            </tr>
                        </table>
                    </div>
                   
                    <div class="tab_content_info">
                        <table cellpadding="5" cellspacing="0" class="table_add">
                            <tr>
                                <td colspan="8">
                                    <a href="javascript:;" onclick="add_support_list_new($(this));"><img style="vertical-align:middle;" src="<?php echo $GLOBALS["base_folder"];?>admincp/media/add.png"></a>
                                    <font style="margin-left: 10px;font-weight: bold;color:#6AB731;">Hệ thống sẽ tự động loại bỏ các phần bỏ trống</font>
                                </td>
                            </tr>
                            <?php $content_type8 = get_content_type_list('Diện tích nhà cho thuê','Thứ tự',8);?>
                            <tr class="hidden">
                                <td colspan="8">
                                    <input type="hidden" class="cf_support_list_number" name="fContent_type8" value="<?php echo $content_type8;?>">
                                    <input type="hidden" class="cf_support_list_type" value="8">
                                    <input type="hidden" class="cf_support_list_type_nick" value="Diện tích nhà cho thuê">
                                    <input type="hidden" class="cf_support_list_type_name" value="Thứ tự">
                                    <input type="hidden" class="cf_support_list_width_input" value="10,200,50">
                                </td>
                            </tr>
                        </table>
                    </div>
                    <div class="tab_content_info">
                        <table cellpadding="5" cellspacing="0" class="table_add">
                            <tr>
                                <td colspan="8">
                                    <a href="javascript:;" onclick="add_support_list_new($(this));"><img style="vertical-align:middle;" src="<?php echo $GLOBALS["base_folder"];?>admincp/media/add.png"></a>
                                    <font style="margin-left: 10px;font-weight: bold;color:#6AB731;">Hệ thống sẽ tự động loại bỏ các phần bỏ trống</font>
                                </td>
                            </tr>
                            <?php $content_type9 = get_content_type_list('Số tầng nhà cho thuê','Thứ tự',9);?>
                            <tr class="hidden">
                                <td colspan="8">
                                    <input type="hidden" class="cf_support_list_number" name="fContent_type9" value="<?php echo $content_type9;?>">
                                    <input type="hidden" class="cf_support_list_type" value="9">
                                    <input type="hidden" class="cf_support_list_type_nick" value="Số tầng nhà cho thuê">
                                    <input type="hidden" class="cf_support_list_type_name" value="Thứ tự">
                                    <input type="hidden" class="cf_support_list_width_input" value="10,200,50">
                                </td>
                            </tr>
                        </table>
                    </div>
                    <div class="tab_content_info">
                        <table cellpadding="5" cellspacing="0" class="table_add">
                            <tr>
                                <td colspan="8">
                                    <a href="javascript:;" onclick="add_support_list_new($(this));"><img style="vertical-align:middle;" src="<?php echo $GLOBALS["base_folder"];?>admincp/media/add.png"></a>
                                    <font style="margin-left: 10px;font-weight: bold;color:#6AB731;">Hệ thống sẽ tự động loại bỏ các phần bỏ trống</font>
                                </td>
                            </tr>
                            <?php $content_type10 = get_content_type_list('Giá nhà cho thuê','Thứ tự',10);?>
                            <tr class="hidden">
                                <td colspan="8">
                                    <input type="hidden" class="cf_support_list_number" name="fContent_type10" value="<?php echo $content_type10;?>">
                                    <input type="hidden" class="cf_support_list_type" value="10">
                                    <input type="hidden" class="cf_support_list_type_nick" value="Giá nhà cho thuê">
                                    <input type="hidden" class="cf_support_list_type_name" value="Thứ tự">
                                    <input type="hidden" class="cf_support_list_width_input" value="10,200,50">
                                </td>
                            </tr>
                        </table>
                    </div>
                    <div class="tab_content_info">
                        <table cellpadding="5" cellspacing="0" class="table_add">
                            <tr>
                                <td colspan="8">
                                    <a href="javascript:;" onclick="add_support_list_new($(this));"><img style="vertical-align:middle;" src="<?php echo $GLOBALS["base_folder"];?>admincp/media/add.png"></a>
                                    <font style="margin-left: 10px;font-weight: bold;color:#6AB731;">Hệ thống sẽ tự động loại bỏ các phần bỏ trống</font>
                                </td>
                            </tr>
                            <?php $content_type11 = get_content_type_list('Dung lượng ổ cứng','Thứ tự',11);?>
                            <tr class="hidden">
                                <td colspan="8">
                                    <input type="hidden" class="cf_support_list_number" name="fContent_type11" value="<?php echo $content_type11;?>">
                                    <input type="hidden" class="cf_support_list_type" value="11">
                                    <input type="hidden" class="cf_support_list_type_nick" value="Dung lượng ổ cứng">
                                    <input type="hidden" class="cf_support_list_type_name" value="Thứ tự">
                                    <input type="hidden" class="cf_support_list_width_input" value="10,200,50">
                                </td>
                            </tr>
                        </table>
                    </div>
                    <div class="tab_content_info">
                        <table cellpadding="5" cellspacing="0" class="table_add">
                            <tr>
                                <td colspan="8">
                                    <a href="javascript:;" onclick="add_support_list_new($(this));"><img style="vertical-align:middle;" src="<?php echo $GLOBALS["base_folder"];?>admincp/media/add.png"></a>
                                    <font style="margin-left: 10px;font-weight: bold;color:#6AB731;">Hệ thống sẽ tự động loại bỏ các phần bỏ trống</font>
                                </td>
                            </tr>
                            <?php $content_type12 = get_content_type_list('Pin','Thứ tự',12);?>
                            <tr class="hidden">
                                <td colspan="8">
                                    <input type="hidden" class="cf_support_list_number" name="fContent_type12" value="<?php echo $content_type12;?>">
                                    <input type="hidden" class="cf_support_list_type" value="12">
                                    <input type="hidden" class="cf_support_list_type_nick" value="Pin">
                                    <input type="hidden" class="cf_support_list_type_name" value="Thứ tự">
                                    <input type="hidden" class="cf_support_list_width_input" value="10,200,50">
                                </td>
                            </tr>
                        </table>
                    </div>
                    
                    <div id="content_button" style="width:100%;">
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