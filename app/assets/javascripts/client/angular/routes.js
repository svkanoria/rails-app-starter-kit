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
        templateUrl: 'client/controllers/home/index.html',
        controller: 'HomeCtrl'
      }).

      // Post routes
      when('/posts', {
        templateUrl: 'client/controllers/posts/index.html',
        controller: 'PostsCtrl',
        resolve: {
          initialData: R.initialData('PostsCtrl', 'index')
        }
      }).
      when('/posts/new', {
        templateUrl: 'client/controllers/posts/new.html',
        controller: 'PostsCtrl',
        resolve: {
          auth: R.requireSignIn(),
          initialData: R.initialData('PostsCtrl', 'new')
        }
      }).
      when('/posts/:id', {
        templateUrl: 'client/controllers/posts/show.html',
        controller: 'PostsCtrl',
        resolve: {
          initialData: R.initialData('PostsCtrl', 'show')
        }
      }).
      when('/posts/:id/edit', {
        templateUrl: 'client/controllers/posts/edit.html',
        controller: 'PostsCtrl',
        resolve: {
          auth1: R.requireSignIn(),
          auth2: R.requireServerAuth('/posts/:id/edit'),
          initialData: R.initialData('PostsCtrl', 'edit')
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

    app.run(R.onAppRun);
  }]);
