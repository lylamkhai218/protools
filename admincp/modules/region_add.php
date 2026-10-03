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
    $id = 0;$region_parent=0;$parentid = 0;
    $region_name = '';$region_alias = '';$region_description = '';
    $meta_title = '';$meta_description = '';$meta_keywords = '';
    $hyper_link = '';$image = '';$icon = '';
    $news_number = 0;
    $showinmenu = 0;$orderingmenu = 0;
    $showinhome = 0;$orderinghome = 0;
    $showinmenubottom = 0;$orderingmenubottom = 0;
    $status = 1;$languageid = 1;
    $news_limit = $GLOBALS["meta_news_in_catalog"];
    //region_info
    $creator = 0;$create_time = 0;
    $update_time = 0;
    $news_number = 0;
    $approve_number = 0;$publish_number = 0;
    // Global config
    $content_group = 0;
    $hyper_tag = 'region';
    $table_query = 'region';
    if(isset($_GET["id"])){
        $id = $_GET["id"];
        get_content_info($id);
    }
    function get_content_info($id) {
        $query ="select region_parent,region_name,region_alias,meta_title,region_description,meta_description,meta_keywords,hyper_link,showinmenu,orderingmenu,showinhome,orderinghome,showinmenubottom,orderingmenubottom,status,languageid,news_limit,image,icon
                    ,region_info.creator,region_info.create_time,region_info.update_time,region_info.news_number,region_info.approve_number,region_info.publish_number 
                     from region,region_info 
                     where region.id = region_info.id and region.id = $id";
        $result = mysql_query($query,$GLOBALS["con"]);
        if($result==false||mysql_num_rows($result)<=0){
            return false;
        }
        else{
            while($row = mysql_fetch_array($result))
            {
                //region
                $GLOBALS["region_parent"] = $row['region_parent'];
                $GLOBALS["parentid"] = $row['region_parent'];
                $GLOBALS["region_name"] = $row['region_name'];$GLOBALS["region_alias"] = $row['region_alias'];$GLOBALS["region_description"] = $row['region_description'];
                $GLOBALS["meta_title"] = $row['meta_title'];$GLOBALS["meta_description"] = $row['meta_description'];$GLOBALS["meta_keywords"] = $row['meta_keywords'];
                $GLOBALS["hyper_link"] = $row['hyper_link'];
                $GLOBALS["news_number"] = $row['news_number'];
                $GLOBALS["showinmenu"] = $row['showinmenu'];$GLOBALS["orderingmenu"] = $row['orderingmenu'];
                $GLOBALS["showinhome"] = $row['showinhome'];$GLOBALS["orderinghome"] = $row['orderinghome'];
                $GLOBALS["showinmenubottom"] = $row['showinmenubottom'];$GLOBALS["orderingmenubottom"] = $row['orderingmenubottom'];
                $GLOBALS["status"] = $row['status'];$GLOBALS["languageid"] = $row['languageid'];$GLOBALS["news_limit"] = $row['news_limit'];
                $GLOBALS["image"] = $row['image'];$GLOBALS["icon"] = $row['icon'];
                //region_info
                $GLOBALS["creator"] = $row['creator'];$GLOBALS["create_time"] = $row['create_time'];
                $GLOBALS["update_time"] = $row['update_time'];
                $GLOBALS["news_number"] = $row['news_number'];$GLOBALS["approve_number"] = $row['approve_number'];$GLOBALS["publish_number"] = $row['publish_number'];
            }
            return true;
        }
    }
    function show_directory_post($id){
        $table_query = $GLOBALS["table_query"];
        $content_group = $GLOBALS["content_group"];
        if($id != 0){
            $content_group = 1;
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
                $strshow = $strshow . '<div id="category_' . $k . '" class="category_level"><select onclick="change_product_catalogs(this.value,' . $k . ',0,0);" multiple="multiple">' . $catalog_level_array[$j] . '</select></div>'; // get list parent
                $k = $k + 1;
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
        $query = "select region_parent from $table_query where id = $id";
        $result = mysql_query($query,$GLOBALS["con"]);
        if($result==false||mysql_num_rows($result)<=0){
            return "";
        }
        else{
            $row = mysql_fetch_array($result);
            return $row[0];
        }
    }
    function check_finish($id,$table_query){
        $query = "select id from $table_query where region_parent = $id order by region_name ASC";
        $result = mysql_query($query,$GLOBALS["con"]);
        if($result==false||mysql_num_rows($result)<=0){
            return "true";
        }
        else{
            return "false";
        }
    }
    function get_catalog_option($catid,$parentid,$content_group,$table_query,$last){
        $query = "select id,region_name from $table_query where id <> '".$GLOBALS["id"]."' and region_parent = $parentid and languageid = ".$GLOBALS["languageid"]." order by region_name ASC";
        $result = mysql_query($query,$GLOBALS["con"]);
        if($result==false||mysql_num_rows($result)<=0){
            return '';
        }
        else{
            $strreturn = '';
            while($row = mysql_fetch_array($result)){
                $selected = '';
                if($catid==$row[0]&&$last==false){
                    $selected = ' selected="selected"';
                }
                $strreturn = $strreturn . '<option' . $selected . ' value="' . check_finish($row[0],$table_query) . '_' . $row[0] . '">' . substring($row[1],30) . '</option>';
            }
            return $strreturn;
        }
    }
    function show_content_group($content_group){
        $strreturn = '<div id="category_0" class="category_level category_first">
                            <select class="select_product_category" multiple="multiple" onclick="change_region_add(this.value,0,0,1);">';
        if($content_group==0){
            $strreturn = $strreturn . '<option value="1">Chọn tỉnh</option>';
        }
        else{
            $strreturn = $strreturn . '<option selected="selected" value="1">Chọn tỉnh</option>';
        }
        $strreturn = $strreturn . '</select></div>';
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
        return $strreturn;
    }
    function get_catalog_name_from_id($id,$table_query){
        $query = "select region_name from $table_query where id = $id";
        $result = mysql_query($query,$GLOBALS["con"]);
        if($result==false||mysql_num_rows($result)<=0){
            return "";
        }
        else{
            $row = mysql_fetch_array($result);
            return '<a href="#' . $GLOBALS["hyper_tag"] . '_add_add?id=' . $id . '" onclick="main_menu_click(\'' . $GLOBALS["hyper_tag"] . '_add\',\'mn_' . $GLOBALS["hyper_tag"] . '\',\'#admin_content\',\'' . $GLOBALS["hyper_tag"] . '_add.php?id=' . $id . '\',\'\');">' . $row[0] . '</a>';
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
        echo 'Bạn đang chọn khu vực: ';
        $content_group = $GLOBALS["content_group"];
        //echo '<u>'.get_content_group_name_from_db($content_group) . '</u>';
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
            $directory_return = $directory_return . ' &gt; ';
        }
        echo $directory_return . '<u>' . get_catalog_name_from_id($id,$table_query) . '</u>';
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
?>
<?php include($_SERVER['DOCUMENT_ROOT'] . $base_folder . "admincp/modules/content_left.php");?>
<div id="content_right">
    <div class="content">
        <div class="form_add" id="form_add">
            <form action="<?php echo $base_folder;?>admincp/modules/region_insert.php" onsubmit="return frmProcess_before_submit();" name="frmProcess" target="processing_target" method="POST">
                <iframe name="processing_target" src="#" style="width:0;height:0;border:0px;display:none;"></iframe>
                <table cellpadding="5" cellspacing="0" width="600" class="table_add">
                    <tr>
                        <td colspan="4" align="center" class="function_name"><?php if($id==0){echo 'Tạo mới khu vực';}else{echo 'Cập nhật khu vực: ' . $region_name;}?></td>
                    </tr>
                </table>
                <div class="menu">
                    <ul>
                        <li class="active"><a href="javascript:;" onclick="show_content_info($(this));">Thông tin cơ bản</a></li>
                        <li><a href="javascript:;" onclick="show_content_info($(this));">Giới thiệu khu vực</a></li>
                        <li><a href="javascript:;" onclick="show_content_info($(this));">SEO</a></li>
                        <?php if($id!=0){echo '<li><a href="javascript:;" onclick="show_content_info($(this));">Thông tin khác</a></li>';}?>
                    </ul>
                </div>
                <div class="tab_content_info">
                    <table cellpadding="5" cellspacing="0" class="table_add">
                        <tr>
                            <td>Tên khu vực</td>
                            <td colspan="3">
                                <input type="text" value="<?php echo $region_name;?>" name="fRegion_name" style="width:400px;" autocomlete="off" require="true" compare_require="" name_require="tên khu vực" />
                                <input type="hidden" value="<?php echo $id;?>" name="fID" />
                                <input type="hidden" value="<?php echo $parentid;?>" name="fOld_parentid" />
                                <input type="hidden" value="<?php echo $parentid;?>" name="fParentid" />
                                <input type="hidden" value="<?php echo $content_group;?>" name="fContent_group" />
                                <?php if($id!=0){echo show_link_catalog($id,$region_name,$region_alias,' target="_blank"','Xem','');}?>
                            </td>
                        </tr>
                        <tr<?php if($GLOBALS["meta_multi_language"]!=1){echo ' style="display:none;"';}?>>
                            <td>Ngôn ngữ</td>
                            <td colspan="3"><?php show_language_list($languageid);?></td>
                        </tr>
                        </td>
                        </tr>
                        <?php if($id!=0){echo '<tr><td colspan="4">';show_category_post_input($id,$table_query);echo '</td></tr>';}?>
                        <tr><td colspan="4"><?php show_directory_post($id);?></td></tr>
                        <tr>
                            <td>Hyper link</td>
                            <td colspan="3"><input type="text" value="<?php echo $hyper_link;?>" name="fHyper_link" style="width:500px;" /></td>
                        </tr>
                        <tr>
                            <td>Ảnh đại diện</td>
                            <td colspan="3">
                                <input type="text" value="<?php echo $image;?>" name="fImage" style="width:400px;" />
                                <div class="fileupload_container" style="float:right;">
                                    <input type="button" value="Browse..." style="height:21px;font-size:11px;margin-left:5px;" onclick="choose_file_upload_fast(2000,'fImage','');" >
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>Icon</td>
                            <td colspan="3">
                                <input type="text" value="<?php echo $icon;?>" name="fIcon" style="width:400px;" />
                                <div class="fileupload_container" style="float:right;">
                                    <input type="button" value="Browse..." style="height:21px;font-size:11px;margin-left:5px;" onclick="choose_file_upload_fast(1000,'fIcon','');" >
                                </div>
                            </td>
                        </tr>
                        <tr bgcolor="#ececec">
                            <td><b>Hiện/Ẩn</b></td>
                            <td colspan="3">
                                <table cellpadding="5" cellspacing="0">
                                    <tr>
                                        <td><label for="fShowinmenu"><u>1.</u> Menu chính</label></td>
                                        <td><input id="fShowinmenu" name="fShowinmenu"<?php if($showinmenu==1){echo ' checked="checked"';}?> style="margin:0;padding:0;" type="checkbox" /></td>
                                        <td align="right">Thứ tự</td>
                                        <td><input type="text" name="fOrderingmenu" style="width:50px;height:15px;text-align:right;" value="<?php echo $orderingmenu;?>" onfocus="if(this.value=='<?php echo $orderingmenu;?>') this.value=''" onblur="if(this.value=='') this.value='<?php echo $orderingmenu;?>'" autocomplete="off" /></td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                        <tr>
                            <td align="right">Giới hạn bài xuất hiện</td>
                            <td><input type="text" name="fNews_limit" style="width:50px;height:15px;text-align:right;" value="<?php echo $news_limit;?>" onfocus="if(this.value=='<?php echo $news_limit;?>') this.value=''" onblur="if(this.value=='') this.value='<?php echo $news_limit;?>'" autocomplete="off" /></td>
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
                    </table>
                </div>
                <div class="tab_content_info" style="display:none;">
                   <table cellpadding="5" cellspacing="0" class="table_add">
                        <tr>
                            <td>
                                <textarea name="fRegion_description" editor_format="true" mini_control="true" width="650" height="300" style="width:590px;height:80px;margin-left:10px;"><?php echo $region_description;?></textarea>
                            </td>
                        </tr>
                    </table>
                   
                </div>
                <div class="tab_content_info" style="display:none;">
                    <table cellpadding="5" cellspacing="0" class="table_add">
                        <tr>
                            <td valign="top">Tiêu đề</td>
                            <td colspan="3"><textarea name="fMeta_title" style="width:500px;height:50px;"><?php echo $meta_title;?></textarea></td>
                        </tr>
                        <tr>
                            <td valign="top">Mô tả</td>
                            <td colspan="3"><textarea name="fMeta_description" style="width:500px;height:50px;"><?php echo $meta_description;?></textarea></td>
                        </tr>
                        <tr>
                            <td valign="top">Từ khoá</td>
                            <td colspan="3"><textarea name="fMeta_keywords" style="width:500px;height:50px;"><?php echo $meta_keywords;?></textarea></td>
                        </tr>
                    </table>
                </div>
                <?php 
                    if($id!=0){
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
                                    <td colspan="3">'.show_value_by_compare($update_time,0,'',format_full_time($update_time,'HH:mm DD/MM/YYYY')).'</td>
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
                    <button class="button_style1" type="submit"><span><?php if($id==0){echo 'Thêm';}else{echo 'Cập nhật';}?></span></button>
                    <button class="button_style1" onclick="return cancel_process('#region');" style="margin-left:5px;"><span>Hủy bỏ</span></button>
                </div>
            </form>
        </div>
    <?php include($_SERVER['DOCUMENT_ROOT'] . $base_folder . "admincp/modules/other_info.php");?>
</div>
