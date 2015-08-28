angular.module('UsersCtrl', ['User'])
  .controller('UsersCtrl', [
    '$scope', '$state', 'flash', 'User', 'initialData',
    function($scope, $state, flash, User, initialData) {
      /**
       * Allowed user roles.
       */
      var USER_ROLE_OPTIONS = [
        { label: 'Admin', value: 'admin' },
        { label: 'Moderator', value: 'moderator' }
      ];

      /**
       * Configuration for the user role Selectize instance.
       */
      var USER_ROLE_SELECTIZE_OPTIONS = {
        options: USER_ROLE_OPTIONS,
        labelField: 'label', valueField: 'value'
      };

      /**
       * The 'list' action.
       */
      $scope.actionList = function () {
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
            { data: 'roles',
              searchable: false, orderable: false,
              render: function (data, type, row, meta) {
                return _.map(data, function (role) {
                  return _.titleize(_.humanize(role));
                }).join(', ')
              }
            },
            { data: 'created_at',
              render: function (data, type, row, meta) {
                return moment(data).format('lll');
              }
            },
            { data: 'confirmed_at',
              render: function (data, type, row, meta) {
                return (data) ? moment(data).format('lll') : 'Pending';
              }
            },
            // An example of bypassing the datatable 'row-ops' functionality,
            // and instead manually setting up some row operations. Why have we
            // done this? To show you its easily possible. Why would you do it?
            // If the standard 'row ops' functionality doesn't support what you
            // want to do.
            //
            // Also see the corresponding Angular view at
            // /app/assets/javascripts/templates/admin/controllers/users/index.html,
            // where a 'row ops' column has been manually added, to accommodate
            // this column definition.
            { // data: 'actions', // Not really required for this column!
              searchable: false, orderable: false,
              className: 'dt-body-center',
              render: function (data, type, row, meta) {
                var editHtml =
                  '<a ui-sref="users.edit({ id: ' + row.id + ' })">'
                    + '<span class="glyphicon glyphicon-pencil"></span>' +
                  '</a>';

                var deleteHtml =
                  '<a ng-click="deleteUser(' + row.id + ')">'
                    + '<span class="glyphicon glyphicon-remove"></span>' +
                  '</a>';

                return editHtml + '&nbsp;' + deleteHtml;
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
              if (!window.confirm('Really delete selected users?')) return;

              $scope.pleaseWaitSvc.request();

              User.batch_destroy({}, { ids: $scope.dataTableSelectedRows },
                function (response) {
                  $scope.pleaseWaitSvc.release();
                  flash.now.set('success', 'Users deleted.');

                  $scope.dataTableInstance.ajax.reload(); // Reload table data
                  $scope.dataTableSelectedRows.length = 0;
                },
                function (failureResponse) {
                  $scope.pleaseWaitSvc.release();
                  flash.now.set('error',
                    failureResponse.data.error || 'Error deleting users.');
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
              selectizeOptions: {
                options: [
                  { label: 'True', value: true },
                  { label: 'False', value: false }
                ]
              }
            },
            // Another filter with a non database mapped column
            {
              name: 'role', label: 'Role', type: 'select',
              selectizeOptions: {
                options: USER_ROLE_OPTIONS
              }
            }
          ],
          initialColumns: ['email', 'id'],
          onSubmit: function () {
            $scope.dataTableInstance.ajax.reload();
          }
        };

        /**
         * Deletes a user.
         *
         * @param {number} userId - The user id to delete.
         */
        $scope.deleteUser = function (userId) {
          if (!window.confirm('Really delete user #' + userId + '?')) return;

          $scope.pleaseWaitSvc.request();
          // When performing an operation on a single row, unselect all rows
          // to avoid any ambiguity about the scope of the operation.
          $scope.dataTableSelectedRows.length = 0;

          User.remove({ userId: userId }, null,
            function (response) {
              $scope.pleaseWaitSvc.release();
              flash.now.set('success', 'User deleted.');

              $scope.dataTableInstance.ajax.reload();
            }, function (failureResponse) {
              $scope.pleaseWaitSvc.release();
              flash.now.set('error',
                failureResponse.data.error || 'Error deleting user.');
            });
        };
      };

      /**
       * The 'new' action.
       * Builds an empty user for the form.
       */
      $scope.actionNew = function () {
        $scope.user = initialData;

        $scope.userRoleSelectizeOptions = USER_ROLE_SELECTIZE_OPTIONS;
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

          $state.go('users.list');
        }, function (failureResponse) {
          $scope.pleaseWaitSvc.release();
          $scope.userErrors = failureResponse.data.errors;
        });
      };

      /**
       * The 'edit' action.
       */
      $scope.actionEdit = function () {
        $scope.user = initialData;

        $scope.userRoleSelectizeOptions = USER_ROLE_SELECTIZE_OPTIONS;
      };

      /**
       * The 'update' action.
       * If there are validation errors on the server side, then populates the
       * 'userErrors' scope variable with these errors.
       */
      $scope.actionUpdate = function () {
        $scope.pleaseWaitSvc.request();

        $scope.user.$update(function (response) {
          $scope.pleaseWaitSvc.release();
          flash.set('success', 'User updated.');

          $state.go('users.list');
        }, function (failureResponse) {
          $scope.pleaseWaitSvc.release();
          $scope.userErrors = failureResponse.data.errors;
        });
      };
    }]);
