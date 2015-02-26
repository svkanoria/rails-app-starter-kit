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
          searching: false, // Since we are using query builder
          columns: [
            { data: 'id' },
            { data: 'message' },
            { data: 'created_at' }
          ]
        };

        $scope.queryBuilderOptions = {
          columns: [
            { name: 'id', type: 'number' },
            { name: 'message', type: 'text' },
            { name: 'created_at', type: 'date' }
          ]
        };

        $scope.queryBuilderFilters = [
          { column: 'id', values: ['10'], op: '=' }
        ];
      };
    }]);
