$(document).ready(function () {
    var focused = null;
    var cssString;
    var defaultbg;
    var panels = [];
    var iden = 0;
    var widthpercent;
    var heightpercent;
    var widthpixel;
    var heightpixel;

    var copy;
    var panelinfo;
    var copypanel;
    var copypanelinner;
    var hoveredpanel;

    var isDragging;
    var isResizing = false;

    tinymce.init({
        selector: '.tinymce',
        setup: function (ed) {
            ed.on('NodeChange', function (e) {
                onChange(ed);
            });
            ed.on('keyup', function (e) {
                onChange(ed);
            });
        }
    });

    function onChange(ed) {
        console.log('the content ' + ed.getContent());
        try {
            console.log('tinymce content: ' + $('.tinymce').val());
            $(focused).empty();
            $(focused).append(ed.getContent() + '<div class="ui-resizable-handle ui-resizable-e" style="z-index: 90;"></div>' + '<div class="ui-resizable-handle ui-resizable-s" style="z-index: 90;"></div>' + '<div class="ui-resizable-handle ui-resizable-se ui-icon ui-icon-gripsmall-diagonal-se" style="z-index: 90;"></div>' + '<!-- END ITEM -->');
        } catch (error) {
            console.log("Panel Deselected");
        }
    }

    //$(".content").sortable();
    $("#editpanel").hide();
    $("#panelmenu").hide();
    $("#togglebar").hide();
    $(".panelmanage").hide();
    
    getCss();
    convertImgToBase64URL('img/bg.jpg', function (base64Img) {
        defaultbg = base64Img;
        defaultbg = defaultbg.replace("data:image/png;base64,", " ");
    });

    $.contextMenu({
        selector: 'body',
        callback: function (key, options) {
            var m = "clicked: " + key + " on " + $(this).text();
            window.console && console.log(m) || alert(m);
        },
        items: {
            "Change Wallpaper": {
                name: "Change Wallpaper",
                icon: "edit"
            },
            "cut": {
                name: "Cut",
                icon: "cut"
            },
            "copy": {
                name: "Copy",
                icon: "copy",
                callback: function () {}
            },
            "paste": {
                name: "Paste",
                icon: "paste",
                callback: function () {
                    copypanel = jQuery.extend(true, {}, copypanel);
                    copypanel.id = "panel" + iden++;
                    copypanel.left = event.clientX + 'px';
                    copypanel.top = event.clientY + 'px';
                    $('.content').append('<li class="panels" id="' + copypanel.id + '" style="width:' + copypanel.widthunit + '; height:' + copypanel.heightunit + '; left: ' + copypanel.left + '; top: ' + copypanel.top + '; background-color:' + copypanel.bgcolor + ';">' + copypanelinner + '<!-- END ITEM --></li>');
                    //setTimeout(function() {
                    addContext('#' + copypanel.id);
                    //}, 100);
                    panels.push(copypanel);
                }
            },
            "delete": {
                name: "Delete",
                icon: "delete",
                callback: function () {}
            },
            "sep1": "---------",
            "quit": {
                name: "Quit",
                icon: "quit"
            }
        }
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
        $('.panelmanage').slideUp();

    });

    $('#togglebar').click(function () {
        $('.fixednavbar').fadeIn();
        $('#togglebar').fadeOut();
    });

    $(document).on('click', '#delete', function (event) {
        $(focused.id).remove();
    });

    //    $('#editor1').ckeditor({});

    //   CKEDITOR.config.autoParagraph = false;

    $('.colorpicker').colorpicker();

    $('#paneltoggle').click(function () {
        $("#panelmenu").toggle('fast', 'swing');
        $('.panelmanage').slideToggle();
        console.log(panels);
    });

    $('#editortoggle').click(function () {
        console.log(focused);
        if (focused != null) {
            $("#editpanel").toggle('fast', 'swing');
        } else {
            alert("No panel selected");
        }
    });

    $('#paneladd').click(function () {
        var panelobj = {};
        if ($('#panelheight').val().indexOf("px") != -1 || $('#panelwidth').val().indexOf("px") != -1 || $('#panelheight').val().indexOf("%") != -1 || $('#panelwidth').val().indexOf("%") != -1) {

            $('.content').append('<li class="panels" id="panel' + iden + '" style="width:' + $('#panelwidth').val() + '; height:' + $('#panelheight').val() + '; background-color:' + $('#panelcolor').val() + ';"><!-- END ITEM --></li>');
            panelobj.id = 'panel' + iden;
            if ($('#panelwidth').val().indexOf("%") != -1) {
                panelobj.widthpercent = true;
            } else {
                panelobj.widthpercent = false;
            }
            if ($('#panelheight').val().indexOf("%") != -1) {
                panelobj.heightpercent = true;
            } else {
                panelobj.heightpercent = false;
            }
            panelobj.leftpercent = false;
            panelobj.toppercent = false;
            panelobj.widthunit = $('#panelwidth').val();
            panelobj.heightunit = $('#panelheight').val();
            panelobj.bgcolor = $('#panelcolor').val();
            panelobj.left = 0 + 'px';
            panelobj.top = 0 + 'px';
            panels.push(panelobj);
            console.log(panels);
            addContext("#" + panelobj.id);
            iden++;
        } else {
            alert("Please correct the panel inputs accordingly; the width and height must be entered like so (100px or 100%)");
        }
    });

    //USED FOR TESTING PURPOSES, TELLS YOU CONTENTS OF PANElS ARRAY ON HOVER of LOGO
    $('.smalllogo').mouseover(function () {
        console.log(panels);
    });

    //USED TO DISPLAY TOOLTIPS
    $(document).on({
            mouseenter: function () {
                var panelinfo = getPanelObj($(this).attr('id'));
                console.log(panels);
                //$(this).draggable();
                $(this).append('<div class="ui-resizable-handle ui-resizable-nw" id="nwgrip"></div> <div class="ui-resizable-handle ui-resizable-ne" id="negrip"></div> <div class="ui-resizable-handle ui-resizable-sw" id="swgrip"></div> <div class="ui-resizable-handle ui-resizable-se" id="segrip"></div> <div class="ui-resizable-handle ui-resizable-n" id="ngrip"></div> <div class="ui-resizable-handle ui-resizable-s" id="sgrip"></div> <div class="ui-resizable-handle ui-resizable-e" id="egrip"></div> <div class="ui-resizable-handle ui-resizable-w" id="wgrip"></div>');
                //handle resizing of % width and heights

                if (panelinfo.widthpercent && panelinfo.heightpercent) {
                    $(this).resizable({
                        stop: function (e, ui) {
                            var parent = ui.element.parent();
                            ui.element.css({
                                width: ui.element.width() / parent.width() * 100 + "%",
                                height: ui.element.height() / parent.height() * 100 + "%"
                            });
                        },
                        handles: {
                            'nw': '#nwgrip',
                            'ne': '#negrip',
                            'sw': '#swgrip',
                            'se': '#segrip',
                            'n': '#ngrip',
                            'e': '#egrip',
                            's': '#sgrip',
                            'w': '#wgrip'
                        }
                    });
                } else if (panelinfo.widthpercent) {
                    $(this).resizable({
                        stop: function (e, ui) {
                            var parent = ui.element.parent();
                            ui.element.css({
                                width: ui.element.width() / parent.width() * 100 + "%"
                            });
                        },
                        handles: {
                            'nw': '#nwgrip',
                            'ne': '#negrip',
                            'sw': '#swgrip',
                            'se': '#segrip',
                            'n': '#ngrip',
                            'e': '#egrip',
                            's': '#sgrip',
                            'w': '#wgrip'
                        }
                    });
                } else if (panelinfo.heightpercent) {
                    $(this).resizable({
                        stop: function (e, ui) {
                            var parent = ui.element.parent();
                            ui.element.css({
                                height: ui.element.height() / parent.height() * 100 + "%"
                            });
                        },
                        handles: {
                            'nw': '#nwgrip',
                            'ne': '#negrip',
                            'sw': '#swgrip',
                            'se': '#segrip',
                            'n': '#ngrip',
                            'e': '#egrip',
                            's': '#sgrip',
                            'w': '#wgrip'
                        }
                    });
                } else {
                    $(this).resizable({
                        handles: {
                            'nw': '#nwgrip',
                            'ne': '#negrip',
                            'sw': '#swgrip',
                            'se': '#segrip',
                            'n': '#ngrip',
                            'e': '#egrip',
                            's': '#sgrip',
                            'w': '#wgrip'
                        }
                    });
                    console.log("default resziable used");
                }
                //handle of % left and top
                if (panelinfo.leftpercent && panelinfo.toppercent) {
                    $(this).draggable({
                        stop: function (e, ui) {
                            var parent = ui.element.parent();
                            ui.element.css({
                                left: ui.element.css("left").replace("px", "") / parent.css("left").replace("px", "") * 100 + "%",
                                top: ui.element.css("top").replace("px", "") / parent.css("top").replace("px", "") * 100 + "%"
                            });
                        }
                    });
                } else if (panelinfo.leftpercent) {
                    $(this).draggable({
                        stop: function (e, ui) {
                            var parent = ui.element.parent();
                            ui.element.css({
                                left: ui.element.css("left").replace("px", "") / parent.css("left").replace("px", "") * 100 + "%"
                            });
                        }
                    });
                } else if (panelinfo.toppercent) {
                    $(this).draggable({
                        stop: function (e, ui) {
                            var parent = ui.element.parent();
                            ui.element.css({
                                top: ui.element.css("top").replace("px", "") / parent.css("top").replace("px", "") * 100 + "%"
                            });
                        }
                    });
                } else {
                    $(this).draggable();
                    console.log("default draggable used");
                }
                //code for tooltip addition
                /*           var panelhover;
                           console.log($(this).attr('id'));
                           for (var i = 0; i < panels.length; i++) {
                               if (panels[i].id === $(this).attr('id')) {
                                   panelhover = panels[i];
                               }
                           }
                           widthpercent = Math.round(($(this).width() / $(document).width()) * 100) + "%";
                           heightpercent = Math.round(($(this).height() / $(document).height()) * 100) + "%";
                           widthpixel = $(this).width() + "px";
                           heightpixel = $(this).height() + "px";

                           console.log("widthpercent: " + panelhover.widthpercent);
                           console.log("heightpercent: " + panelhover.heightpercent);

                           if (panelhover.widthpercent && panelhover.heightpercent) {
                               $(this).data('powertipjq', $([
                   '<p><b>Width: ' + widthpercent + ' Height: ' + heightpercent + '</b></p>'
                   ].join('\n')));
                           } else if (panelhover.widthpercent) {
                               $(this).data('powertipjq', $([
                   '<p><b>Width: ' + widthpercent + ' Height: ' + heightpixel + '</b></p>'
                   ].join('\n')));
                           } else if (panelhover.heightpercent) {
                               $(this).data('powertipjq', $([
                   '<p><b>Width: ' + widthpixel + ' Height: ' + heightpercent + '</b></p>'
                   ].join('\n')));
                           } else {
                               $(this).data('powertipjq', $([
                   '<p><b>Width: ' + widthpixel + ' Height: ' + heightpixel + '</b></p>'
                   ].join('\n')));
                           }

                           $(this).powerTip({
                               followMouse: true,
                               smartPlacement: true
                           });*/
                hoveredpanel = this;
            },
            mouseleave: function () {
                //stuff to do on mouse leave
                $(this).draggable('destroy');
                if (!isResizing) {
                    $(this).children('.ui-resizable-handle').remove();
                    $(this).resizable('destroy');
                }
            }
        },
        ".panels"); //pass the element as an argument to .on  

    $(document).on({
        mousedown: function () {
            isResizing = true;
        },
        mouseup: function () {
            try {
                isResizing = false;
                $(hoveredpanel).children('.ui-resizable-handle').remove();
                $(hoveredpanel).resizable('destroy');
            } catch (e) {
                console.log("error caught");
            }
        }
    }, '.ui-resizable-handle');

    $(document).mouseup(function () {
        try {
            isResizing = false;
            $(hoveredpanel).children('.ui-resizable-handle').remove();
            $(hoveredpanel).resizable('destroy');
        } catch (e) {
            console.log("error caught");
        }
    });

    $(document).on('click', '.panels', function () {
        setFocused(this);
    });

    $(document).on('change', '#width', function () {
        $(focused).css('width', $('#width').val());
        focusedinfo.widthunit = $('#width').val();
        if ($('#width').val().indexOf("%") != -1) {
            focusedinfo.widthpercent = true;
        } else if ($('#width').val().indexOf("px") != -1) {
            focusedinfo.widthpercent = false;
        }
    });

    $(document).on('change', '#height', function () {
        $(focused).css('height', $('#height').val());
        focusedinfo.heightunit = $('#height').val();
        if ($('#height').val().indexOf("%") != -1) {
            focusedinfo.heightpercent = true;
        } else if ($('#height').val().indexOf("px") != -1) {
            focusedinfo.heightpercent = false;
        }
    });

    $(document).on('change', '#left', function () {
        $(focused).css('left', $('#left').val());
        focusedinfo.left = $('#left').val();
        if ($('#left').val().indexOf("%") != -1) {
            focusedinfo.leftpercent = true;
        } else if ($('#left').val().indexOf("px") != -1) {
            focusedinfo.leftpercent = false;
        }
    });

    $(document).on('change', '#top', function () {
        $(focused).css('top', $('#top').val());
        focusedinfo.top = $('#top').val();
        if ($('#top').val().indexOf("%") != -1) {
            focusedinfo.toppercent = true;
        } else if ($('#top').val().indexOf("px") != -1) {
            focusedinfo.toppercent = false;
        }
    });

    $(document).on('resize', '.panels', function () {
        var resizepanel = '#' + $(this).attr('id');
        var panelobj = getPanelObj($(this).attr('id'));
        if (panelobj.widthunit.indexOf("%") != -1) {
            panelobj.widthunit = ($(resizepanel).width() / $(window).width()) * 100 + "%";
        } else {
            panelobj.widthunit = $(resizepanel).width() + "px";
        }
        if (panelobj.heightunit.indexOf("%") != -1) {
            panelobj.heightunit = ($(resizepanel).height() / $(window).height()) * 100 + "%";
        } else {
            panelobj.heightunit = $(resizepanel).height() + "px";
        }
        if ($(this).attr('id') == focusedinfo.id) {
            $('#width').val(panelobj.widthunit);
            $('#height').val(panelobj.heightunit);
        }
        //console.log("width: " + panelobj.widthunit + ", height: " + panelobj.heightunit);
    });

    //ATTEMPT AT UPDATING MARGINS ON DRAG #REWORK
    /*$(document).on('mouseenter', '.panels', function () {
        var panelobj = getPanelObj($(this).attr('id'));
        $(this)
            .mousedown(function () {
                isDragging = false;
            })
            .mousemove(function () {
                isDragging = true;
            })
            .mouseup(function () {
                var wasDragging = isDragging;
                isDragging = false;
                if (!wasDragging) {
                    console.log("panelobj: " + panelobj);
                    panelobj.left = $(this).css('left');
                    panelobj.top = $(this).css('top');
                    if ($(this).attr('id') == focusedinfo.id) {
                        $('#left').val(panelobj.left);
                        $('#top').val(panelobj.top);
                    }
                }
            });
    });*/

    $(document).on('dragstop', '.panels', function () {
        var panelobj = getPanelObj($(this).attr('id'));
        console.log("panelobj: " + panelobj);
        if (panelobj.leftpercent) {
            panelobj.left = ($(this).position().left / $(window).width()) * 100 + "%";
        } else {
            panelobj.left = $(this).position().left + "px";
        }
        if (panelobj.toppercent) {
            panelobj.top = ($(this).position().top / $(window).height()) * 100 + "%";
        } else {
            panelobj.top = $(this).position().top + "px";
        }
        if ($(this).attr('id') == focusedinfo.id) {
            $('#left').val(panelobj.left);
            $('#top').val(panelobj.top);
        }
        $(this).css('left', panelobj.left);
        $(this).css('top', panelobj.top);
    });

    //EDITOR CONTENT
    /*    $('.tinymce').on('change', function () {
          try {
                var content = '<div class="selectedinfo">Selected</div>' + $('#editor1').val() + '<!-- END ITEM -->';
                $(focused.id).empty();
                $(focused.id).append(content);
            } catch (error) {
                console.log("Panel Deselected");
            }
        });*/
    //END EDITOR CONTENT
    $('.close').click(function () {
        $('.panelmanage').slideUp();
    });


    $('#export').click(function () {

        var zip = new JSZip();

        $('.panels').each(function (i, obj) {
            $('.focused').remove();
            $('.ui-draggable').remove();
            $('.ui-draggable-handle').remove();
            $('.ui-resizable').remove();
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

    function addContext(idofpanel) {
        $.contextMenu({
            selector: idofpanel,
            callback: function (key, options) {
                var m = "clicked: " + key + " on " + $(this).text();
                window.console && console.log(m) || alert(m);
            },
            items: {
                "edit": {
                    name: "Edit",
                    icon: "edit"
                },
                "cut": {
                    name: "Cut",
                    icon: "cut"
                },
                "copy": {
                    name: "Copy",
                    icon: "copy",
                    callback: function () {
                        console.log($(this).attr('id'));
                        copypanel = jQuery.extend(true, {}, getPanelObj($(this).attr('id')));
                        copypanelinner = $(this).html();
                    }
                },
                "paste": {
                    name: "Paste",
                    icon: "paste",
                    callback: function () {
                        copypanel = jQuery.extend(true, {}, copypanel);
                        copypanel.id = "panel" + iden++;
                        $('.content').append('<li class="panels" id="' + copypanel.id + '" style="width:' + copypanel.widthunit + '; height:' + copypanel.heightunit + '; left: ' + copypanel.left + '; top: ' + copypanel.top + '; background-color:' + copypanel.bgcolor + ';">' + copypanelinner + '<!-- END ITEM --></li>');
                        //setTimeout(function() {
                        addContext('#' + copypanel.id);
                        //}, 100);
                        panels.push(copypanel);
                    }
                },
                "delete": {
                    name: "Delete",
                    icon: "delete",
                    callback: function () {
                        console.log($(this).attr('id'));
                        for (var i = 0; i < panels.length; i++) {
                            if ($(this).attr('id') == panels[i].id) {
                                panels.splice(i, 1);
                            }
                        }
                        console.log("deleted panel");
                        $(this).remove();
                    }
                },
                "sep1": "---------",
                "quit": {
                    name: "Quit",
                    icon: "quit"
                }
            }
        });
    }

    function getPanelObj(id) {
        for (var i = 0; i < panels.length; i++) {
            if (panels[i].id === id) {
                return panels[i];
            }
        }
    }

    function setFocused(panel) {
        var content = panel.innerHTML.replace('<!-- END ITEM -->', '');
        content = content.replace('<div class="ui-resizable-handle ui-resizable-nw" id="nwgrip"></div> <div class="ui-resizable-handle ui-resizable-ne" id="negrip"></div> <div class="ui-resizable-handle ui-resizable-sw" id="swgrip"></div> <div class="ui-resizable-handle ui-resizable-se" id="segrip"></div> <div class="ui-resizable-handle ui-resizable-n" id="ngrip"></div> <div class="ui-resizable-handle ui-resizable-s" id="sgrip"></div> <div class="ui-resizable-handle ui-resizable-e" id="egrip"></div> <div class="ui-resizable-handle ui-resizable-w" id="wgrip"></div>', '');
        if (focused == panel) {
            $(panel).removeClass('focused');
            focused = null;
            tinymce.activeEditor.setContent("");
            $('.panelinfo').html('');
        } else {
            $('.panels').each(function (index) {
                $(panel).removeClass('focused');
            });
            $(panel).addClass('focused');
            focused = panel;
            focusedinfo = getPanelObj($(panel).attr('id'));
            tinymce.activeEditor.setContent(content);
            $('.panelinfo').html('');
            $('.panelinfo').append('<li>Width <input id="width" type="text" name="width" value="' + focusedinfo.widthunit + '"></input> </li> <li>Height <input id="height" type="text" name="height" value="' + focusedinfo.heightunit + '"></input> </li> <li>Left <input id="left" type="text" name="left" + value="' + focusedinfo.left + '"></input> </li> <li>Top <input id="top" type="text" name="top" value="' + focusedinfo.top + '"></input> </li> <li>Test <input type="text" name="width"></input> </li>');
        }
    }
});