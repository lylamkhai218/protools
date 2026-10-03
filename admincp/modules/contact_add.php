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
    $create_time = 0;$fullname = '';$phone = '';$email = '';$address = '';$title = '';$content = '';$ip_address='';$status = 0;
    $userid = 0;
    if(isset($_GET["id"])){
        $id = intval($_GET["id"]);
        get_content_info($id);
    }
    function get_content_info($id){
        $id = intval($id);
        $query = "select * from contact_list where id = $id";
        $result= mysql_query($query,$GLOBALS["con"]);
        if($result && mysql_num_rows($result) > 0){
            $row = mysql_fetch_array($result);
            $GLOBALS['create_time'] = $row['create_time'];
            $GLOBALS["fullname"] = htmlspecialchars($row['fullname'], ENT_QUOTES, 'UTF-8');
            $GLOBALS["phone"] = htmlspecialchars($row['phone'], ENT_QUOTES, 'UTF-8');
            $GLOBALS["email"] = htmlspecialchars($row['email'], ENT_QUOTES, 'UTF-8');
            $GLOBALS["address"] = htmlspecialchars($row['address'], ENT_QUOTES, 'UTF-8');
            $GLOBALS["title"] = htmlspecialchars($row['title'], ENT_QUOTES, 'UTF-8');
            
            // XSS sanitization for contact_list.content
            $raw_content = $row['content'];
            $clean_content = preg_replace('/<(script|iframe|object|embed|svg|link|meta|style)[^>]*>.*?<\/\1>/is', '', $raw_content);
            $clean_content = preg_replace('/<(script|iframe|object|embed|svg|link|meta|style)[^>]*>/is', '', $clean_content);
            $clean_content = preg_replace('/(\son[a-zA-Z]+\s*=\s*([\'"][^\'"]*[\'"]|[^\s>]+))/is', '', $clean_content);
            $clean_content = preg_replace('/href\s*=\s*[\'"]javascript:[^\'"]*[\'"]/is', 'href="#"', $clean_content);
            $GLOBALS["content"] = $clean_content;
            
            $GLOBALS["status"] = intval($row['status']);
            $GLOBALS["ip_address"] = htmlspecialchars($row['ip_address'], ENT_QUOTES, 'UTF-8');
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
                            <td colspan="4" align="center" class="function_name"><?php if($id==0){echo 'Tạo mới';}else{echo 'Xem liên hệ của khách hàng: ' . $fullname;}?></td>
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
                                <td valign="top"><b>Tiêu đề thông điệp</b></td>
                                <td colspan="3">
                                    <?php echo $title;?>
                                </td>
                            </tr>
                            <tr>
                                <td valign="top"><b>Nội dung liên hệ</b></td>
                                <td colspan="3">
                                    <?php echo $content;?>
                                </td>
                            </tr>
                        </table>
                    </div>
                    <div id="content_button" style="width:670px;">
                        <button class="button_style1" onclick="return cancel_process('#contact');" style="margin-left:5px;"><span>Quay lại</span></button>
                    </div>
                    
                </form>
        </div>
    </div>
    <?php include($_SERVER['DOCUMENT_ROOT'] . $base_folder . "admincp/modules/other_info.php");?>
</div>