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
angular.module('AuthenticationLinks', ['I18n', 'AuthSvc'])
  .directive('authenticationLinks', [
    '$location', 'I18n', 'AuthSvc',
    function ($location, I18n, AuthSvc) {
      return {
        restrict: 'EA',
        templateUrl: 'shared/directives/authentication_links.html',
        replace: true,
        transclude: true,
        scope: {},

        link: function (scope, element, attrs) {
          scope.currentUser = AuthSvc.currentUser();

          scope.$on('$locationChangeSuccess', function () {
            scope.signInRedirectUrl =
              I18n.dl($location.absUrl(), $location.url());
          });
        }
      };
    }]);
