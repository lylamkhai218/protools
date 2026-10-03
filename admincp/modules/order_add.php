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
    $create_time = 0;$fullname = '';$phone = '';$email = '';$address = '';$content_list = '';$summary_price = 0;$note = '';$ip_address='';$status = 0;
    $userid = 0;
    if(isset($_GET["id"])){
        $id = $_GET["id"];
        //get_content_info($id);
        $query = "select * from order_list where id = $id";
        $result= mysql_query($query,$GLOBALS["con"]);
        $order_row = array();
        if($result!=false && mysql_num_rows($result) > 0){
            $order_row = mysql_fetch_array($result);
        }
    } 
    
    function get_content_info($id){
        
        $result= mysql_query($query,$GLOBALS["con"]);
        if(mysql_num_rows($result) > 0){
            $row = mysql_fetch_array($result);
            $GLOBALS['create_time'] = $row['create_time'];$GLOBALS["fullname"] = $row['fullname'];
            $GLOBALS["phone"] = $row['phone'];$GLOBALS["email"] = $row['email'];
            $GLOBALS["address"] = $row['address'];$GLOBALS["content_list"] = $row['content_list'];$GLOBALS["summary_price"] = $row['summary_price'];
            $GLOBALS["note"] = $row['note'];$GLOBALS["status"] = $row['status'];$GLOBALS["ip_address"] = $row['ip_address'];
            mysql_free_result($result);  
            return true;
        }
        else{
            return false;
        }
    }
