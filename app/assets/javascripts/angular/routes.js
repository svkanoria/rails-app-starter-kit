// Angular application routes.
// Uses the 'app' variable defined in app.js, so must be loaded later than
// app.js.
app.config(['$routeProvider', function ($routeProvider) {
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
      controller: 'PostsCtrl'
    });
}]);
