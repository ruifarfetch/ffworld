/**
Main javaScript file. It contains the main functions to use. Defines global variables and the FFAPI
@deprecated api/
@class main-2.0.0.js
**/

/**
 * This module contains global methods of our API
 * @module FFAPI
 */
//try {

/// Initial declaration
/// This is the ONLY time "var" must be used withing the FFAPI namespace
var FFAPI = FFAPI || {};

///////////////////////////////////////////////////////////////////////////
//////////////////////////   Keyboard Keycodes   //////////////////////////
///////////////////////////////////////////////////////////////////////////

/**
 * Indicates keycodes. With these attributes you can check what key the user pressed. <br /><br />
 *   <i>FFAPI.keycode.backspace = 8;<br />
 *   FFAPI.keycode.tab = 9;<br />
 *   FFAPI.keycode.enter = 13;<br />
 *   FFAPI.keycode.shift = 16;<br />
 *   FFAPI.keycode.ctrl = 17;<br />
 *   FFAPI.keycode.alt = 18;<br />
 *   FFAPI.keycode.pause = 19;<br />
 *   FFAPI.keycode.caps_lock = 20;<br />
 *   FFAPI.keycode.escape = 27;<br />
 *   FFAPI.keycode.page_up = 33;<br />
 *   FFAPI.keycode.page_down = 34;<br />
 *   FFAPI.keycode.end = 35;<br />
 *   FFAPI.keycode.home = 36;<br />
 *   FFAPI.keycode.left_arrow = 37;<br />
 *   FFAPI.keycode.up_arrow = 38;<br />
 *   FFAPI.keycode.right_arrow = 39;<br />
 *   FFAPI.keycode.down_arrow = 40;<br />
 *   FFAPI.keycode.insert = 45;<br />
 *   FFAPI.keycode.del = 46;<br /></i>
 *
 * @property FFAPI.keycode.key
 * @static
 * @final
 * @type Number
 */
FFAPI.keycode = FFAPI.keycodes || {};
FFAPI.keycode.backspace = 8;
FFAPI.keycode.tab = 9;
FFAPI.keycode.enter = 13;
FFAPI.keycode.shift = 16;
FFAPI.keycode.ctrl = 17;
FFAPI.keycode.alt = 18;
FFAPI.keycode.pause = 19;
FFAPI.keycode.caps_lock = 20;
FFAPI.keycode.escape = 27;
FFAPI.keycode.page_up = 33;
FFAPI.keycode.page_down = 34;
FFAPI.keycode.end = 35;
FFAPI.keycode.home = 36;
FFAPI.keycode.left_arrow = 37;
FFAPI.keycode.up_arrow = 38;
FFAPI.keycode.right_arrow = 39;
FFAPI.keycode.down_arrow = 40;
FFAPI.keycode.insert = 45;
FFAPI.keycode.del = 46;


///////////////////////////////////////////////////////////////////////////
//////////////////////////////   Variables   //////////////////////////////
///////////////////////////////////////////////////////////////////////////
/**
 * FFAPI Variables object. You can include on this object all the variables you need on your page
 * @property FFAPI.variables
 * @type Object
 */
FFAPI.variables = FFAPI.variables || {};
/**
 * FFAPI Variables animationSpeed. The time the animation takes<br /> We use 300ms by default.
 * <b><i>FFAPI.variables.animationSpeed = 300;<br /></i></b>
 * @property FFAPI.variables.animationSpeed
 * @type Number
 */
FFAPI.variables.animationSpeed = 300;
/**
 * FFAPI Variables resizeWindowTime. The time after resizing the window<br /> We use 200ms by default.
 * <b><i>FFAPI.variables.resizeWindowTime = 200;<br /></i></b>
 * @property FFAPI.variables.resizeWindowTime
 * @type Number
 */
FFAPI.variables.resizeWindowTime = 200;
/**
 * FFAPI Variables isTestEnvironment. Verify if is test environment.
 * <b><i>FFAPI.variables.isTestEnvironment = true;<br /></i></b>
 * @property FFAPI.variables.isTestEnvironment
 * @type Number
 */
