/*
 * Angular application routes.
 * Uses the 'app' variable defined in app.js, so must be loaded after it.
 */
app.config(['$routeProvider', function ($routeProvider) {
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

  var initialData = function (ctrl, action) {
    return ['$injector', function ($injector) {
      var svc = $injector.get(ctrl + 'InitialData');

      if (svc) {
        var actionMethod = svc['action' + _.capitalize(action)];

        if (actionMethod) {
          return actionMethod();
        }
      }

      return null;
    }];
  };

  $routeProvider.
    // Home routes
    when('/', {
      templateUrl: 'controllers/home/index.html',
      controller: 'HomeCtrl'
    }).

    // Post routes
    when('/posts', {
      templateUrl: 'controllers/posts/index.html',
      controller: 'PostsCtrl',
      resolve: {
        initialData: initialData('PostCtrl', 'index')
      }
    }).
    when('/posts/new', {
      templateUrl: 'controllers/posts/new.html',
      controller: 'PostsCtrl',
      resolve: {
        auth: requireSignIn(),
        initialData: initialData('PostCtrl', 'new')
      }
    }).
    when('/posts/:id', {
      templateUrl: 'controllers/posts/show.html',
      controller: 'PostsCtrl',
      resolve: {
        initialData: initialData('PostCtrl', 'show')
      }
    }).
    when('/posts/:id/edit', {
      templateUrl: 'controllers/posts/edit.html',
      controller: 'PostsCtrl',
      resolve: {
        auth1: requireSignIn(),
        auth2: requireServerAuth('/posts/:id/edit'),
        initialData: initialData('PostCtrl', 'edit')
      }
    }).
    when('/unauthorized', {
      templateUrl: '401.html'
    }).
    when('/server_error', {
      templateUrl: '500.html'
    }).
    otherwise({
      templateUrl: '404.html'
    });
}]);

/*
 * Works in conjunction with 'requireSignIn' and 'requireServerAuth'.
 * If their promises do not resolve, we catch the resulting $routeChangeError
 * and redirect to the sign-in page.
 */
app.run([
  '$rootScope', '$window', '$location',
  function($rootScope, $window, $location) {
    $rootScope.$on('$routeChangeError', function(e, curr, prev, rejection) {
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
  }]);
