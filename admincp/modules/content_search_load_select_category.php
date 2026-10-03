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
    if(isset($_GET["id"])){
        $id = $_GET["id"];
    }
    $level = 0;
    if(isset($_GET["level"])){
        $level = $_GET["level"];
    }
    $finish = 0;
    if(isset($_GET["finish"])){
        $finish = $_GET["finish"];
    }
    $level = $level + 1;
    $table_query = "catalogs";
    $product_group = 0;
    if(isset($_GET["product_group"])){
        $product_group = $_GET["product_group"];
    }
    if($product_group==0){
        $query = "select * from $table_query where parentid = $id and status = 1 order by catalog_name ASC";
    }
    else{
        $query = "select * from $table_query where product_group = $product_group and status = 1 and parentid = 0 order by catalog_name ASC";
    }
    $function_js = 'change_catalogs_ajax';
    if($finish==0){
        get_contents($query,$table_query,$level);
    }
    else{
        $product_group = get_product_group($id,$table_query);
        if($product_group==1){
            echo '<u>Tin tức</u>';
        }
        else{
            echo '<u>Sản phẩm</u>';
        }
        $directory_return = '';
        $parentid = get_parent_id($id,$table_query);
        if($parentid==0){
            
        }
        else{
            $i = 0;
            while($parentid!=0&&$i<10){
                if($i==0){
                    $directory_return = '<u>' . get_catalog_name_from_id($parentid,$table_query) . '</u>';
                }
                else{
                    $directory_return = '<u>' . get_catalog_name_from_id($parentid,$table_query) . '</u> > ' . $directory_return;
                }
                $parentid = get_parent_id($parentid,$table_query);
                $i = $i + 1;
            }
            echo ' > ';
        }
        echo $directory_return . ' > <u>' . get_catalog_name_from_id($id,$table_query) . '</u>';
    }
    function get_contents($query,$table_query,$level){
        $result = mysql_query($query,$GLOBALS["con"]);
        if($result==false||mysql_num_rows($result)<=0){
            return false;
        }
        else{
            echo '<select onchange="'.$GLOBALS["function_js"].'(this.value,' . $level . ',0,0);"><option value="0">[---Chọn---]</option>';
            while($row = mysql_fetch_array($result)){
                echo '<option value="' . check_finish($row['catid'],$table_query) . '_' . $row['catid'] . '">' . substring($row['catalog_name'],30) . '</option>';
            }
            echo '</select>';
            return true;
        }
    }
    function check_finish($id,$table_query){
        $query = "select catid from $table_query where parentid = $id order by catalog_name ASC";
        $result = mysql_query($query,$GLOBALS["con"]);
        if($result==false||mysql_num_rows($result)<=0){
            return "true";
        }
        else{
            return "false";
        }
    }
    function get_product_group($id,$table_query){
        $query = "select product_group from $table_query where catid = $id";
        $result = mysql_query($query,$GLOBALS["con"]);
        if($result==false||mysql_num_rows($result)<=0){
            return -1;
        }
        else{
            $row = mysql_fetch_array($result);
            return $row['product_group'];
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
?>