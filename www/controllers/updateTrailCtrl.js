angular.module('trailsApp').controller('updateCtrl', function (postSvc) {


function updateTrail() {
    postSvc.updateTrail().then(response => {
        console.log(response, ' this is the FRONT END!')
    })
}

// updateTrail();

})