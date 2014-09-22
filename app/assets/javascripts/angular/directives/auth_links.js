/*
 * Sign-up/in/out links.
 *
 * Usage:
 *   <auth-links></auth-links>
 */
angular.module('AuthLinks', []).
  directive('authLinks', [
    '$location', 'AuthSvc',
    function ($location, AuthSvc) {
      return {
        restrict: 'EA',
        templateUrl: "directives/auth_links.html",
        replace: true,

        link: function (scope, element, attrs) {
          scope.currentUser = AuthSvc.currentUser();

          scope.$on('$locationChangeSuccess', function () {
            scope.signInRedirectUrl = $location.url();
          });
        }
      };
    }]);