?>
<?php include($_SERVER['DOCUMENT_ROOT'] . $base_folder . "admincp/modules/content_left.php");?>
<div id="content_right">
    <div class="content">
        <div class="form_add" id="form_add">
                <form action="<?php echo $base_folder;?>admincp/modules/adv_insert.php" onsubmit="return frmProcess_before_submit()" name="frmProcess" target="processing_target" method="POST">
                    <iframe name="processing_target" src="#" style="width:0;height:0;border:0px;display:none;"></iframe>
                    <table cellpadding="5" cellspacing="0" width="600" class="table_add">
                        <tr>
                            <td colspan="4" align="center" class="function_name"><?php if($id==0){echo 'Tạo mới';}else{echo 'Xem đơn hàng của khách hàng: ' . $fullname;}?></td>
                        </tr>
                    </table>
                    <div class="menu" name="content_menu">
                        <ul>
                            <li name="mn_content_base" class="active"><a href="javascript:;" onclick="show_content_info($(this));">Thông tin cơ bản</a></li>
                        </ul>
                    </div>
                    <div class="tab_content_info">
                        <style type="text/css">
                            #order_table{border-collapse:collapse;}
                            #order_table td{border:1px solid #CCCCCC;}
                            #order_table p{margin:0;padding:0;}
                        </style>
                        <table cellpadding="5" cellspacing="0" class="table_add" id="order_table">
                            <tr>
                                <td colspan="4" style="text-transform: uppercase;text-align: center;color:#00377A;"><b>Thông tin hệ thống</b></td>
                            </tr>
                            <tr>
                                <td>Thời gian gửi</td>
                                <td colspan="3">
                                    <?php echo format_full_time($order_row["create_time"],'HH:mm DD/MM/YYYY');?>
                                </td>
                            </tr>
                            <tr>
                                <td>Gửi từ địa chỉ IP</td>
                                <td colspan="3">
                                    <?php echo $order_row["ip_address"];?>
                                </td>
                            </tr>
                            <tr>
                                <td colspan="4" style="text-transform: uppercase;text-align: center;color:#00377A;"><b>Thông tin đơn hàng</b></td>
                            </tr>
                            <tr>
                                <td>Mã đơn hàng</td>
                                <td colspan="3">
                                    <?php echo $order_row["order_code"];?>
                                </td>
                            </tr>
                            <tr>
                                <td>Danh sách sản phẩm</td>
                                <td colspan="3">
                                    <?php echo $order_row["content_list"];?>
                                </td>
                            </tr>
                            <tr>
                                <td>Tổng số tiền</td>
                                <td colspan="3">
                                    <?php echo format_number_thousand($order_row["summary_price"]);?> đ
                                </td>
                            </tr>
                            <tr>
                                <td>Hình thức thanh toán đơn hàng</td>
                                <td colspan="3">
                                    <?php 
                                        $typeofpaymentText = 'Thanh toán khi nhận hàng';
                                        if($order_row["typeofpayment"]==1){$typeofpaymentText = 'Thanh toán an toàn qua cổng thanh toán NgânLượng.vn';}
                                        if($order_row["typeofpayment"]==2){$typeofpaymentText = 'Thanh toán tại cửa hàng';}
                                        echo $typeofpaymentText;
                                    ?>
                                </td>
                            </tr>
                            <tr>
                                <td>Tình trạng thanh toán</td>
                                <td colspan="3">
                                    <?php 
                                        $Text = '<font color="#ff0000">Chưa thanh toán</font>';
                                        if($order_row["statusofpayment"]==1){
                                            $Text = '<font color="#1FAB04">';
                                            if($order_row["payment_type"]==1){
                                                $Text .= 'Thanh toán ngay';
                                            }
                                            else{
                                                $Text .= 'Thanh toán tạm giữ';
                                            }
                                            $Text .= ' với Payment ID: '.$order_row["payment_id"];
                                            $Text .= '</font>';
                                        }
                                        else if($order_row["statusofpayment"]==2){
                                            $Text = '<font color="#ff0000">Thanh toán chưa thành công</font>';
                                        }
                                        echo $Text;
                                    ?>
                                </td>
                            </tr>
                            <tr>
                                <td>Lời nhắn</td>
                                <td colspan="3">
                                    <?php echo $order_row["note"];?>
                                </td>
                            </tr>
                            
                            <tr>
                                <td colspan="4" style="text-transform: uppercase;text-align: center;color:#00377A;"><b>Thông tin người đặt hàng</b></td>
                            </tr>
                            <tr>
                                <td>Họ và tên</td>
                                <td colspan="3">
                                    <?php echo $order_row["fullname"];?>
                                </td>
                            </tr>
                            <tr>
                                <td>Điện thoại</td>
                                <td colspan="3">
                                    <?php echo $order_row["phone"];?>
                                </td>
                            </tr>
                            <tr>
                                <td>Email</td>
                                <td colspan="3">
                                    <a href="mailto:<?php echo $order_row["email"];?>"><?php echo $order_row["email"];?></a>
                                </td>
                            </tr>
                            <tr>
                                <td>Địa chỉ</td>
                                <td colspan="3">
                                    <?php echo $order_row["address"];?>
                                </td>
                            </tr>
                            <tr>
                                <td>Tỉnh/Thành phố</td>
                                <td colspan="3">
                                    <?php echo $order_row["regionid"];?>
                                </td>
                            </tr>
                            
                            <tr>
                                <td colspan="4" style="text-transform: uppercase;text-align: center;color:#00377A;"><b>Thông tin người nhận hàng</b></td>
                            </tr>
                            <tr>
                                <td>Họ và tên</td>
                                <td colspan="3">
                                    <?php echo $order_row["fullname_receiver"];?>
                                </td>
                            </tr>
                            <tr>
                                <td>Điện thoại</td>
                                <td colspan="3">
                                    <?php echo $order_row["phone_receiver"];?>
                                </td>
                            </tr>
                            <tr>
                                <td>Email</td>
                                <td colspan="3">
                                    <a href="mailto:<?php echo $order_row["email_receiver"];?>"><?php echo $order_row["email_receiver"];?></a>
                                </td>
                            </tr>
                            <tr>
                                <td>Địa chỉ</td>
                                <td colspan="3">
                                    <?php echo $order_row["address_receiver"];?>
                                </td>
                            </tr>
                            <tr>
                                <td>Tỉnh/Thành phố</td>
                                <td colspan="3">
                                    <?php echo $order_row["regionid_receiver"];?>
                                </td>
                            </tr>
                        </table>
                    </div>
                    <div id="content_button" style="width:670px;">
                        <button class="button_style1" onclick="return cancel_process('#order');" style="margin-left:5px;"><span>Quay lại</span></button>
                    </div>
                    
                </form>
        </div>
    <?php include($_SERVER['DOCUMENT_ROOT'] . $base_folder . "admincp/modules/other_info.php");?>
</div>
