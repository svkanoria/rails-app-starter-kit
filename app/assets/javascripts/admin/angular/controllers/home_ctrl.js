angular.module('HomeCtrl', [])
  .controller('HomeCtrl', [
    '$scope',
    function($scope) {
      $scope.hello = 'Hello, Admin World!';
    }]);
