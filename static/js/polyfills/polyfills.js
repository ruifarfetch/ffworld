/// Media queries and polyfills
/// Loaded if is browser is not IE8 and fails the test matchMedia
/// if (ffbrowser.isIE8 === false) {
Modernizr.load([
/// Test Polyfills Media Queries - loads to IE9
    {
        test: window.matchMedia,
        nope: [jsFolderMain + jsSubFolderPolyfills + 'respond-match-media-addListener.js']
    }
]);
/// }


/// Load these on IE8 the only not having SVG Support
/// selectivzr and responsive-IE8
if (!Modernizr.svg && ffbrowser.isIE8 === true) {
    yepnope({
        load: [jsFolderMain + jsSubFolderPolyfillsIe8 + 'selectivizr-min.js', jsFolderMain + jsSubFolderPolyfillsIe8 + 'responsive-IE8-1.0.0.js']
    });
}


/// Placeholder Support for IE
if (!Modernizr.input.placeholder) {
    yepnope({
        load: [jsFolderMain + jsSubFolderPolyfills + 'jquery.placeholder-1.0.0.js']
    });
}

/// Multi column support
if (!Modernizr.csscolumns) {
    yepnope({
        load: [jsFolderMain + jsSubFolderPolyfills + 'css3-multi-column.min.js']
    });
}