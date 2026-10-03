<?php
    session_start();
    header("Expires: Mon, 26 Jul 1997 05:00:00 GMT"); 
    header("Last-Modified: " . gmdate("D, d M Y H:i:s") . " GMT"); 
    header("cache-Control: no-store, no-cache, must-revalidate"); 
    header("cache-Control: post-check=0, pre-check=0", false); 
    header("Pragma: no-cache"); 
    date_default_timezone_set('Asia/Bangkok');
    $base_folder = substr($_SERVER['SCRIPT_NAME'],0,strrpos($_SERVER['SCRIPT_NAME'], '/'));
    $base_folder = substr($base_folder,0,strrpos($base_folder, '/')) . '/';
    $path = $_SERVER['DOCUMENT_ROOT'];
    include($path . $base_folder . "function/mdl_function.php");
    include($path . $base_folder . "config/database.php");
    include($path . $base_folder . "modules/mdl_meta.php");
    include($path . $base_folder . "admincp/modules/mdl_global_admincp.php");
    $permit_name = 0;
    $user_logined = 0;
    function check_user_from_db($username,$password) {
        $username = filter_user_char($username);
        $password = filter_pass_char($password);
        $query ="select id,permit_name from user where username = '$username' and password = '$password' and type != 0 and status = 1";
        $result= mysql_query($query,$GLOBALS["con"]);
        if($result==false || mysql_num_rows($result)<=0){return false;}
        else{
            $row = mysql_fetch_array($result);
            $GLOBALS['permit_name'] = $row['permit_name'];
            return true;
        }
    }
    function checklogin(){
        if(isset($_COOKIE[$GLOBALS['rootuser']])==true && isset($_COOKIE[$GLOBALS['rootpass']])==true){
            if(check_user_from_db($_COOKIE[$GLOBALS['rootuser']],$_COOKIE[$GLOBALS['rootpass']])){
                return true;
            }
        }
        return false;
    }
    if(checklogin()){
        $user_logined = 1;
    }
    else{
        
    }
    if(!isset($_COOKIE['content_list_column'])){
        setcookie('content_list_column','0,1,2,3,4,5,6,7,8,9,10',time()+60*60*24*365,$GLOBALS['base_folder'],$GLOBALS["domain"],0);
    }
    if(!isset($_COOKIE['product_list_column'])){
        setcookie('product_list_column','0,1,2,3,4,5,6,7,8,9,10',time()+60*60*24*365,$GLOBALS['base_folder'],$GLOBALS["domain"],0);
    }
    if(!isset($_COOKIE['catalog_list_column'])){
        setcookie('catalog_list_column','0,1,2,3,4,5,6,7,8',time()+60*60*24*365,$GLOBALS['base_folder'],$GLOBALS["domain"],0);
    }
    if(!isset($_COOKIE['region_list_column'])){
        setcookie('region_list_column','0,1,2,3,4,5,6,7,8',time()+60*60*24*365,$GLOBALS['base_folder'],$GLOBALS["domain"],0);
    }
	
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<title>Quản Trị Hệ Thống | T&T VINA INDUSTRIAL</title>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
<link rel="icon" type="image/svg+xml" href="/logos/TTV_LOGO_Color_Master.svg" />
<link rel="alternate icon" type="image/png" href="/logos/TTV_LOGO_Color_Master.png" />
<link rel="shortcut icon" href="/logos/TTV_LOGO_Color_Master.png" />
<link rel="apple-touch-icon" href="/logos/TTV_LOGO_Color_Master.png" />
<link rel="stylesheet" type="text/css" href="<?php echo $base_folder;?>admincp/style.css" />
<script type="text/javascript" src="<?php echo $base_folder;?>js/jquery.min.js"></script>
<script type="text/javascript" src="<?php echo $base_folder;?>js/jquery-ui.js"></script>
<script type="text/javascript" src="<?php echo $base_folder;?>js/jquery.cookie.js"></script>
<script type="text/javascript" src="<?php echo $base_folder;?>js/other_js.js"></script>
<script type="text/javascript" src="<?php echo $base_folder;?>admincp/admin.js"></script>
<script type="text/javascript" src="<?php echo $base_folder;?>admincp/js/tooltip.js"></script>
<script type="text/javascript" src="<?php echo $base_folder;?>ckeditor/ckeditor.js"></script>
<script type="text/javascript" src="<?php echo $base_folder;?>ckeditor/adapters/jquery.js"></script>
<script type="text/javascript" src="<?php echo $base_folder;?>admincp/calendar/calendar.js"></script>
<link rel="stylesheet" type="text/css" href="<?php echo $base_folder;?>admincp/calendar/Calendar.css" />
<script type="text/javascript">var rootuser = "<?php echo $rootuser;?>";var rootpass = "<?php echo $rootpass;?>";var member_user = "<?php echo $member_user;?>";var member_pass = "<?php echo $member_pass;?>";var base_folder = "<?php echo $base_folder;?>";var domain = "<?php echo $domain;?>";var logined = "<?php echo $user_logined;?>";</script>
<script type="text/javascript">
    if(logined==0){
        $.cookie("bl_referer",window.location.href,{ path: base_folder, domain: '.'+domain });
        window.location = base_folder + "admincp/login.php";
    }
    var screen_height = $(window).height();
    var screen_width = $(window).width();
    var content_height = screen_height - 200;
    var help_link_height = content_height/2;
    var current_content_left = true;
    var previous_href = '';
    var warning_text_color = "#ff7200";
    var success_text_color = "#1FAB04";
    var error_text_color = "#ff0000";
    if($.cookie("show_content_left")==null){
        if(screen_width < 900){
            try{ $.cookie("show_content_left","false",{ path: '/' }); }catch(e){}
        }
        else{
            try{ $.cookie("show_content_left","true",{ path: '/' }); }catch(e){}
        }
    }
    if($.cookie("number_limit")==null){
        try{ $.cookie("number_limit",20,{ path: '/' }); }catch(e){}
    }
    if($.cookie("history_action")==null){
        try{ $.cookie("history_action","true",{ path: '/' }); }catch(e){}
    }
    $(document).ready(function(){
        if($.cookie("show_content_left") === "false" || $(window).width() < 900){
            $('#wrap, #admin_content').addClass('left_collapsed');
            $("[name='hide_left']").hide();
            $("[name='show_left']").show();
        } else {
            $('#wrap, #admin_content').removeClass('left_collapsed');
            $("[name='show_left']").hide();
            $("[name='hide_left']").show();
        }
    });
    function hide_content_left(){
        $('#wrap, #admin_content').addClass('left_collapsed');
        $('#content_left').css({left: '', width: ''});
        $('#content_right').css({left: '', width: ''});
        $("[name='hide_left']").hide();
        $("[name='show_left']").show();
        try{ $.cookie("show_content_left","false",{ path: '/' }); }catch(e){}
    }
    function show_content_left(){
        $('#wrap, #admin_content').removeClass('left_collapsed');
        $('#content_left').css({left: '', width: ''});
        $('#content_right').css({left: '', width: ''});
        $("[name='show_left']").hide();
        $("[name='hide_left']").show();
        try{ $.cookie("show_content_left","true",{ path: '/' }); }catch(e){}
    }
    function content_add(filename,hyper_tag,mn_obj,container){
        show_alert_doing();
        previous_href = window.location.href;
        window.location = '#'+hyper_tag;
        url = base_folder + "admincp/modules/" + filename;
        if(container==""){container = "#admin_content";}
        $.get(url, function(data) {
            $(container).html(data);
            close_alert_doing();
        });
        set_active_menu_top(mn_obj);
        return false;
    }
    function cancel_process(page){
        if(previous_href==''){
            previous_href = page;
        }
        previous_href = previous_href.replace("ajax=1","ajax=0");
        if(previous_href.indexOf("#")>=0){
            var url = base_folder+"admincp/modules/home.php";
            var page = previous_href.split("#")[1];
            window.location = '#' + page;
            var vari_get = '';
            /*
            var mn = page;
            if(page.indexOf("_")>=0){
                mn = page.substr(0,page.indexOf("_"));
            }
            if(mn.indexOf("?")>=0){
                mn = mn.substr(0,mn.indexOf("?"));
            }
            */
            if(page.indexOf("?")>=0){
                vari_get = page.substr(page.indexOf("?"));
                page = page.substr(0,page.indexOf("?"));
            }
            
            var mn = get_mn_function_for_menu(previous_href);
            set_active_menu_top($("[name='"+mn+"']"));
            get_content_of_menu(base_folder+"admincp/modules/"+page+".php"+vari_get,'admin_content');
        }
        else{
            get_content_of_menu(base_folder+"admincp/modules/home.php",'admin_content');
            window.location = '#home';
        }
        return false;
    }
    function ajax_load_content(current_function,page,limit,mode,other){
        try{
            $.cookie("number_limit",limit,{ expires: 7, path: base_folder, domain: '.'+domain });
            window.location = '#'+current_function+'?page='+page+'&limit='+limit+'&mode='+mode+other;
            var url = base_folder+"admincp/modules/"+current_function+".php?ajax=1&page="+page+"&limit="+limit+"&mode="+mode+other;
            show_alert_doing2();
            $.get(url, function(data) {
                $("#admin_content_list").html(data);
                close_alert_doing2(); 
            });
        }
        catch(err){
            alert("Ajax load content error: "+err);
        }
    }
    function sort_content_by_time(sortDir){
        try{
            try {
                $.cookie("product_sort_time", sortDir, { expires: 365, path: '/' });
                if(typeof domain !== 'undefined' && domain) {
                    $.cookie("product_sort_time", sortDir, { expires: 365, path: base_folder, domain: '.' + domain });
                }
            } catch(ce) {}
            var hash = window.location.hash || '#content?content_group=6&mn=mn_room';
            var page = 1;
            var limit = $.cookie("number_limit") || 20;
            var mode = 'all';
            var content_group = '6';
            var mn = 'mn_room';
            var catid = 'all';
            var search_text = '';

            if(hash.indexOf('?') >= 0){
                var q = hash.substring(hash.indexOf('?') + 1);
                var pairs = q.split('&');
                for(var i = 0; i < pairs.length; i++){
                    var kv = pairs[i].split('=');
                    if(kv[0] === 'mode') mode = kv[1];
                    if(kv[0] === 'content_group') content_group = kv[1];
                    if(kv[0] === 'mn') mn = kv[1];
                    if(kv[0] === 'catid') catid = kv[1];
                    if(kv[0] === 'search_text') search_text = decodeURIComponent(kv[1]);
                    if(kv[0] === 'page') page = kv[1];
                }
            }

            var other = '&content_group=' + content_group + '&mn=' + mn + '&catid=' + catid + '&search_text=' + encodeURIComponent(search_text) + '&sort_by=' + sortDir;
            ajax_load_content('content', page, limit, mode, other);
        }catch(err){
            alert("Sort error: "+err);
        }
    }
    function content_process(url,reload){
        if(confirm('Bạn có chắc muốn thực hiện thao tác?')){
            show_alert_doing2();
            $.get(base_folder+url,function(data) {
                close_alert_doing2();
                if(reload==1){
                    window.location.reload();
                }
                else{
                    show_alert_message(data,success_text_color);
                }
            });
        }
        return false;
    }
    function show_content_info(obj){
        var index = obj.parent().parent().find("a").index(obj);
        $(".tab_content_info").hide();
        obj.parent().parent().find("li.active").removeAttr("class");
        obj.parent().attr("class","active");
        $(".tab_content_info:eq("+index+")").show();
        $(".tab_content_info:eq("+index+")").find("textarea").each(function(i){
            if($(this).attr("editor_format")=="true"){
                var width = $(this).attr("width");var height = $(this).attr("height");
                if($(this).attr("fill_height")=="true"){
                    height = content_height - 200;
                }
                if($(this).attr("fill_width")=="true"){
                    width = screen_width - 275;
                }
                var config = {startupFocus:false,toolbar:[['Styles','Font','FontSize','Bold','Italic','Underline','Strike','NumberedList','BulletedList','JustifyLeft','JustifyCenter','JustifyRight','JustifyBlock','TextColor','BGColor'],['RemoveFormat','Source'],['Link','Unlink','Image','Table','Iframe','Flash','Find']],uiColor : '#F4F5F7',width: width,height: height};
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
        if(obj.attr("funct_name")!=undefined){
            var call_func = obj.attr("funct_name");
            var param_function = obj.attr("funct_param");
            var fn = window[call_func];
            fn(param_function);
        }
    }
    
    $("#change_status_of_content").find("li").live("click", function(){        
        var current_request = $(this).attr("request");
        var current_function = $(this).attr("function");
        var current_process = $(this).attr("process");
        var current_page = $(this).parent().attr("page");
        var current_number_limit = $(this).parent().attr("number_limit");
        var current_mode = $(this).parent().attr("mode");
        var catid = $(this).parent().attr("catid");
        var content_group = $(this).parent().attr("content_group");
        var list = 0;
        $("[name='select']:checked").each(function(i){
            list = list + "," + $(this).val();
        });
        if(list!=0&&list!=""){
            if(confirm('Bạn có chắc muốn thực hiện thao tác?')){
                show_alert_doing2();
                $.get(base_folder+"admincp/modules/"+current_function+current_process+".php?id="+list+current_request, function(data) {
                    if(data.indexOf('<font')==-1){
                        $.get(base_folder+"admincp/modules/"+current_function+".php?ajax=1&page="+current_page+"&limit="+current_number_limit+"&mode="+current_mode+"&catid="+catid+"&content_group="+content_group, function(data) {
                            $("#admin_content_list").html(data);
                            close_alert_doing2();
                        });
                    }
                    else{
                        show_alert_message(data,success_text_color);
                        close_alert_doing2();
                    }
                });
            }
        }
        else{
            show_alert_message("Vui lòng chọn nội dung.",error_text_color);
        }
    });
    $("#change_column_of_list").find("li").live("click", function(){        
        var current_page = $(this).parent().attr("page");
        var current_number_limit = $(this).parent().attr("number_limit");
        var current_mode = $(this).parent().attr("mode");
        var catid = $(this).parent().attr("catid");
        var content_group = $(this).parent().attr("content_group");
        var cookie_name = $(this).parent().attr("cookie_name");
        var index = $("#change_column_of_list").find("li").index($(this));
        var current_cookie = ','+$.cookie(cookie_name)+',';
        if($(this).find("a").attr("class")=="tick"){ // Not showing
            $(this).find("a").attr("class","tick_active");
            $(".listnews_content .header").find("span:eq("+index+")").show();
            $(".listnews_content .lc_content .rows").each(function(i){
                $(this).find("span:eq("+index+")").show();
            });
            current_cookie = $.cookie(cookie_name) + "," + index;
        }
        else{ //showing
            $(this).find("a").attr("class","tick");
            $(".listnews_content .header").find("span:eq("+index+")").hide();
            $(".listnews_content .lc_content .rows").each(function(i){
                $(this).find("span:eq("+index+")").hide();
            });
            current_cookie = current_cookie.replace(","+index+",",",");
            //alert(index);
        }
        if(current_cookie.indexOf(",")==0){current_cookie=current_cookie.substring(1);}
        if(current_cookie.lastIndexOf(",")==current_cookie.length-1){current_cookie=current_cookie.substring(0,current_cookie.lastIndexOf(","));}
        $.cookie(cookie_name,current_cookie,{ path: base_folder,domain: '.'+domain });
    });
    $("#tab_mode_menu").find("li").live("click", function(){
        $("#tab_mode_menu").find("li.active").removeClass('active');
        $(this).addClass('active');
        var mode = $(this).attr("mode");
        var limit = $("[name='fPage']").val();
        ajax_load_content($(this).attr("name"),1,limit,mode,'');
    });
    function check_all_checkbox(){
        if($("[name='selectall']").attr('checked')){
            $("[name='select']").each(function(i){
                $(this).attr('checked', true);
            });
        }
        else{
            $("[name='select']").each(function(i){
                $(this).attr('checked', false);
            });
        }
    }
    function change_language_of_catalog(){
        $("[name='fParentid']").val("0");
        //$("[name='fContent_group']").val("0");
        $("#form_add div[id^='category_']").each(function(index){
            if(index > 0){
                $(this).css("display", "none");
            } 
            else{
                $(this).find("option").removeAttr("selected");
            }
        });
    }
    function change_product_catalogs(string,level,id,content_group){
        if(string==""){return false;}
        arr_str = string.split("_");
        languageid = $("[name='fLanguage']").val();
        catid = 0;
        if($("[name='fCatid']").length>0){
            catid = $("[name='fCatid']").val();
        }
        if(content_group==0){
            $("[name='fParentid']").val(arr_str[1]);
        }
        else{
            $("[name='fParentid']").val("0");
            $("[name='fContent_group']").val(string);
            content_group = string;
        }
        if(arr_str[0] == "true"){
            $("#form_add div[id^='category_']").each(function(index){
                if(index > level){
                    $(this).css("display", "none");
                } 
            });
            return false;
        }
        else{
            current_level = level + 1;
            $("#category_" + (level + 1)).html("");
            show_alert_doing();
            $.get(base_folder+"admincp/modules/catalog_add_load_select_category.php?id="+arr_str[1]+"&finish=0&content_group="+content_group+"&level="+level+"&languageid="+languageid+"&catid="+catid, function(data) {
                if(data!=""){
                    $("#category_" + (level + 1)).html('<div class="current_level">Cấp '+current_level+'</div>'+data);
                }
                close_alert_doing();
                $("#form_add div[id^='category_']").each(function(index){
                    display = (index <= (level+1) ? "block" : "none");
                    $(this).css("display", display);
                });
            });
        }
    }
    function change_catalogs_of_content_add(string,level,id,content_group){
        if(string==""){return false;}
        arr_str = string.split("_");
        languageid = $("[name='fLanguage']").val();
        if(content_group==0){
            $("[name='fCatid']").val(arr_str[1]);
        }
        else{
            $("[name='fCatid']").val("0");
            $("[name='fContent_group']").val(string);
            content_group = string;
        }
        if(arr_str[0] == "true"){
            $("#form_add div[id^='category_']").each(function(index){
                if(index > level){
                    $(this).css("display", "none");
                } 
            });
            return false;
        }
        else{
            current_level = level + 1;
            $("#category_" + (level + 1)).html("");
            show_alert_doing();
            $.get(base_folder+"admincp/modules/content_add_load_select_category.php?id="+arr_str[1]+"&finish=0&content_group="+content_group+"&level="+level+"&languageid="+languageid, function(data) {
                $("#category_" + (level + 1)).html('<div class="current_level">Cấp '+current_level+'</div>'+data);
                close_alert_doing();
                $("#form_add div[id^='category_']").each(function(index){
                    display = (index <= (level+1) ? "block" : "none");
                    $(this).css("display", display);
                });
            });
        }
    }
    // Catalog left
    function change_catalogs_left_show_of_catalog_add(obj,string,level,id,content_group){
        var directory = "";
        if(string==""){return false;}
        languageid = $("[name='fLanguage']").val();
        $("#form_add div[id^='category_left_']").each(function(index){
            if(index<=level){
                if($(this).find("select option:selected").length>0){
                    if(directory==""){
                        directory = directory + '<u>' + $(this).find("select option:selected").html() + '</u>';
                    }
                    else{
                        directory = directory + ' &gt; <u>' + $(this).find("select option:selected").html() + '</u>';
                    }
                }
            }
        });
        $("#current_left_selected").html(directory);
        arr_str = string.split("_");
        if(content_group==0){
            $("#current_left_select_value").val(arr_str[1]);
        }
        else{
            $("#current_left_select_value").val("0");
            content_group = string;
        }
        if(arr_str[0]=="true"){
            $("#form_add div[id^='category_left_']").each(function(index){
                if(index > level){
                    $(this).css("display", "none");
                } 
            });
            return false;
        }
        else{
            show_alert_doing();
            $.get(base_folder+"admincp/modules/catalog_left_load_select_category.php?id="+arr_str[1]+"&finish=0&content_group="+content_group+"&level="+level+"&languageid="+languageid, function(data) {
                $("#category_left_" + (level + 1)).html(data);
                close_alert_doing();
            });
        }
        $("#form_add div[id^='category_left_']").each(function(index){
            display = (index <= (level+1) ? "block" : "none");
            $(this).css("display", display);
        });
    }
    function add_catalog_left_category(){
        var value = $("#current_left_select_value").val();
        var current_list = $("[name='fCatalog_left']").val() + ",";
        if(value==0){
            show_alert_message("Vui lòng chọn danh mục!",error_text_color);
        }
        else{
            if(current_list.indexOf(","+value+"-")>0){
                show_alert_message("Danh mục đã được chọn trước đó! Vui lòng chọn danh mục khác.",error_text_color);
            }
            else{
                // Add value
                var id = value;
                var ordering = $("[name='fCatalog_left_ordering']").val();
                var style = $("[name='fStyle_in_left']").val();
                var idata = id + "-" + ordering + "-" + style;
                var add_value = $("[name='fCatalog_left']").val() + "," + id + "-" + ordering + "-" + style;
                $("[name='fCatalog_left']").val(add_value);
                
                var number = parseInt($("[name='fCatalog_left_number']").val());
                number = number + 1; 
                $("[name='fCatalog_left_number']").val(number);
                add_value2 = $("#catalog_left_list").html()+'<p><b id="directory_left_'+ordering+'">'+number+' .</b> Thứ tự ' + ordering + ' - Kiểu '+style+' - ' +$("#current_left_selected").html()+'&nbsp;&nbsp;&nbsp;<a idata="'+idata+'" href="javascript:;" onclick="remove_catalog_left_category($(this));"><img align="absMiddle" src="'+base_folder+'admincp/media/remove-icon.gif"></a></p>';
                $("#catalog_left_list").html(add_value2);
                show_alert_message("Thêm danh mục thành công!",success_text_color);
            }
        }
    }
    function remove_catalog_left_category(obj){
        var number = parseInt($("[name='fCatalog_left_number']").val());
        if(number>0){
            number = number - 1;
        }
        else{
            number = 0;
        }
        $("[name='fCatalog_left_number']").val(number);
        var current_list = $("[name='fCatalog_left']").val() + ",";
        current_list = current_list.replace(","+obj.attr("idata")+",",",");
        if(current_list.lastIndexOf(",")==current_list.length-1){
            current_list = current_list.substring(0,current_list.lastIndexOf(","));
        }
        $("[name='fCatalog_left']").val(current_list);
        obj.parent().remove();
        $("#form_add b[id^='directory_left_']").each(function(index){
            number = index + 1;
            $(this).html(number+". ");
        });
    }
    // Catalog right
    function change_catalogs_right_show_of_catalog_add(obj,string,level,id,content_group){
        var directory = "";
        if(string==""){return false;}
        languageid = $("[name='fLanguage']").val();
        $("#form_add div[id^='category_right_']").each(function(index){
            if(index<=level){
                if($(this).find("select option:selected").length>0){
                    if(directory==""){
                        directory = directory + '<u>' + $(this).find("select option:selected").html() + '</u>';
                    }
                    else{
                        directory = directory + ' &gt; <u>' + $(this).find("select option:selected").html() + '</u>';
                    }
                }
            }
        });
        $("#current_right_selected").html(directory);
        arr_str = string.split("_");
        if(content_group==0){
            $("#current_right_select_value").val(arr_str[1]);
        }
        else{
            $("#current_right_select_value").val("0");
            content_group = string;
        }
        if(arr_str[0]=="true"){
            $("#form_add div[id^='category_right_']").each(function(index){
                if(index > level){
                    $(this).css("display", "none");
                } 
            });
            return false;
        }
        else{
            show_alert_doing();
            $.get(base_folder+"admincp/modules/catalog_right_load_select_category.php?id="+arr_str[1]+"&finish=0&content_group="+content_group+"&level="+level+"&languageid="+languageid, function(data) {
                $("#category_right_" + (level + 1)).html(data);
                close_alert_doing();
            });
        }
        $("#form_add div[id^='category_right_']").each(function(index){
            display = (index <= (level+1) ? "block" : "none");
            $(this).css("display", display);
        });
    }
    function add_catalog_right_category(){
        var value = $("#current_right_select_value").val();
        var current_list = $("[name='fCatalog_right']").val() + ",";
        if(value==0){
            show_alert_message("Vui lòng chọn danh mục!",error_text_color);
        }
        else{
            if(current_list.indexOf(","+value+"-")>0){
                show_alert_message("Danh mục đã được chọn trước đó! Vui lòng chọn danh mục khác.",error_text_color);
            }
            else{
                // Add value
                var id = value;
                var ordering = $("[name='fCatalog_right_ordering']").val();
                var style = $("[name='fStyle_in_right']").val();
                var idata = id + "-" + ordering + "-" + style;
                var add_value = $("[name='fCatalog_right']").val() + "," + id + "-" + ordering + "-" + style;
                $("[name='fCatalog_right']").val(add_value);
                
                var number = parseInt($("[name='fCatalog_right_number']").val());
                number = number + 1; 
                $("[name='fCatalog_right_number']").val(number);
                add_value2 = $("#catalog_right_list").html()+'<p><b id="directory_right_'+ordering+'">'+number+' .</b> Thứ tự ' + ordering + ' - Kiểu '+style+' - ' +$("#current_right_selected").html()+'&nbsp;&nbsp;&nbsp;<a idata="'+idata+'" href="javascript:;" onclick="remove_catalog_right_category($(this));"><img align="absMiddle" src="'+base_folder+'admincp/media/remove-icon.gif"></a></p>';
                $("#catalog_right_list").html(add_value2);
                show_alert_message("Thêm danh mục thành công!",success_text_color);
            }
        }
    }
    function remove_catalog_right_category(obj){
        var number = parseInt($("[name='fCatalog_right_number']").val());
        if(number>0){
            number = number - 1;
        }
        else{
            number = 0;
        }
        $("[name='fCatalog_right_number']").val(number);
        var current_list = $("[name='fCatalog_right']").val() + ",";
        current_list = current_list.replace(","+obj.attr("idata")+",",",");
        if(current_list.lastIndexOf(",")==current_list.length-1){
            current_list = current_list.substring(0,current_list.lastIndexOf(","));
        }
        $("[name='fCatalog_right']").val(current_list);
        obj.parent().remove();
        $("#form_add b[id^='directory_right_']").each(function(index){
            number = index + 1;
            $(this).html(number+". ");
        });
    }
    // Catalog center
    function change_catalogs_center_show_of_catalog_add(obj,string,level,id,content_group){
        var directory = "";
        if(string==""){return false;}
        languageid = $("[name='fLanguage']").val();
        $("#form_add div[id^='category_center_']").each(function(index){
            if(index<=level){
                if($(this).find("select option:selected").length>0){
                    if(directory==""){
                        directory = directory + '<u>' + $(this).find("select option:selected").html() + '</u>';
                    }
                    else{
                        directory = directory + ' &gt; <u>' + $(this).find("select option:selected").html() + '</u>';
                    }
                }
            }
        });
        $("#current_center_selected").html(directory);
        arr_str = string.split("_");
        if(content_group==0){
            $("#current_center_select_value").val(arr_str[1]);
        }
        else{
            $("#current_center_select_value").val("0");
            content_group = string;
        }
        if(arr_str[0]=="true"){
            $("#form_add div[id^='category_center_']").each(function(index){
                if(index > level){
                    $(this).css("display", "none");
                } 
            });
            return false;
        }
        else{
            show_alert_doing();
            $.get(base_folder+"admincp/modules/catalog_center_load_select_category.php?id="+arr_str[1]+"&finish=0&content_group="+content_group+"&level="+level+"&languageid="+languageid, function(data) {
                $("#category_center_" + (level + 1)).html(data);
                close_alert_doing();
            });
        }
        $("#form_add div[id^='category_center_']").each(function(index){
            display = (index <= (level+1) ? "block" : "none");
            $(this).css("display", display);
        });
    }
    function add_catalog_center_category(){
        var value = $("#current_center_select_value").val();
        var current_list = $("[name='fCatalog_center']").val() + ",";
        if(value==0){
            show_alert_message("Vui lòng chọn danh mục!",error_text_color);
        }
        else{
            if(current_list.indexOf(","+value+"-")>0){
                show_alert_message("Danh mục đã được chọn trước đó! Vui lòng chọn danh mục khác.",error_text_color);
            }
            else{
                // Add value
                var id = value;
                var ordering = $("[name='fCatalog_center_ordering']").val();
                var style = $("[name='fStyle_in_center']").val();
                var idata = id + "-" + ordering + "-" + style;
                var add_value = $("[name='fCatalog_center']").val() + "," + id + "-" + ordering + "-" + style;
                $("[name='fCatalog_center']").val(add_value);
                var number = parseInt($("[name='fCatalog_center_number']").val());
                number = number + 1; 
                $("[name='fCatalog_center_number']").val(number);
                add_value2 = $("#catalog_center_list").html()+'<p><b id="directory_center_'+ordering+'">'+number+' .</b> Thứ tự ' + ordering + ' - Kiểu '+style+' - ' +$("#current_center_selected").html()+'&nbsp;&nbsp;&nbsp;<a idata="'+idata+'" href="javascript:;" onclick="remove_catalog_center_category($(this));"><img align="absMiddle" src="'+base_folder+'admincp/media/remove-icon.gif"></a></p>';
                $("#catalog_center_list").html(add_value2);
                show_alert_message("Thêm danh mục thành công!",success_text_color);
            }
        }
    }
    function remove_catalog_center_category(obj){
        var number = parseInt($("[name='fCatalog_center_number']").val());
        if(number>0){
            number = number - 1;
        }
        else{
            number = 0;
        }
        $("[name='fCatalog_center_number']").val(number);
        var current_list = $("[name='fCatalog_center']").val() + ",";
        current_list = current_list.replace(","+obj.attr("idata")+",",",");
        if(current_list.lastIndexOf(",")==current_list.length-1){
            current_list = current_list.substring(0,current_list.lastIndexOf(","));
        }
        $("[name='fCatalog_center']").val(current_list);
        obj.parent().remove();
        $("#form_add b[id^='directory_center_']").each(function(index){
            number = index + 1;
            $(this).html(number+". ");
        });
    }
    // Search catalog
    function load_catalog_ajax_by_language(){
        load_catalogs_ajax('0',0,0,0);
    }
    function load_catalogs_ajax(string,level,id,content_group){
        page = 1;
        languageid = $("[name='fLanguage']").val();
        mode = $("#tab_mode_menu").find("li.active").attr("mode");
        catid = "all";
        arr_str = string.split("_");
        if(string.indexOf("_")>=0){
            catid = arr_str[1];
        }
        if(arr_str[0] == "true"){
            $("#admin_content_list span[id^='category_']").each(function(index){
                if(index > level){
                    $(this).css("display", "none");
                } 
            });
        }
        else{
            $("#admin_content_list span[id^='category_']").each(function(index){
                display = (index <= (level+1) ? "block" : "none");
                $(this).css("display", display);
                if(index > (level)){
                    $(this).html("");
                }
            });
        }
        show_alert_doing2();
        $.get(base_folder+"admincp/modules/catalog_search_load_select_category.php?id="+catid+"&finish=0&content_group="+content_group+"&level="+level+"&languageid="+languageid, function(data) {
                $("#category_" + (level + 1)).html(data);
                variable_get = "page="+page+"&limit="+$.cookie("number_limit")+"&mode="+mode+'&catid='+catid+'&content_group='+content_group+'&languageid='+languageid;
                url = base_folder+"admincp/modules/catalog.php?ajax=1&"+variable_get;
                window.location = '#catalog?'+variable_get;
                $.get(url, function(data) {
                    $("#admin_content_list").html(data);
                    close_alert_doing2();
                });
                //ajax_load_content('catalog',1,$.cookie("number_limit"),mode,'&catid='+catid+'&content_group='+content_group+'&languageid='+languageid);
            });
        return false;
        
    }
    function change_region_of_content_add(string,level,id,content_group){
        if(string==""){return false;}
        arr_str = string.split("_");
        languageid = $("[name='fLanguage']").val();
        if(content_group==0){
            $("[name='fRegionid']").val(arr_str[1]);
        }
        else{
            $("[name='fRegionid']").val("0");
            content_group = string;
        }
        if(arr_str[0] == "true"){
            $("#form_add div[id^='region_choose_']").each(function(index){
                if(index > level){
                    $(this).css("display", "none");
                } 
            });
            return false;
        }
        else{
            $("#region_choose_" + (level + 1)).html("");
            show_alert_doing();
            $.get(base_folder+"admincp/modules/content_add_load_select_region.php?id="+arr_str[1]+"&finish=0&content_group="+content_group+"&level="+level+"&languageid="+languageid, function(data) {
                $("#region_choose_" + (level + 1)).html(data);
                close_alert_doing();
                $("#form_add div[id^='region_choose_']").each(function(index){
                    display = (index <= (level+1) ? "block" : "none");
                    $(this).css("display", display);
                });
            });
        }
    }
    // Region
    function load_region_ajax(string,level,id,content_group){
        page = 1;
        languageid = $("[name='fLanguage']").val();
        mode = $("#tab_mode_menu").find("li.active").attr("mode");
        catid = "all";
        arr_str = string.split("_");
        if(string.indexOf("_")>=0){
            catid = arr_str[1];
        }
        if(arr_str[0] == "true"){
            $("#admin_content_list span[id^='category_']").each(function(index){
                if(index > level){
                    $(this).css("display", "none");
                } 
            });
        }
        else{
            $("#admin_content_list span[id^='category_']").each(function(index){
                display = (index <= (level+1) ? "block" : "none");
                $(this).css("display", display);
                if(index > (level)){
                    $(this).html("");
                }
            });
        }
        show_alert_doing2();
        $.get(base_folder+"admincp/modules/region_search_load_select_category.php?id="+catid+"&finish=0&content_group="+content_group+"&level="+level+"&languageid="+languageid, function(data) {
                $("#category_" + (level + 1)).html(data);
                variable_get = "page="+page+"&limit="+$.cookie("number_limit")+"&mode="+mode+'&catid='+catid+'&content_group='+content_group+'&languageid='+languageid;
                url = base_folder+"admincp/modules/region.php?ajax=1&"+variable_get;
                window.location = '#region?'+variable_get;
                $.get(url, function(data) {
                    $("#admin_content_list").html(data);
                    close_alert_doing2();
                });
                //ajax_load_content('catalog',1,$.cookie("number_limit"),mode,'&catid='+catid+'&content_group='+content_group+'&languageid='+languageid);
            });
        return false;
        
    }
    function change_region_add(string,level,id,content_group){
        arr_str = string.split("_");
        languageid = $("[name='fLanguage']").val();
        catid = 0;
        if($("[name='fID']").length>0){
            catid = $("[name='fID']").val();
        }
        if(content_group==0){
            $("[name='fParentid']").val(arr_str[1]);
        }
        else{
            $("[name='fParentid']").val("0");
            $("[name='fContent_group']").val(string);
            content_group = string;
        }
        if(arr_str[0] == "true"){
            $("#form_add div[id^='category_']").each(function(index){
                if(index > level){
                    $(this).css("display", "none");
                } 
            });
            return false;
        }
        else{
            $("#category_" + (level + 1)).html("");
            show_alert_doing();
            $.get(base_folder+"admincp/modules/region_add_load_select_category.php?id="+arr_str[1]+"&finish=0&level="+level+"&languageid="+languageid+"&catid="+catid+"&content_group="+content_group, function(data) {
                $("#category_" + (level + 1)).html(data);
                close_alert_doing();
                $("#form_add div[id^='category_']").each(function(index){
                    display = (index <= (level+1) ? "block" : "none");
                    $(this).css("display", display);
                });
            });
        }
    }
    // Real type
    function change_realtype_add(string,level,id,content_group){
        arr_str = string.split("_");
        languageid = $("[name='fLanguage']").val();
        catid = 0;
        if($("[name='fID']").length>0){
            catid = $("[name='fID']").val();
        }
        if(content_group==0){
            $("[name='fParentid']").val(arr_str[1]);
        }
        else{
            $("[name='fParentid']").val("0");
            $("[name='fContent_group']").val(string);
            content_group = string;
        }
        if(arr_str[0] == "true"){
            $("#form_add div[id^='category_']").each(function(index){
                if(index > level){
                    $(this).css("display", "none");
                } 
            });
            return false;
        }
        else{
            $("#category_" + (level + 1)).html("");
            show_alert_doing();
            $.get(base_folder+"admincp/modules/realtype_add_load_select_category.php?id="+arr_str[1]+"&finish=0&level="+level+"&languageid="+languageid+"&catid="+catid+"&content_group="+content_group, function(data) {
                $("#category_" + (level + 1)).html(data);
                close_alert_doing();
                $("#form_add div[id^='category_']").each(function(index){
                    display = (index <= (level+1) ? "block" : "none");
                    $(this).css("display", display);
                });
            });
        }
    }
    
    // Content special
    function remove_customer_to_list(obj){
        var tr_parent = obj.parent().parent();
        var contentid = obj.attr("idata");
        var obj_value_old = obj.html();
        var obj_value_new = '<a idata="'+contentid+'" href="javascript:;" onclick="add_customer_to_list($(this));"><img src="'+base_folder+'admincp/media/add.png"/></a>';
        var add_value = "<tr>"+tr_parent.html()+"</tr>";
        add_value = add_value.replace(obj_value_old,obj_value_new);
        $("#customer_list_choose").prepend(add_value);
        tr_parent.remove();
        var customer_selected = ","+$("[name='fCustomer_selected']").val()+",";
        customer_selected = customer_selected.replace(","+contentid+",",",");
        if(customer_selected.indexOf(",")==0){
            customer_selected = customer_selected.substring(1);
        }
        if(customer_selected.lastIndexOf(",")==customer_selected.length-1){
            customer_selected = customer_selected.substring(0,customer_selected.lastIndexOf(","));
        }
        $("[name='fCustomer_selected']").val(customer_selected);
    }
    function add_customer_to_list(obj){
        var tr_parent = obj.parent().parent();
        var contentid = obj.attr("idata");
        var obj_value_old = obj.html();
        var obj_value_new = '<a idata="'+contentid+'" href="javascript:;" onclick="remove_customer_to_list($(this));"><img src="'+base_folder+'admincp/media/remove.png"/></a>';
        var add_value = "<tr>"+tr_parent.html()+"</tr>";
        add_value = add_value.replace(obj_value_old,obj_value_new);
        $("#customer_list_selected").prepend(add_value);
        tr_parent.remove();
        var customer_selected = $("[name='fCustomer_selected']").val();
        if(customer_selected==""){
            customer_selected = contentid;
        }
        else{
            customer_selected = customer_selected + "," + contentid;
        }
        $("[name='fCustomer_selected']").val(customer_selected);
    }
    // Search content
    function change_catalogs_ajax(string,level,id,content_group){
        page = 1;
        languageid = $("[name='fLanguage']").val();
        search_text = $("[name='fSearch_text']").val();
        mode = $("#tab_mode_menu").find("li.active").attr("mode");
        catid = "all";
        arr_str = string.split("_");
        if(string.indexOf("_")>=0){
            catid = arr_str[1];
        }
        if(arr_str[0] == "true"){
            $("#admin_content_list span[id^='category_']").each(function(index){
                if(index > level){
                    $(this).css("display", "none");
                } 
            });
        }
        else{
            $("#admin_content_list span[id^='category_']").each(function(index){
                display = (index <= (level+1) ? "block" : "none");
                $(this).css("display", display);
                if(index > (level)){
                    $(this).html("");
                }
            });
        }
        show_alert_doing2();
        $.get(base_folder+"admincp/modules/catalog_search_load_select_category.php?id="+catid+"&finish=0&content_group="+content_group+"&level="+level+"&languageid="+languageid, function(data) {
            $("#category_" + (level + 1)).html(data);
            variable_get = "page="+page+"&limit="+$.cookie("number_limit")+"&mode="+mode+'&catid='+catid+'&search_text='+search_text+'&content_group='+content_group+'&languageid='+languageid;
            url = base_folder+"admincp/modules/content.php?ajax=1&"+variable_get;
            window.location = '#content?'+variable_get;
            $.get(url, function(data) {
                $("#admin_content_list").html(data);
                close_alert_doing2();
            });
        });
        return false;
        
    }
    function search_text_content_submit(obj,event,search_text){
        var key = event.keyCode || event.which;
        if(key==13){
            var current_function = $(obj).attr("function");
            var languageid = $(obj).attr("languageid");
            var page = $(obj).attr("page");
            var number_limit = $(obj).attr("number_limit");
            var mode = $(obj).attr("mode");
            var catid = $(obj).attr("catid");
            var content_group = $(obj).attr("content_group");
            
            
            var variable_get = "page="+page+"&limit="+number_limit+"&mode="+mode+"&catid="+catid+"&search_text="+search_text+"&content_group="+content_group+"&languageid="+languageid;
            var url = base_folder+"admincp/modules/"+current_function+".php?ajax=1&"+variable_get;
            window.location = '#'+current_function+'?'+variable_get;
            show_alert_doing2();
            $.get(url, function(data) {
                $("#admin_content_list").html(data);
                close_alert_doing2();
            });
        }
    }
    function frmProcess_save_click(){
        $("[name='fSubmit_require']").val("1");
        
    }
    function frmProcess_before_submit(){
        try{
            var value_return = true;
            $("input").each(function(i){
                if($(this).attr('require')=='true'){
                    var compare_require = $(this).attr('compare_require');
                    var name_require = $(this).attr('name_require');
                    if(compare_require==$(this).val()){
                        show_alert_message('Vui lòng nhập đúng '+name_require+'!',error_text_color);
                        $(this).focus();
                        value_return = false;
                        return false;
                    }
                }
            });
            $("textarea").each(function(i){
                if($(this).attr('require')=='true'){
                    var compare_require = $(this).attr('compare_require');
                    var name_require = $(this).attr('name_require');
                    if(compare_require==$(this).val()){
                        show_alert_message('Vui lòng nhập đúng '+name_require+'!',error_text_color);
                        $(this).focus();
                        value_return = false;
                        return false;
                    }
                }
            });
            if(value_return==true){
                get_slide_content_from_image_list();
                show_alert_doing2();
                return true;
            }
            else{
                return false;
            }
        }
        catch(err){alert(err);return false;}
    }
    function frmProcess_after_submit(message,status,url_refresh,container){
        //close_alert_doing2();
        try{
        if(status==1){
            show_alert_message(message,success_text_color);
            get_data_from_url_ajax(url_refresh,false,container);   
        }
        if(status==2){
            close_alert_doing2();
            show_alert_message(message,success_text_color);
        }
        if(status==3){
            close_alert_doing2();
            document.frmProcess.reset();
            $(".tab_content_info").each(function(i){
                $(this).find("textarea").each(function(j){
                    $(this).val("");
                });
            });
            $("#form_add div[id^='category_']").each(function(index){
                if(index > 0){
                    $(this).css("display", "none");
                } 
            });
            show_alert_message(message,success_text_color);
        }
        if(status==4){
            window.location.reload();
            show_alert_message(message,success_text_color);
        }
        if(status==5){
            show_alert_doing2();
            var loadurl = process_hyperlink_for_loading();
            if(loadurl!=""){
                $.get(loadurl, function(data) {
                    $("#admin_content").html(data);
                    process_after_get_content_ajax('admin_content');
                    close_alert_doing2();
                    show_alert_message(message,success_text_color);
                });
            }
        }
        if(status==10){ // Reset to default
            $(".tab_content_info").each(function(i){
                $(this).find("textarea").each(function(indextextarea){
                    if($(this).attr("reset")=="true"){
                        $(this).val($(this).attr("default"));
                    }
                });
                $(this).find("input").each(function(indexinput){
                    if($(this).attr("reset")=="true"){
                        $(this).val($(this).attr("default"));
                    }
                });
            });
            $("#image_list").html("");
            $("#count_image_upload").html("0");
            $("#color_list").html("");
            $("#count_color_upload").html("0");
            $("[name='hotel_room_list_tbl']").find("tr.item").remove();
            $("[name='hotel_room_total_number']").val('0');
            close_alert_doing2();
            show_alert_message(message,success_text_color);
            
        }
        if(status==0){
            close_alert_doing2();
            show_alert_message(message,error_text_color);
        }
        }catch(err){alert(err);}
    }
    //Upload process
    function content_upload_image_submit(){
        show_alert_doing();
    }
    function upload_fast(){
        show_alert_doing();
        $('#frmUpload_target').submit();
    }
    function choose_file_upload_fast(max_size,target,filename){
        //show_alert_doing();
        $('#frmUpload_target > [name="filename"]').val(filename);
        $('#frmUpload_target > [name="fMaxsize"]').val(max_size);
        $('#frmUpload_target > [name="fTarget"]').val(target);
        $('#frmUpload_target > [name="userfile"]').click();
        return false;
    }
    function content_upload_image_status(message,url,name,status){
        try{
            $('#frmUpload_target')[0].reset();
            close_alert_doing();
            if(status==0){
                show_alert_message(message,error_text_color);
            }
            else{
                show_alert_message(message,success_text_color);
                $("[name='"+name+"']").val(url);
            }
            return true;
        }
        catch(err){alert(err);return false;}
    }
    // USER
    function change_passsword(obj){
        if(obj.attr("state")=="off"){
            $("#change_password_container").show();
        }
        else{
            $("#change_password_container").hide();
        }
    }
    // ADV
    function change_language_of_adv(){
        $("#current_select_value").val("0");
        //$("[name='fContent_group']").val("0");
        $("#form_add div[id^='category_']").each(function(index){
            if(index > 0){
                $(this).css("display", "none");
            } 
            else{
                $(this).find("option").removeAttr("selected");
            }
        });
    }
    function change_catalogs_show_of_adv_add(obj,string,level,id,content_group){
        if(string==""){return false;}
        var directory = "";
        languageid = $("[name='fLanguage']").val();
        $("#form_add div[id^='category_']").each(function(index){
            if(index<=level){
                if($(this).find("select option:selected").length>0){
                    if(directory==""){
                        directory = directory + '<u>' + $(this).find("select option:selected").html() + '</u>';
                    }
                    else{
                        directory = directory + ' &gt; <u>' + $(this).find("select option:selected").html() + '</u>';
                    }
                }
            }
        });
        $("#current_selected").html(directory);
        arr_str = string.split("_");
        if(content_group==0){
            $("#current_select_value").val(arr_str[1]);
        }
        else{
            $("#current_select_value").val("0");
            content_group = string;
        }
        if(arr_str[0]=="true"){
            $("#form_add div[id^='category_']").each(function(index){
                if(index > level){
                    $(this).css("display", "none");
                } 
            });
            return false;
        }
        else{
            show_alert_doing();
            $.get(base_folder+"admincp/modules/adv_load_select_category.php?id="+arr_str[1]+"&finish=0&content_group="+content_group+"&level="+level+"&languageid="+languageid, function(data) {
                $("#category_" + (level + 1)).html(data);
                close_alert_doing();
            });
        }
        $("#form_add div[id^='category_']").each(function(index){
            display = (index <= (level+1) ? "block" : "none");
            $(this).css("display", display);
        });
    }
    function add_adv_category(){
        var value = $("#current_select_value").val();
        var current_list = $("[name='fCatalog_show']").val() + ",";
        if(value==0){
            show_alert_message("Vui lòng chọn danh mục!",error_text_color);
        }
        else{
            if(current_list.indexOf(","+value+",")>0){
                show_alert_message("Danh mục đã được chọn trước đó! Vui lòng chọn danh mục khác.",error_text_color);
            }
            else{
                // Add value
                var id = value;
                var ordering = $("[name='fCatalog_show_ordering']").val();
                var idata = id + "-" + ordering;
                var add_value = $("[name='fCatalog_show']").val() + "," + id + "-" + ordering;
                var number = parseInt($("[name='fCatalog_show_number']").val());
                number = number + 1; 
                $("[name='fCatalog_show_number']").val(number);
                $("[name='fCatalog_show']").val(add_value);
                
                add_value2 = $("#catalog_show_list").html()+'<p><b id="directory_'+number+'">' + number + '.</b> Thứ tự ' + ordering + ' - ' +$("#current_selected").html()+'&nbsp;&nbsp;&nbsp;<a idata="'+id + "-" + ordering+'" href="javascript:;" onclick="remove_adv_category($(this));"><img align="absMiddle" src="'+base_folder+'admincp/media/remove-icon.gif"></a></p>';
                $("#catalog_show_list").html(add_value2);
                show_alert_message("Thêm danh mục thành công!",success_text_color);
            }
        }
    }
    function remove_adv_category(obj){
        var number = parseInt($("[name='fCatalog_show_number']").val());
        if(number>0){
            number = number - 1;
        }
        else{
            number = 0;
        }
        var current_list = $("[name='fCatalog_show']").val() + ",";
        current_list = current_list.replace(","+obj.attr("idata")+",",",");
        if(current_list.lastIndexOf(",")==current_list.length-1){
            current_list = current_list.substring(0,current_list.lastIndexOf(","));
        }
        $("[name='fCatalog_show']").val(current_list);
        $("[name='fCatalog_show_number']").val(number);
        obj.parent().remove();
        $("#form_add b[id^='directory_']").each(function(index){
            number = index + 1;
            $(this).html(number+". ");
        });
    }
    // Content info special 
    function remove_size_list_from_list(obj){
        var parent_obj = obj.parent().parent().parent();
        var number_obj = parent_obj.find(".cf_size_list_number");
        var type_obj = parent_obj.find(".cf_size_list_type");
        var type = type_obj.val();
        var number = parseInt(number_obj.val());
        if(number>0){
            number = number - 1;
        }
        else{
            number = 0;
        }
        number_obj.val(number);
        obj.parent().parent().remove(); // Remove obj
        // Reset identify
        parent_obj.find("b[id^='size_list_number_']").each(function(index){
            number = index + 1;
            $(this).html(number.toString()+". ");
        });
        parent_obj.find("[id^='size_id_']").each(function(index){
            $(this).attr("name","fSize_list_"+type+"_id"+index.toString());
        });
        parent_obj.find("[id^='support_nick_']").each(function(index){
            $(this).attr("name","fSize_list_"+type+"_nick"+index.toString());
        });
        parent_obj.find("[id^='size_name_']").each(function(index){
            $(this).attr("name","fSize_list_"+type+"_name"+index.toString());
        });
        parent_obj.find("[id^='size_status_']").each(function(index){
            $(this).attr("name","fSize_list_"+type+"_status"+index.toString());
        });
        show_alert_message("Loại bỏ thành công!",success_text_color);
    }
    function add_size_list_new(obj){
        var parent_obj = obj.parent().parent().parent();
        var number_obj = parent_obj.find(".cf_size_list_number");
        var type_obj = parent_obj.find(".cf_size_list_type");
        var nick = parent_obj.find(".cf_size_list_type_nick").val();
        var name = parent_obj.find(".cf_size_list_type_name").val();
        var number = parseInt(number_obj.val());
        var type = type_obj.val();
        var id = number;
        number = number + 1;
        number_obj.val(number);
        var add_value = '<tr><td><a onclick="remove_size_list_from_list($(this));" href="javascript:;" idata="0"><img align="absMiddle" src="'+base_folder+'admincp/media/remove.png"></a></td><td><b id="size_list_number_'+number.toString()+'">'+number.toString()+'.</b></td><td>'+nick+'</td><td><input type="hidden" id="size_id_'+type+'_'+id.toString()+'" name="fSize_list_'+type+'_id'+id.toString()+'" value="0"><input id="size_nick_'+id.toString()+'" name="fSize_list_'+type+'_nick'+id.toString()+'" type="text" value="" style="width:150px;" /></td><td>'+name+'</td><td><input id="size_name_'+id.toString()+'" name="fSize_list_'+type+'_name'+id.toString()+'" type="text" value="" style="width:150px;"></td><td><span class="check_box_style1" state="on"><span class="check_box_on1"><span class="check_box_on"></span><span class="check_box_bar"></span><input type="checkbox" id="size_status_'+id.toString()+'" name="fSize_list_'+type+'_status'+id.toString()+'" checked="checked" /></span></span></td><td><a href="javascript:;" onclick="add_size_list_new($(this));"><img src="'+base_folder+'admincp/media/add.png"></a></td></tr>';
        parent_obj.append(add_value);
        show_alert_message("Thêm thành công!",success_text_color);
    }
    // Config
    function remove_support_list_from_list(obj){
        var parent_obj = obj.parent().parent().parent();
        var number_obj = parent_obj.find(".cf_support_list_number");
        var type_obj = parent_obj.find(".cf_support_list_type");
        var type = type_obj.val();
        var number = parseInt(number_obj.val());
        if(number>0){
            number = number - 1;
        }
        else{
            number = 0;
        }
        number_obj.val(number);
        obj.parent().parent().remove(); // Remove obj
        // Reset identify
        parent_obj.find("b[id^='support_list_number_']").each(function(index){
            number = index + 1;
            $(this).html(number.toString()+". ");
        });
        parent_obj.find("[id^='support_id_']").each(function(index){
            $(this).attr("name","fSupport_list_"+type+"_id"+index.toString());
        });
        parent_obj.find("[id^='support_nick_']").each(function(index){
            $(this).attr("name","fSupport_list_"+type+"_nick"+index.toString());
        });
        parent_obj.find("[id^='support_name_']").each(function(index){
            $(this).attr("name","fSupport_list_"+type+"_name"+index.toString());
        });
        parent_obj.find("[id^='support_status_']").each(function(index){
            $(this).attr("name","fSupport_list_"+type+"_status"+index.toString());
        });
        show_alert_message("Loại bỏ thành công!",success_text_color);
    }
	function add_support_list_new_by_region(obj){
        try{
        var parent_obj = obj.parent().parent().parent();
        var number_obj = parent_obj.find(".cf_support_list_number");
        var type_obj = parent_obj.find(".cf_support_list_type");
        var regionid = parent_obj.find(".cf_support_list_type_region").val();
        var nick = parent_obj.find(".cf_support_list_type_nick").val();
        var name = parent_obj.find(".cf_support_list_type_name").val();
        var maxid = parent_obj.find(".cf_support_list_type_maxid").val();
        var tinycode = parent_obj.find(".cf_support_list_type_tinycode").val();
        var expand = parent_obj.find(".cf_support_list_type_expand").val();
        var listWidth = parent_obj.find(".cf_support_list_width_input").val();
		var width1 = '10';var width2 = '150';var width3 = '150';var width4 = '150';var width5 = '150';
		//var add_item = '<option value="1">Chọn1</option>';
        var k = 1;
        try{
            if(listWidth.indexOf(",")>=0){
                while(listWidth.indexOf(",")>=0){
                    var str = listWidth.substring(0,listWidth.indexOf(","));
                    listWidth = listWidth.substring(listWidth.indexOf(",")+1);
                    if(str!=0 && str!=''){
                        if(k==1){
                            width1 = str;
                        }
                        if(k==2){
                            width2 = str;
                        }
                        if(k==3){
                            width3 = str;
                        }
                        if(k==4){
                            width4 = str;
                        }
                        k += 1;
                    }
                }
                if(listWidth!=0 && listWidth!=''){
                    if(k==3){
                        width3 = listWidth;
                    }
                    if(k==4){
                        width4 = listWidth;
                    }
                    if(k==5){
                        width5 = listWidth;
                    }
                }
            }
        }
        catch(err2){
            
        }
        
        var number = parseInt(number_obj.val());
        var type = type_obj.val();
        var id = number;
        number = number + 1;
        number_obj.val(number);
        var add_value = '<tr>';
		add_value += '<td><a onclick="remove_support_list_from_list($(this));" href="javascript:;" idata="0"><img align="absMiddle" src="'+base_folder+'admincp/media/remove.png"></a></td>';
        add_value += '<td><b id="support_list_number_'+number.toString()+'">'+number.toString()+'.</b></td>';
		
		add_value += '<td>'+regionid+'</td>';
		add_value += '<td>';
		add_value += '<select name="fSupport_list_'+type+'_region'+id.toString()+'">';
		//add_value += '<option selected="selected" value="0">Chọn</option>';
		<?php 
			$result = fn_get_array_with_query("select id,code from content_type where type = 3 and status = 1 order by name,id ASC");
				if($result!=false && mysql_num_rows($result)>0){
					while($row = mysql_fetch_array($result)){
						echo 'add_value += \'<option value="'.$row['regionstt'].'">'.$row['code'].'</option>\';';
					}
				}
		?>
		add_value += '</select>';
		add_value += '</td>';
		
        add_value += '<td>'+nick+'</td>';
        add_value += '<td><input type="hidden" id="support_id_'+type+'_'+id.toString()+'" name="fSupport_list_'+type+'_id'+id.toString()+'" value="0">';
        add_value += '<input id="support_nick_'+id.toString()+'" name="fSupport_list_'+type+'_nick'+id.toString()+'" type="text" value="" style="width:'+width2+'px;" />';
        add_value += '</td>';
        add_value += '<td>'+name+'</td>';
        add_value += '<td><input id="support_name_'+id.toString()+'" name="fSupport_list_'+type+'_name'+id.toString()+'" type="text" value="" style="width:'+width3+'px;"></td>';
        
        if(expand=="true"){
            add_value += '<td>'+maxid+'</td>';
            add_value += '<td><input id="support_name_'+id.toString()+'" name="fSupport_list_'+type+'_maxid'+id.toString()+'" type="text" value="" style="width:'+width4+'px;"></td>';
            add_value += '<td>'+tinycode+'</td>';
            add_value += '<td><input id="support_name_'+id.toString()+'" name="fSupport_list_'+type+'_tinycode'+id.toString()+'" type="text" value="" style="width:'+width5+'px;"></td>';
        }
        
        
        add_value += '<td><span class="check_box_style1" state="on"><span class="check_box_on1"><span class="check_box_on"></span><span class="check_box_bar"></span><input type="checkbox" id="support_status_'+id.toString()+'" name="fSupport_list_'+type+'_status'+id.toString()+'" checked="checked" /></span></span></td>';
        add_value += '<td><a href="javascript:;" onclick="add_support_list_new($(this));"><img src="'+base_folder+'admincp/media/add.png"></a></td>';
        add_value += '</tr>';
        parent_obj.append(add_value);
        show_alert_message("Thêm thành công!",success_text_color);
        }
        catch(err){alert(err);}
    }
    function add_support_list_new(obj){
        try{
        var parent_obj = obj.parent().parent().parent();
        var number_obj = parent_obj.find(".cf_support_list_number");
        var type_obj = parent_obj.find(".cf_support_list_type");
        var nick = parent_obj.find(".cf_support_list_type_nick").val();
        var name = parent_obj.find(".cf_support_list_type_name").val();
        var maxid = parent_obj.find(".cf_support_list_type_maxid").val();
        var tinycode = parent_obj.find(".cf_support_list_type_tinycode").val();
        var expand = parent_obj.find(".cf_support_list_type_expand").val();
        var listWidth = parent_obj.find(".cf_support_list_width_input").val();
        var width1 = '10';var width2 = '150';var width3 = '150';var width4 = '150';var width5 = '150';
        var k = 1;
        try{
            if(listWidth.indexOf(",")>=0){
                while(listWidth.indexOf(",")>=0){
                    var str = listWidth.substring(0,listWidth.indexOf(","));
                    listWidth = listWidth.substring(listWidth.indexOf(",")+1);
                    if(str!=0 && str!=''){
                        if(k==1){
                            width1 = str;
                        }
                        if(k==2){
                            width2 = str;
                        }
                        if(k==3){
                            width3 = str;
                        }
                        if(k==4){
                            width4 = str;
                        }
                        k += 1;
                    }
                }
                if(listWidth!=0 && listWidth!=''){
                    if(k==3){
                        width3 = listWidth;
                    }
                    if(k==4){
                        width4 = listWidth;
                    }
                    if(k==5){
                        width5 = listWidth;
                    }
                }
            }
        }
        catch(err2){
            
        }
        
        var number = parseInt(number_obj.val());
        var type = type_obj.val();
        var id = number;
        number = number + 1;
        number_obj.val(number);
        var add_value = '<tr><td><a onclick="remove_support_list_from_list($(this));" href="javascript:;" idata="0"><img align="absMiddle" src="'+base_folder+'admincp/media/remove.png"></a></td>';
		
        add_value += '<td><b id="support_list_number_'+number.toString()+'">'+number.toString()+'.</b></td>';
        add_value += '<td>'+nick+'</td>';
        add_value += '<td><input type="hidden" id="support_id_'+type+'_'+id.toString()+'" name="fSupport_list_'+type+'_id'+id.toString()+'" value="0">';
        add_value += '<input id="support_nick_'+id.toString()+'" name="fSupport_list_'+type+'_nick'+id.toString()+'" type="text" value="" style="width:'+width2+'px;" />';
        add_value += '</td>';
        add_value += '<td>'+name+'</td>';
        add_value += '<td><input id="support_name_'+id.toString()+'" name="fSupport_list_'+type+'_name'+id.toString()+'" type="text" value="" style="width:'+width3+'px;"></td>';
        
        if(expand=="true"){
            add_value += '<td>'+maxid+'</td>';
            add_value += '<td><input id="support_name_'+id.toString()+'" name="fSupport_list_'+type+'_maxid'+id.toString()+'" type="text" value="" style="width:'+width4+'px;"></td>';
            add_value += '<td>'+tinycode+'</td>';
            add_value += '<td><input id="support_name_'+id.toString()+'" name="fSupport_list_'+type+'_tinycode'+id.toString()+'" type="text" value="" style="width:'+width5+'px;"></td>';
        }
        
        
        add_value += '<td><span class="check_box_style1" state="on"><span class="check_box_on1"><span class="check_box_on"></span><span class="check_box_bar"></span><input type="checkbox" id="support_status_'+id.toString()+'" name="fSupport_list_'+type+'_status'+id.toString()+'" checked="checked" /></span></span></td>';
        add_value += '<td><a href="javascript:;" onclick="add_support_list_new($(this));"><img src="'+base_folder+'admincp/media/add.png"></a></td>';
        add_value += '</tr>';
        parent_obj.append(add_value);
        show_alert_message("Thêm thành công!",success_text_color);
        }
        catch(err){alert(err);}
    }
    
    function show_image_upload_fast(){
        var height = content_height - 200;
        if(height<270){height=270;}
        var width = screen_width - 300;
        $(".image_list_upload_container").css("width",width+"px");
        $(".image_list_upload_container").find("#image_list").css("height",height+"px");
        $(".image_list_upload_container").show();
        //$(".color_list_upload_container").show();
    }
    function hide_image_upload_fast(){
        $(".image_list_upload_container").hide();
        $(".color_list_upload_container").hide();
    }
    
    // Upload color list
    function user_post_upload_color_image(){
        try{
            var count_image = parseInt($("#count_color_upload").html());
            if(count_image<20){
                var name = prompt("Tên màu","");
                //var name = "";
                $('#frmUpload_color_image').find("[name='fTitle']").val(name);
                $('#frmUpload_color_image')[0].submit();
                $("#uploading_color_photo_input").hide();
                $("#uploading_color_photo").show();
                $("#uploading_color_status").html('<font color="green">Đang tải ảnh màu sản phẩm...</font>');
                return true;
            }
            else{
                $("#uploading_color_status").html('<font color="red">Tối đa chỉ tải 20 ảnh.</font>');
                return false;
            }
        }
        catch(err){alert(err);return false;}
    }
    function user_post_upload_color_status(status,message,url_return){
        try{
            $('#frmUpload_color_image')[0].reset();
            $("#uploading_color_photo_input").show();
            $("#uploading_color_photo").hide();
            if(status==1){
                var name = $('#frmUpload_color_image').find("[name='fTitle']").val();
                var add_value = '<span class="color_number"><a class="title" title="'+name+'">'+name+'</a><img src="' + base_folder+url_return + '"><a onclick="delete_color_from_content(\'' + url_return + '\')" class="delete">Xóa</a></span>';
                add_value = add_value + $("#color_list").html();
                $("#color_list").html(add_value);
                $("#uploading_color_status").html('<font color="green">Tải thành công!</font>');
                var count_image = parseInt($("#count_color_upload").html()) + 1;
                $("#count_color_upload").html(count_image);
                get_slide_content_from_color_list();
            }
            else{
                $("#uploading_color_status").html('<font color="red">' + message + '</font>');
            }
            return true;
        }
        catch(err){alert(err);return false;}
    }
    function delete_color_from_content(url_input){
        try{
            var content = $("#color_list").html();
            if(content!=''){
                var str_first = content.substring(0,content.indexOf(url_input,0));
                str_first = str_first.substring(0,str_first.lastIndexOf("<span"));
                var str_last = content.substring(content.indexOf(url_input,0));
                str_last = str_last.substring(str_last.indexOf("</span>",0)+7);
                str_first = $.trim(str_first);
                str_last = $.trim(str_last);
                content = str_first + str_last;
                $("#color_list").html(content);
                var count_image = parseInt($("#count_color_upload").html());
                if(count_image>0){
                    count_image = count_image - 1;
                }
                $("#count_color_upload").html(count_image);
                get_slide_content_from_color_list();
            }
            return true;
        }
        catch(err){alert(err);return false}
    }
    function get_slide_content_from_color_list(){
        try{
            var content = '';
            $("#color_list").find(".color_number").each(function(index){
                var name = $(this).find("a:first").html();
                var url = $(this).find("img:first").attr("src");
                if(url!=""){
                    content = content+";["+url+"]["+name+"]";
                }
            });
            if(content.indexOf(";")==0){
                content = content.substr(1).trim();
            }
            $("[name='fColor_list']").val(content);
        }
        catch(err){alert(err);return false;}
    }
    
    // Upload multi image
    function user_post_upload_image(){
        try{
            var count_image = parseInt($("#count_image_upload").html());
            if(count_image<20){
                //var name = prompt("Tiêu đề ảnh","");
                var name = '';
                $('#frmUpload_list_image').find("[name='fTitle']").val(name);
                $('#frmUpload_list_image')[0].submit();
                $("#uploading_photo_input").hide();
                $("#uploading_photo").show();
                $("#uploading_status").html('<font color="green">Đang tải ảnh...</font>');
                return true;
            }
            else{
                $("#uploading_status").html('<font color="red">Tối đa chỉ tải 20 ảnh.</font>');
                return false;
            }
        }
        catch(err){alert(err);return false;}
    }
    
    function user_post_upload_image_status(status,message,url_return){
        try{
            $('#frmUpload_list_image')[0].reset();
            $("#uploading_photo_input").show();
            $("#uploading_photo").hide();
            if(status==1){
                $("#upload_image_color_status").val(status);
                $("#upload_image_color_message").val(message);
                $("#upload_image_color_url_return").val(url_return);
                $("#upload_image_color_mode").val(0);
                /*
                if($(".colorBoxChoose").length>0){
                    $(".colorBoxChoose").show();
                    $(".colorBoxBg").show();
                }
                else{
            */
                    var name = '';
                    var add_value = '<span class="image_number">';
                    add_value += '<input class="input_name" value="'+name+'"></a><img src="' + base_folder + url_return + '">';
                    add_value += '<a class="delete" onclick="delete_image_from_content(\'' + base_folder + url_return + '\')">Xóa</a>';
                    add_value += '<a class="view" target="_blank" href="'+base_folder+url_return+'" title="'+name+'">Xem</a>';
                    add_value += '</span>';
                    add_value = $("#image_list").html() + add_value;
                    $("#image_list").html(add_value);
                    
                    $( "#image_list" ).sortable({ opacity: 0.6, cursor: "move" });
                    
                    $("#uploading_status").html('<font color="green">Tải thành công!</font>');
                    var count_image = parseInt($("#count_image_upload").html()) + 1;
                    $("#count_image_upload").html(count_image);
                    get_slide_content_from_image_list();
                //}
                
                /*
                    var name = $('#frmUpload_list_image').find("[name='fImage_color_choose']").val();
                    var add_value = '<span class="image_number">';
                    add_value += '<input class="input_name" value="'+name+'"></a><img src="' + base_folder + url_return + '">';
                    add_value += '<a class="delete" onclick="delete_image_from_content(\'' + base_folder + url_return + '\')">Xóa</a>';
                    add_value += '<a class="view" target="_blank" href="'+base_folder+url_return+'" title="'+name+'">Xem</a>';
                    add_value += '</span>';
                    add_value = $("#image_list").html() + add_value;
                    $("#image_list").html(add_value);
                    
                    $( "#image_list" ).sortable({ opacity: 0.6, cursor: "move" });
                    
                    $("#uploading_status").html('<font color="green">Tải thành công!</font>');
                    var count_image = parseInt($("#count_image_upload").html()) + 1;
                    $("#count_image_upload").html(count_image);
                    get_slide_content_from_image_list();
                */
            }
            else{
                $("#uploading_status").html('<font color="red">' + message + '</font>');
            }
            return true;
        }
        catch(err){alert(err);return false;}
    }
    function delete_image_from_content(url_input){
        try{
            var content = $("#image_list").html();
            if(content!=''){
                var str_first = content.substring(0,content.indexOf(url_input,0));
                str_first = str_first.substring(0,str_first.lastIndexOf("<span"));
                var str_last = content.substring(content.indexOf(url_input,0));
                str_last = str_last.substring(str_last.indexOf("</span>",0)+7);
                str_first = $.trim(str_first);
                str_last = $.trim(str_last);
                content = str_first + str_last;
                $("#image_list").html(content);
                var count_image = parseInt($("#count_image_upload").html());
                if(count_image>0){
                    count_image = count_image - 1;
                }
                $("#count_image_upload").html(count_image);
                get_slide_content_from_image_list();
            }
            return true;
        }
        catch(err){alert(err);return false}
    }
    function get_slide_content_from_image_list(){
        try{
            var content = '';
            $("#image_list").find(".image_number").each(function(index){
                var name = $(this).find(".input_name").val();
                var url = $(this).find("img:first").attr("src");
                if(url != ""){
                    content = content+";["+url+"]["+name+"]";
                }
            });
            if(content.indexOf(";")==0){
                content = content.substr(1).trim();
            }
            if($("[name='fImage_list']").length>0){
                $("[name='fImage_list']").val(content);
            }
        }
        catch(err){alert(err);return false;}
    }
    
    function change_filter_catalog_ajax(string,level,id,content_group,filephp,hypertag){
        page = 1;
        languageid = $("[name='fLanguage']").val();
        search_text = $("[name='fSearch_text']").val();
        mode = $("#tab_mode_menu").find("li.active").attr("mode");
        catid = "all";
        arr_str = string.split("_");
        if(string.indexOf("_")>=0){
            catid = arr_str[1];
        }
        if(arr_str[0] == "true"){
            $("#admin_content_list span[id^='category_']").each(function(index){
                if(index > level){
                    $(this).css("display", "none");
                } 
            });
        }
        else{
            $("#admin_content_list span[id^='category_']").each(function(index){
                display = (index <= (level+1) ? "block" : "none");
                $(this).css("display", display);
                if(index > (level)){
                    $(this).html("");
                }
            });
        }
        show_alert_doing2();
        $.get(base_folder+"admincp/modules/"+filephp+"?id="+catid+"&finish=0&content_group="+content_group+"&level="+level+"&languageid="+languageid+"&filephp="+filephp+"&hypertag="+hypertag, function(data) {
            $("#category_" + (level + 1)).html(data);
            variable_get = "page="+page+"&limit="+$.cookie("number_limit")+"&mode="+mode+'&catid='+catid+'&search_text='+search_text+'&content_group='+content_group+'&languageid='+languageid+"&filephp="+filephp+"&hypertag="+hypertag;
            url = base_folder+"admincp/modules/"+hypertag+".php?ajax=1&"+variable_get;
            window.location = '#'+hypertag+'?'+variable_get;
            $.get(url, function(data) {
                $("#admin_content_list").html(data);
                close_alert_doing2();
            });
        });
        return false;
    }
    function change_category_of_content_add(string,level,id,content_group,filephp,hypertag){
        if(string==""){return false;}
        arr_str = string.split("_");
        languageid = $("[name='fLanguage']").val();
        if(content_group==0){
            $("[name='fCatid']").val(arr_str[1]);
        }
        else{
            $("[name='fCatid']").val("0");
            $("[name='fContent_group']").val(string);
            content_group = string;
        }
        if(arr_str[0] == "true"){
            $("#form_add div[id^='category_']").each(function(index){
                if(index > level){
                    $(this).css("display", "none");
                } 
            });
            return false;
        }
        else{
            current_level = level + 1;
            $("#category_" + (level + 1)).html("");
            show_alert_doing();
            $.get(base_folder+"admincp/modules/"+filephp+"?id="+arr_str[1]+"&finish=0&content_group="+content_group+"&level="+level+"&languageid="+languageid, function(data) {
                $("#category_" + (level + 1)).html('<div class="current_level">Cấp '+current_level+'</div>'+data);
                close_alert_doing();
                $("#form_add div[id^='category_']").each(function(index){
                    display = (index <= (level+1) ? "block" : "none");
                    $(this).css("display", display);
                });
            });
        }
    }
$("[name='openMoreSettingBtn']").live("click",function(){
    var obj = $(this);
    var targetID = obj.attr("idata");
    var state = obj.attr("class");
    var targetObj = $("#"+targetID);
    if(state=="active"){
        targetObj.slideUp();
        obj.removeAttr("class");
    }
    else{
        targetObj.slideDown();
        obj.attr("class","active");
    }
});
</script>
</head>
<body>
    <div id="wrap">
        <?php include($_SERVER['DOCUMENT_ROOT'] . $base_folder . "admincp/modules/alert.php");?>
        <div class="sticky_top_container">
            <?php include($_SERVER['DOCUMENT_ROOT'] . $base_folder . "admincp/modules/header.php");?>
        </div>
        <!-- Floating Show Sidebar Button when Collapsed -->
        <button type="button" id="btn_show_left" class="show_left show_left_floating" name="show_left" onclick="show_content_left();" title="Mở thanh điều hướng" aria-label="Mở thanh điều hướng">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
        </button>
        <div id="admin_content">
            
        </div>
    </div>
    <div class="div_upload_fast">
        <form id="frmUpload_target" action="<?php echo $base_folder;?>admincp/modules/uploadfile.php" method="POST" ENCTYPE="multipart/form-data" target="upload_target">
            <input type="hidden" name="fTarget" value=""  />
            <input type="hidden" name="fMaxsize" value=""  /><!--Max size is ..KB-->
            <input type="hidden" name="filename" value="" />
            <input name="userfile" type="file" onchange="upload_fast();" class="input_upload" value="" />
            <iframe name="upload_target" src="#" style="width:0px;height:0px;border:0px;display: none;"></iframe>
        </form>
    </div>
    <!-- Back to Top Button with 2-Stage Smooth Scroll (Rule 9.8) -->
    <button id="admin_back_to_top" class="admin_back_to_top" onclick="admin_scroll_to_top();" title="Cuộn về đầu trang" aria-label="Cuộn về đầu trang">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="18 15 12 9 6 15"></polyline>
        </svg>
    </button>
    <script type="text/javascript">
    $(window).scroll(function() {
        var totalHeight = $(document).height() - $(window).height();
        if (totalHeight > 100 && $(window).scrollTop() >= (totalHeight * 0.5)) {
            $('#admin_back_to_top').addClass('visible');
        } else {
            $('#admin_back_to_top').removeClass('visible');
        }
    });

    function admin_scroll_to_top() {
        var current = $(window).scrollTop();
        if (current <= 0) return;
        // Giai doan 1: cuon nhe len tu tu trong 700ms de nguoi dung khong bi giat minh
        var initialStep = Math.min(380, current * 0.3);
        $('html, body').stop().animate({ scrollTop: current - initialStep }, 700, 'swing', function() {
            // Giai doan 2: luot vuot muot ma len tan dinh trang
            $('html, body').animate({ scrollTop: 0 }, 450, 'swing');
        });
    }
    </script>
</body>
</html>
