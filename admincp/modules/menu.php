<div class="menu_top" name="menu_top">
    <ul>
        <li><a class="active" href="#home" name="mn_home" onclick="main_menu_click('home','mn_home','#admin_content','home.php','');">Home</a></li>
        <li>
            <a href="#content?content_group=1&mn=mn_content" name="mn_content" onclick="main_menu_click('content?content_group=1&mn=mn_content','mn_content','#admin_content','content.php?content_group=1&mn=mn_content','');">Bài viết<span></span></a>
            <ul>
                <li><a href="#content_add?id=0&content_group=1&mn=mn_content" onclick="main_menu_click('content_add?id=0&content_group=1&mn=mn_content','mn_content','#admin_content','content_add.php?id=0&content_group=1&mn=mn_content','');">Tạo mới bài viết</a></li>
            </ul>
        </li>
        <li>
            <a href="#content?content_group=6&mn=mn_room" name="mn_room" onclick="main_menu_click('content?content_group=6&mn=mn_room','mn_room','#admin_content','content.php?content_group=6&mn=mn_room','');">Sản phẩm<span></span></a>
            <ul>
                <li><a href="#content_add?id=0&content_group=6&mn=mn_room" onclick="main_menu_click('content_add?id=0&content_group=6&mn=mn_room','mn_room','#admin_content','content_add.php?id=0&content_group=6&mn=mn_room','');">Tạo sản phẩm mới</a></li>
            </ul>
        </li>
        <li>
            <a href="#catalog" name="mn_catalog" onclick="main_menu_click('catalog','mn_catalog','#admin_content','catalog.php','');">Danh mục<span></span></a>
            <ul>
                <li><a href="#catalog_add" onclick="main_menu_click('catalog_add','mn_catalog','#admin_content','catalog_add.php?id=0','');">Thêm danh mục</a></li>
            </ul>
        </li>
        <li><a href="#order" name="mn_order" onclick="main_menu_click('order','mn_order','#admin_content','order.php','');">Đặt hàng</a></li>
        <li><a href="#contact" name="mn_contact" onclick="main_menu_click('contact','mn_contact','#admin_content','contact.php','');">Liên hệ</a></li>
        <li><a href="#comment" name="mn_comment" onclick="main_menu_click('comment','mn_comment','#admin_content','comment.php','');">Phản hồi</a></li>
        <li>
            <a href="#user" name="mn_user" onclick="main_menu_click('user','mn_user','#admin_content','user.php','');">Thành viên<span></span></a>
            <ul>
                <li><a href="#user_add.php?id=0" onclick="main_menu_click('user_add','mn_user','#admin_content','user_add.php?id=0','');">Tạo thành viên mới</a></li>
            </ul>
        </li>
        <li>
            <a href="#adv" name="mn_adv" onclick="main_menu_click('adv','mn_adv','#admin_content','adv.php','');">Quảng cáo<span></span></a>
            <ul>
                <li><a href="#adv_add.php?id=0" onclick="main_menu_click('adv_add','mn_adv','#admin_content','adv_add.php?id=0','');">Tạo quảng cáo mới</a></li>
            </ul>
        </li>
        <li>
            <a href="#support" name="mn_support" onclick="main_menu_click('support','mn_support','#admin_content','support.php','');">Hỗ trợ</a>
        </li>
        <?php 
            if($GLOBALS["meta_multi_language"]==1){
                echo '<li><a name="mn_language" href="#language?page=1" onclick="main_menu_click(\'language\',\'mn_language\',\'#admin_content\',\'language.php\',\'\');">Ngôn ngữ</a></li>';
            }
        ?>
        <li>
            <a href="#config" name="mn_config" onclick="main_menu_click('config','mn_config','#admin_content','config.php','');">Cấu hình chung</a>
            <?php if($GLOBALS["meta_multi_language"]==1){
                    echo '<ul><li><a href="#config?languageid=2" onclick="main_menu_click(\'config?languageid=2\',\'mn_config\',\'#admin_content\',\'config.php\',\'?languageid=2\');">Cấu hình tiếng Anh</a></li></ul>';
                }
            ?>
            
        </li>
    </ul>
