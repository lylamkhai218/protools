<?php 
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
    $comment_parent = 0;
    $comment_parent_body = '';
    $contentid = 0;
    $create_time = 0;
    $poster = 0;
    $published = 0;
    $publisher = 0;
    $publish_fullname = '';
    $publish_time = '';
    $title = '';
    $title2 = '';
    $fullname = '';
    $body = '';
    if(isset($_GET["id"])){
        $id = $_GET["id"];
        get_content_from_db($id);
        if($published==1){get_publisher($publisher);}
    }
    function get_content_from_db($id){
        $query = "select comment.commentid,comment.contentid,comment.create_time,comment.poster,comment.published,comment.publisher,comment.publish_time,comment.title,comment.fullname,comment_body.body 
                    from comment,comment_body 
                    where comment.commentid = comment_body.commentid and comment.commentid = $id";
        $result= mysql_query($query,$GLOBALS["con"]);
        if(mysql_num_rows($result) > 0){
            $row = mysql_fetch_array($result);
            $GLOBALS['contentid'] = $row['contentid'];
            $GLOBALS['comment_parent'] = $row['comment_parent'];
            $GLOBALS['create_time'] = $row['create_time'];
            $GLOBALS['poster'] = $row['poster'];
            $GLOBALS['published'] = $row['published'];
            $GLOBALS["publisher"] = $row['publisher'];
            $GLOBALS["publish_time"] = $row['publish_time'];
            $GLOBALS["title"] = $row['title'];
            $GLOBALS["fullname"] = $row['fullname'];
            $GLOBALS["body"] = str_replace("<br>",chr(13),$row['body']);
            $GLOBALS["alias"] = $row['alias'];
            $GLOBALS['title2'] = get_column_from_db("select title from content_meta where contentid = " . $GLOBALS['contentid']);
            $GLOBALS['alias'] = get_column_from_db("select alias from content_meta where contentid = " . $GLOBALS['contentid']);
            $GLOBALS['fullname'] = get_column_from_db("select fullname from user_info where id = " . $GLOBALS['poster']);
            mysql_free_result($result);  
            return true;
        }
        else{
            //Header("Location: " . $GLOBALS['base_folder']);
            return false;
        }
    }
    function get_column_from_db($query){
        $result = mysql_query($query,$GLOBALS["con"]);
        if($result==false||mysql_num_rows($result)<=0){
            return "";
        }
        else{
            $row = mysql_fetch_array($result);
            return $row[0];
        }
    }
    function get_publisher($id){
        $query = "select fullname 
                    from user_info 
                    where id = $id";
        $result = mysql_query($query,$GLOBALS["con"]);
        if($result==false||mysql_num_rows($result)<=0){
            return false;
        }
        else{
            $row = mysql_fetch_array($result);
            $GLOBALS['publish_fullname'] = $row['fullname'];
            mysql_free_result($result);  
            return true;
        }
    }
