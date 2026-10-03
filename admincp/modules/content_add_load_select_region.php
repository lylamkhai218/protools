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
    $table_query = "region";
    $content_group = 0;
    if(isset($_GET["content_group"])){$content_group = $_GET["content_group"];}
    $languageid = 1;
    if(isset($_GET["languageid"])){$languageid = $_GET["languageid"];}
    if($content_group==0){
        $query = "select * from $table_query where region_parent = $id order by region_name ASC";
    }
    else{
        $query = "select * from $table_query where region_parent = 0 order by region_name ASC";
    }
    //echo $query;
    if($finish==0){
        get_contents($query,$table_query,$level);
    }
    else{
        
    }
    function get_contents($query,$table_query,$level){
        $result = mysql_query($query,$GLOBALS["con"]);
        if($result==false||mysql_num_rows($result)<=0){
            return false;
        }
        else{
            echo '<select multiple="multiple" onclick="change_region_of_content_add(this.value,' . $level . ',0,0);">';
            while($row = mysql_fetch_array($result)){
                echo '<option value="' . check_finish($row['id'],$table_query) . '_' . $row['id'] . '">' . substring($row['region_name'],30) . '</option>';
            }
            echo '</select>';
            return true;
        }
    }
    function check_finish($id,$table_query){
        $query = "select id from $table_query where region_parent = $id";
        $result = mysql_query($query,$GLOBALS["con"]);
        if($result==false||mysql_num_rows($result)<=0){
            return "true";
        }
        else{
            return "false";
        }
    }
?>