FFAPI.variables.isTestEnvironment = true;
/**
 * FFAPI Variables hasPlurals. If the language uses more than ths standard lexical plurals<br /> Only Russia uses this by now (default is false).
 * <b><i>FFAPI.variables.animationSpeed = true;<br /></i></b>
 * @property FFAPI.variables.hasPlurals
 * @type Bool
 */
FFAPI.variables.hasPlurals = false;
/**
 * FFAPI Variables Body element
 * <b><i>FFAPI.variables.bodyElement = $('body');<br /></i></b>
 * @property FFAPI.variables.bodyElement
 * @type Object
 */
$(document).ready(function () {
    FFAPI.variables.bodyElement = $('body');
    //Subfolder Attributes Configuration - China Request
    if (FFAPI.variables.enableBlankLinks && !FFAPI.variables.touchSupported) {
        $('a.blankLink').attr('target', '_blank');
    }
});
/**
 * FFAPI Variables Body element JS
 * <b><i>FFAPI.variables.bodyElement = document.getElementsByTagName('body');<br /></i></b>
 * @property FFAPI.variables.bodyElementJS
 * @type Object
 */
FFAPI.variables.bodyElementJS = document.getElementsByTagName('body');

///////////////////////////////////////////////////////////////////////////
///////////////////////////////   Methods   ///////////////////////////////
///////////////////////////////////////////////////////////////////////////
/**
 * FFAPI methods object. All our main functions are added to this object
 * @property FFAPI.methods
 * @type Object
 */
FFAPI.methods = FFAPI.methods || {};

/**
 * Initial global bindings; called at the end of the code
 * @method FFAPI.methods.init
 */
FFAPI.methods.init = function () { };


/**
 * Generic event handler for preventing click on any desired element
 * @method FFAPI.methods.preventClick
 * @param {event} event
 */

FFAPI.methods.preventClick = function (event) {
    if (event.preventDefault) {
        event.preventDefault();
    } else {
        event.returnValue = false;
    }
    return false;
};

FFAPI.methods.addBlankLinks = function () {
    //Subfolder Attributes Configuration - China Request    
    if (FFAPI.variables.enableBlankLinks && !FFAPI.variables.touchSupported) {
        $('a.blankLink').attr('target', '_blank');
    }
};

/**
 * Outputs message to console if it's in a test environment
 * @method FFAPI.methods.debug
 * @param {String} msg
 */
FFAPI.methods.debug = function (msg) {
    if (FFAPI.variables.isTestEnvironment && window.console && window.console.msg) {
        window.console.log(msg);
    }
};

/**
 * Converts decimal to hexadecimal
 * @method FFAPI.methods.d2h
 * @param {String} d Decimal to convert
 * @return String
 */
FFAPI.methods.d2h = function (d) {
    return d.toString(16);
};

/**
 * Converts hexadecimal to decimal
 * @method FFAPI.methods.h2d
 * @param {String} h Hexdecimal to convert
 * @return String
 */
FFAPI.methods.h2d = function (h) {
    return parseInt(h, 16);
};

/**
 * Checks if email string is valid against RegExp
 * @method FFAPI.methods.validateEmail
 * @param {email} email to validate
 * @return Boolean
 */
FFAPI.methods.validateEmail = function (email) {
    var regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    return regex.test(email);
};

/**
 * Generic hasClass function - Detects if element has a certain class
 * @method FFAPI.methods.hasClass
 * @param {Object} ele HTML Object
 * @param {String} cls ClassName to check
 * @return Boolean
 */
FFAPI.methods.hasClass = function (ele, cls) {
    return ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
};


/**
 * Generic adds class function - Adds a certain class from an element
 * @method FFAPI.methods.addClass
 * @param {Object} ele HTML object
 * @param {String} cls ClassName to add
 */
FFAPI.methods.addClass = function (ele, cls) {
    if (!FFAPI.methods.hasClass(ele, cls)) ele.className += " " + cls;
};

/**
 * Generic remove class function - Removes a certain class from an element
 * @method FFAPI.methods.removeClass
 * @param {Object} ele HTML Object
 * @param {String} cls ClassName to check
 */

FFAPI.methods.removeClass = function (ele, cls) {
    if (FFAPI.methods.hasClass(ele, cls)) {
        var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
        ele.className = ele.className.replace(reg, ' ').trim();
    }
};


