/*
*  maps.js
*/


require.config({
    paths: {
        /**
         * Require plugin Clusterer file.
         * <b><i>plu_markerClusterer: jsSubFolderPlugins+'ff.modal'<br /></i></b>
         * @property require(['plu_modal'])
         * @type File
         */
        plu_markerClusterer: jsSubFolderBundles + 'markerclusterer' + jsMinified,
        /**
         * Require plugin async file.
         * <b><i>plu_markerClusterer: jsSubFolderPlugins+'ff.modal'<br /></i></b>
         * @property require(['plu_modal'])
         * @type File
         */
        plu_async: jsSubFolderBundles + 'async' + jsMinified
    }
});
/*
*  maps.js
*/
FFAPI.variables.maps = FFAPI.variables.maps || {},
FFAPI.methods.maps = FFAPI.methods.maps || {};
FFAPI.translations = FFAPI.translations || {};

var host = window.location.protocol.concat("//").concat(window.location.host);
var openHoursUrl = universal_variable.page.subfolder + '/MultiChannel/GetOpenHours';

var markersPath = host + '/static/images/maps/',
    whiteMarkerIcon = markersPath + 'pin.png',
    blackMarkerIcon = markersPath + 'pin_dark.png',
    whiteMarkerIconSmall = markersPath + 'pin.png',
    blackMarkerIconSmall = markersPath + 'pin_dark.png',
    markerIcon = "",
    geocoder,
    boutiquesMarkers,
    result,
    marker,
    markers,
    latnearMarker,
    lngnearMarker,
    newLatLngNearMarker,
    searchTerm,
    numbermatchesArray,
    responseBoutiques,
    bounds,
    numArr = [],
    markers = [];

FFAPI.methods.maps.bindEvents = function () {

    FFAPI.variables.maps.searchInput = $('#theBox');
    FFAPI.variables.maps.searchForm = FFAPI.variables.maps.searchInput.closest('form');
    FFAPI.variables.maps.inputVal = $(".checkout-text-input"),
    FFAPI.variables.maps.searchBtn = $(".mc-search button"),
    FFAPI.variables.maps.mapsCanvas = $("#map-canvas");
    FFAPI.variables.maps.viewMapButton = $('.js-mc-toggleView-map');
    FFAPI.variables.maps.viewListButton = $('.js-mc-toggleView-list');
    FFAPI.variables.maps.activeWindow = null;    

    FFAPI.variables.maps.searchForm.on('submit', function (event) {
        var searchTerm = FFAPI.variables.maps.searchInput.val();
        FFAPI.variables.maps.viewListButton.data('lastSearch', searchTerm);
    });

    //click and enter keypress handlers
    $('.js-checkout-mc-search-btn').on('click', function (event) {
        FFAPI.methods.maps.doSearch();
    });

    $(document).on('keypress', '#theBox', function (event) {
        var keycode = (event.keyCode ? event.keyCode : event.which);
        if (keycode == '13') {
            FFAPI.methods.maps.doSearch();
            event.stopPropagation();
            event.preventDefault();
        }
    });
    
    /*mc list view/map toggle*/

    FFAPI.variables.maps.viewMapButton.click(function () {
        $('.js-mc-toggleMcResultsTable').addClass('hide');
        $('.checkout-mc-searchResults').addClass('hide');
        $('#checkout-map-errorDisplay-multipleBoutiques').removeClass('hide');
        $('.checkout-map-pin-info').removeClass('hide');
        $('.js-mc-toggleMcResultsMap').removeClass('hide');
        //$('#checkout-map-errorDisplay').removeClass('hide');
        //$('#checkout-map-errorDisplay').show();
        FFAPI.variables.maps.viewMapButton.addClass('bold');
        FFAPI.variables.maps.viewListButton.removeClass('bold');

        google.maps.event.trigger(map, 'resize');
        searchTerm = $('#theBox').val();
        codeAddress(searchTerm);

        // Do a search if there is something on the search box that doesn't match the last search on the map mode
        var searchTerm = FFAPI.variables.maps.searchInput.val();
        var lastListSearch = FFAPI.variables.maps.viewMapButton.data('lastSearch');
        if (searchTerm != undefined && searchTerm.length > 0 && searchTerm != lastListSearch) {
            FFAPI.methods.maps.doSearch();
        }
        // Clickstream
        if (typeof (_fftrkobj) !== "undefined") { _fftrkobj.track({ tid: 273, val: 'map' }) }
    });
    FFAPI.variables.maps.viewListButton.click(function () {
        $('.checkout-map-pin-info').addClass('hide');
        $('.js-mc-toggleMcResultsMap').addClass('hide');
        $('#checkout-map-errorDisplay-multipleBoutiques').addClass('hide');
        $('#checkout-map-errorDisplay').addClass('hide');
        $('.js-mc-toggleMcResultsTable').removeClass('hide');
        $('.checkout-mc-searchResults').removeClass('hide');
        $('#checkout-map-errorDisplay').hide();
        FFAPI.variables.maps.viewListButton.addClass('bold');
        FFAPI.variables.maps.viewMapButton.removeClass('bold');

        // Do a search if there is something on the search box that doesn't match the last search on the list mode
        var searchTerm = FFAPI.variables.maps.searchInput.val();
        var lastListSearch = FFAPI.variables.maps.viewListButton.data('lastSearch');
        if (searchTerm != undefined && searchTerm.length > 0 && searchTerm != lastListSearch) {
            FFAPI.variables.maps.searchForm.submit();
        }
        // Clickstream
        if (typeof (_fftrkobj) !== "undefined") { _fftrkobj.track({ tid: 273, val: 'list' }) }
    });
};

