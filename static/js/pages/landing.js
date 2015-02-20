/**
* This module contains global methods for the listing
* @module LANDING
*/
/**
    Landong page javaScript file. It contains the function to make the listing work on desktop and mobile
    @deprecated pages/
    @class landing.js
    **/


FFAPI.variables.landing = FFAPI.variables.landing || {},
FFAPI.methods.landing = FFAPI.methods.landing || {};


$('.no-touch .sliderTabs-slide').rollover({}); 	


// Select Last landing-container to add class
$('.landing-container-spacer').last().addClass('landing-container-spacer-last');