</div>
<script type="text/javascript">
     function main_menu_click(hypertag,menu_active,container,filephp,variable_get){
        previous_href = window.location.href;
        show_alert_doing2();
        var link = base_folder + 'admincp/#'+hypertag;
        window.location = link;
        url = base_folder + "admincp/modules/" + filephp + variable_get;
        $.get(url, function(data) {
            $(container).html(data);
            process_after_get_content_ajax(container);
            close_alert_doing2();
        });
        if(menu_active==''){
            var mn = get_mn_function_for_menu(link);
            set_active_menu_top($("[name='"+mn+"']"));
        }
        else{
            set_active_menu_top($("[name='"+menu_active+"']"));
        }
        
        return false;
    }
    function get_mn_function_for_menu(link){
        var mn = link;
        if(link.indexOf("mn=")>=0){
            mn = mn.substr(mn.indexOf("mn=")+3);
            if(mn.indexOf("&")>=0){
                mn = mn.substr(0, mn.indexOf("&"));
            }
        }
        else{
            if(link.indexOf("#")>=0){
                mn = location.href.split("#")[1];
            }
            if(mn.indexOf("_")>=0){
                mn = mn.substr(0,mn.indexOf("_"));
            }
            if(mn.indexOf("?")>=0){
                mn = mn.substr(0,mn.indexOf("?"));
            }
            mn = "mn_"+mn;
        }
        return mn;
    }
    function process_hyperlink_for_loading(){
        var link = location.href;
        var url = '';
        var mn = get_mn_function_for_menu(link);
        
        if(link.indexOf("#")>=0){
            var page = location.href.split("#")[1];
            var vari_get = '';
            if(page.indexOf("?")>=0){
                vari_get = page.substr(page.indexOf("?"));
                page = page.substr(0,page.indexOf("?"));
            }
            url = base_folder+"admincp/modules/"+page+".php"+vari_get;
        }
        set_active_menu_top($("[name='"+ mn +"']"));
        return url;
    }
    $(document).ready(function(){
        if(logined==1){
            show_alert_doing2();
            var url = process_hyperlink_for_loading();
            if(url==""){url=base_folder+"admincp/modules/home.php";}
            $.get(url, function(data) {
                $("#admin_content").html(data);
                process_after_get_content_ajax('admin_content');
                close_alert_doing2();
            });
        }
    });
    function load_url(url){
        $.get(url, function(data) {
            
        });
    }
    function get_data_from_url_ajax(url,process_after_load,container){
        show_alert_doing();
        $.get(base_folder+url, function(data) {
            $("#"+container).html(data);
            close_alert_doing();
        });
        return false;
    }
    function get_data_from_url_ajax_have_tag(url,process_after_load,container,tag){
        window.location = '#'+tag;
        show_alert_doing();
        $.get(base_folder+url, function(data) {
            $("#"+container).html(data);
            close_alert_doing();
        });
        return false;
    }
    function set_active_menu_top(obj){
        $("[name='menu_top']").find('.active').removeClass('active');
        obj.addClass('active');
    }
    function get_content_of_menu(url,container){
        try{
            show_alert_doing();
            var XMLHttpRequestObject = false; 
            if (window.XMLHttpRequest) {
                XMLHttpRequestObject = new XMLHttpRequest();
            } 
            else if(window.ActiveXObject) {
                XMLHttpRequestObject = new ActiveXObject("Microsoft.XMLHTTP");
            }
            if(XMLHttpRequestObject){
                XMLHttpRequestObject.open("GET",url); 
                XMLHttpRequestObject.onreadystatechange = function(){ 
                    if (XMLHttpRequestObject.readyState == 4 && XMLHttpRequestObject.status == 200){ 
                        close_alert_doing();
                        document.getElementById(container).innerHTML = XMLHttpRequestObject.responseText;
                        delete XMLHttpRequestObject;
                        XMLHttpRequestObject = null;
                        process_after_get_content_ajax(container);
                    } 
                } 
                XMLHttpRequestObject.send(null); 
                
            }
            
        }
        catch(err){
            alert("Get content error: "+err);
        }
    }
    function load_content_ajax_into_element(url,container){
        try{
            show_alert_doing();
            var XMLHttpRequestObject = false; 
            if (window.XMLHttpRequest) {
                XMLHttpRequestObject = new XMLHttpRequest();
            } 
            else if(window.ActiveXObject) {
                XMLHttpRequestObject = new ActiveXObject("Microsoft.XMLHTTP");
            }
            if(XMLHttpRequestObject){
                XMLHttpRequestObject.open("GET",url); 
                XMLHttpRequestObject.onreadystatechange = function(){ 
                    if (XMLHttpRequestObject.readyState == 4 && XMLHttpRequestObject.status == 200){ 
                        close_alert_doing();
                        document.getElementById(container).innerHTML = XMLHttpRequestObject.responseText;
                        delete XMLHttpRequestObject;
                        XMLHttpRequestObject = null;
                    } 
                } 
                XMLHttpRequestObject.send(null); 
                
            }
            
        }
        catch(err){
            alert("Get content error: "+err);
        }
    }
    function process_after_get_content_ajax(container){
        $(".tab_content_info:first").find("textarea").each(function(i){
            if($(this).attr("editor_format")=="true"){
                var width = $(this).attr("width");var height = $(this).attr("height");
                if($(this).attr("fill_height")=="true"){
                    height = content_height - 200;
                }
                if($(this).attr("fill_width")=="true"){
                    width = screen_width - 275;
                }
                config = {startupFocus:false,toolbar:[['Styles','Font','FontSize','Bold','Italic','Underline','Strike','NumberedList','BulletedList','JustifyLeft','JustifyCenter','JustifyRight','JustifyBlock','TextColor','BGColor'],['RemoveFormat','Source'],['Link','Unlink','Image','Table','Iframe','Flash','Find']],uiColor : '#F4F5F7',width: width,height: height};
                if($(this).attr("mini_control")=="true"){
                    config = {startupFocus:false,toolbar:[['Bold','Italic','Underline','Undo','Redo','JustifyLeft','JustifyCenter','JustifyRight','JustifyBlock','Link','Unlink','TextColor','BGColor'],['Font','FontSize','RemoveFormat','Source']],uiColor : '#F4F5F7', width:$(this).attr("width"),height:$(this).attr("height")};
                }
                if(CKEDITOR.instances[$(this).attr("name")]){
                    delete CKEDITOR.instances[$(this).attr("name")];
                }
                if(!CKEDITOR.instances[$(this).attr("name")]){
                    $(this).ckeditor(config);
                }
                else{
                    delete CKEDITOR.instances[$(this).attr("name")];
                    BindCKEditor();
                }
            }
        });
        /*if($("[name='editor1']").length>0){
            var config2 = {
            startupFocus:false,toolbar:[
                ['Bold','Italic','Underline','Strike','HorizontalRule','Undo','Redo','NumberedList','BulletedList','JustifyLeft','JustifyCenter','JustifyRight','JustifyBlock','Link','Unlink','Image','Table','TextColor','BGColor'],
                                            ['Styles','Format','Font','FontSize','RemoveFormat','Source']
                ],uiColor : '#F4F5F7', width: '600',height : '300'};
            if(!CKEDITOR.instances.editor1){
                $("[name='editor1']").ckeditor(config2);
            }
            else{
                delete CKEDITOR.instances['editor1'];
                BindCKEditor();
            }
        }*/
        // process content_left showing
        if($.cookie("show_content_left") === "false" || $(window).width() < 900){
            $('#wrap, #admin_content').addClass('left_collapsed');
            $('#content_left').css({left: '', width: ''});
            $('#content_right').css({left: '', width: ''});
            $("[name='hide_left']").hide();
            $("[name='show_left']").show();
        } else {
            $('#wrap, #admin_content').removeClass('left_collapsed');
            $('#content_left').css({left: '', width: ''});
            $('#content_right').css({left: '', width: ''});
            $("[name='show_left']").hide();
            $("[name='hide_left']").show();
        }
        if($.cookie("history_action")=="false"){
            $("#history_content").css('height','0');
            $("#history_content").parent().find(".show_button").show();
        }
        if($(".message_from_admin").length>0){
            //var set_height = content_height-245;
            //$(".lc_content").css("height",set_height+"px");
        }
        return false;
    }
</script>