FFAPI.methods.maps.doSearch = function () {
    searchTerm = FFAPI.variables.maps.searchInput.val();
    if (FFAPI.methods.maps.isMapVisible()) {
        codeAddress(searchTerm);
        FFAPI.variables.maps.viewMapButton.data('lastSearch', searchTerm);
        $('#hello').hide();
        event.preventDefault();        
    } else {
        FFAPI.variables.maps.viewListButton.data('lastSearch', searchTerm);
    }
    // Clickstream
    if (typeof (_fftrkobj) !== "undefined") { _fftrkobj.track({ tid: 270, val: searchTerm }) }
};

function getStoreOpenHours(boutiquesMarkers, marker) {
    $.ajax({
        url: openHoursUrl,
        data: JSON.stringify({ openingHours: boutiquesMarkers.openJson }),
        type: 'POST',
        contentType: 'application/json',
        dataType: 'json'
    })
    .done(function (response) {
        if (response.success) {
            boutiquesMarkers.open = response.data;
            boutiquesMarkers.loadedOpenHours = true;
        }
    })
    .always(function () {
        showInfoWindow(boutiquesMarkers, marker);
    });
}

function showInfoWindow(boutiquesMarkers, marker) {
    var infowindow = new google.maps.InfoWindow({ maxWidth: 270, zIndex: 2 });
    // only one open at each time
    if (FFAPI.variables.maps.activeWindow != null) {
        FFAPI.variables.maps.activeWindow.close();
    }

    FFAPI.variables.maps.activeWindow = infowindow;
    // Setting the content of the InfoWindow
    if (boutiquesMarkers.CanSelectStore) {
        var buttonDataAttributes = 'data-addr-id="' + boutiquesMarkers.IdAddress + '" data-return-addr-id="' + boutiquesMarkers.ReturnAddressId + '" data-store-id="' + boutiquesMarkers.PointId + '"';
        infowindow.setContent("<div id='iw_content' class='float-left col12 h4 infowindowWidth js-map-store-name'>" + boutiquesMarkers.name + "</h5></div>" + "<div class='float-left col12 mb10 js-map-store-address'>" + boutiquesMarkers.address + "</div>" + "<div class='float-left small color-dark-grey mb10 mt10 '>" + boutiquesMarkers.open + "</div><button class='js-checkout-mc-fauxTable-selectBtn-action mb10 button-black'>" + FFAPI.translations.select + "<span class='glyphs icon-thinArrow float-right' " + buttonDataAttributes + "></span></button>");
    } else {
        infowindow.setContent("<div id='iw_content' class='float-left col12 h4 infowindowWidth '>" + boutiquesMarkers.name + "</h5></div>" + "<div class='float-left col12 mb10'>" + boutiquesMarkers.address + "</div>" + "<div class='float-left small color-dark-grey mb10 mt10 '>" + boutiquesMarkers.open + "</div>");
    }

    infowindow.open(map, marker);
};