/**
 * Generic get Height of an element
 * @method FFAPI.methods.getElementHeight
 * @param {Object} ele HTML Object
 * @return {[int]} Height of the element
 */

FFAPI.methods.getElementHeight = function (ele) {
    /// console.log(ele);
    if (typeof ele != "undefined") {
        var helper = ele.getBoundingClientRect().height;
        if (typeof helper === 'undefined') helper = 0;

        return Math.max(
            ele.clientHeight,
            helper,
            ele.offsetHeight);
    } else {
        return 0;
    }
};

/**
 * Generic get document Height
 * @method FFAPI.methods.getDocHeight
 * @param {Object} ele HTML Object
 * @return {[int]} Height of the element
 */
FFAPI.methods.getDocHeight = function () {
    var D = document;
    return Math.max(
        D.body.scrollHeight, D.documentElement.scrollHeight,
        D.body.offsetHeight, D.documentElement.offsetHeight,
        D.body.clientHeight, D.documentElement.clientHeight
    );
};
/**
 * Generic get Width of an element
 * @method FFAPI.methods.getElementWidth
 * @param {Object} ele HTML Object
 * @return {[int]} Width of the element
 */

FFAPI.methods.getElementWidth = function (ele) {
    var helper = ele.getBoundingClientRect().width;
    if (typeof helper === 'undefined') helper = 0;

    return Math.max(
        ele.clientWidth,
        helper,
        ele.offsetWidth);
};

/**
 * Generic remove element from DOM Width of an element
 * @method FFAPI.methods.removeElementDom
 * @param {Object} ele HTML Object
 * @param {Object} par Parent element HTML Object
 */
FFAPI.methods.removeElementDom = function (ele, par) {
    /// Remove Unobtrousive Mask
    var unobtrusiveMask = document.getElementsByClassName(ele),
        unobtrusiveParent = document.getElementsByClassName(par);
    for (var i = 0; i < unobtrusiveMask.length; i++) {
        unobtrusiveParent[0].removeChild(unobtrusiveMask[i]);
    }
};

/**
 * Makes an async request using POST method and returns JSON
 * @method FFAPI.methods.doRelativeJsonPost
 * @param {String} url Relative Url of the Webservice
 * @param {Object} data Data to be passed to webservice
 * @param {Function} callback functio to execute at the end
 */
FFAPI.methods.doRelativeJsonPost = function (url, data, callback) {
    $.ajax({
        type: "POST",
        url: (typeof (globalAsyncReqDomain) == "undefined" ? "" : globalAsyncReqDomain) + url,
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (result, e) {
            if (typeof (callback) === "function") {
                callback(result, e);
            }
        }
    });
};

/**
 * Fade Out native function
 * @method FFAPI.methods.fadeOut
 * @param  {[type]} HTMl elemento to hide
 */
FFAPI.methods.fadeOut = function (element) {
    var s = element.style;
    element.setAttribute('style', '');
    s.opacity = 1;
    FFAPI.methods.fadeOutElement(s);
};
/**
 * Fade Out native function behavior
 * @method FFAPI.methods.fadeOutElement
 * @param  {[type]} HTMl element to hide
 */
FFAPI.methods.fadeOutElement = function (style) {
    /// Get the style opactity with just one decimal part
    style.opacity = Math.round((Number(style.opacity) - Number(0.1)) * 10) / 10;
    /// If it's not equal to zero 
    if (Number(style.opacity) > Number(0.1)) {
        setTimeout(function () {
            FFAPI.methods.fadeOutElement(style);
        }, 40);

    } else {
        style.opacity = 0;
    }
}

/**
 * Fade In native function
 * @method FFAPI.methods.fadeIn
 * @param  {[type]} HTMl element to hide
 */
FFAPI.methods.fadeIn = function (element, display) {
    var s = element.style;
    element.setAttribute('style', '');
    if (display === 1) {
        s.display = 'block';
    }
    s.opacity = 0.1;

    FFAPI.methods.fadeInElement(s);

};
/**
 * Fade In native function behavior
 * @method FFAPI.methods.fadeInElement
 * @param  {[type]} HTMl element to hide
 */
