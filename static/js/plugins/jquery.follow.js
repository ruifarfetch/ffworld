/* 
Follow Plugin 
*/
(function ($) {
    // Default Options
    var defaults = {
        followID: null,
        followType: null
    };

    // Methods object
    var methods = {
        followPPage: function (settings, followId, followType, isFollowing) {
            var isLogged = FFAPI.methods.requireLogin();

            if (followType == 1) // follow store
            {
                if (isFollowing) {
                    if (typeof (_fftrkobj) !== "undefined") { _fftrkobj.track({ "tid": "222", "val": followId }); }
                    FFAPI.methods.fireQubitEvents("Click follow boutique", "follow boutique");
                } else {
                    if (typeof (_fftrkobj) !== "undefined") { _fftrkobj.track({ "tid": "221", "val": followId }); }
                  
                }
            }
            if (followType == 2) // follow designer
            {
                if (isFollowing) {
                    if (typeof (_fftrkobj) !== "undefined") { _fftrkobj.track({ "tid": "232", "val": followId }); }
                    FFAPI.methods.fireQubitEvents("Click follow designer", "follow designer");
                } else {
                    if (typeof (_fftrkobj) !== "undefined") { _fftrkobj.track({ "tid": "231", "val": followId }); }
                    

                }
            }

            $.ajax({
                type: "POST",
                url: (typeof (globalAsyncReqDomain) == "undefined" ? "" : globalAsyncReqDomain) + universal_variable.page.subfolder + "/ws/WsFollow.asmx/addToFollowsQueue",
                data: "{follows:'" + followId + "', isFollowing:'" + isFollowing + "', followType:'" + followType + "'}",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (result, e) {
                    if (isLogged && isFollowing) {
                        $("#followId" + settings.clientID).hide();
                        $("#unfollowId" + settings.clientID).show();

                    } else {
                        $("#unfollowId" + settings.clientID).hide();
                        $("#followId" + settings.clientID).show();

                    }
                    $(".followBoutiqueDesigner").tooltip("destroy").tooltip({});
                }
            });

        },
        isFollowing: function (settings) {
            // call the web service to determinate if the user already follows the brand/designer
            $.ajax({
                type: "POST",
                url: (typeof (globalAsyncReqDomain) == "undefined" ? "" : globalAsyncReqDomain) + universal_variable.page.subfolder + "/ws/WsFollow.asmx/isFollowing",
                data: "{follows:'" + settings.followID + "', followType:'" + settings.followType + "'}",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (result, e) {
                    if (result.d) {
                        $("#followId" + settings.clientID).hide();
                        $("#unfollowId" + settings.clientID).show();
                    } else {
                        $("#unfollowId" + settings.clientID).hide();
                        $("#followId" + settings.clientID).show();
                    }
                    $(".followBoutiqueDesigner").tooltip("destroy").tooltip({});
                }
            });
        },
        // Initialize follow
        init: function (options) {
            /// <summary>
            ///     Initializes follow objects
            /// </summary>
            /// <param name="options" type="object">
            ///     Object with initial parameters
            /// </param>
            /// <returns type="this" />
            if (this.length) {
                // extend options, set defaults for options not set
                var settings = {};
                if (options) {
                    settings = $.extend(settings, defaults, options);
                }
                if (window.universal_variable.user.isLogged) {
                    methods.isFollowing(settings);
                }
                this.find(".follow").bind("click", function () {
                    methods.followPPage(settings, settings.followID, settings.followType, true);
                });
                this.find(".unfollow").bind("click", function () {
                    methods.followPPage(settings, settings.followID, settings.followType, false);
                });
            }
            return this;
        }
    };
    // Method caller. Will call "init" with given parameters if no methods are called
    $.fn.follow = function (method, args) {
        return this.each(function () {
            if (methods[method]) {
                if (args) {
                    return methods[method].apply($(this), args);
                } else {
                    return methods[method]();
                }
            } else if (typeof method === 'object' || !method) {
                return methods.init.call($(this), method);
            } else {
                $.error('Method ' + method + ' does not exist on jQuery.follow');
            }
        });
    };
})(jQuery);