function getAllMap() {
    var mapOptions, bounds, i, boutiquesMarkers, zoomLevel, infowindow;

    //show loading
    $(".checkout-mc-loader").show();
    if (FFAPI.variables.maps.mapsCanvas.data('json-loaded') == true) {
        tryGeolocation();
        $(".checkout-mc-loader").hide();
        $('.js-checkout-mc-toggleListMap').show();
        return;
    }
    var APIKey = 'AIzaSyC0RAgEdVpFL544GZCtZuOypK4MizCrA6U';
    //require google maps api script async
    require(['plu_async!https://maps.googleapis.com/maps/api/js?key=' + APIKey + '&libraries=geometry'], function () {
        //require marker clusterer plugin for grouping pins in cluster icons
        require(['plu_markerClusterer'], function () {
            var url = $('.js-mc-searchForm').data('jsonUrl');
            $.ajax({
                url: url,
                dataType: "json",
                type: "get",
                cache: true,
                contentType: "application/json",
                success: function (data) {
                    result = data;
                     var aux = [], aux2 = '';
                     for(var i = 0; i<data.boutique.length; i++){
                        aux2 = data.boutique[i].name;
                        if(aux2){
                            aux.push({ value: data.boutique[i].name , data: i});
                        }
                     }
                    responseBoutiques = aux;
                }
            })
            .done(function (data) {
                //autocomplete
                options = {
                    lookup: responseBoutiques,

                    appendTo: '.header-autocomplete-containter',
                    transformResult: function (response) {
                        console.log(response);
                    },
                    onSelect: function (value, data) {
                        searchTerm = $('#theBox').val();
                        codeAddress(searchTerm);
                    }
                }

                var a = $('#theBox').autocomplete(options);

                //start map

                markers = [];

                map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
                FFAPI.variables.maps.mapsCanvas.css("height", "320px");
                map.setZoom(2);
                map.setCenter({ lat: 37.54789246782872, lng: -3.1736209499999823 });
                /*
                 bounds = new google.maps.LatLngBounds();*/

                geocoder = new google.maps.Geocoder();
                
                for (i = 0; i < result.boutique.length; i++) {
                    boutiquesMarkers = result.boutique[i];
                    zoomLevel = map.getZoom();

                    if (boutiquesMarkers.marker == "white" && zoomLevel > 5) {
                        markerIcon = whiteMarkerIcon;

                    } else if (boutiquesMarkers.marker == "white" && zoomLevel < 5) {
                        markerIcon = whiteMarkerIconSmall;
                    }
                    else if (boutiquesMarkers.marker == "black" && zoomLevel > 5) {
                        markerIcon = blackMarkerIcon;
                    }
                    else if (boutiquesMarkers.marker == "black" && zoomLevel < 5) {
                        markerIcon = blackMarkerIconSmall;
                    }

                    var marker = new google.maps.Marker({
                        position: new google.maps.LatLng(boutiquesMarkers.latitude, boutiquesMarkers.longitude),
                        map: map,
                        icon: markerIcon
                    });


                    (function (i, marker, boutiquesMarkers) {
                        // creating the InfoWindow
                        google.maps.event.addListener(marker, 'click', function () {
                            
                            if (!boutiquesMarkers.loadedOpenHours && (boutiquesMarkers.open == undefined || boutiquesMarkers.open == '')) {
                                getStoreOpenHours(boutiquesMarkers, this);
                            } else {
                                showInfoWindow(boutiquesMarkers, this);
                            }

                        });

                        /*google.maps.event.addListener(map, 'zoom_changed', function () {
                            var zoomLevel = map.getZoom();

                            if (boutiquesMarkers.marker == "white" && zoomLevel >= 4) {
                                marker.setIcon(whiteMarkerIcon);
                            } else if (boutiquesMarkers.marker == "white" && zoomLevel <= 4) {
                                marker.setIcon(whiteMarkerIconSmall);
                            }
                            else if (boutiquesMarkers.marker == "black" && zoomLevel >= 4) {
                                marker.setIcon(blackMarkerIcon);
                            }
                            else if (boutiquesMarkers.marker == "black" && zoomLevel <= 4) {
                                marker.setIcon(blackMarkerIconSmall);
                            }
                        });*/

                    })(i, marker, boutiquesMarkers);

                    markers.push(marker);
                    /*
                    map.fitBounds(bounds);*/
                }

                google.maps.event.addListener(map, 'click', function (event) {

                    geocoder.geocode({ 'latLng': event.latLng }, function (results, status) {
                        if (status == google.maps.GeocoderStatus.OK) {
                            if (results[1]) {
                                if (typeof (_fftrkobj) !== "undefined") { _fftrkobj.track({ tid: 271, val: results[1].formatted_address }) }
                            }
                        }
                    });
                });

                var clusterStyles = [
                    {
                        textColor: 'white',
                        url: markersPath + 'circle.png',
                        height: 19,
                        width: 19
                    },
                    {
                        textColor: 'white',
                        url: markersPath + 'circle.png',
                        height: 19,
                        width: 19
                    }
                ];
                var mcClusterOptions = {
                    styles: clusterStyles
                };

                var markerCluster = new MarkerClusterer(map, markers, mcClusterOptions);

                //center map around pins
                /*
                map.fitBounds(bounds);*/

                //get user location
                tryGeolocation();

                //hide loading
                $(".checkout-mc-loader").hide();
                FFAPI.variables.maps.mapsCanvas.data('json-loaded', true);
            })
        .fail(function () {
            console.log("error");
        });
        });

        $('.js-checkout-mc-toggleListMap').show();
    });
}

