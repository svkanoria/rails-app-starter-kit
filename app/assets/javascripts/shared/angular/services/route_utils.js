/*
 * Helpers for use while configuring routes with $routeProvider.
 * Merely inject into the app.config(...) block.
 */
angular.module('RouteUtils', [])
  .constant('ROUTE_UTILS', function () {
    /**
     * Use within the 'resolve' property of a route.
     * See comments for namesake in AuthSvc service.
     *
     * Usage:
     *   when('/some-route', {
     *      :
     *     resolve: { someProperty: requireSignIn(optionalRoleOrRoles) }
     *   })
     *
     * @param [roles] {string|string[]} - The role(s) to allow, if any.
     */
    var requireSignIn = function (roles) {
      return ['AuthSvc', function (AuthSvc) {
        return AuthSvc.requireSignIn(roles);
      }];
    };

    /**
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

    /**
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

    /**
     * Sets up logic for handling route change errors, and for hiding the
     * please-wait directive on route change.
     *
     * Usage:
     *   app.run([
     *     '$injector', 'ROUTE_UTILS',
     *     function ($injector, ROUTE_UTILS) {
     *        :
     *       $injector.invoke(ROUTE_UTILS.onAppRun);
     *     }]);
     *
     * @type {*[]}
     */
    var onAppRun = [
      '$rootScope', '$window', '$location', 'PleaseWaitSvc',
      function($rootScope, $window, $location, PleaseWaitSvc) {
        // To show a 'Please Wait...' message between route changes
        $rootScope.$on('$routeChangeStart', function() {
          PleaseWaitSvc.request();
        });

        /*
         * Works in conjunction with 'requireSignIn' and 'requireServerAuth'.
         * If their promises do not resolve, we catch the $routeChangeError that
         * results, and redirect to the sign-in page.
         *
         * Also hides the 'Please Wait...' message requested above.
         */
        $rootScope.$on('$routeChangeError', function(e, curr, prev, rejection) {
          PleaseWaitSvc.releaseAll();

          switch (rejection) {
            case 'NOT_SIGNED_IN':
              $window.location.href = '/users/sign_in?x_return_to=' +
              $location.path();

              break;
            case 'ROLE_NOT_AUTHORIZED':
            case 'SERVER_DID_NOT_AUTH':
              $location.path('/unauthorized').replace();

              break;
            default:
              $location.path('/server_error').replace();

              break;
          }
        });

        // This hides the 'Please Wait...' message requested above.
        $rootScope.$on('$routeChangeSuccess', function() {
          PleaseWaitSvc.releaseAll();
        });
      }];

    return {
      requireSignIn: requireSignIn,
      requireServerAuth: requireServerAuth,
      initialData: initialData,
      onAppRun: onAppRun
    };
  }());
