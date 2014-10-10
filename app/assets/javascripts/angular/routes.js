/*
 * Angular application routes.
 * Uses the 'app' variable defined in app.js, so must be loaded after it.
 */
app.config(['$routeProvider', function ($routeProvider) {
  /*
   * Use within the 'resolve' property of a route.
   * Requires a user to be signed in, and to possibly have one of the given
   * role(s), in order to access the route.
   *
   * Usage:
   *   when('/some-route', {
   *      :
   *     resolve: { requireSignIn: requireSignIn(optionalRoleOrRoles) }
   *   })
   *
   * @param [role] {string|string[]} - The role(s) to allow, if any.
   */
  var requireSignIn = function (roles) {
    return ['AuthSvc', function(AuthSvc) {
      return AuthSvc.requireSignIn(roles);
    }];
  };

  $routeProvider.
    /////////////////
    // Main routes //
    /////////////////

    // Home routes
    when('/', {
      templateUrl: 'controllers/home/index.html',
      controller: 'HomeCtrl'
    }).
    when('/about_us', {
      templateUrl: 'controllers/home/about_us.html',
      controller: 'HomeCtrl'
    }).
    // Post routes
    when('/posts', {
      templateUrl: 'controllers/posts/index.html',
      controller: 'PostsCtrl'
    }).
    when('/posts/new', {
      templateUrl: 'controllers/posts/new.html',
      controller: 'PostsCtrl',
      resolve: { requireSignIn: requireSignIn() }
    }).

    //////////////////
    // Admin routes //
    //////////////////

    // Location routes
    when('/locations', {
      templateUrl: 'controllers/locations/index.html',
      controller: 'LocationsCtrl',
      resolve: { requireSignIn: requireSignIn('admin') }
    }).
    when('/locations/new', {
      templateUrl: 'controllers/locations/new.html',
      controller: 'LocationsCtrl',
      resolve: { requireSignIn: requireSignIn('admin') }
    }).
    when('/locations/:id/edit', {
      templateUrl: 'controllers/locations/edit.html',
      controller: 'LocationsCtrl',
      resolve: { requireSignIn: requireSignIn('admin') }
    }).

    ///////////////////
    // Shared routes //
    ///////////////////
    when('/unauthorized', {
      templateUrl: '401.html'
    }).
    otherwise({
      templateUrl: '404.html'
    });
}]);

/*
 * Works in conjunction with 'requireSignIn' above.
 * If requireSignIn does not resolve, we catch the resulting $routeChangeError
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
          $location.path('/unauthorized').replace();

          break;
      }
    });
  }]);
