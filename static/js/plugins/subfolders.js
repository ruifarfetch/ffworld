//DEBUG TOOL FOR SUBFOLDERS VERSION
//Inject on URL metatag_debug for Metatags
//Inject on URL subfolder_debug for Subfolders Links
$(function () {

    function getCookie(cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i].trim();
            if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
        }
        return "";
    }

    if (document.location.href.indexOf("ff_debug") > 0 || getCookie("ff_debug") == 1) {
        //document.cookie = "ff_debug=1;path=/";

        var containerStyle =
            "<style>" +                
            "   #ffDebuggerWrapper {" +
            "       padding: 0;" +
            "       margin: 0;" +
            "       position: fixed;" +
            "       right: 0;" +
            "       top: 0;" +
            "       bottom: 0;" +
            "       width: 300px;" +
            "       z-index: 99999;" +
            "       background: #F0F0F0;" +
            "       border-left: 2px solid grey;" +
            "   }" +
            "   #ffDebuggerHeader {" +
            "       position: absolute;" +
            "       top: 0;" +
            "       height: 40px;" +
            "       overflow: hidden;" +
            "       background: grey;" +
            "       width: 100%;" +
            "       display: table;" +
            "   }" +
            "       #ffDebuggerHeader a {" +
            "           cursor: pointer;" +
            "           display: table-cell;" +
            "           width: 40px;" +
            "           height: 40px;" +
            "       }" +
            "       #ffDebuggerHeader a:hover {" +
            "               background: #ddd;" +
            "       }" +
            "           #ffDebuggerHeader a div {" +
            "               background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsSAAALEgHS3X78AAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAAIjSURBVHja7JfPS1VREMc/n+vrB2qilOQiEjfu+rHSok21CgokaBvtiv6GNm4CadXKVaGrFkFgENHGNKlFi8BAA4PSVxCFtbOIQqaF54E9rvrS63sEDgz33nPmnPmemfnO4RIR5Grf4VEgNqNr7pmjGXnS3z0KXKEOUqpy3A7crpfzvwGsOJ8EjlFHyRrpfAVAf/dxYLoRzgFKdxaXhtqasnlgPmd+crsBmKiTKxFhfWqggbIDoOEA1i1C4EyN+yxExMJmQUQBOvgvF9DGl9FOEf6PANRqHciy7F6WZa1Zlj1U+3NsiitCYBdwCtgLNKvv1DJwVP2tjifWdQAn0vuGNDxdYwDKQJc6FREX1WlgDmgGvgOtajkieiPiqjoUEUeA+dK6/Ix4Vmv4gd4Uhc6I6FCb0wFb016dEbEP6AJaErj1U1Arl5P0qEvqG/W+Gjk6on5WF1IqCgWAOqD+WMN5Rb+oJ7eDBe3AU2BmA9MXwIzaVlgE1EF1Qf2qLq867SdgMKWmMvYr2b0Frm8ZQDr9slpWZ6vCPZXm31eNv1K/qYtbTkECkUXEcETcrW50akvOmpvAGHCgVFAJjAETQE+N9h+Bx4m2hbFgv/qyKtTP1ZacFDyq/BQVyYJrQF9EDAMf0vDu1Iz2pO/XETECnAcuFX0bHkzPGxFxDhhX59Sf6izwICIuALeSXWfRjegy8KTSelNUmrIsQ11da4fUCeAswJ8BAPKiDYyty2jDAAAAAElFTkSuQmCC) no-repeat center;" +
            "               width: 40px;" +
            "               height: 40px;" +
            "           }" +
            "       #ffDebuggerHeader h2 {" +
            "           display: table-cell;" +
            "           line-height: 40px;" +
            "           vertical-align: middle;" +
            "           text-align: center;" +
            "       }" +
            "   #ffDebuggerTypeDrop {" +
            "       width: 100%;" +
            "       padding: 5px;" +
            "       font-weight: bold;" +
            "       position: absolute;" +
            "       top: 40px;" +
            "   }" +
            "   #ffDebuggerBody {" +
            "       position: absolute;" +
            "       top: 74px;" +
            "       bottom: 0;" +
            "       overflow: auto;" +
            "       width: 100%;" +
            "   }" +
            "   #ffDebuggerBody .ffDebuggerBodyContainer {" +
            "       padding: 5px;" +
            "   }" +

            " #ffDebuggerBody input{" +
                "-webkit-appearance: checkbox;" +
            "}" +
            //Hidden mode
            "   #ffDebuggerWrapper.ffDebuggerHidden {" +
            "       width: 40px;" +
            "       height: 40px;" +
            "       border: none;" +
            "   }" +
            "   #ffDebuggerWrapper.ffDebuggerHidden #ffDebuggerBody," +
            "   #ffDebuggerWrapper.ffDebuggerHidden #ffDebuggerTypeDrop," +
            "   #ffDebuggerWrapper.ffDebuggerHidden #ffDebuggerHeader h2 {" +
            "       display: none;" +
            "   }" +
            "   #ffDebuggerWrapper.ffDebuggerHidden #ffDebuggerHeader a {" +
            "           background: #F0F0F0;" +
            "   }" +
            "   #ffDebuggerWrapper.ffDebuggerHidden #ffDebuggerHeader a:hover {" +
            "           background: #ddd;" +
            "   }" +
            "</style>";
        var containerHtml =
            "<div id='ffDebuggerWrapper' " + (getCookie("ff_debug_open") == 1 ? "" : "class='ffDebuggerHidden'") + ">" +
            "   <div id='ffDebuggerHeader'>" +
            "       <h2>Farfetch Debugger</h2>" +
            "       <a href='javascript:document.ff_debug.toogle();'>" +
            "           <div></div>" +
            "       </a>" +
            "   </div>" +
            "   <select id='ffDebuggerTypeDrop'></select>" +
            "   <div id='ffDebuggerBody'>" +
            "   </div>" +
            "</div>";

        document.ff_debug = {
            wrapper: $(containerHtml),
            toogle: function () {
                if (document.ff_debug.wrapper.hasClass("ffDebuggerHidden")) {
                    document.ff_debug.wrapper.removeClass('ffDebuggerHidden');
                    document.cookie = "ff_debug_open=1;path=/";
                } else {
                    document.ff_debug.wrapper.addClass('ffDebuggerHidden');
                    document.cookie = "ff_debug_open=0;path=/";
                }
            },
            translations: {
                toggleHighlight: function () {
                    if ($(this).is(':checked')) {
                        $('body').highlight('NO_TRAD');
                        $('[value*=NO_TRAD],[placeholder*=NO_TRAD],[text*=NO_TRAD]').css('border', '2px solid red');
                    }
                    else {

                        $('body').removeHighlight('NO_TRAD');
                        $('[value*=NO_TRAD],[placeholder*=NO_TRAD],[text*=NO_TRAD]').css('border', 'none');
                    }
                }
            },
            clickstream: {
                toggleTracking: function () {
                    if ($(this).is(':checked')) {
                        $("[trk]").each(function () {
                            $(this).css('color', 'orange');
                            $(this).attr('alt', $(this).attr('trk'));
                            $(this).attr('title', $(this).attr('trk'));
                        });
                    } else {
                        $("[trk]").each(function () {
                            $(this).css('color', 'black');
                            $(this).attr('alt', '');
                            $(this).attr('title', '');
                        });
                    }
                }
            },
            flatContent: {
                toggleTracking: function () {
                    if ($(this).is(':checked')) {
                        $("[data-flat]").each(function () {
                            $(this).css('border', '2px solid red');
                            $(this).attr('alt', $(this).attr('data-flat'));
                            $(this).attr('title', $(this).attr('data-flat'));
                        });
                    } else {
                        $("[data-flat]").each(function () {
                            $(this).css('border', 'none');
                            $(this).attr('alt', '');
                            $(this).attr('title', '');
                        });
                    }
                },
                flatIdentityOn: function() {
                    var flatId = $(this).data("flat-id");
                    $("[data-flat='" + flatId + "']").addClass("identifyOn");
                },
                flatIdentityOff: function () {
                    var flatId = $(this).data("flat-id");
                    $("[data-flat='" + flatId + "']").removeClass("identifyOn");
                }
            }                           
        };
        document.ff_debug.typeDrop = document.ff_debug.wrapper.find("#ffDebuggerTypeDrop");
        document.ff_debug.body = document.ff_debug.wrapper.find("#ffDebuggerBody");
        document.ff_debug.typeDrop.change(function () {
            var $selectedOption = $(this).find("option:selected");
            $(".ffDebuggerBodyContainer").hide();
            $("#ffDebuggerContainer_" + $selectedOption.val()).show();
            document.cookie = "ff_debug_type=" + $selectedOption.val() + ";path=/";
        });

        document.ff_debug.wrapper.prepend(containerStyle);



        //START - SubFolders
        document.ff_debug.typeDrop.append("<option value='subfolder'>Subfolder</option>");
        var $container = $("<div id='ffDebuggerContainer_subfolder' class='ffDebuggerBodyContainer'>");
        //Universial Variable Status
        $container.append("<h4 style='text-align: center; margin: 10px 0;'>Universial Variable Status</h4>");
        $container.append("<p><b>Current Subfolder: </b>" + window.universal_variable.page.subfolder + "</p><hr style='margin: 3px 0;'>");
        $container.append("<p><b>User Subfolder: </b>" + window.universal_variable.page.userSubfolder + "</p><hr style='margin: 3px 0;'>");
        $container.append("<p><b>Geo Subfolder: </b>" + window.universal_variable.page.geoSubfolder + "</p><hr style='margin: 3px 0;'>");
        $container.append("<p><b>Ip: </b>" + window.universal_variable.user.ip + "</p><hr style='margin: 3px 0;'>");
        
        //Links
        var $links = $("a[href]");
        if ($links.length > 0) {
            var $ul,
                $dataIgnoreLinks = [],
                $errorLinks = [],
                $subfolderLinks = [],
                $fullUrlLinks = [],
                $anchorsLinks = [],
                $javascriptLinks = [];

            $container.append("<h4 style='text-align: center; margin: 10px 0;'>Links</h4>");

            $links.sort(function (a, b) {
                return $(a).attr("href") > $(b).attr("href") ? 1 : -1;;
            });

            $links.each(function (index, elem) {
                var $elem = $(elem),
                    elemHref = $elem.attr("href");

                if (elemHref.indexOf(window.universal_variable.page.subfolder) == 0) {//Sulfolder
                    $subfolderLinks.push(elem);
                } else if (elemHref.indexOf('#') == 0 || !elemHref) {//Anchors
                    $anchorsLinks.push(elem);
                } else if (elemHref.indexOf('javascript') == 0) {//Javascript Execution
                    $javascriptLinks.push(elem);
                } else if ($elem.attr("data-ignore")) {//Mark data-ignore
                    $dataIgnoreLinks.push(elem);
                } else if (elemHref.indexOf('http://') == 0 || elemHref.indexOf('https://') == 0) {//Full Url
                    $fullUrlLinks.push(elem);
                } else {//Error
                    $errorLinks.push(elem);
                }
            });

            //Error
            $container.append("<h5 style='text-align: right; margin: 10px 0;'>Errors</h5>");
            $ul = $("<ul>");
            if ($errorLinks.length) {
                $.each($errorLinks, function (index, elem) {
                    $ul.append("<li>" + $(elem).attr("href") + "</li><hr style='margin: 3px 0;'>");
                });
            } else {
                $ul.append("<li><i>No errors found</i></li><hr style='margin: 3px 0;'>");
            }
            $container.append($ul);
            //Subfolders
            $container.append("<h5 style='text-align: right; margin: 10px 0;'>Subfolders</h5>");
            $ul = $("<ul>");
            if ($subfolderLinks.length) {
                $.each($subfolderLinks, function (index, elem) {
                    $ul.append("<li><a href='" + $(elem).attr("href") + "'>" + $(elem).attr("href") + "</a></li><hr style='margin: 3px 0;'>");
                });
            } else {
                $ul.append("<li><i>No sulfolder links found</i></li><hr style='margin: 3px 0;'>");
            }
            $container.append($ul);
            //data-ignore
            $container.append("<h5 style='text-align: right; margin: 10px 0;'>Data-ignore</h5>");
            $ul = $("<ul>");
            if ($dataIgnoreLinks.length) {
                $.each($dataIgnoreLinks, function (index, elem) {
                    $ul.append("<li>" + $(elem).attr("href") + "</li><hr style='margin: 3px 0;'>");
                });
            } else {
                $ul.append("<li><i>No data-ignore links found</i></li><hr style='margin: 3px 0;'>");
            }
            $container.append($ul);
            //Full Url
            $container.append("<h5 style='text-align: right; margin: 10px 0;'>Full Url</h5>");
            $ul = $("<ul>");
            if ($fullUrlLinks.length) {
                $.each($fullUrlLinks, function (index, elem) {
                    $ul.append("<li>" + $(elem).attr("href") + "</li><hr style='margin: 3px 0;'>");
                });
            } else {
                $ul.append("<li><i>No data-ignore links found</i></li><hr style='margin: 3px 0;'>");
            }
            $container.append($ul);
            //Anchors
            $container.append("<h5 style='text-align: right; margin: 10px 0;'>Anchors</h5>");
            $ul = $("<ul>");
            if ($anchorsLinks.length) {
                $.each($anchorsLinks, function (index, elem) {
                    $ul.append("<li>" + $(elem).attr("href") + "</li><hr style='margin: 3px 0;'>");
                });
            } else {
                $ul.append("<li><i>No anchors links found</i></li><hr style='margin: 3px 0;'>");
            }
            $container.append($ul);
            //Javascript Execution
            $container.append("<h5 style='text-align: right; margin: 10px 0;'>Javascript</h5>");
            $ul = $("<ul>");
            if ($javascriptLinks.length) {
                $.each($javascriptLinks, function (index, elem) {
                    $ul.append("<li>" + $(elem).attr("href") + "</li><hr style='margin: 3px 0;'>");
                });
            } else {
                $ul.append("<li><i>No javascript execution links found</i></li><hr style='margin: 3px 0;'>");
            }
            $container.append($ul);




            //$links.each(function (index, elem) {
            //    var $elem = $(elem);
            //    $ul.append("<li><b>Href: </b>" + $elem.attr("href") + "</li><hr style='margin: 3px 0;'>");
            //});
        } else {
            $container.append("<i style='text-align: center;'>No links found on page</i>");
        }
        document.ff_debug.body.append($container);
        //END - SubFolders

        //START - Metatags
        document.ff_debug.typeDrop.append("<option value='metatag'>Metatag</option>");
        $container = $("<div id='ffDebuggerContainer_metatag' class='ffDebuggerBodyContainer' style='display: none;'>");
        $container.append("<h4 style='text-align: center; margin: 10px 0;'>Metatags</h4>");
        var $metaTags = $("meta");
        if ($metaTags.length > 0) {
            $ul = $("<ul>");
            $metaTags.each(function (index, elem) {
                var metaHtml = "<li>";
                $.each(elem.attributes, function (i, tagAttr) {
                    if (tagAttr.specified) {
                        metaHtml += "<b>" + tagAttr.name + ": </b> " + tagAttr.value + ";";
                    }
                });
                metaHtml += "</li><hr style='margin: 3px 0;'>";
                $ul.append(metaHtml);
            });
            $container.append($ul);
        } else {
            $container.append("<i style='text-align: center;'>No metatags found on page</i>");
        }
        document.ff_debug.body.append($container);
        //END - Metatags


        //START - H1
        document.ff_debug.typeDrop.append("<option value='h1'>H1</option>");
        $container = $("<div id='ffDebuggerContainer_h1' class='ffDebuggerBodyContainer' style='display: none;'>");
        $container.append("<h4 style='text-align: center; margin: 10px 0;'>H1</h4>");
        var $h1 = $("h1");
        if ($h1.length > 0) {
            $ul = $("<ul>");
            $h1.each(function (index, elem) {
                $ul.append("<li>" + $(elem).text() + "</li><hr style='margin: 3px 0;'>");
            });
            $container.append($ul);
        } else {
            $container.append("<i style='text-align: center;'>No h1 found on page</i>");
        }
        document.ff_debug.body.append($container);
        //END - H1

        //START - Translations
        document.ff_debug.typeDrop.append("<option value='Trans'>Translations</option>");
        $container = $("<div id='ffDebuggerContainer_Trans' class='ffDebuggerBodyContainer' style='display: none;'>");
        $container.append("<h4 style='text-align: center; margin: 10px 0;'>Translations</h4>");

        $container.append("<div><input type='checkbox'/> Highlight no Trad</div>");
        $container.find('input[type=checkbox]').change(document.ff_debug.translations.toggleHighlight);

        document.ff_debug.body.append($container);
        //END - Translations

        //START - ClickStream
        document.ff_debug.typeDrop.append("<option value='ClkStream'>ClickStream</option>");
        $container = $("<div id='ffDebuggerContainer_ClkStream' class='ffDebuggerBodyContainer' style='display: none;'>");
        $container.append("<h4 style='text-align: center; margin: 10px 0;'>ClickStream</h4>");

        $container.append("<div><input type='checkbox'/> Color Clickstream Events</div>");
        $container.find('input[type=checkbox]').change(document.ff_debug.clickstream.toggleTracking);



        document.ff_debug.body.append($container);
        //END - ClickStream
        
        //START - Flat Contents
        document.ff_debug.typeDrop.append("<option value='fltContent'>Flat Contents</option>");
        $container = $("<div id='ffDebuggerContainer_fltContent' class='ffDebuggerBodyContainer' style='display: none;'>");
        $container.append("<h4 style='text-align: center; margin: 10px 0;'>Flat Content</h4><style> .identifyOn{border:2px solid yellow !important;} </style>");

        $container.append("<div><input type='checkbox'/>View Flat Content</div>");       
        $container.find('input[type=checkbox]').change(document.ff_debug.flatContent.toggleTracking);
        
        $("[data-flat]").each(function () {            
            $container.append("<div class='flatId' data-flat-id='" + $(this).attr('data-flat') + "' >" + $(this).attr('data-flat') + "</div>");
            $container.append("</br>");
        });

        $container.find('.flatId').hover(document.ff_debug.flatContent.flatIdentityOn);
        $container.find('.flatId').mouseout(document.ff_debug.flatContent.flatIdentityOff);
        document.ff_debug.body.append($container);
        //END - ClickStream


        document.ff_debug.wrapper.appendTo("body");
        if (getCookie("ff_debug_type")) {
            document.ff_debug.typeDrop.val(getCookie("ff_debug_type")).change();
        }
    }
});