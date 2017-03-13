angular.module('trailsApp').controller('dataCtrl', function($scope, $stateParams, mainSvc, postSvc) {

    trailData($stateParams.id)

    function trailData(id) {
        mainSvc.trailData(id).then(response => {
            response.time = Math.round((response.time / 60) * 10) / 10;
            $scope.trail = response;
        })
    }

    

    

})