angular.module('UsersCtrl', ['User'])
  .controller('UsersCtrl', [
    '$scope', '$location', 'flash', 'User', 'initialData',
    function($scope, $location, flash, User, initialData) {
      /**
       * The 'index' action.
       */
      $scope.actionIndex = function () {
        $scope.dataTableOptions = {
          serverSide: true,
          ajax: {
            url: '/admin/users.json',
            data: function (d) {
              // Delete the 'roles' column (at index 3) since it isn't a real
              // column in the database. This is fine since the server returns
              // roles anyway. All we need this column def for here, is to
              // display the roles correctly.
              d.columns.splice(3, 1);
              // Just add the query builder filters to all AJAX requests sent by
              // the data table!
              d.filters = $scope.queryBuilderFilters;
            }
          },
          searching: false, // Since we are using query builder
          processing: true, // Show the 'processing' indicator
          columns: [
            { data: 'id' },
            { data: 'email' },
            { data: 'roles',
              orderable: false, // Since it isn't a real column in the database
              render: function (data, type, row, meta) {
                return _.map(data, function (role) {
                  return _.titleize(_.humanize(role));
                }).join(',')
              }
            },
            { data: 'created_at',
              render: function (data, type, row, meta) {
                return moment(data).format('lll');
              }
            },
            { data: 'confirmed_at' ,
              render: function (data, type, row, meta) {
                return (data) ? moment(data).format('lll') : 'Pending';
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
              User.batch_destroy({}, { ids: $scope.dataTableSelectedRows },
                function (success) {
                  $scope.dataTableInstance.ajax.reload(); // Reload table data
                  $scope.dataTableSelectedRows.length = 0;
                },
                function (failure) {
                  console.log(failure);
                }
              )
            }
          }
        };

        $scope.queryBuilderOptions = {
          columns: [
            { name: 'email', label: 'Email', type: 'text' },
            // See query-builder for why 'id' column has type 'text'
            { name: 'id', label: 'ID', type: 'text' },
            { name: 'created_at', label: 'Created At', type: 'date' },
            // Filter with a non database mapped column.
            // See also app/controllers/admin/users_controller.rb.
            {
              name: 'confirmed?', label: 'Confirmed?', type: 'select',
              options: [
                { label: 'True', value: true },
                { label: 'False', value: false }
              ]
            },
            // Another filter with a non database mapped column
            {
              name: 'role', label: 'Role', type: 'select',
              options: [
                { label: 'Admin', value: 'admin' }
              ]
            }
          ],
          initialColumns: ['email', 'id'],
          onSubmit: function () {
            $scope.dataTableInstance.ajax.reload();
          }
        };
      };

      /**
       * The 'new' action.
       * Builds an empty user for the form.
       */
      $scope.actionNew = function () {
        $scope.user = initialData;
      };

      /**
       * The 'create' action.
       * If there are validation errors on the server side, then populates the
       * 'userErrors' scope variable with these errors.
       */
      $scope.actionCreate = function () {
        $scope.pleaseWaitSvc.request();

        $scope.user.$save(function (response) {
          $scope.pleaseWaitSvc.release();
          flash.set('success', 'User created.');

          $location.path('users');
        }, function (failureResponse) {
          $scope.pleaseWaitSvc.release();
          $scope.userErrors = failureResponse.data.errors;
        });
      };
    }]);
