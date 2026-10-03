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
    $type = 0;
    $catid = 0;
    $query = "";
    $query2 = "";
    if(isset($_GET["catid"])){
        $catid = $_GET["catid"];   
    }
    if(isset($_GET["type"])){
        $type = $_GET["type"];   
    }
    function get_parent_of_catalogs($parentid){
        if($parentid==0){return "";}
        $query = "select catalog_name from catalogs where catid = $parentid";
        $result = mysql_query($query,$GLOBALS["con"]); 
        if($result==false||mysql_num_rows($result)<=0){
            return "";
        }
        else{
            $row = mysql_fetch_array($result);
            return ' (' . $row['catalog_name'] . ')';
        }
    }
    function show_parent(){
        $query = "select catid,parentid,catalog_name from catalogs where status = 1 and type = " . $GLOBALS["type"] . " order by catalog_name ASC";
        $result= mysql_query($query,$GLOBALS["con"]); 
        if($result==false||mysql_num_rows($result)<=0){
            return '<option selected="true" value="0">Chưa chọn</option>';
        }
        else{
            $str_return = "";
            $check = false;
            while($row = mysql_fetch_array($result)){
                if($row['catid']==$GLOBALS["catid"]){
                    $str_return = $str_return . "<option selected=\"true\" value=\"" . $row['catid'] . "\">" . $row['catalog_name'] . get_parent_of_catalogs($row['parentid']) . "</option>";
                    $check = true;
                }
                else{
                    $str_return = $str_return . "<option value=\"" . $row['catid'] . "\">" . $row['catalog_name'] . get_parent_of_catalogs($row['parentid']) . "</option>";
                }
            }
            if($check==true){
                $str_return = '<option value="0">Chưa chọn</option>' . $str_return; 
            }
            else{
                $str_return = '<option selected="true" value="0">Chưa chọn</option>' . $str_return; 
            }
            return $str_return;
        }
    }
?>
<select name="fParent" id="fParent" style="margin: 0;">
    <?php echo show_parent();?>
</select>