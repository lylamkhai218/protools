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
    $id = 0;
    $title = '';
    $description = '';
    $position = 0;
    $ordering = 0;
    $type = 1;
    $file_url = '';$image_list = '';
    $typeofopen = 1;
    $hyperlink = '';
    $image = '';
    $width = 0;
    $height = 0;
    $create_time = 0;
    $target = '_blank';
    $status = 1;
    $languageid = 1;
    $catalog_show = '0';
    $catalog_show_number = 0;
    $showinhome = 0;$showallpage = 0;
    $padding_horizontal_left = 0;
    $padding_horizontal_right = 0;
    $padding_vertical_top = 0;
    $padding_vertical_bottom = 0;
    $expire = 0;
    $expire_time = 0;
    $userid = 0;
    if(isset($_GET["id"])){
        $id = $_GET["id"];
        get_content_info($id);
        $catalog_show = get_catalog_show($id);
    }
	if($languageid==1){$language_alias = 'vn';}
    elseif($languageid==2){$language_alias = 'en';}
    function get_catalog_show($id){
        $strreturn = '0-0';
        $query ="select * from adv_catalog where advid = $id order by ordering ASC";
        $result = mysql_query($query,$GLOBALS["con"]);
        if($result==false||mysql_num_rows($result)<=0){
            
        }
        else{
            while($row = mysql_fetch_array($result)){
                $strreturn = $strreturn . ','.$row['catid'].'-'.$row['ordering'];
            }
            $GLOBALS["catalog_show_number"] = mysql_num_rows($result);
        }
        return $strreturn;
    }
    function get_content_info($id){
        $query = "select * from adv where id = $id";
        $result= mysql_query($query,$GLOBALS["con"]);
        if(mysql_num_rows($result) > 0){
            $row = mysql_fetch_array($result);
            $GLOBALS['title'] = $row['title'];
            $GLOBALS["description"] = $row['description'];
            $GLOBALS["position"] = $row['position'];
            $GLOBALS["ordering"] = $row['ordering'];
            $GLOBALS["type"] = $row['type'];
            $GLOBALS["file_url"] = $row['file_url'];$GLOBALS['image_list'] = $row['image_list'];
            $GLOBALS["typeofopen"] = $row['typeofopen'];
            $GLOBALS["hyperlink"] = $row['hyperlink'];
            $GLOBALS["width"] = $row['width'];
            $GLOBALS["height"] = $row['height'];
            $GLOBALS["padding_horizontal_left"] = $row['padding_horizontal_left'];
            $GLOBALS["padding_horizontal_right"] = $row['padding_horizontal_right'];
            $GLOBALS["padding_vertical_top"] = $row['padding_vertical_top'];
            $GLOBALS["padding_vertical_bottom"] = $row['padding_vertical_bottom'];
            $GLOBALS["create_time"] = $row['create_time'];
            $GLOBALS["target"] = $row['target'];
            $GLOBALS["catalog_show"] = $row['catalog_show'];
            $GLOBALS["catalog_show_number"] = $row['catalog_show_number'];
            $GLOBALS["showinhome"] = $row['showinhome'];$GLOBALS["showallpage"] = $row['showallpage'];
            $GLOBALS["expire"] = $row['expire'];
            $GLOBALS["expire_time"] = $row['expire_time'];
            $GLOBALS["status"] = $row['status'];
			 $GLOBALS["languageid"] = $row['languageid'];
            mysql_free_result($result);  
            return true;
        }
        else{
            return false;
        }
    }
    function show_directory_show($id){
        if($id==0){return '';}
        $strreturn = '';
        $table_query = 'catalog';
        $catid = $id;
        $content_group = get_content_group($id);
        $parentid = get_parent_id($id,$table_query);
        $strreturn = '<u>' . get_catalog_name_from_id($catid,$table_query) . '</u>';
        $i = 0;
        while($parentid!=0&&$i<10){
            $strreturn = '<u>' . get_catalog_name_from_id($parentid,$table_query) . '</u> &gt; ' . $strreturn;
            $parentid = get_parent_id($parentid,$table_query);
            $i = $i + 1;
        }
        $strreturn ='<u>' .  $content_group . '</u> &gt; ' . $strreturn;
        return $strreturn;
    }
    function get_content_group($id){
        $query = "select content_group.id,content_group.name from catalog,content_group where content_group.id = catalog.content_group and catalog.catid = $id";
        $result = mysql_query($query,$GLOBALS["con"]);
        if($result==false||mysql_num_rows($result)<=0){
            return '';
        }
        else{
            $row = mysql_fetch_array($result);
            return $row['name'];
        }
    }
    function show_content_group($content_group){
        $query = "select id,name from content_group where status = 1 and languageid = ".$GLOBALS["languageid"]." order by name ASC";
        $result = mysql_query($query,$GLOBALS["con"]);
        if($result==false||mysql_num_rows($result)<=0){
            return '';
        }
        else{
            $strreturn = '<div id="category_0" class="category_level category_first">
                            <select class="select_product_category" multiple="multiple" onclick="change_catalogs_show_of_adv_add($(this),this.value,0,0,1);">';
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
    function get_parent_id($id,$table_query){
        $query = "select parentid from $table_query where catid = $id";
        $result = mysql_query($query,$GLOBALS["con"]);
        if($result==false||mysql_num_rows($result)<=0){
            return "";
        }
        else{
            $row = mysql_fetch_array($result);
            return $row['parentid'];
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
            return $row['catalog_name'];
        }
    }
    function process_catalog_show($catalog_show){
        $list = explode(',', $catalog_show);
        $k = 1;
        for($i=0;$i<sizeof($list);$i++){
            $value = explode('-', trim($list[$i]));
            $id = trim($value[0]);
            $ordering = trim($value[1]);
            $idata = $id . '-' . $ordering;
            if($id!=''&&$id!='0'){
                echo '<p><b id="directory_'.$k.'">'.$k.'. </b> Thứ tự ' . $ordering . ' - '.show_directory_show($id).'&nbsp;&nbsp;&nbsp;<a onclick="remove_adv_category($(this));" href="javascript:;" idata="'.$idata.'"><img align="absMiddle" src="'.$GLOBALS["base_folder"].'admincp/media/remove-icon.gif"></a></p>';
                $k = $k + 1;
            }  
        }
    }
    function show_expire_time($expire_time){
        if($expire_time==0){
            $expire_time = date("d/m/Y",mktime(0,0,0,date("m")+1,date("d"),date("Y")));
            echo $expire_time;
        }
        else{
            $expire_time = substr($expire_time,6,2) . "/" . substr($expire_time,4,2) . "/" . substr($expire_time,0,4);
            echo $expire_time;
        }
    }
    function show_language_list($languageid){
        $query = "select id,name from language where status = 1 order by name ASC";
        $result = mysql_query($query,$GLOBALS["con"]);
        if($result==false||mysql_num_rows($result)<=0){
            return '';
        }
        else{
            $strreturn = '<select name="fLanguage" onchange="change_language_of_adv();" style="width:150px;">';
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
                $image = image_process_http($image);
                if($image!=""){
                    $image = image_process_http($image);
                    $count = $count + 1;
                    echo '<span class="image_number"><a class="title" title="'.$name.'">'.$name.'</a><img src="' . $image . '"><a onclick="delete_image_from_content(\'' . $image . '\')" class="delete">Xóa</a></span>';
                }
            }
        }
        echo '</div><div id="count_image_upload">'.$count.'</div>';
        echo '</div>';
    }
?>
<script type="text/javascript">
$(document).ready(function() {
    $( "#image_list" ).sortable({ opacity: 0.6, cursor: "move" });
});
</script>
<?php include($_SERVER['DOCUMENT_ROOT'] . $base_folder . "admincp/modules/content_left.php");?>
<div id="content_right">
    <div class="content">
        <div class="image_list_upload_container">
            <form id="frmUpload_list_image" name="frmUpload_list_image" action="<?php echo $GLOBALS["base_folder"];?>admincp/modules/upload_image_fast.php" method="POST" ENCTYPE="multipart/form-data" target="upload_target">
                <iframe name="upload_target" src="<?php echo $GLOBALS["base_folder"];?>global/process_target.png" style="width:0px;height:0px;border:0px;display:none;"></iframe>
                <div class="name"><b>Tải ảnh</b> (gif, png, jpg &lt; <font color="red"><b>2MB</b></font>).</div>
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
        <div class="form_add" id="form_add">
                <form action="<?php echo $base_folder;?>admincp/modules/adv_insert.php" onsubmit="return frmProcess_before_submit()" name="frmProcess" target="processing_target" method="POST">
                    <iframe name="processing_target" src="#" style="width:0;height:0;border:0px;display:none;"></iframe>
                    <table cellpadding="5" cellspacing="0" width="600" class="table_add">
                        <tr>
                            <td colspan="4" align="center" class="function_name"><?php if($id==0){echo 'Tạo mới quảng cáo';}else{echo 'Cập nhật quảng cáo: ' . $title;}?></td>
                        </tr>
                    </table>
                    <div class="menu" name="content_menu">
                        <ul>
                            <li name="mn_content_base" class="active"><a href="javascript:;" onclick="show_content_info($(this));" funct_name="hide_image_upload_fast" funct_param="">Thông tin cơ bản</a></li>
                            <li name="mn_content_body"><a onclick="show_content_info($(this));" funct_name="show_image_upload_fast" funct_param="">Ảnh slide</a></li>
                            <li name="mn_content_body"><a href="javascript:;" onclick="show_content_info($(this));" funct_name="hide_image_upload_fast" funct_param="">Khoảng cách</a></li>
                            <li name="mn_content_seo"><a href="javascript:;" onclick="show_content_info($(this));" funct_name="hide_image_upload_fast" funct_param="">Chuyên mục hiển thị</a></li>
                        </ul>
                    </div>
                    <div class="tab_content_info">
                        <table cellpadding="5" cellspacing="0" class="table_add">
							
                            <tr>
                                <td>Tên quảng cáo <font color="#ff0000">*</font></td>
                                <td colspan="3">
                                    <input type="text" name="fTitle" style="width:450px;" value="<?php echo $title;?>" />
                                    <input type="hidden" value="<?php echo $id;?>" name="fID" />
                                </td>
                            </tr>
                            <tr>
                                <td valign="top">Mô tả</td>
                                <td colspan="3">
                                    <textarea name="fDescription" style="width:550px;height:16px;"><?php echo $description;?></textarea>
                                </td>
                            </tr>
                            <tr>
                                <td valign="top" style="padding-top: 6px;">Đường dẫn file <font color="#ff0000">*</font><br>(Hoặc mã HTML)</td>
                                <td colspan="3">
                                    <textarea name="fFile_url" style="width:485px;height:80px;"><?php echo $file_url;?></textarea>
                                    <?php 
                                        if($file_url!='' && $type==1){
                                            echo '<a rel="tooltip" style="vertical-align:top;"><img style="vertical-align:text-top;" border="0" src="'.$base_folder.'admincp/media/picture-icon.png"></a>';
                                            echo '<div class="hidden"><div class="image"><img src="'.image_process_http($file_url).'"></div></div>';
                                        };
                                    ?>
                                    <div class="fileupload_container" style="float:right;">
                                        <input type="button" value="Browse..." style="height:21px;font-size:11px;margin-left:5px;" onclick="choose_file_upload_fast(5000,'fFile_url','');" >
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>Độ rộng</td>
                                <td><input type="text" value="<?php echo $width;?>" name="fWidth" style="width:100px;text-align:right;" onblur="if(this.value=='') this.value='0'" onfocus="if(this.value=='0') this.value=''" /> px</td>
                                <td>Độ cao</td>
                                <td><input type="text" value="<?php echo $height;?>" name="fHeight" style="width:100px;text-align:right;" onblur="if(this.value=='') this.value='0'" onfocus="if(this.value=='0') this.value=''" /> px</td>
                            </tr>
                            <tr>
                                <td>Thứ tự hiển thị</td>
                                <td colspan="3"><input type="text" value="<?php echo $ordering;?>" name="fOrdering" style="width:50px;text-align:right;" onblur="if(this.value=='') this.value='0'" onfocus="if(this.value=='0') this.value=''" /></td>
                            </tr>
                            <tr>
                                <td>Loại hiển thị</td>
                                <td colspan="3">
                                    <input type="radio" name="fType"<?php if($type==1){echo ' checked="checked"';}?> value="1" id="fType1" /> <label for="fType1">Ảnh</label>
                                    <input type="radio" name="fType"<?php if($type==2){echo ' checked="checked"';}?> value="2" id="fType2" /> <label for="fType2">Flash</label>
                                    <input type="radio" name="fType"<?php if($type==3){echo ' checked="checked"';}?> value="3" id="fType3" /> <label for="fType3">Code</label>
                                </td>
                            </tr>
                            <tr>
                                <td>Mở trang</td>
                                <td>
                                    <select name="fTarget" style="margin: 0;">
                                        <option value="_self"<?php if($target=='_self'){echo ' selected="selected"';}?>>Mở trong trang hiện tại</option>
                                        <option value="_blank"<?php if($target=='_blank'){echo ' selected="selected"';}?>>Bật cửa sổ mới</option>
                                    </select>
                                </td>
                                <td>Vị trí</td>
                                <td>
                                    <select name="fPosition" style="margin: 0;">
                                        <option value="1"<?php if($position==1){echo ' selected="selected"';}?>>Top banner</option>
                                        <option value="2"<?php if($position==2){echo ' selected="selected"';}?>>Right banner</option>
                                        <option value="5"<?php if($position==5){echo ' selected="selected"';}?>>Extra left</option>
                                        <option value="6"<?php if($position==6){echo ' selected="selected"';}?>>Extra right</option>
										<option value="3"<?php if($position==3){echo ' selected="selected"';}?>>Left banner</option>
										<option value="10"<?php if($position==10){echo ' selected="selected"';}?>>Center banner</option>
										<!--
                                        
                                        <option value="9"<?php //if($position==9){echo ' selected="selected"';}?>>Below hotnews</option>
                                        <option value="7"<?php //if($position==7){echo ' selected="selected"';}?>>Middle banner</option>
                                        <option value="12"<?php //if($position==12){echo ' selected="selected"';}?>>Background banner</option>
                                        <option value="8"<?php //if($position==8){echo ' selected="selected"';}?>>Footer</option>
                                        <option value="4"<?php //if($position==4){echo ' selected="selected"';}?>>Video Ballon (260x230)</option>
										-->
                                    </select>
                                </td>
                            </tr>
                            <tr>
                                <td>Hyper link</td>
                                <td colspan="3">
                                    <input type="text" value="<?php echo $hyperlink;?>" name="fHyperlink" style="width:550px;" />
                                </td>
                            </tr>
                            <tr style="background:#ececec;">
                                <td>Hết hạn</td>
                                <td colspan="3">
                                    <input style="float:left;" name="fExpire"<?php if($expire==1){echo ' checked="checked"';}?> type="checkbox" onclick="if(this.checked==true){$(this).parent().find('span').show();}else{$(this).parent().find('span').hide();}" />
                                    <span style="float:left;margin-left:10px;<?php if($expire==0){echo 'display:none;';}?>">
                                        Ngày hết hạn
                                        <input type="text" id="expire_time" name="fExpire_time" value="<?php show_expire_time($expire_time);?>" onclick="popUpCalendar(this,document.getElementById('expire_time'), 'dd/mm/yyyy', fnSetDate);" style="width:80px;text-align:right;position:relative;" readonly="readonly" autocomlete="off" /> <font style="font-size:11px;color:#555555;">(Mặc định là 1 tháng)</font>
                                    </span>
                                </td>
                            </tr>
                            <tr>
                                <td>Kích hoạt</td>
                                <td colspan="3">
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
                                <td colspan="4">
                                    <?php if($id!=0){echo 'Tạo lúc: ' . format_full_time($GLOBALS["create_time"],'HH:mm DD/MM/YYYY');}?>
                            </tr>
                        </table>
                    </div>
                    <div class="tab_content_info" style="display:none;padding-top:250px;height:400px;">
                        <table cellpadding="5" cellspacing="0" class="table_add">
                            <tr>
                                <td>
                                    <textarea name="fImage_list" default="" reset="true" style="width:706px;height:200px;display:none;"><?php echo $image_list;?></textarea>
                                </td>
                            </tr>
                        </table>
                    </div>
                    <div class="tab_content_info" style="display:none;">
                        <table cellpadding="5" cellspacing="0" class="table_add">
                            <tr style="background:#ececec;">
                                <td colspan="4" width="500" align="center">
                                    <div style="display:block;position:relative;width:150px;height:80px;padding:30px 70px;">
                                        <div style="width:150px;height:80px;border:1px solid #1B99CC;background:#ffffff;text-align:center;display:table-cell;vertical-align:middle;">
                                            Quảng cáo của bạn
                                        </div>
                                        <div style="position:absolute;top:0;left:120px;">
                                            <input type="text" value="<?php echo $padding_vertical_top;?>" name="fPadding_vertical_top" style="width:50px;text-align:center;" onblur="if(this.value=='') this.value='0'" onfocus="if(this.value=='0') this.value=''" />
                                        </div>
                                        <div style="position:absolute;bottom:0;left:120px;">
                                            <input type="text" value="<?php echo $padding_vertical_bottom;?>" name="fPadding_vertical_bottom" style="width:50px;text-align:center;" onblur="if(this.value=='') this.value='0'" onfocus="if(this.value=='0') this.value=''" />
                                        </div>
                                        <div style="position:absolute;top:60px;left:0;">
                                            <input type="text" value="<?php echo $padding_horizontal_left;?>" name="fPadding_horizontal_left" style="width:50px;text-align:center;" onblur="if(this.value=='') this.value='0'" onfocus="if(this.value=='0') this.value=''" />
                                        </div>
                                        <div style="position:absolute;top:60px;right:0;">
                                            <input type="text" value="<?php echo $padding_horizontal_right;?>" name="fPadding_horizontal_right" style="width:50px;text-align:center;" onblur="if(this.value=='') this.value='0'" onfocus="if(this.value=='0') this.value=''" />
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        </table>
                    </div>
                    <div class="tab_content_info" style="display:none;">
                        <table cellpadding="5" cellspacing="0" class="table_add" id="category_adv_add">
                            <tr>
                                <td width="120">Hiển thị ở trang chủ</td>
                                <td colspan="3">
                                    <span class="check_box_style1" state="<?php if($showinhome==1){echo 'on';}else{echo 'off';}?>">
                                        <span class="<?php if($showinhome==1){echo 'check_box_on1';}else{echo 'check_box_off1';}?>">
                                            <span class="check_box_on"></span>
                                            <span class="check_box_bar"></span>
                                            <input type="checkbox" name="fShowinhome"<?php if($showinhome==1){echo ' checked="checked"';}?> />
                                        </span>
                                    </span>
                                </td>
                            </tr>
                            <tr>
                                <td width="120">Hiển tất cả các trang</td>
                                <td colspan="3">
                                    <span class="check_box_style1" state="<?php if($showallpage==1){echo 'on';}else{echo 'off';}?>">
                                        <span class="<?php if($showallpage==1){echo 'check_box_on1';}else{echo 'check_box_off1';}?>">
                                            <span class="check_box_on"></span>
                                            <span class="check_box_bar"></span>
                                            <input type="checkbox" name="fShowallpage"<?php if($showallpage==1){echo ' checked="checked"';}?> />
                                        </span>
                                    </span>
                                </td>
                            </tr>
                            <tr style="display:none;">
                                <td>Ngôn ngữ</td>
                                <td colspan="3"><?php show_language_list($GLOBALS["languageid"]);?></td>
                            </tr>
                            <tr>
                                <td colspan="4">
                                    <div style="float:left;">
                                        Chuyên mục đang chọn
                                    </div>
                                    <div style="float:left;margin-left:10px;" id="current_selected"></div>
                                </td>
                            </tr>
                            <tr>
                                <td colspan="4">
                                    <input type="hidden" name="fCatalog_show" value="<?php echo $GLOBALS["catalog_show"];?>">
                                    <input type="hidden" name="fCatalog_show_number" value="<?php echo $GLOBALS["catalog_show_number"];?>">
                                    <input type="hidden" value="0" id="current_select_value">
                                    <?php echo show_content_group(0);?>
                                    <div style="float:left;width:100%;margin:10px 0;">
                                        <span style="float:left;margin:1px 2px;">
                                            Thứ tự <input type="text" value="<?php echo $GLOBALS["catalog_show_number"];?>" name="fCatalog_show_ordering" onfocus="if(this.value=='0') this.value=''" onblur="if(this.value=='') this.value='0'" style="width:50px;">
                                        </span>
                                        <span style="float:left;margin-left:10px;">
                                            <a href="javascript:;" onclick="add_adv_category();"><img style="height:22px;" src="<?php echo $GLOBALS["base_folder"];?>admincp/media/add.png"></a>
                                        </span>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td colspan="4">
                                    <div style="float:left;width:100%;" id="catalog_show_list">
                                        <?php echo process_catalog_show($GLOBALS["catalog_show"]);?>
                                    </div>
                                </td>
                            </tr>
                        </table>
                    </div>
                    <div id="content_button" style="width:670px;">
                        <button type="submit" class="button_style1"><span><?php if($id==0){echo 'Tạo mới';}else{echo 'Cập nhật';}?></span></button>
                        <button class="button_style1" onclick="return cancel_process('#adv');" style="margin-left:5px;"><span>Hủy</span></button>
                    </div>
                    
                </form>
        </div>
    </div>
    <?php include($_SERVER['DOCUMENT_ROOT'] . $base_folder . "admincp/modules/other_info.php");?>
</div>