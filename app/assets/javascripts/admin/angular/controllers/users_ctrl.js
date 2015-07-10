angular.module('UsersCtrl', [])
  .controller('UsersCtrl', [
    '$scope',
    function($scope) {
      /**
       * The 'index' action.
       */
      $scope.actionIndex = function () {
        $scope.dataTableOptions = {
          serverSide: true,
          ajax: {
            url: '/admin/users.json',
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
            { data: 'email' },
            { data: 'created_at',
              render: function (data, type, row, meta) {
                return moment(data).format('LLL');
              }
            }
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

        // To enable row selection
        $scope.dataTableSelectedRows = [];

        // For bulk operations on currently selected rows
        $scope.dataTableBulkOps = {
          deleteAll: {
            name: 'Delete All',
            action: function () {
              console.log('TODO Delete all selected users');
            }
          }
        };

        $scope.queryBuilderOptions = {
          columns: [
            { name: 'email', type: 'text' },
            { name: 'id', type: 'text' }, // See query-builder for why 'text'
            { name: 'created_at', type: 'date' }
          ],
          initialColumns: ['email', 'id'],
          onSubmit: function () {
            $scope.dataTableInstance.ajax.reload(); // Reload the data table
          }
        };
      };
    }]);
