angular.module('trailsApp').controller('updateCtrl', function (postSvc) {

let error = 0;
function updateTrail(id) {
    console.log('step 2')
    postSvc.callBackend(id).then(response => {
        console.log(response, ' this is the FRONT END!')
    }).catch(err => {
        error++
        console.log(error);
    })
}

var counter = 1;
var updater
function updaterTimeout() {
    updater = setTimeout(function(){
      updateTrail()
      counter ++
      if(counter > 1278) {
        clearTimeout(updater)
        return;
      } else {
        updaterTimeout()
      }
    }, 2000);
}
// updaterTimeout()





})