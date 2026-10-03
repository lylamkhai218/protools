<div id="content_left">
    <div id="list_catalog">
        <div class="search_catalog">
            <input type="text" value="Tìm kiếm" />
            <button class="submit"><img src="<?php echo $GLOBALS["base_folder"];?>admincp/media/search_icon.png" alt="" /></button>
        </div>
        <div class="catalog">
            <?php 
                $row_today_counter = fn_get_feed_array_with_query("select * from website_counter where sys_date = " . date("Ymd"),false,false);
                $row_yesterday_counter = fn_get_feed_array_with_query("select * from website_counter where sys_date = " . date("Ymd",time()-86400),false,false);
                $row_total_counter = fn_get_feed_array_with_query("select sum(visitor) as total_visitor,sum(pageview) as total_pageview from website_counter",false,false);
            ?>
            <div class="catalog_header">
                <div class="catalog_header_title">
                    <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="18" y1="20" x2="18" y2="10"></line>
                        <line x1="12" y1="20" x2="12" y2="4"></line>
                        <line x1="6" y1="20" x2="6" y2="14"></line>
                    </svg>
                    <span>Thống kê truy cập</span>
                </div>
                <button type="button" class="hide_left_btn" name="hide_left" onclick="hide_content_left();" title="Thu gọn thanh bên" aria-label="Thu gọn thanh bên">
                    <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="15 18 9 12 15 6"></polyline>
                    </svg>
                </button>
            </div>
            <div class="other_menu">
                <div class="rows first">
                    <span class="counter_row"><span class="text">Truy cập hôm nay:</span> <span class="num"><?php echo format_number_thousand($row_today_counter["visitor"]);?></span></span>
                </div>
                <div class="rows">
                    <span class="counter_row"><span class="text">Truy cập hôm qua:</span> <span class="num"><?php echo format_number_thousand($row_yesterday_counter["visitor"]);?></span></span>
                </div>
                <div class="rows">
                    <span class="counter_row"><span class="text">Tổng lượt truy cập:</span> <span class="num"><?php echo format_number_thousand($row_total_counter["total_visitor"]);?></span></span>
                </div>
                <div class="rows">
                    <span class="counter_row"><span class="text">Đang online:</span> <span class="num"><?php echo format_number_thousand(fn_get_column_of_table_with_query("select count(*) from user_online",0,0));?></span></span>
                </div>
                
            </div>
        </div>
    </div>
    <?php //include($_SERVER['DOCUMENT_ROOT'] . $GLOBALS["base_folder"] . "admincp/modules/help_link.php");?>
    <div id="history" class="content_left_style2">
        <div class="cs_title">
            <a>Lịch sử hoạt động</a>
            <div class="hide_button" name="hide_history" onclick="hide_content_left_style1($(this),'history_action');"><img src="<?php echo $GLOBALS["base_folder"];?>admincp/media/arrow.png" alt=""></div>
            <div class="show_button" name="show_history" onclick="show_content_left_style1($(this),'history_action');"><img src="<?php echo $GLOBALS["base_folder"];?>admincp/media/arrow2.png" alt=""></div>
        </div>
        <div id="history_content" class="cs_content">
            <?php get_history_from_system_log($GLOBALS["userid"]);?>
        </div>
</div>
</div>
<?php 
    function get_column_of_table_content_left_admincp($query) {
        $result = mysql_query($query,$GLOBALS["con"]);
        if($result==false||mysql_num_rows($result)<=0){
            return 0;
        }   
        else{
            $row = mysql_fetch_array($result);
            return $row[0];
        }
    }
    function get_history_from_system_log($userid){
        $query = "select system_log.create_time,system_log.note,system_log.hyper_link,system_log.status from system_log,user where user.id = system_log.userid and user.username = '".$_COOKIE[$GLOBALS['rootuser']]."' order by system_log.id DESC limit 30";
        $result = mysql_query($query,$GLOBALS["con"]);
        if($result==false||mysql_num_rows($result)<=0){
            echo '<div class="pipeline_empty"><p>Chưa có hoạt động hệ thống nào.</p></div>';
            return false;
        }
        else{
            echo '<div class="git_pipeline">';
            while($row = mysql_fetch_array($result)){
                $hyper_link = $row['hyper_link'];
                $has_link = false;
                if($hyper_link!=""){
                    $has_link = true;
                    if(strpos($hyper_link,'/')!=0&&strpos($hyper_link,'http://')===false){
                        $hyper_link = ' href="'.$GLOBALS["base_folder"].$hyper_link.'" target="_blank"';
                    }
                    else{
                        $hyper_link = ' href="'.$hyper_link.'" target="_blank"';
                    }
                }
                
                $status_class = ($row['status'] == 1) ? 'status_success' : 'status_warning';
                $status_title = ($row['status'] == 1) ? 'Thành công (Passed)' : 'Cảnh báo / Lỗi';
                
                $time_str = '';
                if(!empty($row['create_time'])){
                    if(function_exists('format_full_time')){
                        $time_str = format_full_time($row['create_time'],'HH:mm DD/MM');
                    } else if(strlen($row['create_time']) >= 12){
                        $time_str = substr($row['create_time'],8,2).':'.substr($row['create_time'],10,2).' '.substr($row['create_time'],6,2).'/'.substr($row['create_time'],4,2);
                    }
                }
                
                echo '<div class="pipeline_item '.$status_class.'">';
                echo '  <div class="pipeline_rail">';
                echo '    <span class="pipeline_node" title="'.$status_title.'"></span>';
                echo '    <span class="pipeline_stem"></span>';
                echo '  </div>';
                echo '  <div class="pipeline_content">';
                if($time_str != ''){
                    echo '    <div class="pipeline_meta"><span class="pipeline_tag">commit</span><span class="pipeline_time">'.$time_str.'</span></div>';
                }
                if($has_link){
                    echo '    <a class="pipeline_note"'.$hyper_link.' title="'.htmlspecialchars(strip_tags($row['note'])).'">'.substring($row['note'],130).'</a>';
                } else {
                    echo '    <span class="pipeline_note" title="'.htmlspecialchars(strip_tags($row['note'])).'">'.substring($row['note'],130).'</span>';
                }
                echo '  </div>';
                echo '</div>';
            }
            echo '</div>';
            return true;
        }
    }
?>