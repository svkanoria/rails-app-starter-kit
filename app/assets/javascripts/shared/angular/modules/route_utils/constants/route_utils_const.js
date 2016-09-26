/*
 * Helpers for use while configuring routes with `$stateProvider`.
 * Merely inject into the `app.config(...)` block.
 */
angular.module('RouteUtilsConst', [])
  .constant('ROUTE_UTILS', function () {
    /**
     * Use within the `resolve` property of a route.
     * See comments for namesake in `AuthSvc` service.
     *
     * Usage:
     *   when('/some-route', {
     *      :
     *     resolve: { someProperty: requireSignIn(optionalRoleOrRoles) }
     *   })
     *
     * @param {string|string[]} [roles] - The role(s) to allow, if any.
     */
    var requireSignIn = function (roles) {
      return ['AuthSvc', function (AuthSvc) {
        return AuthSvc.requireSignIn(roles);
      }];
    };

    /**
     * Use within the `resolve` property of a route.
     * See comments for namesake in `AuthSvc` service.
     *
     * Usage:
     *   when('/some-route', {
     *      :
     *     resolve: { someProperty: requireServerAuth(serverRoute) }
     *   })
     *
     * @param {string} serverRoute - The server route to hit. It can contain a
     *   ':locale' substring; this is replaced by the current locale, if any.
     */
    var requireServerAuth = function (serverRoute) {
      return ['$stateParams', 'I18n', 'AuthSvc',
        function ($stateParams, I18n, AuthSvc) {
          var localizedServerRoute = I18n.l(serverRoute);

          return AuthSvc.requireServerAuth(localizedServerRoute, $stateParams);
        }];
    };

    /**
     * Sets up logic for handling route change errors, and also for hiding the
     * `please-wait` directive on route change.
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
      '$rootScope', '$window', '$location', '$state', 'I18n', 'PleaseWaitSvc',
      'NavConfirmationSvc',
      function($rootScope, $window, $location, $state, I18n, PleaseWaitSvc,
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
         * Works in conjunction with `requireSignIn` and `requireServerAuth`.
         * If their promises do not resolve, we catch the `$stateChangeError`
         * that results, and redirect to the sign in page.
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
                  var signInRedirectAbsUrl =
                    $state.href(to.name, toParams, { absolute: true });

                  var signInRedirectRelUrl = $state.href(to.name, toParams);

                  var signInRedirectUrl =
                    I18n.dl(signInRedirectAbsUrl, signInRedirectRelUrl);

                  $window.location.href =
                    I18n.l('/:locale/users/sign_in?return_to='
                      + signInRedirectUrl);

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
