angular.module('LocationsCtrl', ['Location']).
  controller('LocationsCtrl', [
    '$scope', '$location', '$routeParams', 'Location',
    function($scope, $location, $routeParams, Location) {
      $scope.actionIndex = function () {
        $scope.locations = Location.query();
      };

      $scope.actionShow = function () {
        $scope.location = Location.get({
          locationId: $routeParams.id
        });
      };

      $scope.actionNew = function () {
        $scope.location = new Location();
      };

      $scope.actionCreate = function () {
        $scope.location.$save(function (response) {
          $location.path('locations');
        }, function (failureResponse) {
          $scope.locationErrors = failureResponse.data.errors;
        });
      };

      $scope.actionUpdate = function () {
        $scope.location.$update(function (response) {
          $location.path('locations');
        }, function (failureResponse) {
          $scope.locationErrors = failureResponse.data.errors;
        });
      };
    }]);
