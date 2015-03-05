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
          ajax: {
            url: '/admin/posts.json',
            // Just add the query builder filters to all AJAX requests sent by
            // the data table!
            data: function (d) {
              d.filters = $scope.queryBuilderFilters;
            }
          },
          searching: false, // Since we are using query builder
          processing: true, // Show the 'processing' indicator
          columns: [
            { data: 'id' },
            { data: 'message' },
            { data: 'created_at' }
          ],
          stateSave: true, // Ensure table element has an id for this to work!
          // Save/load the query builder state along with the table state
          stateSaveParams: function (settings, data) {
            data.filters = $scope.queryBuilderFilters;
          },
          stateLoadParams: function (settings, data) {
            $scope.queryBuilderFilters = data.filters;
          }
        };

        // The 'raw' data table instance.
        // This is populated by the 'datatable' directive.
        $scope.dataTableInstance = null;

        $scope.queryBuilderOptions = {
          columns: [
            { name: 'id', type: 'text' }, // See query-builder for why 'text'
            { name: 'message', type: 'text' },
            { name: 'created_at', type: 'date' }
          ],
          onSubmit: function () {
            $scope.dataTableInstance.ajax.reload(); // Reload the data table
          }
        };
      };
    }]);
