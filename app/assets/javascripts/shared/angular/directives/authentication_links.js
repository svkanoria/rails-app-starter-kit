/*
 * Sign-up/in/out links.
 *
 * Usage:
 *   <authentication-links></authentication-links>
 */
angular.module('AuthenticationLinks', []).
  directive('authenticationLinks', [
    '$location', 'AuthSvc',
    function ($location, AuthSvc) {
      return {
        restrict: 'EA',
        templateUrl: 'shared/directives/authentication_links.html',
        replace: true,
        scope: {},

        link: function (scope, element, attrs) {
          scope.currentUser = AuthSvc.currentUser();

          scope.$on('$locationChangeSuccess', function () {
            scope.signInRedirectUrl = $location.url();
          });
        }
      };
    }]);
