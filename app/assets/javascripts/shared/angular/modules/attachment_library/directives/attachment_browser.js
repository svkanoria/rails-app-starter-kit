angular.module('AttachmentBrowser', ['QueryBuilder', 'DataTable']).
  directive('attachmentBrowser', [
    function () {
      return {
        restrict: 'E',
        templateUrl: 'shared/directives/attachment_browser.html',
        replace: true,

        scope: {},

        link: {
          // The various options for the child directives (query-builder and
          // datatable) must be set during pre-link. By post-link, it will be
          // too late, as the children will be linked already.
          pre: function (scope, element, attrs) {
            scope.dataTableOptions = {
              serverSide: true,
              ajax: {
                url: '/attachments.json',
                data: function (d) {
                  // Add the following to all AJAX requests:
                  // The URL column (for rendering the name as a link)
                  d.columns.push({ data: 'url' });
                  // The query builder filters (for advanced result filtering)
                  d.filters = scope.queryBuilderFilters;
                }
              },
              searching: false, // Since we are using query builder
              processing: true, // Show the 'processing' indicator
              columns: [
                { data: 'id' },
                { data: 'name',
                  render: function (data, type, row, meta) {
                    return '<a href="' + row.url + '" target="_blank">' + data +
                      '</a>';
                  }
                },
                { data: 'created_at' }
              ],
              // Ensure table element has an id for this to work!
              stateSave: true,
              // Save/load the query builder state along with the table state
              stateSaveParams: function (settings, data) {
                data.filters = scope.queryBuilderFilters;
              },
              stateLoadParams: function (settings, data) {
                scope.queryBuilderFilters = data.filters;
              }
            };

            // The 'raw' data table instance.
            // This is populated by the 'datatable' directive.
            scope.dataTableInstance = null;

            scope.queryBuilderOptions = {
              columns: [
                { name: 'name', type: 'text' },
                // See query-builder for why 'id' column has type 'text'
                { name: 'id', type: 'text' },
                { name: 'created_at', type: 'date' }
              ],
              onSubmit: function () {
                scope.dataTableInstance.ajax.reload(); // Reload the data table
              }
            };
          }
        }
      };
    }]);
