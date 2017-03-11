angular.module('trailsApp').controller('dataCtrl', function($scope, $stateParams, mainSvc, postSvc) {

    trailData($stateParams.id)

    function trailData(id) {
        mainSvc.trailData(id).then(response => {
            $scope.trail = response;
        })
    }

    

})