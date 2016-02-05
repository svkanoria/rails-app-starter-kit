angular.module('AppCtrl', ['AuthSvc', 'PleaseWait', 'RouteUtils'])
  .controller('AppCtrl', [
    '$scope', 'AuthSvc', 'PleaseWaitSvc', 'NavConfirmationSvc',
    function($scope, AuthSvc, PleaseWaitSvc, NavConfirmationSvc) {
      // Near-ubiquitous functionality, added to this scope to prevent
      // repetition in each controller.
      $scope.authSvc = AuthSvc;
      $scope.pleaseWaitSvc = PleaseWaitSvc;
      $scope.navConfirmationSvc = NavConfirmationSvc;
    }]);
