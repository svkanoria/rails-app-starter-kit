/*
 * Authentication and authorization service.
 *
 * Retrieves signed in user data from the global `CurrentUser` variable set on
 * the server side.
 *
 * Authentication occurs via the 'devise' gem, whose workflow is deliberately
 * kept outside of Angular.
 *
 * Authorization is checked via simple rules defined herein. Add/modify rules
 * based on your requirements.
 */
angular.module('AuthSvc', [])
  .factory('AuthSvc', [
    '$q', '$http',
    function ($q, $http) {
      ////////////////////
      // Public Methods //
      ////////////////////

      /**
       * Gets the currently signed in user's details, if any.
       *
       * @returns {?Object}
       */
      var currentUser = function () {
        return Static.current_user;
      };

      /**
       * Returns whether the currently signed in user (if any) is equal to the
       * given user object or user id.
       * Equality is determined solely on the basis of id comparison.
       *
       * @param {Object|number} userOrId - A user object, or id.
       *
       * @returns {boolean}
       */
      var currentUserIs = function (userOrId) {
        if (Static.current_user) {
          if (typeof(userOrId) === 'number') {
            return Static.current_user.id === userOrId;
          } else {
            return Static.current_user.id === userOrId.id;
          }
        }

        return false;
      };

      /**
       * Returns whether the currently signed in user (if any) has one of the
       * given role(s).
       *
       * @param {string|string[]} role - A role, or array of roles.
       *
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
       * Requires no server round-trip, so prefer this over `requireServerAuth`
       * whenever possible.
       *
       * Can be used in conjunction with `requireServerAuth` to redirect to the
       * sign in page if required. Left to itself, `requireServerAuth` does not
       * do so.
       *
       * Usage:
       *   In your routes file:
       *
       *   $routeProvider.when('/some-route', {
       *      :
       *     resolve: {
       *       someProperty: ['AuthSvc', function (AuthSvc) {
       *         return AuthSvc.requireSignIn(optionalRoleOrRoles);
       *       }]
       *     }
       *   });
       *
       * @param {string|string[]} [role] - The role(s) to allow, if any.
       *
       * @returns {Object} A promise that resolves only if a user is signed in
       *   and, in case `role` is non-empty, has one of the given role(s).
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
       *       someProperty: ['AuthSvc', function (AuthSvc) {
       *         return AuthSvc.requireServerAuth(serverRoute);
       *       }]
       *     }
       *   });
       *
       * @param {string} serverRoute - The server route to hit, in a format
       *   compatible with `$routeProvider`.
       * @param {Object} [routeParams] - A hash of parameters to concretize the
       *   route, by replacing named groups with real values.
       *
       * @returns {Object} A promise that resolves only if the server responds
       *   with a non-error status code. Resolves with the response returned
       *   from the server; this may obviate the need for another request to
       *   fetch the data.
       */
      var requireServerAuth = function (serverRoute, routeParams) {
        var deferred = $q.defer();

        if (routeParams) {
          serverRoute = concretizeRoute(serverRoute, routeParams);
        }

        $http.get(serverRoute)
          .success(function (data) {
            deferred.resolve(data);
          })
          .error(function (data, status) {
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

      /////////////////////
      // Private Methods //
      /////////////////////

      /*
       * Concretizes a route by replacing any named groups with real values as
       * found in `routeParams`.
       *
       * @param {string} route - The route, in a format compatible with
       *   $routeProvider.
       * @param {Object} routeParams - A hash of parameters.
       *
       * @returns {string} The concretized route.
       */
      var concretizeRoute = function (route, routeParams) {
        var result = route;

        for (paramName in routeParams) {
          if (routeParams.hasOwnProperty(paramName)) {
            var regexp = new RegExp(':' + paramName + '(\\*|\\?)?', 'g');
            result = result.replace(regexp, routeParams[paramName]);
          }
        }

        return result;
      };

      // Return the service object
      return {
        currentUser: currentUser,
        currentUserIs: currentUserIs,
        hasRole: hasRole,
        requireSignIn: requireSignIn,
        requireServerAuth: requireServerAuth
      };
    }]);
