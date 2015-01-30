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
          ajax: '/admin/posts.json',
          columns: [
            { data: 'id' },
            { data: 'message' },
            { data: 'created_at' }
          ]
        };
      };
    }]);
