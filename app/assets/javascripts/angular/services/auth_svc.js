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
  factory('AuthSvc', ['$q', '$http', function ($q, $http) {
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
     *
     * Requires a user to be signed in, and to possibly have one of the given
     * role(s), in order to access certain routes.
     *
     * Requires no server round-trip, so prefer this over 'requireServerAuth',
     * whenever possible.
     *
     * Usage:
     *   In your routes file:
     *
     *   $routeProvider.when('/some-route', {
     *      :
     *     resolve: {
     *       someVariable: ['AuthSvc', function (AuthSvc) {
     *         return AuthSvc.requireSignIn(optionalRoleOrRoles);
     *       }]
     *     }
     *   });
     *
     * @param [role] {string|string[]} - The role(s) to allow, if any.
     * @returns {promise} A promise that resolves only if a user is signed in
     * and, in case 'role' is non-empty, has one of the given role(s).
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

    /**
     * Helper method to be used in routing.
     *
     * Delegates authentication/authorization to the server, by simulating an
     * HTTP GET request to a server route and interpreting the status code in
     * the response.
     *
     * Requires a server round-trip, but is very convenient, because it
     * delegates authentication/authorization to the server, thus keeping code
     * DRYer.
     *
     * Usage:
     *   In your route files:
     *
     *   $routeProvider.when('/some-route', {
     *      :
     *     resolve: {
     *       someVariable: ['AuthSvc', function (AuthSvc) {
     *         return AuthSvc.requireServerAuth(serverRoute);
     *       }]
     *     }
     *   });
     *
     * @param serverRoute {string} - The server route to hit.
     * @returns {promise} A promise that resolves only if the server responds
     * with a non-error status code. Resolves with the response returned from
     * the server; this may obviate the need for a second request to fetch the
     * data.
     */
    var requireServerAuth = function (serverRoute) {
      var deferred = $q.defer();

      $http.get(serverRoute).
        success(function (data) {
          deferred.resolve(data);
        }).
        error(function (data, status) {
          // Some schools of thought advocate the use of 404. See
          // http://www.bennadel.com/blog/2400-handling-forbidden-restful-requests-401-vs-403-vs-404.htm
          if (status == 401) {
            deferred.reject('SERVER_DID_NOT_AUTH');
          } else {
            deferred.reject('SERVER_ERROR');
          }
        });

      return deferred.promise;
    };

    // Return the service object
    return {
      currentUser: currentUser,
      hasRole: hasRole,
      requireSignIn: requireSignIn,
      requireServerAuth: requireServerAuth
    };
  }]);
