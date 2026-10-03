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
    $id = 0;$tab = 0;if(isset($_GET["tab"])){$tab = $_GET["tab"];}
    $page = 1;if(isset($_GET["page"])){$page = $_GET["page"];}
    $number_result = 0;$news_limit = 20;
    $OffsetNews = $page - 1;
    $OffsetNews = $OffsetNews * $news_limit;
    $total_result = fn_get_column_of_table_with_query("select count(id) from language_template where languageid = 1");
    $total_page = ceil($total_result/$news_limit);
?>
<?php include($_SERVER['DOCUMENT_ROOT'] . $base_folder . "admincp/modules/content_left.php");?>
<style type="text/css">
    .languageList{float:left;margin:0;}
    .languageList .row{}
    .page{float:left;width:100%;padding:5px 0;text-align: center;}
    .page a{display: inline-block;padding:2px 7px;margin:0 2px;border:1px solid #AAAAAA;color:#444444;text-decoration: none;}
    .page a:hover{background-color: #1B99CC;border-color:#1B99CC;color:#ffffff;}
    .page .current{text-decoration: underline;background-color: #DDDDDD;border-color:#DDDDDD;}
</style>
<div id="content_right">
    <div class="content">
        <div class="form_add" id="form_add">
                <form action="<?php echo $base_folder;?>admincp/modules/language_update.php" onsubmit="return frmProcess_before_submit();" name="frmProcess" target="processing_target" method="POST">
                    <input type="hidden" value="<?php echo $languageid;?>" name="fLanguage"> 
                    <iframe name="processing_target" src="#" style="width:0;height:0;border:0px;display:none;"></iframe>
                    <div class="menu" name="content_menu" style="font-size: 15px;text-transform: uppercase;color:#1B99CC;font-weight: bold;text-align: center;padding:10px 0;">
                        Ngôn ngữ
                    </div>
                    <div id="content_button" style="width:auto;position: absolute;right:10px;z-index: 200;">
                        <button type="submit" class="button_style1"><span>Cập nhật</span></button>
                    </div>
                    
                    <div class="page">
                        <?php 
                            function process_page_link($page,$pageshow,$class){
                                return '<a'.$class.' href="#language?page='.$page.'" name="mn_language" onclick="main_menu_click(\'language\',\'mn_language\',\'#admin_content\',\'language.php?page='.$page.'\',\'\');">'.$pageshow.'</a>';
                            }
                            $setpage = $page;
                            $num = 0;
                            
                            if($page>2){
                                echo process_page_link(1,'Đầu','');
                            }
                            
                            $strPrevious = '';
                            for($i=$page-1;$i>=1;$i--){
                                $strPrevious = process_page_link($i,$i,'') . $strPrevious;
                                if($num>=6){break;}
                                $num+=1;
                            }
                            echo $strPrevious;
                            echo process_page_link($page,$page,' class="current"');
                            $num = 0;
                            for($i=$page+1;$i<=$total_page;$i++){
                                echo process_page_link($i,$i,'');
                                if($num>=6){break;}
                                $num+=1;
                            }
                            if($i<$total_page){
                                echo process_page_link($total_page,'Cuối','');
                            }
                        ?>
                    </div>
                    <div class="tab_content_info">
                        <?php 
                            $result_language = fn_get_array_with_query("select * from language where status = 1 order by id ASC");
                            $language_array = array();
                            if($result_language!=false && mysql_num_rows($result_language)>0){
                                $i = 0;
                                while($row = mysql_fetch_array($result_language)){
                                    $language_array[$i] = '<div class="languageList">';
                                    $language_array[$i] .= '<table cellpadding="5" cellspacing="0">';
                                    $language_array[$i] .= '<tr><td align="center"><img style="border:1px solid #AAAAAA;padding:2px;" src="'.image_process_http($row['flag']).'"></td></tr>';
                                    $languageid = $row['id'];
                                    
                                    $result_language_vn_template = fn_get_array_with_query("select * from language_template where languageid = 1 order by id ASC limit $news_limit offset $OffsetNews");
                                    while($row_temp_vn = mysql_fetch_array($result_language_vn_template)){
                                        $id = $row_temp_vn['id'];
                                        $input_name = 'language_' . $languageid . '_' . $id;
                                        $id_current = fn_get_column_of_table_with_query("select id from language_template where id = $id and languageid = $languageid",'','');
                                        //$name = fn_get_column_of_table_with_query("select name from language_template where id = $id and languageid = $languageid",'','');
                                        $value = fn_get_column_of_table_with_query("select value from language_template where id = $id and languageid = $languageid",'','');
                                        if($id_current==''){
                                            fn_process_query("insert into language_template(id,languageid,name,value) values('$id','$languageid','','')");
                                        }
                                        $language_array[$i] .= '<tr class="row"><td>';
                                        if(strpos($value,'"')!==false || strpos($value,"'")!==false){
                                            $language_array[$i] .= '<textarea style="width:250px;height:16px;" name="'.$input_name.'">'.$value.'</textarea>';
                                        }
                                        else{
                                            $language_array[$i] .= '<input style="width:250px;" type="text" name="'.$input_name.'" value="'.$value.'">';
                                        }
                                        $language_array[$i] .= '</td></tr>';
                                    }
                                    $language_array[$i] .= '</table>';
                                    $language_array[$i] .= '</div>';
                                    $i+=1;
                                }
                            }
                            for($i=0;$i<sizeof($language_array);$i++){
                                echo $language_array[$i];
                            }
                        ?>
                    </div>
                    <div id="content_button" style="width:auto;position: absolute;right:10px;bottom:10px;z-index: 200;">
                        <button type="submit" class="button_style1"><span>Cập nhật</span></button>
                    </div>
                </form>
        </div>
    </div>
    <?php include($_SERVER['DOCUMENT_ROOT'] . $base_folder . "admincp/modules/other_info.php");?>
</div>