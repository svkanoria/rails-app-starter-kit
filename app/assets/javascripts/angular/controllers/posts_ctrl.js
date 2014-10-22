angular.module('PostsCtrl', ['Post']).
  controller('PostsCtrl', [
    '$scope', '$location', '$routeParams', 'flash', 'Post',
    function ($scope, $location, $routeParams, flash, Post) {
      /**
       * The 'index' action.
       */
      $scope.actionIndex = function () {
        $scope.posts = Post.query();
      };

      /**
       * The 'show' action.
       */
      $scope.actionShow = function () {
        $scope.post = Post.get({
          postId: $routeParams.id
        });
      };

      /**
       * The 'new' action.
       * Builds an empty post for the form.
       */
      $scope.actionNew = function () {
        $scope.post = new Post({
          message: '' // It is good practice to initialize to non-null values
        });
      };

      /**
       * The 'create' action.
       * If there are validation errors on the server side, then populates the
       * 'postErrors' scope variable with these errors.
       */
      $scope.actionCreate = function () {
        $scope.post.$save(function (response) {
          flash.set('success', 'Post created.');

          $location.path('posts');
        }, function (failureResponse) {
          $scope.postErrors = failureResponse.data.errors;
        });
      };

      /**
       * The 'edit' action.
       */
      $scope.actionEdit = function () {
        $scope.post = Post.get({
          postId: $routeParams.id
        });
      };

      /**
       * The 'update' action.
       * If there are validation errors on the server side, then populates the
       * 'postErrors' scope variable with these errors.
       */
      $scope.actionUpdate = function () {
        $scope.post.$update(function (response) {
          flash.set('success', 'Post updated.');

          $location.path('posts');
        }, function (failureResponse) {
          $scope.postErrors = failureResponse.data.errors;
        });
      };

      /**
       * The 'destroy' action.
       */
      $scope.actionDestroy = function () {
        $scope.post.$delete(function (response) {
          flash.set('success', 'Post deleted.');

          $location.path('posts');
        }, function (failureResponse) {
          flash.set('success', 'Error deleting post.')
        });
      };
    }]);