function codeAddress(mysearch) {

    var address = mysearch,
        searchNearest = mysearch,
        i = 0,
        numbermatches = 0,
        boutiquesiterator, areEqual, lat, lng, newLatLng, bound, matchBoutique, saveEachPos, latMultiple, lngMultiple, newLatLngMultiple, elementID, repeatedMessage, message, getbou;
    //iterate through boutiques to check if search term is a boutique
    for (i = 0; i < result.boutique.length; i++) {
        //save boutique name,convert to uppercase,returnresult 
        boutiquesiterator = result.boutique[i].name;
        areEqual = boutiquesiterator.toUpperCase() === address.toUpperCase();

        if (areEqual) {

            //count matches
            numbermatches++;
            //array count sarts at 0
            numbermatchesArray = numbermatches - 1;

            //save boutique coordinates
            lat = result.boutique[i].latitude;
            lng = result.boutique[i].longitude;
            newLatLng = new google.maps.LatLng(lat, lng);

            //center map
            var bound = new google.maps.LatLngBounds();
            bound.extend(new google.maps.LatLng(lat, lng));

            //save boutique position to use later
            numArr[numbermatchesArray] = i;
        }
    }

    // clear old results
    getbou = document.getElementById('checkout-map-errorDisplay-multipleBoutiques');
    getbou.innerHTML = '';

    //only one boutique immediately go to position
    if (numbermatches > 0) {
        map.panTo(newLatLng);
        map.setZoom(20);
        console.log('1 b');
        google.maps.event.trigger(markers[numArr[numbermatchesArray]], 'click');
    }

    //more than one boutique show message with results
    /*
    if (numbermatches > 1) {
        for (j = 0; j < numArr.length; j++) {

            matchBoutique = numArr[j];
            saveEachPos = [];

            //each match coordinates
            latMultiple = result.boutique[matchBoutique].latitude;
            lngMultiple = result.boutique[matchBoutique].longitude;
            newLatLngMultiple = new google.maps.LatLng(latMultiple, lngMultiple);

            //build error message
            elementID = 'checkout-map-errorDisplay' + j;
            repeatedMessage = document.createElement('div');
            repeatedMessage.id = elementID;

            message = "<div class='baseline col12 color-red bold mb20 checkout-choose-boutique" + j + "'>" + result.boutique[matchBoutique].name + "&nbsp;" + result.boutique[matchBoutique].city + "</div>";            

            getbou.appendChild(repeatedMessage);
            repeatedMessage.innerHTML = message;

            //attach click event to each result
            (function (_j, mapPan, markerNumber) {

                $(document).on('click', '.checkout-choose-boutique' + _j, function () {
                    console.log('qqrepeat');
                    map.panTo(mapPan);
                    map.setZoom(8);
                    google.maps.event.trigger(markers[markerNumber], 'click');
                });

            })(j, newLatLngMultiple, matchBoutique);
        }
    }
    */

    //if there's no boutique match check if google finds an address
    if (numbermatches === 0) {        
        geocodeMe(address);
    } else {
        $('#checkout-map-errorDisplay').hide();
    }
}

