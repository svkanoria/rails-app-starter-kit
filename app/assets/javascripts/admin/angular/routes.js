/*
 * Angular application routes.
 * Uses the 'app' variable defined in app.js, so must be loaded after it.
 */
app.config([
  '$stateProvider', '$urlRouterProvider', 'ROUTE_UTILS',
  function ($stateProvider, $urlRouterProvider, ROUTE_UTILS) {
    var R = ROUTE_UTILS; // Shortcut

    $urlRouterProvider.otherwise('/');

    $stateProvider
      // Home routes
      .state('home', {
        url: '/',
        templateUrl: 'admin/controllers/home/index.html',
        controller: 'HomeCtrl'
      })

      // Post routes
      .state('posts', {
        abstract: true,
        url: '/posts',
        template: '<div ui-view></div>'
      })
      .state('posts.index', {
        url: '',
        templateUrl: 'admin/controllers/posts/index.html',
        controller: 'PostsCtrl'
      })

      // User routes
      .state('users', {
        abstract: true,
        url: '/users',
        template: '<div ui-view></div>'
      })
      .state('users.index', {
        url: '',
        templateUrl: 'admin/controllers/users/index.html',
        controller: 'UsersCtrl',
        resolve: {
          initialData: angular.noop
        }
      })
      .state('users.new', {
        url: '/new',
        templateUrl: 'admin/controllers/users/new.html',
        controller: 'UsersCtrl',
        resolve: {
          initialData: ['User', function (User) {
            return new User({
              // It is good practice to initialize to non-null values
              email: '',
              password: '',
              password_confirmation: ''
            })
          }]
        }
      })
      .state('users.edit', {
        url: '/:id/edit',
        templateUrl: 'admin/controllers/users/edit.html',
        controller: 'UsersCtrl',
        resolve: {
          initialData: ['$stateParams', 'User', function ($stateParams, User) {
            return User.edit({ userId: $stateParams.id }).$promise;
          }]
        }
      })

      // Error routes
      .state('401', {
        templateUrl: 'shared/401.html'
      })
      .state('404', {
        templateUrl: 'shared/404.html'
      })
      .state('500', {
        templateUrl: 'shared/500.html'
      });
  }]);

app.run([
  '$injector', 'ROUTE_UTILS',
  function ($injector, ROUTE_UTILS) {
    $injector.invoke(ROUTE_UTILS.onAppRun);
  }]);
