angular.module('trailsApp').controller('updateCtrl', function (postSvc) {


function updateTrail() {
    postSvc.updateTrail().then(response => {
        console.log(response, ' this is the FRONT END!')
    })
}

updateTrail();
    



    // function getTrailNames() {
        // if (mainSvc.trailNames) {
        //     trails = mainSvc.trailNames;
        //     startUpdate()
        // } else {
        //     mainSvc.allTrails().then(response => {
        //         trails = response;
        //         startUpdate()
        //     })
        // }

    // }

    // getTrailNames();

    // function startUpdate() {
    //     for (let i = 0; i < 1; i++) {
    //         if (trails[i].trail_id) {
    //             postSvc.startUpdate(trails[i].trail_id).then(response => {
    //                 if (response.data !== 'No data') {
    //                     calculations(response).then(response => {
    //                         console.log(response)
    //                     });
    //                 }
    //             })
    //         }
    //     }
    // }


    // function calculations(trail) {
    //     let deferred = $q.defer()
    //     let sorted = trail.elevation_array.sort((a, b) => {
    //         return b - a;
    //     })
    //     let elevationChange = Math.round((sorted[0] - sorted[sorted.length - 1]) * 1000) / 1000;
    //     let distInFeet = trail.gis_miles * 5280;
    //     let ratio = Math.asin(elevationChange / distInFeet);
    //     if (isNaN(ratio)) ratio = Math.asin(distInFeet / elevationChange)
    //     ratio = Math.round((ratio * 100) * 10000) / 10000;
    //     postSvc.updateEndpoint(elevationChange, ratio, trail.trail_id).then(response => {
    //         return deferred.resolve(response);
    //     })
    //     return deferred.promise;
    // }

})