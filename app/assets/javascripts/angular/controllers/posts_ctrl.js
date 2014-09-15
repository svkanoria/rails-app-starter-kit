angular.module('PostsCtrl', ['Post']).
  controller('PostsCtrl', ['$scope', 'Post', function($scope, Post) {
    /**
     * Returns a list of posts.
     */
    $scope.find = function () {
      $scope.posts = Post.query();
    }
  }]);
