/*
 * Angular application routes.
 * Uses the `app` variable defined in app.js, so must be loaded after it.
 */
app.config([
  '$stateProvider', '$locationProvider', '$urlRouterProvider', 'ROUTE_UTILS',
  function ($stateProvider, $locationProvider, $urlRouterProvider,
            ROUTE_UTILS) {

    var R = ROUTE_UTILS; // Shortcut

    $locationProvider.html5Mode(true);

    $urlRouterProvider.otherwise('/');

    $stateProvider
      // App routes
      // The 'top level' view corresponding to `AppCtrl`
      .state('app', {
        abstract: true,
        url: '',
        templateUrl: 'admin/controllers/app/index.html',
        controller: 'AppCtrl'
      })

      // Home routes
      .state('app.home', {
        url: '/',
        templateUrl: 'admin/controllers/home/index.html',
        controller: 'HomeCtrl'
      })

      // Post routes
      .state('app.posts', {
        abstract: true,
        url: '/posts',
        template: '<div ui-view></div>'
      })
      .state('app.posts.index', {
        url: '',
        templateUrl: 'admin/controllers/posts/index.html',
        controller: 'PostsCtrl'
      })

      // User routes
      .state('app.users', {
        abstract: true,
        url: '/users',
        template: '<div ui-view></div>',
        resolve: {
          initialData: angular.noop
        }
      })
      .state('app.users.index', {
        url: '',
        templateUrl: 'admin/controllers/users/index.html',
        controller: 'UsersCtrl'
      })
      .state('app.users.new', {
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
      .state('app.users.edit', {
        url: '/:id/edit',
        templateUrl: 'admin/controllers/users/edit.html',
        controller: 'UsersCtrl',
        resolve: {
          initialData: ['$stateParams', 'User', function ($stateParams, User) {
            return User.edit({ userId: $stateParams.id }).$promise;
          }]
        }
      })

      // App settings routes
      .state('app.app_settings', {
        abstract: true,
        url: '/app_settings/:category',
        templateUrl: 'admin/controllers/app_settings/layout.html',
        controller: 'AppSettingsCtrl',
        resolve: {
          initialData: ['$stateParams', function ($stateParams) {
            return $stateParams.category;
          }],
          initialData2: ['$stateParams', '$http', 'I18n',
            function ($stateParams, $http, I18n) {
              var localizedUrl =
                I18n.l('/admin/:locale/app_settings.json?category=' +
                  $stateParams.category);

              return $http.get(localizedUrl);
            }]
        }
      })
      .state('app.app_settings.show', {
        url: '',
        templateUrl: function ($stateParams) {
          return 'admin/controllers/app_settings/' + $stateParams.category
            + '.html';
        }
      })

      // Error routes
      .state('401', {
        url: '/401',
        templateUrl: 'shared/401.html'
      })
      .state('404', {
        url: '/404',
        templateUrl: 'shared/404.html'
      })
      .state('500', {
        url: '/500',
        templateUrl: 'shared/500.html'
      });
  }]);

app.run([
  '$injector', 'ROUTE_UTILS',
  function ($injector, ROUTE_UTILS) {
    $injector.invoke(ROUTE_UTILS.onAppRun);
  }]);
