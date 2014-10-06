angular.module('LocationsCtrl', ['Location']).
  controller('LocationsCtrl', [
    '$scope', '$location', 'Location',
    function($scope, $location, Location) {
      /**
       * Creates a location from form data.
       * If there are validation errors on the server side, then populates the
       * 'createLocationErrors' scope variable with these errors.
       */
      $scope.create = function () {
        var location = new Location({
          slug: this.slug,
          name: this.name
        });

        location.$save(function (response) {
          $location.path('locations');
        }, function (failureResponse) {
          $scope.createLocationErrors = failureResponse.data.errors;
        });
      };

      /**
       * Populates scope.locations with a list of locations retrieved from the
       * server.
       */
      $scope.find = function () {
        $scope.locations = Location.query();
      };
    }]);
