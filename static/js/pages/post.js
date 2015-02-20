var urlEncoded = encodeURIComponent(document.URL);

function socialShare(elem, url) {
    $(elem).on('click', function () {
        window.open(url, 'share', 'top=(screen.height / 2) - (350 / 2), left=(screen.width / 2) - (520 / 2), width=520, height=350');
    });
}

socialShare('.displayFacebook', 'https://www.facebook.com/sharer/sharer.php?u=' + urlEncoded);
socialShare('.displayTwitter', 'http://twitter.com/share?url=' + urlEncoded);
socialShare('.displayGoogle', 'https://plus.google.com/share?url=' + urlEncoded);
socialShare('.displayPinterest', 'http://pinterest.com/pin/create/button/?url=' + urlEncoded
	+ '&amp;media=' + encodeURIComponent($('head meta[property="og:image"]').attr('content'))
	+ '&amp;description=' + encodeURIComponent($('head meta[property="og:description"]').attr('content')));
socialShare('.displayWeibo', 'http://service.weibo.com/share/share.php?url=' + urlEncoded);
