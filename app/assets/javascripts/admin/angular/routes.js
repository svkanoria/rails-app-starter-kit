/*
 * Angular application routes.
 * Uses the 'app' variable defined in app.js, so must be loaded after it.
 */
app.config([
  '$routeProvider', 'ROUTE_UTILS',
  function ($routeProvider, ROUTE_UTILS) {
    var R = ROUTE_UTILS; // Shortcut

    $routeProvider
      // Home routes
      .when('/', {
        templateUrl: 'admin/controllers/home/index.html',
        controller: 'HomeCtrl'
      })

      // Post routes
      .when('/posts', {
        templateUrl: 'admin/controllers/posts/index.html',
        controller: 'PostsCtrl'
      })

      // User routes
      .when('/users', {
        templateUrl: 'admin/controllers/users/index.html',
        controller: 'UsersCtrl',
        resolve: {
          initialData: R.initialData('UsersCtrl', 'index')
        }
      })
      .when('/users/new', {
        templateUrl: 'admin/controllers/users/new.html',
        controller: 'UsersCtrl',
        resolve: {
          initialData: R.initialData('UsersCtrl', 'new')
        }
      })

      // Error routes
      .when('/unauthorized', {
        templateUrl: 'shared/401.html'
      })
      .when('/server_error', {
        templateUrl: 'shared/500.html'
      })
      .otherwise({
        templateUrl: 'shared/404.html'
      });
  }]);

app.run([
  '$injector', 'ROUTE_UTILS',
  function ($injector, ROUTE_UTILS) {
    $injector.invoke(ROUTE_UTILS.onAppRun);
  }]);
