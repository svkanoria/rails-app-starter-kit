/*
 * Sign-up/in/out links.
 *
 * Usage:
 *   <authentication-links>
 *     <!-- Any additional links to show for *signed in* users -->
 *     <li>...</li>
 *       :
 *   </authentication-links>
 */
angular.module('AuthenticationLinks', ['AuthSvc'])
  .directive('authenticationLinks', [
    '$location', 'AuthSvc',
    function ($location, AuthSvc) {
      return {
        restrict: 'EA',
        templateUrl: 'shared/directives/authentication_links.html',
        replace: true,
        transclude: true,
        scope: {},

        link: function (scope, element, attrs) {
          scope.currentUser = AuthSvc.currentUser();

          scope.$on('$locationChangeSuccess', function () {
            scope.signInRedirectUrl = $location.url();
          });
        }
      };
    }]);
