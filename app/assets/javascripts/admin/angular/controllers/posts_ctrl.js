angular.module('PostsCtrl', []).
  controller('PostsCtrl', [
    '$scope',
    function($scope) {
      /**
       * The 'index' action.
       */
      $scope.actionIndex = function () {
        $scope.dataTableOptions = {
          serverSide: true,
          ajax: '/admin/posts.json'
        };
      };
    }]);
