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
     * Gets the currently signed in user's details, if any.
     * @returns {*} Signed in user details, or null.
     */
    var currentUser = function () {
      return CurrentUser;
    };

    /**
     * Returns whether the currently signed in user has one of the given
     * role(s).
     * @param role {string|string[]} - A role, or array of roles.
     * @returns {boolean}
     */
    var hasRole = function (role) {
      var u = currentUser();

      if (!u || _.isEmpty(u.roles)) return false;

      if (typeof(role) == 'string') {
        return _.contains(u.roles, role);
      } else {
        return _.intersection(u.roles, role).length > 0;
      }
    };

    /**
     * Helper method to be used in routing.
     * Requires a user to be signed in, and to possibly have one of the given
     * role(s), in order to access certain routes.
     *
     * Usage:
     *   In your routes file:
     *
     *   $routeProvider.when('/some-route', {
     *      :
     *     resolve: {
     *       requireSignIn: ['AuthSvc', function (AuthSvc) {
     *         return AuthSvc.requireSignIn(optionalRoleOrRoles);
     *       }]
     *     }
     *   });
     *
     * @param [role] {string|string[]} - The role(s) to allow, if any.
     * @returns {promise} A promise that resolves only if a user is signed in
     * and, in case 'role' in non-empty, has one of the given role(s).
     */
    var requireSignIn = function (role) {
      var deferred = $q.defer();

      if (!currentUser()) {
        deferred.reject('NOT_SIGNED_IN');
      } else if (!_.isEmpty(role) && !hasRole(role)) {
        deferred.reject('ROLE_NOT_AUTHORIZED');
      } else {
        deferred.resolve();
      }

      return deferred.promise;
    };

    // Return the service object
    return {
      currentUser: currentUser,
      hasRole: hasRole,
      requireSignIn: requireSignIn
    };
  }]);
