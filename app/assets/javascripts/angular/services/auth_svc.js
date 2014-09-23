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
    /**
     * Gets the currently logged in user's details, if any.
     * @returns {*} Logged in user details, or null.
     */
    var currentUser = function () {
      return CurrentUser;
    };

    /**
     * Helper method to be used in routing.
     * Requires a user to be signed in, and to possibly have one of the given
     * roles, in order to access certain routes.
     *
     * Usage:
     *   In your routes file:
     *
     *   $routeProvider.when('/some-route', {
     *      :
     *     resolve: {
     *       requireSignIn: ['AuthSvc', function (AuthSvc) {
     *         return AuthSvc.requireSignIn(optionalRoles);
     *       }]
     *     }
     *   });
     *
     * @param [roles] {string[]} - The roles to restrict access to, if any.
     * @returns {promise} A promise that resolves only if a user is signed-in
     * and, in case 'roles' in non-empty, has one of the given roles.
     */
    var requireSignIn = function (roles) {
      var deferred = $q.defer();

      if (!currentUser()) {
        deferred.reject('NOT_SIGNED_IN');
      } else if (!_.isEmpty(roles) &&
          _.intersection(currentUser().roles, roles).length == 0) {

        deferred.reject('ROLE_NOT_AUTHORIZED');
      } else {
        deferred.resolve();
      }

      return deferred.promise;
    };

    // Return the service object
    return {
      currentUser: currentUser,
      requireSignIn: requireSignIn
    };
  }]);
