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
        cssString = cssString.split('/* PANEL SELECT */')[0] + cssString.split('/* END PANEL SELECT */')[1];
        convertImgToBase64URL($('#wallpaperurl').val(), function (base64Img) {
            defaultbg = base64Img;
            console.log(defaultbg);
            defaultbg = defaultbg.replace("data:image/png;base64,", " ");
        });
    });

    $('#toolopener').click(function () {
        $(".toolcontainer").toggle('fast', 'swing');
        $(".editorspacer").toggle('fast', 'swing');
        $("html, body").animate({
            scrollBottom: $(document).height()
        }, "slow");
        $('#toolopener').hide();
    });

    $(document).on('click', '#delete', function (event) {
        $(focused).remove();
    });

    $('#editor1').ckeditor();

    $('#editortoggle').click(function () {
        $(".toolcontainer").toggle('fast', 'swing');
        $(".editorspacer").toggle('fast', 'swing');
        $('#toolopener').show();
        $("html, body").animate({
            scrollBottom: $(document).height()
        }, "slow");
    });

    $('#panel-full-selector').click(function () {
        $('.content').append('<div class="panels" id="panel-full"></div>');
    });

    $('#panel-half-selector').click(function () {
        $('.content').append('<div class="panels" id="panel-half"></div>');
    });

    $('#panel-quarter-selector').click(function () {
        $('.content').append('<div class="panels" id="panel-quarter"></div>');
    });

    $(document).on('click', '.panels', function () {
        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
            CKEDITOR.instances['editor1'].setData("");
            focused = null;
        } else {
            $('.panels').each(function (i, obj) {
                $(obj).removeClass('selected');
                //REMOVE XBUTTON
            });
            $(this).addClass('selected');
            focused = this;
        }
        CKEDITOR.instances['editor1'].setData(this.innerHTML);
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

        htmlString = htmlString.split('<!-- REMOVABLE FILES -->')[0] + htmlString.split('<!-- END REMOVABLE FILES -->')[1];
        htmlString = htmlString.split('<!-- TOOLS -->')[0] + htmlString.split('<!-- END TOOLS -->')[1];
        htmlString = htmlString.split('<!-- XBUTTON -->')[0] + htmlString.split('<!-- END XBUTTON -->')[1];
        htmlString = htmlString.split('<!-- EXTRA CODE -->')[0] + '<body>' + htmlString.split('<!-- END EXTRA CODE -->')[1];
        htmlString = htmlString.split('<!-- EDITOR SPACER -->')[0] + htmlString.split('<!-- END EDITOR SPACER -->')[1];

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