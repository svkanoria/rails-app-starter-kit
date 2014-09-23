/*
 * Authentication and authorization service.
 *
 * Retrieves signed in user data from the global 'CurrentUser' variable set on
 * the server side.
 *
 * Authentication occurs via the 'devise' gem, whose workflow is deliberately
 * kept outside of Angular.
 *
 * Authorization is checked via simple rules defined herein. Add/modify rules
 * based on your requirements.
 */
angular.module('AuthSvc', []).
  factory('AuthSvc', ['$q', function ($q) {
    var svc = {};

    /**
     * Gets the currently logged in user's details, if any.
     * @returns {*} Logged in user details, or null.
     */
    svc.currentUser = function () {
      return CurrentUser;
    };

    /**
     * Helper method to be used in routes, to require a user to sign in before
     * accessing certain routes.
     *
     * Usage:
     *   In your routes file:
     *
     *   $routeProvider.when('/some-route', {
     *      :
     *     resolve: {
     *       requireSignIn: ['AuthSvc', function (AuthSvc) {
     *         return AuthSvc.requireSignIn();
     *       }]
     *     }
     *   });
     *
     * @returns {promise} A promise that resolves only if a user is signed-in.
     */
    svc.requireSignIn = function () {
      var deferred = $q.defer();

      if (!svc.currentUser()) {
        deferred.reject('NOT_SIGNED_IN');
      } else {
        deferred.resolve();
      }

      return deferred.promise;
    };

    return svc;
  }]);
