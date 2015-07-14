$(document).ready(function () {
    var focused = null;
    var cssString;
    var defaultbg;


    $(".content").sortable();
    $("#editpanel").hide();
    $("#panelmenu").hide();
    $("#togglebar").hide();

    getCss();
    convertImgToBase64URL('img/bg.jpg', function (base64Img) {
        defaultbg = base64Img;
        defaultbg = defaultbg.replace("data:image/png;base64,", " ");
    });

    $('#changewallpaper').click(function () {
        console.log($('#wallpaperurl').val());
        $('html').css('background-image', 'url("' + $('#wallpaperurl').val() + '")');
        $('body').css('background-image', 'url("' + $('#wallpaperurl').val() + '")');
        cssString = cssString.split('/*START BG*/')[0] + '/*START BG*/' + 'background-image: url("' + $('#wallpaperurl').val() + '");' + '/*END BG*/' + cssString.split('/*END BG*/')[1];
        convertImgToBase64URL($('#wallpaperurl').val(), function (base64Img) {
            defaultbg = base64Img;
            console.log(defaultbg);
            defaultbg = defaultbg.replace("data:image/png;base64,", " ");
        });
    });

    $('#togglebaroff').click(function () {
        $('.fixednavbar').fadeOut();
        $('#togglebar').fadeIn();
        $('#panelmenu').fadeOut();
        $("#editpanel").fadeOut();

    });

    $('#togglebar').click(function () {
        $('.fixednavbar').fadeIn();
        $('#togglebar').fadeOut();
    });

    $(document).on('click', '#delete', function (event) {
        $(focused).remove();
    });

    $('#editor1').ckeditor({});

    CKEDITOR.config.autoParagraph = false;

    $('.colorpicker').colorpicker();

    $('#paneltoggle').click(function () {
        $("#panelmenu").toggle('fast', 'swing');
    });

    $('#editortoggle').click(function () {
        if (focused != null) {
            $("#editpanel").toggle('fast', 'swing');
        } else {
            alert("No panel selected");
        }
    });

    $('#paneladd').click(function () {
        if ($('#panelheight').val().indexOf("px") != -1 || $('#panelwidth').val().indexOf("px") != -1 || $('#panelheight').val().indexOf("%") != -1 || $('#panelwidth').val().indexOf("%") != -1) {
            /*if (focused != null) {
                $(focused).append('<div class="panels" style="width:' + $('#panelwidth').val() + '; height:' + $('#panelheight').val() + '; background-color:' + $('#panelcolor').val() + ';"></div>');
            //} else {*/
            $('.content').append('<li class="panels" style="width:' + $('#panelwidth').val() + '; height:' + $('#panelheight').val() + '; background-color:' + $('#panelcolor').val() + ';"><!-- END ITEM --></li>');
            //}
        } else {
            alert("Please correct the panel inputs accordingly; the width and height must be entered like so (100px or 100%)");
        }
    });

    $(document).on('click', '.panels', function () {
        var content = this.innerHTML.replace('<!-- END ITEM -->', '');
        content = this.innerHTML.replace('<div class="selectedinfo">' + $(focused).css("height") + '</div>', '');
        if ($(this).find('.selectedinfo').length > 0) {
            $('.selectedinfo').remove();
            CKEDITOR.instances['editor1'].setData("");
            focused = null;
            $("#editpanel").hide();
        } else {
            $('.panels').each(function (i, obj) {
                $('.selectedinfo').remove();
            });
            $(this).append('<div class="selectedinfo"></div>');
            focused = this;
        }
        CKEDITOR.instances['editor1'].setData(content);
    });

    //EDITOR CONTENT
    CKEDITOR.instances['editor1'].on('change', function () {
        var content = '<div class="selectedinfo">Height: ' + $(focused).css("height") + ' Width: ' + $(focused).css("width") + '</div>' + $('#editor1').val() + '<!-- END ITEM -->';
        $(focused).empty();
        $(focused).append(content);
    });
    //END EDITOR CONTENT

    $('#export').click(function () {

        var zip = new JSZip();

        $('.panels').each(function (i, obj) {
            $('.selectedinfo').remove();
        });

        var html = $('html').clone();

        var htmlString = html.html();

        cssString = cssString.split('/* PANEL SELECT */')[0] + cssString.split('/* END PANEL SELECT */')[1];
        htmlString.replace('<ul class="content ui-sortable">', '<div class="content">');
        htmlString = htmlString.split('<!-- REMOVABLE FILES -->')[0] + htmlString.split('<!-- END REMOVABLE FILES -->')[1];
        htmlString = htmlString.split('<!-- TOOLS -->')[0] + htmlString.split('<!-- END TOOLS -->')[1];
        htmlString = htmlString.split('<!-- EXTRA CODE -->')[0] + '</head><body>' + htmlString.split('<!-- END EXTRA CODE -->')[1];
        htmlString = htmlString.split('<!-- END -->')[0] + "</body>";

        htmlString = htmlString.replace('<ul class="content ui-sortable">', '<div class="content">');
        htmlString = htmlString.replace('</ul><!-- CONTENT END -->', '</div>');

        console.log(htmlString);

        while (htmlString.indexOf('<li class="panels') > -1) {
            htmlString = htmlString.replace('<li class="panels', '<div class="panels');
        }

        while (htmlString.indexOf('<!-- END ITEM --></li>') > -1) {
            htmlString = htmlString.replace('<!-- END ITEM --></li>', '</div>');
        }

        console.log(htmlString);

        var img = zip.folder("img");

        img.file("bg.jpg", defaultbg, {
            base64: true
        });
        var content = zip.generate({
            type: "blob"
        });

        var js = zip.folder("js");
        var css = zip.folder("css");

        css.file("main.css", cssString);
        zip.file("index.html", htmlString);
        var content = zip.generate({
            type: "blob"
        });
        saveAs(content, "website.zip");

    });

    function getCss() {
        $.get("css/main.css", function (cssContent) {
            cssString = cssContent;
        });
    }

    function convertImgToBase64URL(url, callback, outputFormat) {
        var img = new Image();
        img.crossOrigin = 'Anonymous';
        img.onload = function () {
            var canvas = document.createElement('CANVAS'),
                ctx = canvas.getContext('2d'),
                dataURL;
            canvas.height = this.height;
            canvas.width = this.width;
            ctx.drawImage(this, 0, 0);
            dataURL = canvas.toDataURL(outputFormat);
            callback(dataURL);
            canvas = null;
        };
        img.src = url;
    }

});