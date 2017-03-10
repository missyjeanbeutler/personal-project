angular.module('trailsApp').controller('dataCtrl', function($scope, $stateParams, mainSvc) {


    trailData($stateParams.id)

    function trailData(id) {
        mainSvc.trailData(id).then(response => {
            console.log(response)
            $scope.trail = response;
        })
    }

})