angular.module('PostsCtrl', ['I18n', 'Flash', 'Post', 'AttachmentLibrarySvc'])
  .controller('PostsCtrl', [
    '$scope', '$state', 'I18n', 'Flash', 'Post', 'AttachmentLibrarySvc',
    'initialData',
    function ($scope, $state, I18n, Flash, Post, AttachmentLibrarySvc,
              initialData) {
      
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
          postsQuery.$cancelRequest();
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
       * `postErrors` scope variable with these errors.
       */
      $scope.actionCreate = function () {
        $scope.pleaseWaitSvc.request();

        $scope.post.$save(function (response) {
          $scope.pleaseWaitSvc.release();
          Flash.push('success', 'Post created.', 'post_created');

          $scope.navConfirmationSvc.setConfirmNav(false);
          $state.go('app.posts.index');
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
       * `postErrors` scope variable with these errors.
       */
      $scope.actionUpdate = function () {
        $scope.pleaseWaitSvc.request();

        $scope.post.$update(function (response) {
          $scope.pleaseWaitSvc.release();
          Flash.push('success', 'Post updated.', 'post_updated');

          $scope.navConfirmationSvc.setConfirmNav(false);
          $state.go('app.posts.index');
        }, function (failureResponse) {
          $scope.pleaseWaitSvc.release();
          $scope.postErrors = failureResponse.data.errors;
        });
      };

      /**
       * The 'destroy' action.
       */
      $scope.actionDestroy = function () {
        I18n.confirm('Really delete post?',
          'really_delete_post').then(function () {

          $scope.pleaseWaitSvc.request();

          $scope.post.$delete(function (response) {
            $scope.pleaseWaitSvc.release();
            Flash.push('success', 'Post deleted.', 'post_deleted');

            $scope.navConfirmationSvc.setConfirmNav(false);
            $state.go('app.posts.index');
          }, function (failureResponse) {
            $scope.pleaseWaitSvc.release();
            if (failureResponse.data.error) {
              // We assume messages from the server are localized, so we don't
              // need to provide a translation id.
              Flash.push('danger', failureResponse.data.error);
            } else {
              Flash.push('danger', 'Error deleting post.',
                'error_deleting_post');
            }
          });
        });
      };
    }]);
