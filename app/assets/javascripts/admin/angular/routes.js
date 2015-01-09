/*
 * Angular application routes.
 * Uses the 'app' variable defined in app.js, so must be loaded after it.
 */
app.config([
  '$routeProvider', 'ROUTE_UTILS',
  function ($routeProvider, ROUTE_UTILS) {
    var R = ROUTE_UTILS; // Shortcut

    $routeProvider.
      // Home routes
      when('/', {
        templateUrl: 'admin/controllers/home/index.html',
        controller: 'HomeCtrl'
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

    app.run(R.onAppRun);
  }]);