function geocodeMe(address) {
    var closest = 0, distance, closestMarker, closestMarkername, latnear, lngnear, newLatLngnear, currentlatlng, distance, saveMarkerIteration;
    //geocoder API
    geocoder.geocode({ 'address': address }, function (results, status) {

        if (status == google.maps.GeocoderStatus.OK) {

            map.panTo(results[0].geometry.location);
            console.log(results[0].geometry.location);
            map.fitBounds(results[0].geometry.viewport);
            map.setZoom(7);

            //check if there are pins in view
            for (i = 0; i < markers.length; i++) {

                if (map.getBounds().contains(markers[i].getPosition())) {
                    //break loop if map has pins
                    break;

                } else if (i === markers.length - 1) {
                    //find closest marker
                    closest = 0;
                    for (i = 0; i < result.boutique.length; i++) {

                        latnear = result.boutique[i].latitude;
                        lngnear = result.boutique[i].longitude;
                        newLatLngnear = new google.maps.LatLng(latnear, lngnear);
                        currentlatlng = map.getCenter();
                        distance = google.maps.geometry.spherical.computeDistanceBetween(currentlatlng, newLatLngnear) / 1000;

                        if (closest === 0 || distance < closest) {
                            saveMarkerIteration = i;

                            closest = distance;
                            closestMarker = result.boutique[i];
                            closestMarkername = closestMarker.name;

                            latnearMarker = result.boutique[i].latitude;
                            lngnearMarker = result.boutique[i].longitude;
                            newLatLngNearMarker = new google.maps.LatLng(latnearMarker, lngnearMarker);
                        }
                        //Show message with closest marker
                        if (i === result.boutique.length - 1) {
                            document.getElementById('checkout-map-errorDisplay').innerHTML = "<p class='baseline col12 alpha mb20'>" + $.format(FFAPI.translations.noBoutiquesFound, searchTerm) + "<span class='checkout-goToNearMarker'>" + closestMarkername + "</span>" + ".</p>";
                            $('#checkout-map-errorDisplay').show();
                        } else {
                            $('#checkout-map-errorDisplay').hide();
                        }
                    }
                    //attach click event to closest marker
                    $(document).on('click', '.checkout-goToNearMarker', function () {
                        console.log('qq');
                        map.panTo(newLatLngNearMarker);
                        map.setZoom(20);
                        google.maps.event.trigger(markers[saveMarkerIteration], 'click');
                    });
                }
            }
            //if geocode fails
        } else {
            document.getElementById('checkout-map-errorDisplay').innerHTML = "<div class='baseline alpha col12 mb20'>" + $.format(FFAPI.translations.noResultsFound, searchTerm) + "</div>";
            $('#checkout-map-errorDisplay').show();
            console.log('Geocode was not successful for the following reason: ' + status);
        }
    });
}

// Try HTML5 geolocation
function tryGeolocation() {
    var pos, infowindowMyLoc;
    if (navigator.geolocation && ffbrowser.isIE8 === false) {
        navigator.geolocation.getCurrentPosition(function (position) {

            pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            map.panTo(pos);
            map.setZoom(12);

        });
    }
}

FFAPI.methods.maps.isMapVisible = function () {
    return FFAPI.variables.maps.viewMapButton.hasClass('bold');
};

FFAPI.methods.maps.isListVisible = function () {
    return FFAPI.variables.maps.viewListButton.hasClass('bold');
};

FFAPI.methods.maps.bindEvents();