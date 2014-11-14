/*
 * The 'top level' controller.
 * Conceptually, this is much like the ApplicationController in Rails.
 * Anything added to its scope will be available to all other controllers, and
 * subsequently views.
 */
angular.module('AppCtrl', ['AuthSvc', 'PleaseWait']).
  controller('AppCtrl', [
    '$scope', 'AuthSvc', 'PleaseWaitSvc',
    function($scope, AuthSvc, PleaseWaitSvc) {
      $scope.authSvc = AuthSvc;
      $scope.pleaseWaitSvc = PleaseWaitSvc;
    }]);
