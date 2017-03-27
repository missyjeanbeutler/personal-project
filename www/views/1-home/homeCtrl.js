angular.module('trailsApp').controller('homeCtrl', function () {


    //------------parallax scrolling effect----------//

    (function () {
        var parallax = document.querySelectorAll(".parallax"),
            speed = 0.5;
        window.onscroll = function () {
            [].slice.call(parallax).forEach(function (el, i) {
                var windowYOffset = window.pageYOffset,
                    elBackgrounPos = "50% " + (windowYOffset * speed) + "px";
                el.style.backgroundPosition = elBackgrounPos;
            });
        };
    })();

    //---------------fade in on scroll-----------//

    $(document).ready(function () {
        $('#home-3').css('opacity', 0);
        $('#home-4').css('opacity', 0);
        $('#home-5').css('opacity', 0);
        $('#home-6').css('opacity', 0);
        $('#home-7').css('opacity', 0);
        $('#home-3').waypoint(function () {
            $('#home-3').addClass('fadeInLeft');
        }, {
            offset: '60%'
        });
        $('#home-4').waypoint(function () {
            $('#home-4').addClass('fadeInRight');
        }, {
            offset: '60%'
        });
        $('#home-5').waypoint(function () {
            $('#home-5').addClass('fadeInLeft');
        }, {
            offset: '60%'
        });
        $('#home-6').waypoint(function () {
            $('#home-6').addClass('fadeInRight');
        }, {
            offset: '60%'
        });
        $('#home-7').waypoint(function () {
            $('#home-7').addClass('fadeInLeft');
        }, {
            offset: '80%'
        });

    });



})