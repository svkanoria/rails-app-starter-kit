angular.module('PostsCtrl', ['Post']).
  controller('PostsCtrl', [
    '$scope', '$location', '$routeParams', 'Post',
    function($scope, $location, $routeParams, Post) {
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
        $scope.post = new Post();
      };

      /**
       * The 'create' action.
       * If there are validation errors on the server side, then populates the
       * 'postErrors' scope variable with these errors.
       */
      $scope.actionCreate = function () {
        $scope.post.$save(function (response) {
          $location.path('posts');
        }, function (failureResponse) {
          $scope.postErrors = failureResponse.data.errors;
        });
      };

      /**
       * The 'update' action.
       * If there are validation errors on the server side, then populates the
       * 'postErrors' scope variable with these errors.
       */
      $scope.actionUpdate= function () {
        $scope.post.$update(function (response) {
          $location.path('posts');
        }, function (failureResponse) {
          $scope.postErrors = failureResponse.data.errors;
        });
      };
    }]);
