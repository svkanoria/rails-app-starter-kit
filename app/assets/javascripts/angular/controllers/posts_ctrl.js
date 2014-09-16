angular.module('PostsCtrl', ['Post']).
  controller('PostsCtrl', ['$scope', 'Post', function($scope, Post) {
    $scope.create = function () {
      var post = new Post({
        message: this.message
      });

      post.$save(function (response) {

      });
    };


    /**
     * Returns a list of posts.
     */
    $scope.find = function () {
      $scope.posts = Post.query();
    }
  }]);
