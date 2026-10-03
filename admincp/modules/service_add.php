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
    $id = 0;$create_time = 0;$company = '';$fullname = '';$phone = '';$website = '';$email = '';$address = '';$made = '';$title = '';$content = '';$price = '';$ip_address='';$user_agent = '';$status = 0;
    $userid = 0;
    if(isset($_GET["id"])){
        $id = $_GET["id"];
        get_content_info($id);
    }
    function get_content_info($id){
        $query = "select * from service_require where id = $id";
        $result= mysql_query($query,$GLOBALS["con"]);
        if(mysql_num_rows($result) > 0){
            $row = mysql_fetch_array($result);
            $GLOBALS['create_time'] = $row['create_time'];$GLOBALS["company"] = $row['company'];$GLOBALS["fullname"] = $row['fullname'];
            $GLOBALS["phone"] = $row['phone'];$GLOBALS["email"] = $row['email'];$GLOBALS["price"] = $row['price'];$GLOBALS["made"] = $row['made'];$GLOBALS["website"] = $row['website'];
            $GLOBALS["address"] = $row['address'];$GLOBALS["title"] = $row['title'];
            $GLOBALS["content"] = $row['content'];$GLOBALS["status"] = $row['status'];$GLOBALS["ip_address"] = $row['ip_address'];$GLOBALS["user_agent"] = $row['user_agent'];
            mysql_free_result($result);  
            return true;
        }
        else{
            return false;
        }
    }
?>
<?php include($_SERVER['DOCUMENT_ROOT'] . $base_folder . "admincp/modules/content_left.php");?>
<style type="text/css">
    #order_table{border-collapse:collapse;color:#333333;}
    #order_table td{border:1px solid #DDDDDD;}
</style>
<div id="content_right">
    <div class="content">
        <div class="form_add" id="form_add">
                <form action="<?php echo $base_folder;?>admincp/modules/adv_insert.php" onsubmit="return frmProcess_before_submit()" name="frmProcess" target="processing_target" method="POST">
                    <iframe name="processing_target" src="#" style="width:0;height:0;border:0px;display:none;"></iframe>
                    <table cellpadding="5" cellspacing="0" width="600" class="table_add">
                        <tr>
                            <td colspan="4" align="center" class="function_name"><?php if($id==0){echo 'Tạo mới';}else{echo 'Xem yêu cầu của: ' . $fullname;}?></td>
                        </tr>
                    </table>
                    <div class="menu" name="content_menu">
                        <ul>
                            <li name="mn_content_base" class="active"><a href="javascript:;" onclick="show_content_info($(this));">Thông tin cơ bản</a></li>
                        </ul>
                    </div>
                    <div class="tab_content_info">
                        <table cellpadding="8" cellspacing="0" class="table_add" id="order_table">
                            <tr>
                                <td><b>Tên công ty</b></td>
                                <td colspan="3">
                                    <span style="float:left;width:500px;"><?php echo $company;?></span>
                                </td>
                            </tr>
                            <tr>
                                <td><b>Họ tên người liên hệ</b></td>
                                <td colspan="3">
                                    <span style="float:left;width:500px;"><?php echo $fullname;?></span>
                                </td>
                            </tr>
                            <tr>
                                <td><b>Thời gian gửi</b></td>
                                <td colspan="3">
                                    <?php echo format_full_time($GLOBALS["create_time"],'HH:mm DD/MM/YYYY');?>
                                </td>
                            </tr>
                            <tr>
                                <td><b>Gửi từ địa chỉ IP</b></td>
                                <td colspan="3">
                                    <?php echo $ip_address;?>
                                </td>
                            </tr>
                            <tr>
                                <td><b>Điện thoại liên hệ</b></td>
                                <td colspan="3">
                                    <?php echo $phone;?>
                                </td>
                            </tr>
                            <tr>
                                <td><b>Website</b></td>
                                <td colspan="3">
                                    <?php echo $website;?>
                                </td>
                            </tr>
                            <tr>
                                <td><b>Email</b></td>
                                <td colspan="3">
                                    <a href="mailto:<?php echo $email;?>"><?php echo $email;?></a>
                                </td>
                            </tr>
                            <tr>
                                <td><b>Địa chỉ</b></td>
                                <td colspan="3">
                                    <?php echo $address;?>
                                </td>
                            </tr>
                            <tr>
                                <td valign="top"><b>Tên sản phẩm, dịch vụ</b></td>
                                <td colspan="3">
                                    <?php echo $title;?>
                                </td>
                            </tr>
                            <tr>
                                <td valign="top"><b>Xuất xứ</b></td>
                                <td colspan="3">
                                    <?php echo $made;?>
                                </td>
                            </tr>
                            <tr>
                                <td valign="top"><b>Giá đề xuất</b></td>
                                <td colspan="3">
                                    <?php echo $price;?> VNĐ
                                </td>
                            </tr>
                            <tr>
                                <td valign="top"><b>Đặc điểm công dụng</b></td>
                                <td colspan="3">
                                    <?php echo $content;?>
                                </td>
                            </tr>
                        </table>
                    </div>
                    <div id="content_button" style="width:670px;">
                        <button class="button_style1" onclick="return cancel_process('#service');" style="margin-left:5px;"><span>Quay lại</span></button>
                    </div>
                    
                </form>
        </div>
    </div>
    <?php include($_SERVER['DOCUMENT_ROOT'] . $base_folder . "admincp/modules/other_info.php");?>
</div>