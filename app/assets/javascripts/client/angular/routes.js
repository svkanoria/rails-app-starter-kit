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
        templateUrl: 'client/controllers/home/index.html',
        controller: 'HomeCtrl'
      })

      // Post routes
      .state('posts', {
        url: '/posts',
        templateUrl: 'client/controllers/posts/index.html',
        controller: 'PostsCtrl',
        resolve: {
          initialData: angular.noop
        }
      })
      .state('posts.list', {
        url: '/list',
        templateUrl: 'client/controllers/posts/list.html',
        controller: 'PostsCtrl',
        resolve: {
          initialData: angular.noop
        }
      })
      .state('posts.new', {
        url: '/new',
        templateUrl: 'client/controllers/posts/new.html',
        controller: 'PostsCtrl',
        resolve: {
          auth: R.requireSignIn(),
          initialData: ['Post', function (Post) {
            // It is good practice to initialize to non-null values
            return new Post({ message: '' });
          }]
        }
      })
      .state('posts.show', {
        url: '/:id',
        templateUrl: 'client/controllers/posts/show.html',
        controller: 'PostsCtrl',
        resolve: {
          initialData: ['$stateParams', 'Post', function ($stateParams, Post) {
            return Post.get({ postId: $stateParams.id }).$promise;
          }]
        }
      })
      .state('posts.edit', {
        url: '/:id/edit',
        templateUrl: 'client/controllers/posts/edit.html',
        controller: 'PostsCtrl',
        resolve: {
          initialData: ['$stateParams', 'Post', function ($stateParams, Post) {
            return Post.edit({ postId: $stateParams.id }).$promise;
          }]
        }
      })

      // Attachment routes
      .state('attachments', {
        url: '/attachments',
        templateUrl: 'client/controllers/attachments/index.html',
        controller: 'AttachmentsCtrl',
        resolve: {
          auth1: R.requireSignIn(),
          initialData: angular.noop
        }
      })
      .state('attachments.show', {
        url: '/:id',
        templateUrl: 'client/controllers/attachments/show.html',
        controller: 'AttachmentsCtrl',
        resolve: {
          auth2: R.requireServerAuth('/attachments/:id'),
          initialData: [
            '$stateParams', 'Attachment',
            function ($stateParams, Attachment) {
              return Attachment.get({ attachmentId: $stateParams.id }).$promise;
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