FFAPI.methods.fadeInElement = function (style) {
    /// Get the style opactity with just one decimal part
    style.opacity = Math.round((Number(style.opacity) + Number(0.1)) * 10) / 10;
    /// If it's not equal to one
    /// SetTimeout of the function itself
    if (Number(style.opacity) < 1) {
        setTimeout(function () {
            FFAPI.methods.fadeInElement(style);
        }, 40);
    } else {
        style.opacity = 1;
    }
}





/**
 * This functions caches the new image using another function, and it has a callback function
 * @method FFAPI.responsive.cacheAndLoadImage
 * @param {Object} node - Image Object
 * @param {URL} newSrc - Image URL
 * @param {function} callback
 * @return Callback function
 */
FFAPI.methods.doFunctionAndCallback = function (functionFirst, callback) {
    functionFirst();
    callback();
};

/**
 * Binds clicking on the element.
 * @method FFAPI.methods.bindElemClick
 * @param {Array} elems - Elems array
 * @param {function} clickFunction
 */
FFAPI.methods.bindElemClick = function (elems, clickFunction) {
    var elemsLength = elems.length;
    for (var i = 0; i < elemsLength; i++) {
        if (!elems[i].removeEventListener) {
            elems[i].detachEvent("onclick", FFAPI.methods.preventClick);
        } else {
            elems[i].removeEventListener("click", FFAPI.methods.preventClick, false);
        }

        if (!elems[i].addEventListener) {
            elems[i].attachEvent("onclick", clickFunction);
        } else {
            elems[i].addEventListener("click", clickFunction, false);
        }
    }
};

/**
 * Temporarily unbinds clicking on the elems.
 * @method FFAPI.methods.unbindElemClick
 * @param {Array} elems - Elems array
 * @param {function} clickFunction
 */
FFAPI.methods.unbindElemClick = function (elems, clickFunction) {
    var elemsLength = elems.length;
    for (var i = 0; i < elemsLength; i++) {
        if (!elems[i].removeEventListener) {
            elems[i].detachEvent("onclick", clickFunction);
        } else {
            elems[i].removeEventListener("click", clickFunction, false);
        }

        if (!elems[i].addEventListener) {
            elems[i].attachEvent("onclick", FFAPI.methods.preventClick);
        } else {
            elems[i].addEventListener("click", FFAPI.methods.preventClick, false);
        }
    }
};

/**
 * To remove all the listners we replace the child with a new one, this way it's easier to remove all
 * @param  {[Object]} el DOM element
 * @method FFAPI.methods.removeEventListener
 */
FFAPI.methods.removeEventListener = function (el) {
    if (!ffbrowser.isIE8) {
        var par = el.parentNode,
            clone = el.cloneNode(false);

        par.replaceChild(clone, el);

        for (var index = el.childNodes.length - 1; index >= 0; --index) {
            clone.insertBefore(el.childNodes[index], clone.childNodes[0]||null);
        }
    }
}
/**
 * To remove all the listners we replace the child with a new one, this way it's easier to remove all
 * @param  {[Object]} el DOM element array
 * @method FFAPI.methods.removeListernerAll
 */
FFAPI.methods.removeListenerAll = function (el) {
    for (var i = 0; i < el.length; i++) {
        FFAPI.methods.removeEventListener(el[i]);
    }
}


/**
 * On submitting the forms we change the form buttons to loading buttons
 * @method FFAPI.methods.loadingButtons
 */
FFAPI.methods.loadingButtons = function (formId) {
    var formId = document.getElementById(formId),
        formButtons = formId.getElementsByClassName('js-wait-button'),
        formButtonsLength = formButtons.length,
        formWaitText = formId.getElementsByClassName('js-wait-text'),
        formWaitIcon = formId.getElementsByClassName('js-wait-icon'),
        j = 0;

    for (j = 0; j < formButtonsLength; j++) {
        formButtons[j].setAttribute('disabled', 'true');
        formButtons[j].value = formButtons[j].getAttribute('data-loader');
        formWaitText[j].innerHTML = formButtons[j].getAttribute('data-loader');
        FFAPI.methods.addClass(formWaitIcon[0], 'animation-fade-inSlower');
        FFAPI.methods.addClass(formWaitIcon[0], 'icon-loader');
    }
};

/**
 * Reset the loading buttons
 * @method FFAPI.methods.resetButtons
 */
