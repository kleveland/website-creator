$(document).ready(function () {

    var focused;
    var cssString;
    var defaultbg;

    getCss();
    convertImgToBase64URL('img/bg.jpg', function (base64Img) {
        defaultbg = base64Img;
        defaultbg = defaultbg.replace("data:image/png;base64,", " ");
    });


    $('#toolopener').hide();

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

    $(document).on('click', '#delete', function (event) {
        $(focused).remove();
    });

    $('#editor1').ckeditor({});

    CKEDITOR.config.autoParagraph = false;

    $('.colorpicker').colorpicker();

    $('#tooltoggle').click(function () {
        $("#tools").toggle('fast', 'swing');
    });

    $('#editortoggle').click(function () {
        $("#editpanel").toggle('fast', 'swing');
    });

    $('#paneladd').click(function () {
        if ($('#panelheight').val().indexOf("px") != -1 || $('#panelwidth').val().indexOf("px") != -1 || $('#panelheight').val().indexOf("%") != -1 || $('#panelwidth').val().indexOf("%") != -1) {
            /*if (focused != null) {
                $(focused).append('<div class="panels" style="width:' + $('#panelwidth').val() + '; height:' + $('#panelheight').val() + '; background-color:' + $('#panelcolor').val() + ';"></div>');
            } else {*/
                $('.content').append('<div class="panels" style="width:' + $('#panelwidth').val() + '; height:' + $('#panelheight').val() + '; background-color:' + $('#panelcolor').val() + ';"></div>');
            //}
        } else {
            alert("Please correct the panel inputs accordingly; the width and height must be entered like so (100px or 100%)");
        }
    });

    $(document).on('click', '.panels', function () {
        var content = this.innerHTML;
        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
            CKEDITOR.instances['editor1'].setData("");
            focused = null;
        } else {
            $('.panels').each(function (i, obj) {
                $(obj).removeClass('selected');
            });
            $(this).addClass('selected');
            focused = this;
        }
        CKEDITOR.instances['editor1'].setData(content);
    });


    CKEDITOR.instances['editor1'].on('change', function () {
        $(focused).empty();
        $(focused).append($('#editor1').val());
    });

    $('#export').click(function () {

        var zip = new JSZip();

        $('.panels').each(function (i, obj) {
            $(obj).removeClass('selected');
        });

        var html = $('html').clone();

        var htmlString = html.html();

        cssString = cssString.split('/* PANEL SELECT */')[0] + cssString.split('/* END PANEL SELECT */')[1];

        htmlString = htmlString.split('<!-- REMOVABLE FILES -->')[0] + htmlString.split('<!-- END REMOVABLE FILES -->')[1];
        htmlString = htmlString.split('<!-- TOOLS -->')[0] + htmlString.split('<!-- END TOOLS -->')[1];
        htmlString = htmlString.split('<!-- XBUTTON -->')[0] + htmlString.split('<!-- END XBUTTON -->')[1];
        htmlString = htmlString.split('<!-- EXTRA CODE -->')[0] + '</head><body>' + htmlString.split('<!-- END EXTRA CODE -->')[1];
        htmlString = htmlString.split('<!-- EDITOR SPACER -->')[0] + htmlString.split('<!-- END EDITOR SPACER -->')[1];
        htmlString = htmlString.split('<!-- END -->')[0] + "</body>";

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