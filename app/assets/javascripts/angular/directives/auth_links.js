// Sign-up/in/out links.
angular.module('AuthLinks', []).
  directive('authLinks', ['$location', function ($location) {
    return {
      restrict: 'EA',
      templateUrl: "directives/auth_links.html",
      replace: true,

      link: function (scope, element, attrs) {
        scope.currentUser = CurrentUser;

        scope.$on('$locationChangeSuccess', function () {
          scope.signInRedirectUrl = $location.url();
        });
      }
    }
  }]);
