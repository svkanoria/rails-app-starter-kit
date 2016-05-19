angular.module('PostsCtrl', ['Flash', 'Post'])
  .controller('PostsCtrl', [
    '$scope', 'Flash', 'Post',
    function($scope, Flash, Post) {
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
            { data: 'id',
              render: function (data, type, row, meta) {
                return '<a href="/#/posts/' + data + '">' + data + '</a>';
              }
            },
            { data: 'message' },
            { data: 'created_at',
              render: function (data, type, row, meta) {
                return moment(data).format('lll');
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

        // For operations on a single row
        $scope.dataTableRowOps = {
          edit: {
            icon: 'glyphicon-pencil',
            link: function (rowId) {
              return '/#/posts/' + rowId + '/edit';
            }
          },
          delete: {
            icon: 'glyphicon-remove',
            action: function (rowId) {
              if (!window.confirm('Really delete post #' + rowId + '?')) return;

              $scope.pleaseWaitSvc.request();
              // When performing an operation on a single row, unselect all rows
              // to avoid any ambiguity about the scope of the operation.
              $scope.dataTableSelectedRows.length = 0;

              Post.remove({ postId: rowId }, null,
                function (response) {
                  $scope.pleaseWaitSvc.release();
                  Flash.now.push('success', 'Post deleted.');

                  $scope.dataTableInstance.ajax.reload();
                }, function (failureResponse) {
                  $scope.pleaseWaitSvc.release();
                  Flash.now.push('danger',
                    failureResponse.data.error || 'Error deleting post.');
                });
            }
          }
        };

        // To enable row selection
        $scope.dataTableSelectedRows = [];

        // For bulk operations on currently selected rows
        $scope.dataTableBulkOps = {
          deleteAll: {
            name: 'Delete all',
            action: function () {
              if (!window.confirm('Really delete selected posts?')) return;

              $scope.pleaseWaitSvc.request();

              Post.batch_destroy({}, { ids: $scope.dataTableSelectedRows },
                function (response) {
                  $scope.pleaseWaitSvc.release();
                  Flash.now.push('success', 'Posts deleted.');

                  $scope.dataTableInstance.ajax.reload(); // Reload table data
                  $scope.dataTableSelectedRows.length = 0;
                },
                function (failureResponse) {
                  $scope.pleaseWaitSvc.release();
                  Flash.now.push('danger',
                    failureResponse.data.error || 'Error deleting posts.');
                });
            }
          }
        };

        // For showing expanded row information
        $scope.dataTableExpandedRowInfo = function () {
          return 'Dummy expanded row text';
        };

        $scope.queryBuilderOptions = {
          columns: [
            { name: 'message', label: 'Message', type: 'text' },
            // See query-builder for why 'id' column has type 'text'
            { name: 'id', label: 'ID', type: 'text' },
            { name: 'created_at', label: 'Created At', type: 'date' }
          ],
          initialColumns: ['message', 'id'],
          onSubmit: function () {
            $scope.dataTableInstance.ajax.reload();
          }
        };
      };
    }]);