FFAPI.methods.resetButtons = function (formId) {
    var formId = document.getElementById(formId),
        formButtons = formId.getElementsByClassName('js-wait-button'),
        formButtonsLength = formButtons.length,
        formWaitText = formId.getElementsByClassName('js-wait-text'),
        formWaitIcon = formId.getElementsByClassName('js-wait-icon'),
        j = 0;

    for (j = 0; j < formButtonsLength; j++) {
        formButtons[j].setAttribute('disabled', 'false');
        formButtons[j].removeAttribute("disabled");
        formButtons[j].value = formButtons[j].getAttribute('data-original');
        formWaitText[j].innerHTML = formButtons[j].getAttribute('data-original');
        FFAPI.methods.removeClass(formWaitIcon[0], 'animation-fade-inSlower');
        FFAPI.methods.removeClass(formWaitIcon[0], 'icon-loader');
    }
};



/**
 * Adds a custom variable to the FFAPI namespace. 
 &#10;Useful if we want to add something to the global namespacing using server tags.
 &#10;Eg.: initDynFFAPI("method", "foo", function(param1, param2) { console.log("bar"); });
 * @param  {[String]} type      Value type. Eg.: method, variable
 * @param  {[Value type. Eg.: method, variable]} fieldname [description]
 * @param  {[Object]} value     Object to be stored
 * @param  {[String]} replacing [description]
 * @return {[Object]}           [description]
 */
FFAPI.methods.initDynFFAPI = function (type, fieldname, value, replacing) {
    if (typeof (replacing) === "undefined") {
        replacing = false;
    }
    if (!FFAPI[type]) {
        FFAPI[type] = {};
    }
    if (typeof (FFAPI[type][fieldname]) !== "undefined" && !replacing) {
        console.log('WARNING: Replacing existing variable \'' + fieldname + '\' of type \'' + type + '\'!');
    }
    FFAPI[type][fieldname] = value;

    return value;
};

/// <summary>
///    Gets the genderId 
/// </summary>
/// <returns type="Int" />
FFAPI.methods.getGenderId = function () {

    var genderID = 249;

    try {
        if (universal_variable.page.contextGenderId != 0)
            genderID = universal_variable.page.contextGenderId;
    } catch (e) {
    }

    return genderID;
};

FFAPI.variables.wishlistItems = FFAPI.variables.wishlistItems || {};
FFAPI.methods.clearWishList = function () {
    FFAPI.variables.wishlistItems = {};
}
FFAPI.methods.addWishListItem = function (itemId, triggerEvent) {
    FFAPI.variables.wishlistItems[itemId] = true;
    if (triggerEvent) {
        $('body').trigger('wishlistUpdated');
    }
};
FFAPI.methods.removeWishListItem = function (itemId, triggerEvent) {
    FFAPI.variables.wishlistItems[itemId] = false;
    if (triggerEvent) {
        $('body').trigger('wishlistUpdated');
    }
};
FFAPI.methods.triggerWishlistUpdated = function () {
    $('body').trigger('wishlistUpdated');
};

$(document).ready(function () {
    /* Clickstream */
    FFAPI.variables.bodyElement.on('chosen:showing_dropdown', function (event, data) {
        try {
            if (typeof (_fftrkobj) !== "undefined") {
                var chosen = data.chosen;
                var select = $(chosen.form_field);
                _fftrkobj.extract(select);
            }
        }
        catch (e) {
            console.log(e.message);
        }
    });

    FFAPI.variables.bodyElement.on('change', 'select', function () {
        try {
            if (typeof (_fftrkobj) !== "undefined") {
                var selectedElement = $(this).find('option:selected');
                if (selectedElement.attr('trk') != undefined) {
                    _fftrkobj.extract(selectedElement);
                }
            }
        }
        catch (e) {
            console.log(e.message);
        }
    });

    //CLICKSTREAM HEADER ACTIONS
    $("#header-bag-button").click(function () {
        if (typeof (_fftrkobj) !== "undefined") { _fftrkobj.extract($(this)); }
    });

    $("#header-wishlist-button").click(function () {
        if (typeof (_fftrkobj) !== "undefined") { _fftrkobj.extract($(this)); }
    });

    FFAPI.variables.bodyElement.on("click", "#sliderwishlist .sliderTabs-slide:not(.bx-clone) a.global-button-a", function () {
        if (typeof (_fftrkobj) !== "undefined") { _fftrkobj.extract($(this)); }
    });

    FFAPI.variables.bodyElement.on("click", "#sliderbag .sliderTabs-slide:not(.bx-clone) a.global-button-a", function () {
        if (typeof (_fftrkobj) !== "undefined") { _fftrkobj.extract($(this)); }
    });

    FFAPI.variables.bodyElement.on("click", "#header-tabs-2 .bx-prev,#header-tabs-2 .bx-next", function () {
        if (typeof (_fftrkobj) !== "undefined") { _fftrkobj.parse("243"); }
    });

    FFAPI.variables.bodyElement.on("click", "#header-tabs-3 .bx-prev,#header-tabs-3 .bx-next", function () {
        if (typeof (_fftrkobj) !== "undefined") { _fftrkobj.parse("244"); }
    });

    FFAPI.variables.bodyElement.on("click", ".header-tabs-close", function () {
        if (typeof (_fftrkobj) !== "undefined") { _fftrkobj.parse("74"); }
    });
});


