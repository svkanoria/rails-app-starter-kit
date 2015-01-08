/*
 * Angular application routes.
 * Uses the 'app' variable defined in app.js, so must be loaded after it.
 */
app.config(['$routeProvider', function ($routeProvider) {
  ////////////////////
  // Helper Methods //
  ////////////////////

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

  ////////////
  // Routes //
  ////////////

  $routeProvider.
    // Home routes
    when('/', {
      templateUrl: 'client/controllers/home/index.html',
      controller: 'HomeCtrl'
    }).

    // Post routes
    when('/posts', {
      templateUrl: 'client/controllers/posts/index.html',
      controller: 'PostsCtrl',
      resolve: {
        initialData: initialData('PostsCtrl', 'index')
      }
    }).
    when('/posts/new', {
      templateUrl: 'client/controllers/posts/new.html',
      controller: 'PostsCtrl',
      resolve: {
        auth: requireSignIn(),
        initialData: initialData('PostsCtrl', 'new')
      }
    }).
    when('/posts/:id', {
      templateUrl: 'client/controllers/posts/show.html',
      controller: 'PostsCtrl',
      resolve: {
        initialData: initialData('PostsCtrl', 'show')
      }
    }).
    when('/posts/:id/edit', {
      templateUrl: 'client/controllers/posts/edit.html',
      controller: 'PostsCtrl',
      resolve: {
        auth1: requireSignIn(),
        auth2: requireServerAuth('/posts/:id/edit'),
        initialData: initialData('PostsCtrl', 'edit')
      }
    }).
    when('/unauthorized', {
      templateUrl: 'shared/401.html'
    }).
    when('/server_error', {
      templateUrl: 'shared/500.html'
    }).
    otherwise({
      templateUrl: 'shared/404.html'
    });
}]);

app.run([
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
  }]);
