angular.module('trailsApp').controller('homeCtrl', function () {


    //--------------loading animation---------------//

    function onReady(callback) {
        var intervalID = window.setInterval(checkReady, 1000);
        function checkReady() {
            if (document.getElementsByTagName('body')[0] !== undefined) {
                window.clearInterval(intervalID);
                callback.call(this);
            }
        }
    }

    function show(id, value) {
        document.getElementById(id).style.display = value ? 'block' : 'none';
    }

    onReady(function () {
        show('loading', false);
    });


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
        // $('#home-1').css('opacity', 0);
        // $('#home-2').css('opacity', 0);
        $('#home-3').css('opacity', 0);
        $('#home-4').css('opacity', 0);
        $('#home-5').css('opacity', 0);
        $('#home-6').css('opacity', 0);
        $('#home-7').css('opacity', 0);
        // $('#home-1').waypoint(function () {
        //     $('#home-1').addClass('fadeInLeft');
        // }, {
        //     offset: '100%'
        // });
        // $('#home-2').waypoint(function () {
        //     $('#home-2').addClass('fadeInRight');
        // }, {
        //     offset: '100%'
        // });
        $('#home-3').waypoint(function () {
            $('#home-3').addClass('fadeInLeft');
        }, {
            offset: '90%'
        });
        $('#home-4').waypoint(function () {
            $('#home-4').addClass('fadeInRight');
        }, {
            offset: '90%'
        });
        $('#home-5').waypoint(function () {
            $('#home-5').addClass('fadeInLeft');
        }, {
            offset: '90%'
        });
        $('#home-6').waypoint(function () {
            $('#home-6').addClass('fadeInRight');
        }, {
            offset: '90%'
        });
        $('#home-7').waypoint(function () {
            $('#home-7').addClass('fadeInLeft');
        }, {
            offset: '90%'
        });

    });



})