/*
 * Angular application routes.
 * Uses the 'app' variable defined in app.js, so must be loaded later than
 * app.js.
 */
app.config(['$routeProvider', function ($routeProvider) {
  /*
   * Use within the 'resolve' property of a route, to require signed-in access
   * to the route.
   *
   * Usage:
   *   when('/some-route', {
   *      :
   *     resolve: { requireSignIn: requireSignIn }
   *   })
   */
  var requireSignIn = ['AuthSvc', function(AuthSvc) {
    return AuthSvc.requireSignIn();
  }];

  $routeProvider.
    // Home routes
    when('/', {
      templateUrl: 'controllers/home/index.html',
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
      resolve: { requireSignIn: requireSignIn }
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
      if (rejection == 'NOT_SIGNED_IN') {
        $window.location.href = '/users/sign_in?x_return_to=' +
          $location.path();
      }
    });
  }]);
