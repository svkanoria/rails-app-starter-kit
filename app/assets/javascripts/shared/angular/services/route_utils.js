/*
 * Helper methods for use while configuring routes with $routeProvider.
 * Merely inject into the app.config(...) block.
 */
angular.module('RouteUtils', [])
  .constant('ROUTE_UTILS', function () {
    /*
     * Use within the 'resolve' property of a route.
     * See comments for namesake in AuthSvc service.
     *
     * Usage:
     *   when('/some-route', {
     *      :
     *     resolve: { someProperty: requireSignIn(optionalRoleOrRoles) }
     *   })
     *
     * @param [role] {string|string[]} - The role(s) to allow, if any.
     */
    var requireSignIn = function (roles) {
      return ['AuthSvc', function (AuthSvc) {
        return AuthSvc.requireSignIn(roles);
      }];
    };

    /*
     * Use within the 'resolve' property of a route.
     * See comments for namesake in AuthSvc service.
     *
     * Usage:
     *   when('/some-route', {
     *      :
     *     resolve: { someProperty: requireServerAuth(serverRoute) }
     *   })
     *
     * @param serverRoute {string} - The server route to hit.
     */
    var requireServerAuth = function (serverRoute) {
      return ['$route', 'AuthSvc', function ($route, AuthSvc) {
        return AuthSvc.requireServerAuth(serverRoute, $route.current.params);
      }];
    };

    /*
     * Use within the 'resolve' property of a route.
     * A convenience method for ensuring the presence of required initial data
     * before navigating to a route.
     *
     * Assumes certain conventions:
     * * If the controller name is 'SomeCtrl', there is a service called
     *   'SomeCtrlInitSvc' that provides this initial data.
     * * For every controller action requiring initial data, the service has a
     *   method called 'actionSomeAction' that returns the initial data.
     *   For example, 'actionIndex', 'actionShow' etc.
     *
     * Usage:
     *   when('/some-route', {
     *      :
     *     resolve: { someProperty: initialData(ctrl, action) }
     *   })
     *
     * @param ctrl {string} - The controller name.
     * @param action {string} - The action name.
     */
    var initialData = function (ctrl, action) {
      return ['$injector', function ($injector) {
        var svc = $injector.get(ctrl + 'InitSvc');

        if (svc) {
          var actionMethod = svc['action' + _.capitalize(action)];

          if (actionMethod) {
            return actionMethod();
          }
        }

        return null;
      }];
    };

    return {
      requireSignIn: requireSignIn,
      requireServerAuth: requireServerAuth,
      initialData: initialData
    };
  }());
