$(document).ready(function() {
    
});

function position_admin_tooltip(e) {
    var $tip = $('#tooltip');
    if (!$tip.length) return;

    var tipWidth = Math.min(360, $tip.outerWidth() || 350);
    var tipHeight = Math.min(360, $tip.outerHeight() || 350);
    var winWidth = $(window).width();
    var winHeight = $(window).height();
    var scrollLeft = $(window).scrollLeft();
    var scrollTop = $(window).scrollTop();

    // Horizontal position
    var left = e.pageX + 20;
    if (e.clientX + tipWidth + 30 > winWidth) {
        left = e.pageX - tipWidth - 25;
    }
    if (left < scrollLeft + 10) {
        left = scrollLeft + 10;
    }

    // Vertical position
    var top = e.pageY - 40;
    if (e.clientY + tipHeight + 20 > winHeight) {
        top = e.pageY - tipHeight + 20;
    }
    if (top < scrollTop + 10) {
        top = scrollTop + 10;
    }

    $tip.css({
        top: top + 'px',
        left: left + 'px'
    });
}

$("[rel=tooltip2]").live("mouseover", function(e){
    var idata = $(this).attr('idata');
    $("#wrap").children('#tooltip').remove();
    $("#wrap").append('<div id="tooltip"><div class="image"><img src="' + idata + '"></div></div>');
    position_admin_tooltip(e);
    $('#tooltip').stop(true, true).fadeIn(150);
});

$("[rel=tooltip2]").live("mousemove", function(e){
    position_admin_tooltip(e);
});

$("[rel=tooltip2]").live("mouseout", function(e){
    $("#wrap").children('#tooltip').remove();
});

$("a[rel=tooltip]").live("mouseover", function(e){
    var hiddenHtml = $(this).closest('.rows, .rows_last').find(".hidden").html();
    if (!hiddenHtml) {
        hiddenHtml = $(this).parent().parent().find(".hidden").html();
    }
    if (!hiddenHtml) return;

    $("#wrap").children('#tooltip').remove();
    $("#wrap").append('<div id="tooltip">' + hiddenHtml + '</div>');
    position_admin_tooltip(e);
    $('#tooltip').stop(true, true).fadeIn(150);
});

$("a[rel=tooltip]").live("mousemove", function(e){
    position_admin_tooltip(e);
});

$("a[rel=tooltip]").live("mouseout", function(e){
    $("#wrap").children('#tooltip').remove();
});