// Angular application routes.
// Uses the 'app' variable defined in app.js, so must be loaded later than
// app.js.
app.config(['$routeProvider', function ($routeProvider) {
  $routeProvider.
    when('/', {
      templateUrl: 'index.html',
      controller: 'HomeCtrl'
    }).
    when('/posts', {
      templateUrl: 'controllers/posts/index.html',
      controller: 'PostsCtrl'
    });
}]);