?>
<?php include($_SERVER['DOCUMENT_ROOT'] . $base_folder . "admincp/modules/content_left.php");?>
<div id="content_right">
    <div class="content">
        <div class="form_add" id="form_add">
            <form action="<?php echo $base_folder;?>admincp/modules/comment_insert.php" onsubmit="return frmProcess_before_submit();" name="frmProcess" target="processing_target" method="POST">
                <iframe name="processing_target" src="#" style="width:0;height:0;border:0px;display:none;"></iframe>
                <table cellpadding="5" cellspacing="0" width="600" class="table_add">
                    <tr>
                        <td colspan="4" align="center" class="function_name"><?php if($id==0){echo 'Tạo mới phản hồi';}else{echo 'Cập nhật phản hồi: ' . substring($body,60);}?></td>
                    </tr>
                </table>
                <div class="menu" name="content_menu">
                    <ul>
                        <li name="mn_content_base" class="active"><a href="javascript:;" onclick="show_content_info('base')">Thông tin cơ bản</a></li>
                    </ul>
                </div>
                <div class="tab_content_info">
                    <table cellpadding="5" cellspacing="0" class="table_add">
                        <tr>
                            <td>Bài viết</td>
                            <td colspan="3">
                                <?php echo show_link_article($contentid,$title2,$alias,' target="_blank"',$title2,'');?>
                                <input type="hidden" value="<?php echo $id;?>" name="fID" />
                                <input type="hidden" value="<?php echo $contentid;?>" name="fContentid" />
                            </td>
                        </tr>
                        <tr>
                            <td valign="top">Nội dung</td>
                            <td colspan="3">
                                <textarea name="fBody" require="true" compare_require="" name_require="nội dung phản hồi" style="width:550px;height:200px;"><?php echo $body;?></textarea>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="4">
                                <span style="border: 1px solid #CCCCCC;color:#999999;float:left;padding:6px 8px;<?php if($id==0){echo 'display: none;';}?>">
                                    Người tạo: <a href="#user_add?id=<?php echo $poster;?>" onclick="user_add(<?php echo $poster;?>);"><?php echo $fullname;?></a>
                                     - Tạo lúc <?php echo substr($GLOBALS["create_time"],8,2) . ":" . substr($GLOBALS["create_time"],10,2) . " " . substr($GLOBALS["create_time"],6,2) . "/" . substr($GLOBALS["create_time"],4,2) . "/" . substr($GLOBALS["create_time"],0,4);?>
                                </span>
                                <span style="border: 1px solid #CCCCCC;color:#999999;float:right;padding:6px 8px;<?php if($id==0){echo 'display: none;';}?>">    
                                    
                                    <?php 
                                        if($published==1){
                                            echo 'Người duyệt: <a href="#user_add?id='.$publisher.'" onclick="user_add('.$publisher.');">'.$publish_fullname.'</a>';
                                            echo " - Duyệt lúc: " . substr($GLOBALS["publish_time"],8,2) . ":" . substr($GLOBALS["publish_time"],10,2) . " " . substr($GLOBALS["publish_time"],6,2) . "/" . substr($GLOBALS["publish_time"],4,2) . "/" . substr($GLOBALS["publish_time"],0,4);
                                        }
                                        else{
                                            echo '<font color="#ff0000">Chưa được xuất bản</font>';
                                        }
                                    ?>
                                </span>
                            </td>
                        </tr>
                    </table>
                </div>
                <div id="content_button">
                    <?php 
                        if($published==1){
                            echo '<button type="button" class="button_style1" onclick="return content_process(\'admincp/modules/comment_process.php?id='.$id.'&rq=republish\',true);"><span><a class="republish_article">&nbsp;</a>Tái xuất bản</span></button>';
                            echo '<button type="button" class="button_style4" onclick="return content_process(\'admincp/modules/comment_process.php?id='.$id.'&rq=down\',true);" style="margin:0 4px;"><span><a class="down_article">&nbsp;</a>Gỡ</span></button>';
                        }
                        else{
                            echo '<button type="button" class="button_style1" onclick="return content_process(\'admincp/modules/comment_process.php?id='.$id.'&rq=publish\',true);"><span><a class="publish_article">&nbsp;</a>Xuất bản</span></button>';
                            echo '<button type="button" class="button_style2" onclick="return content_process(\'admincp/modules/comment_process.php?id='.$id.'&rq=delete\',false);" style="margin:0 4px;"><span><a class="delete_article">&nbsp;</a>Xoá</span></button>';
                        }
                    ?>
                    <button type="submit" class="button_style1"><span><?php if($id==0){echo 'Tạo phản hồi';}else{echo 'Cập nhật';}?></span></button>
                    <button class="button_style1" onclick="return cancel_process('#comment');" style="margin-left:5px;"><span>Hủy</span></button>
                </div>
            </form>
        </div>
    <?php include($_SERVER['DOCUMENT_ROOT'] . $base_folder . "admincp/modules/other_info.php");?>
</div>