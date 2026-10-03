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
    if(isset($_GET["id"])){$id = $_GET["id"];}
    $level = 0;
    if(isset($_GET["level"])){$level = $_GET["level"];}
    $finish = 0;
    if(isset($_GET["finish"])){$finish = $_GET["finish"];}
    $level = $level + 1;
    $table_query = "catalog";
    $content_group = 0;
    if(isset($_GET["content_group"])){$content_group = $_GET["content_group"];}
    $languageid = 1;
    if(isset($_GET["languageid"])){$languageid = $_GET["languageid"];}
    if($content_group==0){
        $query = "select * from $table_query where parentid = $id and languageid = $languageid order by catalog_name ASC";
    }
    else{
        $query = "select * from $table_query where content_group = $content_group and parentid = 0 and languageid = $languageid order by catalog_name ASC";
    }
    //echo $query;
    if($finish==0){
        get_contents($query,$table_query,$level);
    }
    else{
        $content_group = get_product_group($id,$table_query);
        echo '<u>'.get_content_group_name_from_db($content_group).'</u>';
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
    function get_contents($query,$table_query,$level){
        $result = mysql_query($query,$GLOBALS["con"]);
        if($result==false||mysql_num_rows($result)<=0){
            return false;
        }
        else{
            echo '<select multiple="multiple" onclick="change_catalogs_show_of_adv_add($(this),this.value,' . $level . ',0,0);">';
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
        $query = "select content_group from $table_query where catid = $id";
        $result = mysql_query($query,$GLOBALS["con"]);
        if($result==false||mysql_num_rows($result)<=0){
            return -1;
        }
        else{
            $row = mysql_fetch_array($result);
            return $row['content_group'];
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