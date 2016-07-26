/*
 * Helpers for use while configuring routes with $stateProvider.
 * Merely inject into the app.config(...) block.
 */
angular.module('RouteUtilsConst', [])
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
      return ['$stateParams', 'AuthSvc', function ($stateParams, AuthSvc) {
        return AuthSvc.requireServerAuth(serverRoute, $stateParams);
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
      '$rootScope', '$window', '$location', '$state', 'PleaseWaitSvc',
      'NavConfirmationSvc',
      function($rootScope, $window, $location, $state, PleaseWaitSvc,
               NavConfirmationSvc) {

        $rootScope.$on('$stateChangeStart', function(event) {
          if (!NavConfirmationSvc.isNavConfirmed()) {
            event.preventDefault();
          } else {
            // Shows a 'Please Wait...' indicator when route changes
            PleaseWaitSvc.request();
          }
        });

        /*
         * Works in conjunction with 'requireSignIn' and 'requireServerAuth'.
         * If their promises do not resolve, we catch the $stateChangeError that
         * results, and redirect to the sign-in page.
         *
         * Also hides the 'Please Wait...' indicator requested above.
         */
        $rootScope.$on('$stateChangeError',
          function(e, to, toParams, from, fromParams, rejection) {
            PleaseWaitSvc.releaseAll();

            if (rejection.status) {
              switch (rejection.status) {
                case 401:
                case 404:
                  $state.go(rejection.status.toString());
                  break;
                default:
                  $state.go('500');
                  break;
              }
            } else {
              switch (rejection) {
                case 'NOT_SIGNED_IN':
                  var signInRedirectUrl = $state.href(to.name, toParams);

                  if (signInRedirectUrl[0] === '#') {
                    signInRedirectUrl = signInRedirectUrl.substring(1);
                  }

                  $window.location.href = '/users/sign_in?return_to=' +
                    signInRedirectUrl;

                  break;
                case 'ROLE_NOT_AUTHORIZED':
                case 'SERVER_DID_NOT_AUTH':
                  $state.go('401');
                  break;
                default:
                  $state.go('500');
                  break;
              }
            }
          });

        // This hides the 'Please Wait...' indicator requested above
        $rootScope.$on('$stateChangeSuccess', function() {
          PleaseWaitSvc.releaseAll();
        });
      }];

    return {
      requireSignIn: requireSignIn,
      requireServerAuth: requireServerAuth,
      onAppRun: onAppRun
    };
  }());