FFAPI.methods.header = FFAPI.methods.header || {};
/**
 * Mark wishlist to be refreshed
 * @method FFAPI.methods.header.needRefreshHeaderTab
 * @param  {string} tabid
 */
FFAPI.methods.header.needRefreshHeaderTab = function (tabId) {
    ///$('#' + tabId).attr('data-loaded', '').attr('data-content-started', '');
    /// Just inform the id to change of the header-tabs (1,2 or 3)
    //console.log(tabId);
    if (FFAPI.variables.header == undefined || FFAPI.variables.header.tabOpeners == undefined) {
        return;
    }
    var tabIdObject = FFAPI.variables.header.tabOpeners[tabId];
    if (tabIdObject == undefined) {
        return;
    }
    //console.log(tabIdObject);
    tabIdObject.setAttribute('data-content-started', '');
    tabIdObject.setAttribute('data-loaded', '');

};

/**
 * Update the Wishlist Item count
 * @method FFAPI.methods.header.updateWishListItemCount
 * @param  {int} newValue New value to add on the wishlist item count
 * @param  {string} itemTranslate value for "Item" or "Items"
 */
FFAPI.methods.header.updateWishListItemCount = function (newValue, itemTranslation) {
    if (newValue !== undefined && newValue !== null) {
        //$(".js-wishlist-item-count").html(newValue);
        var elements = document.getElementsByClassName('js-wishlist-item-count');
        for (var i = 0; i < elements.length; i++) {
            //console.log(elements[i]);
            elements[i].innerHTML = newValue;
        }

        if (itemTranslation !== undefined && itemTranslation !== null && itemTranslation != "") {
            var elm = document.getElementsByClassName('js-wishlist-item-Translation');
            for (i = 0; i < elm.length; i++) {
                //console.log(elements[i]);
                elm[i].innerHTML = itemTranslation;
            }
        }
        else {
            var elm = document.getElementsByClassName('js-wishlist-item-Translation');
            for (i = 0; i < elm.length; i++) {
                //console.log(elements[i]);
                elm[i].innerHTML = FFAPI.translations["wbt_item_" + FFAPI.methods.header.getPluralRule(parseInt(newValue))];
            }
        }
        //Doesnt show the number if it is zero
        newValueCounter = newValue == 0 ? "" : newValue;

        elements = document.getElementsByClassName('header-user-counter');
        for (var i = 0; i < elements.length; i++) {
            elements[i].innerHTML = newValueCounter;
        }
    }
};



/**
 * Update the Bag Item count
 * @method FFAPI.methods.header.updateBagItemCount
 * @param  {int} newValue New value to add on the bag item count
 */
FFAPI.methods.header.updateBagItemCount = function (newValue) {
    if (newValue !== undefined && newValue !== null) {
        //$(".js-bag-item-count").html(newValue);
        var elements = document.getElementsByClassName('js-bag-item-count');
        for (var i = 0; i < elements.length; i++) {
            //console.log(elements[i]);
            elements[i].innerHTML = newValue;
        }

        //Doesnt show the number if it is zero
        newValueCounter = newValue == 0 ? "" : newValue;

        elements = document.getElementsByClassName('header-user-counter-bag-items');
        for (var i = 0; i < elements.length; i++) {
            elements[i].innerHTML = newValueCounter;
        }


    }
};
/**
 * Update the Bag Item count
 * @method FFAPI.methods.header.updateBagTotal
 * @param  {int} newValue New value to add on the bag total formatted
 */
