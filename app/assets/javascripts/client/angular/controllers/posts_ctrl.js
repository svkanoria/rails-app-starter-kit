angular.module('PostsCtrl', ['Post', 'AttachmentLibrarySvc'])
  .controller('PostsCtrl', [
    '$scope', '$state', 'flash', 'Post', 'initialData', 'AttachmentLibrarySvc',
    function ($scope, $state, flash, Post, initialData, AttachmentLibrarySvc) {
      /**
       * The 'index' action.
       */
      $scope.actionIndex = function () {
        var postsQuery = null;

        // Debounce the posts retrieval.
        // This code is merely illustrative. In the case of this particular
        // action, no debouncing is required.
        var fetchPosts = _.debounce(function () {
          $scope.pleaseWaitSvc.request();

          postsQuery = Post.query();

          postsQuery.$promise.then(function (response) {
            $scope.posts = response;
          }, function (failureResponse) {
            // Do something on failure
          }).finally(function () {
            $scope.pleaseWaitSvc.release();
          });
        }, 400);

        // Cancel old request if pending.
        // This code is merely illustrative. In the case of this particular
        // action, no cancelling is required.
        if (postsQuery) {
          postsQuery.cancel();
          postsQuery = null;
        }

        fetchPosts();
      };

      /**
       * The 'show' action.
       */
      $scope.actionShow = function () {
        $scope.post = initialData;
      };

      /**
       * The 'new' action.
       * Builds an empty post for the form.
       */
      $scope.actionNew = function () {
        $scope.post = initialData;
      };

      /**
       * The 'create' action.
       * If there are validation errors on the server side, then populates the
       * 'postErrors' scope variable with these errors.
       */
      $scope.actionCreate = function () {
        $scope.pleaseWaitSvc.request();

        $scope.post.$save(function (response) {
          $scope.pleaseWaitSvc.release();
          flash.set('success', 'Post created.');

          $state.go('posts.list');
        }, function (failureResponse) {
          $scope.pleaseWaitSvc.release();
          $scope.postErrors = failureResponse.data.errors;
        });
      };

      /**
       * The 'edit' action.
       */
      $scope.actionEdit = function () {
        AttachmentLibrarySvc.setVisible(true);

        $scope.post = initialData;
      };

      /**
       * The 'update' action.
       * If there are validation errors on the server side, then populates the
       * 'postErrors' scope variable with these errors.
       */
      $scope.actionUpdate = function () {
        $scope.pleaseWaitSvc.request();

        $scope.post.$update(function (response) {
          $scope.pleaseWaitSvc.release();
          flash.set('success', 'Post updated.');

          $state.go('posts.list');
        }, function (failureResponse) {
          $scope.pleaseWaitSvc.release();
          $scope.postErrors = failureResponse.data.errors;
        });
      };

      /**
       * The 'destroy' action.
       */
      $scope.actionDestroy = function () {
        if (!window.confirm('Really delete this post?')) return;

        $scope.pleaseWaitSvc.request();

        $scope.post.$delete(function (response) {
          $scope.pleaseWaitSvc.release();
          flash.set('success', 'Post deleted.');

          $state.go('posts.list');
        }, function (failureResponse) {
          $scope.pleaseWaitSvc.release();
          flash.set('error', 'Error deleting post.')
        });
      };
    }]);
