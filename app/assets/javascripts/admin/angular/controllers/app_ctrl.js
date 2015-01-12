angular.module('AppCtrl', ['AuthSvc', 'PleaseWait']).
  controller('AppCtrl', [
    '$scope', 'AuthSvc', 'PleaseWaitSvc',
    function($scope, AuthSvc, PleaseWaitSvc) {
      $scope.authSvc = AuthSvc;
      $scope.pleaseWaitSvc = PleaseWaitSvc;
    }]);