FFAPI.methods.header.updateBagTotal = function (newValue) {
    if (newValue !== undefined && newValue !== null) {
        //$(".js-bag-total-formatted").html(newValue);
        var elements = document.getElementsByClassName('js-bag-total-formatted');
        for (var i = 0; i < elements.length; i++) {
            //console.log(elements[i]);
            elements[i].innerHTML = newValue;
        }
    }
};
/**
 * [updateBagInstallments description]
 * @param2m  {[type]} newValue [description]
 * @return {[type]}          [description]
 */
FFAPI.methods.header.updateBagInstallments = function (newValue) {
    if (newValue !== undefined && newValue !== null) {
        //$(".js-bag-installments").html(newValue);
        var elements = document.getElementsByClassName('js-bag-installments');
        for (var i = 0; i < elements.length; i++) {
            //console.log(elements[i]);
            elements[i].innerHTML = newValue;
        }
    }
};

FFAPI.methods.header.getPluralRule = function (intQty) {

    if (FFAPI.variables.hasPlurals == true) {

        if (intQty == 11 || intQty == 12 || intQty == 13 || intQty == 14) {
            return "3";
        }

        var lastNumber = Math.abs(intQty) % 10;
        switch (lastNumber) {
            case 1:
                return "1";
            case 2:
                return "2";
            case 3:
                return "2";
            case 4:
                return "2";
            default:
                return "3";
        }

    }
    else {
        switch (intQty) {
            case 0:
                return "2";
            case 1:
                return "1";
            default:
                return "2";
        }

    }
};
///////////////////////////////////////////////////////////////////////////
//////////////////////////////// Prototypes ///////////////////////////////
///////////////////////////////////////////////////////////////////////////

FFAPI.methods.urlHash = function(url) {
    return url ? url.split('#')[1] : window.location.hash.substring(1);
}

/**
 * Binds an event on an element
 * @param  {Element}  el     Element to bind event
 * @param  {String}   evt    Event name
 * @param  {Function} fn     Callback function
 * @param  {boolean}  bubble Capturing or bubling phase
 * @return {[type]}          [description]
 */
FFAPI.methods.on = function(el, evt, fn, bubble) {
    if("addEventListener" in el) {
        // BBOS6 doesn't support handleEvent, catch and polyfill
        try {
            el.addEventListener(evt, fn, bubble);
        } catch(e) {
            if(typeof fn == "object" && fn.handleEvent) {
                el.addEventListener(evt, function(e){
                    // Bind fn as this and set first arg as event object
                    fn.handleEvent.call(fn,e);
                }, bubble);
            } else {
                throw e;
            }
        }
    } else if("attachEvent" in el) {
        // check if the callback is an object and contains handleEvent
        if(typeof fn == "object" && fn.handleEvent) {
            el.attachEvent("on" + evt, function(){
                // Bind fn as this
                fn.handleEvent.call(fn);
            });      
        } else {
            el.attachEvent("on" + evt, fn);
        }
    }
};

FFAPI.methods.off = function(el, evt, fn, bubble) {
    if("removeEventListener" in el) {
        // BBOS6 doesn't support handleEvent, catch and polyfill
        try {
            el.removeEventListener(evt, fn, bubble);
        } catch(e) {
            if(typeof fn == "object" && fn.handleEvent) {
                el.removeEventListener(evt, fn.handleEvent, bubble);
            } else {
                throw e;
            }
        }
    } else if("detachEvent" in el) {
        // check if the callback is an object and contains handleEvent
        if(typeof fn == "object" && fn.handleEvent) {
            el.detachEvent("on" + evt, fn.handleEvent);      
        } else {
            el.detachEvent("on" + evt, fn);
        }
    }
};

//} catch (e) {
//    try {
//        if (window.debug) {
//            console.log(e);
//        }
//    } catch (ex) {
//    }
//}
