angular.module('PostsCtrl', ['Post']).
  controller('PostsCtrl', [
    '$scope', '$location', 'Post',
    function($scope, $location, Post) {
      /**
       * The 'index' action.
       */
      $scope.actionIndex = function () {
        $scope.posts = Post.query();
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
    }]);
