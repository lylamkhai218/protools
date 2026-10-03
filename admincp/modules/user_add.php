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
    include($path . $base_folder . "/admincp/modules/mdl_global_admincp.php");
    if(isset($_COOKIE[$GLOBALS['rootuser']])==false || isset($_COOKIE[$GLOBALS['rootpass']])==false){
        exit;
    }
    $id = 0;$username = "";$creator = 0;
    $type = 0;
    $create_time = 0;$update_time = 0;
    $last_login = 0;$last_login_ip = '';
    $news_number = 0;$approve_number = 0;$publish_number = 0;
    $status = 1;
    // User info
    $firstname = '';$lastname = '';
    $fullname = '';$showname = '';
    $email = '';$address = '';$phone = '';$mobile = $avatar = '';
    $gender = 0;$day_of_birth = 0;
    $yahoo = '';$skype = '';$note = '';$fax = '';
    if(isset($_GET["id"])){
        $id = $_GET["id"];
        get_user_info($id);
    }
    function get_user_info($id) {
        $query ="select * from user,user_info where user.id = user_info.id and user.id = $id";
        $result= mysql_query($query,$GLOBALS["con"]);
        if($result==false||mysql_num_rows($result)<=0){
            return false;
        }
        else{
            $row = mysql_fetch_array($result);
            $GLOBALS["creator"] = $row['creator'];$GLOBALS["username"] = $row['username'];
            $GLOBALS["type"] = $row['type'];
            $GLOBALS["create_time"] = $row['create_time'];$GLOBALS["update_time"] = $row['update_time'];
            $GLOBALS["last_login"] = $row['last_login'];$GLOBALS["last_login_ip"] = $row['last_login_ip'];
            $GLOBALS["news_number"] = $row['news_number'];$GLOBALS["approve_number"] = $row['approve_number'];$GLOBALS["publish_number"] = $row['publish_number'];
            $GLOBALS["status"] = $row['status'];
            $GLOBALS["firstname"] = $row['firstname'];$GLOBALS["lastname"] = $row['lastname'];
            $GLOBALS["fullname"] = $row['fullname'];$GLOBALS["showname"] = $row['showname'];
            $GLOBALS["email"] = $row['email'];$GLOBALS["address"] = $row['address'];$GLOBALS["phone"] = $row['phone'];$GLOBALS["mobile"] = $row['mobile'];$GLOBALS["avatar"] = $row['avatar'];
            $GLOBALS["gender"] = $row['gender'];$GLOBALS["day_of_birth"] = $row['day_of_birth'];
            $GLOBALS["yahoo"] = $row['yahoo'];$GLOBALS["skype"] = $row['skype'];$GLOBALS["fax"] = $row['fax'];$GLOBALS["note"] = $row['note'];
            return true;
        }
    }
    function get_permit_list_of_group($groupid,$userid,$i){
        $query = "select * from permit where groupid = $groupid order by id ASC";
        if($userid!=0){
            $query ="select * from permit,user_permit where permit.id = user_permit.permitid and user_permit.userid = $userid and permit.groupid = $groupid and permit.status = 1 order by permitid ASC";
        }
        $result= mysql_query($query,$GLOBALS["con"]);
        if($result==false||mysql_num_rows($result)<=0){
            return false;
        }
        else{
            $j = 1;
            echo '<table cellpadding="5" cellspacing="0" style="border-collapse:collapse;">';
            while($row = mysql_fetch_array($result)){
                $value = 0;
                if($userid!=0){
                    $value = $row['value'];
                }
                echo '<tr style="border:1px solid #cccccc;">';
                echo '<td width="250"><u>' . $i . '.' . $j .'</u>. ' . $row['name'].': </td>';
                echo '<td>';
                echo '<span class="check_box_style1" state="'.show_value_by_compare($value,1,'on','off').'">
                            <span class="'.show_value_by_compare($value,1,'check_box_on1','check_box_off1').'">
                                <span class="check_box_on"></span>
                                <span class="check_box_bar"></span>
                                <input type="checkbox" name="'.md5($row['id']).'"'.show_value_by_compare($value,1,' checked="checked"','').' />
                            </span>
                        </span>';
                echo '<td>';
                echo '<tr>';
                $j = $j + 1;
            }
            echo '</table>';
            return true;
        }
    }
    function get_permit_group($userid) {
        $query ="select * from permit_group";
        $result= mysql_query($query,$GLOBALS["con"]);
        if($result==false||mysql_num_rows($result)<=0){
            return false;
        }
        else{
            $i = 1;
            echo '<table cellpadding="5" cellspacing="0" class="table_add">';
            while($row = mysql_fetch_array($result)){
                echo '<tr>';
                echo '<td><b>' . $i . '. ' .$row['name'].'</b></td>';
                echo '<td>';
                get_permit_list_of_group($row['id'],$userid,$i);
                echo '<td>';
                echo '<tr>';
                $i = $i + 1;
            }
            echo '</table>';
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
            <form action="<?php echo $base_folder;?>admincp/modules/user_insert.php" onsubmit="return frmProcess_before_submit()" name="frmProcess" target="processing_target" method="POST">
                <iframe name="processing_target" src="#" style="width:0;height:0;border:0px;display:none;"></iframe>
                <table cellpadding="5" cellspacing="0" width="600" class="table_add">
                    <tr>
                        <td colspan="4" align="center" class="function_name"><?php if($id==0){echo 'Tạo mới thành viên';}else{echo 'Cập nhật thành viên: ' . $username;}?></td>
                    </tr>
                </table>
                <div class="menu" name="content_menu">
                    <ul>
                        <li class="active"><a href="javascript:;" onclick="show_content_info($(this));">Thông tin cơ bản</a></li>
                        <li><a href="javascript:;" onclick="show_content_info($(this));">Phân quyền</a></li>
                        <li><a href="javascript:;" onclick="show_content_info($(this));">Thông tin liên hệ</a></li>
                        <?php if($id!=0){echo '<li><a href="javascript:;" onclick="show_content_info($(this));">Thông tin khác</a></li>';}?>
                    </ul>
                </div>
                <div class="tab_content_info">
                    <table cellpadding="5" cellspacing="0" class="table_add">
                        <tr>
                            <td><b>Tên truy cập <font color="#ff0000">*</font></b></td>
                            <td colspan="3">
                                <input type="text"<?php if($id!=0){echo ' readonly="readonly"';}?> name="fUsername" style="width:250px;font-weight:bold;" value="<?php echo $username;?>" autocomplete="off" />
                                <input type="hidden" value="<?php echo $id;?>" name="fID" />
                            </td>
                        </tr>
                        <tr<?php echo show_value_by_compare($id,0,' style="display:none;"','')?>>
                            <td>Đổi mật khẩu</td>
                            <td>
                                <span class="check_box_style1" state="off" onclick="change_passsword($(this));">
                                    <span class="check_box_off1">
                                        <span class="check_box_on"></span>
                                        <span class="check_box_bar"></span>
                                        <input type="checkbox" name="fChangepassword" />
                                    </span>
                                </span>
                            </td>
                        </tr>
                        <tr id="change_password_container" style="background:#f3f3f3;<?php echo show_value_by_compare($id,0,'',' display:none;')?>">
                            <td>Mật khẩu <font color="#ff0000">*</font></td>
                            <td>
                                <input type="password" name="fPassword" style="width:200px;" value="" autocomlete="off" />
                            </td>
                            <td>Nhập lại mật khẩu <font color="#ff0000">*</font></td>
                            <td>
                                <input type="password" name="fRepassword" style="width:200px;" value="" autocomlete="off" />
                            </td>
                        </tr>
                        <tr>
                            <td>Họ và tên đệm</td>
                            <td>
                                <input type="text" name="fFirstname" style="width:160px;" value="<?php echo $firstname;?>" autocomlete="off" require="true" compare_require="" name_require="Họ và tên đệm" />
                            </td>
                            <td>Tên</td>
                            <td>
                                <input type="text" name="fLastname" style="width:160px;" value="<?php echo $lastname;?>" autocomlete="off" require="true" compare_require="" name_require="Tên" />
                            </td>
                        </tr>
                        <tr>
                            <td valign="top">Tên hiển thị <font color="#ff0000">*</font></td>
                            <td colspan="3">
                                <input type="text" name="fShowname" style="width:300px;" value="<?php echo $showname;?>" autocomlete="off" require="true" compare_require="" name_require="Tên hiển thị" />
                            </td>
                        </tr>
                        <tr>
                            <td valign="top">Họ và tên</td>
                            <td colspan="3">
                                <input type="text" name="fFullname" style="width:300px;" value="<?php echo $fullname;?>" autocomlete="off" require="true" compare_require="" name_require="Họ và tên" />
                            </td>
                        </tr>
                        <tr>
                            <td>Ảnh đại diện</td>
                            <td colspan="3">
                                <input type="text" value="<?php echo $avatar;?>" name="fAvatar" style="width:450px;" />
                                <div class="fileupload_container" style="float:right;">
                                    <input type="button" value="Browse..." style="height:20px;font-size:11px;" onclick="choose_file_upload_fast(2000,'fAvatar','');" >
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>Giới tính</td>
                            <td colspan="3">
                                <select name="fGender" style="margin: 0;">
                                    <option<?php if($gender==0){echo ' selected="selected"';}?> value="0">Chưa chọn</option>
                                    <option<?php if($gender==1){echo ' selected="selected"';}?> value="1">Nam</option>
                                    <option<?php if($gender==2){echo ' selected="selected"';}?> value="2">Nữ</option>
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <td>Ngày sinh</td>
                            <td colspan="3">
                                <input type="text" id="day_of_birth" name="fDay_of_birth" value="<?php echo format_full_time($day_of_birth,'DD/MM/YYYY');?>" onclick="popUpCalendar(this,document.getElementById('day_of_birth'), 'dd/mm/yyyy', fnSetDate);" style="width:80px;text-align:right;position:relative;" readonly="readonly" autocomlete="off" /> <font style="font-size:11px;color:#555555;">(DD/MM/YYYY)</font>
                            </td>
                        </tr>
                        <tr>
                            <td>Phân loại</td>
                            <td colspan="3">
                                <select name="fType" style="margin: 0;">
                                    <option<?php if($type==0){echo ' selected="selected"';}?> value="0">Member</option>
                                    <option<?php if($type==1){echo ' selected="selected"';}?> value="1">Admin</option>
                                    <option<?php if($type==2){echo ' selected="selected"';}?> value="2">Mod</option>
                                </select>
                                <font style="font-size:11px;color:#555555;">(Chỉ có Admin và Mod mới có quyền truy cập vào Trang quản trị - Admincp)</font>
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
                            <td valign="top">Ghi chú</td>
                            <td colspan="3">
                                <textarea name="fNote" style="width:550px;height:80px;"><?php echo $note;?></textarea>
                            </td>
                        </tr>
                    </table>
                </div>
                <div class="tab_content_info" style="display:none;">
                    <?php get_permit_group($id);?>
                </div>
                <div class="tab_content_info" style="display:none;">
                    <table cellpadding="5" cellspacing="0" class="table_add">
                        <tr>
                            <td>Điện thoại cố định</td>
                            <td colspan="3"><input type="text" value="<?php echo $phone;?>" name="fPhone" style="width:250px;" /></td>
                        </tr>
                        <tr>
                            <td>Điện thoại di động</td>
                            <td colspan="3"><input type="text" value="<?php echo $mobile;?>" name="fMobile" style="width:250px;" /></td>
                        </tr>
                        <tr>
                            <td>Fax</td>
                            <td colspan="3"><input type="text" value="<?php echo $fax;?>" name="fFax" style="width:250px;" /></td>
                        </tr>
                        <tr>
                            <td>Email</td>
                            <td colspan="3"><input type="text" value="<?php echo $email;?>" name="fEmail" style="width:250px;" /></td>
                        </tr>
                        <tr>
                            <td>Yahoo</td>
                            <td colspan="3"><input type="text" value="<?php echo $yahoo;?>" name="fYahoo" style="width:250px;" /></td>
                        </tr>
                        <tr>
                            <td>Skype</td>
                            <td colspan="3"><input type="text" value="<?php echo $skype;?>" name="fSkype" style="width:250px;" /></td>
                        </tr>
                        <tr>
                            <td valign="top">Địa chỉ</td>
                            <td colspan="3">
                                <textarea name="fAddress" style="width:530px;height:100px;"><?php echo $address;?></textarea>
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
                                    <td colspan="3">'.get_colum_of_table_from_db('user_info','showname','id',$creator).'</td>
                                </tr>
                                <tr>
                                    <td valign="top">Ngày tạo : </td>
                                    <td colspan="3">'.format_full_time($create_time,'HH:mm DD/MM/YYYY').'</td>
                                </tr>
                                <tr>
                                    <td valign="top">Cập nhật lần cuối : </td>
                                    <td colspan="3">'.show_value_by_compare($update_time,0,'Chưa từng cập nhật!',format_full_time($update_time,'HH:mm DD/MM/YYYY')).'</td>
                                </tr>
                                <tr>
                                    <td valign="top">Lần truy cập cuối : </td>
                                    <td colspan="3">'.show_value_by_compare($last_login,0,'Chưa từng truy cập!',format_full_time($last_login,'HH:mm DD/MM/YYYY').' tại IP: ' . $last_login_ip).'</td>
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
                    <?php 
                        if($id==0){
                            echo '<button type="submit" class="button_style1"><span>Tạo mới</span></button>';
                        }
                        else{
                            echo '<span style="float:left;margin-left:10px;">';
                            if($status==1){
                                echo '<button type="button" class="button_style2" onclick="content_process(\'admincp/modules/user_process.php?id='.$id.'&rq=lock\',true);" style="margin-left:5px;"><span><a class="down_article">&nbsp;</a>Khoá thành viên</span></button>';
                            }
                            else{
                                echo '<button type="button" class="button_style1" onclick="content_process(\'admincp/modules/user_process.php?id='.$id.'&rq=active\',true);"><span><a class="publish_article">&nbsp;</a>Kích hoạt</span></button>';
                                echo '<button type="button" class="button_style4" onclick="content_process(\'admincp/modules/user_process.php?id='.$id.'&rq=delete\',false);" style="margin-left:5px;"><span><a class="delete_article">&nbsp;</a>Xoá thành viên</span></button>';
                            }
                            echo '</span>';
                            echo '<button type="submit" class="button_style1"><span>Cập nhật</span></button>';
                        }
                    ?>
                    <button class="button_style1" onclick="return cancel_process('#user');" style="margin-left:5px;"><span>Hủy</span></button>
                </div>
                
            </form>
        </div>
    </div>
    <?php include($_SERVER['DOCUMENT_ROOT'] . $base_folder . "admincp/modules/other_info.php");?>
</div>