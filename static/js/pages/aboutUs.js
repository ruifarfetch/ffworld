require(['plu_domReady'], function () {
    initialiseMediaPlayer();
});

var mediaPlayer = $('#media-video'),
	play = $('#play-pause-button'),
	mute = $('#mute-button'),
	controls = $('#media-controls'),
	video_msg = $('.video-msg');

controls.hide();
video_msg.hide();

//if ie8 does not support and show message
if ($('html, body').hasClass('lt-ie9')) {
    $('#media-video').off('click');
    video_msg.show();

} else {

    controls.show();

    function initialiseMediaPlayer() {
        mediaPlayer = $("#media-video");
        mediaPlayer.get(0).controls = false;
        mediaPlayer.get(0).muted = true;
    }

    function togglePlayPause() {
        if (mediaPlayer.get(0).paused || mediaPlayer.get(0).ended) {
            mediaPlayer.get(0).play();
            play.removeClass("play-stop");
            play.addClass("play-start");
            mute.addClass("play-stop");
            mediaPlayer.get(0).addEventListener('ended', function () {
                mediaPlayer.get(0).load();
                play.addClass("play-stop");
            });
        }
        else {
            mediaPlayer.get(0).pause();
            play.addClass("play-stop");
            mute.removeClass("play-stop");
            mute.addClass("play-start");
        }
    };

    $(document).on("click", '#media-video,#play-pause-button', function () {
        togglePlayPause();
        if (typeof (_fftrkobj) !== "undefined") { _fftrkobj.parse("252"); }
    });

    mute.click(function () {
        if (mediaPlayer.get(0).muted) {
            mediaPlayer.get(0).muted = false;
            mute.addClass("unmute");
        } else {
            mediaPlayer.get(0).muted = true;
            mute.removeClass("unmute");
        }
    });
}

//back to top
$('.editorial-backTop').click(function (e) {
    e.preventDefault();
    $('html, body').animate({ scrollTop: 0 }, 500);
});



