angular.module('PostsCtrl', []).
  controller('PostsCtrl', ['$scope', function($scope) {
    $scope.posts = [
      {
        id: 1,
        message: 'Post 1'
      },
      {
        id: 2,
        message: 'Post 2'
      }
    ];
  }]);
