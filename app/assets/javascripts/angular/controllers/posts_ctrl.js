angular.module('PostsCtrl', ['Post']).
  controller('PostsCtrl', [
    '$scope', '$location', 'Post',
    function($scope, $location, Post) {
      $scope.create = function () {
        var post = new Post({
          message: this.message
        });

        post.$save(function (response) {
          $location.path('posts');
        }, function (failureResponse) {
          $scope.createPostErrors = failureResponse.data.errors;
        });
      };

      /**
       * Populates scope.posts with a list of posts retrieved from the server.
       */
      $scope.find = function () {
        $scope.posts = Post.query();
      };
    }]);
