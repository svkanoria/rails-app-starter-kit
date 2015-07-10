/*
 * A directive for jQuery DataTables.
 * See http://datatables.net/.
 * Note the slight aberration in the name of the directive. Ideally, it should
 * be 'data-table', but because of the special treatment of 'data-' attributes
 * in HTML, we have named it 'datatable'.
 *
 * Usage:
 *   <table datatable
 *          ?options="Object expr",
 *          ?instance="Empty expr"
 *          ?selected-rows="Array expr"
 *          ?bulk-ops="Object expr">
 *     :
 *   </table>
 *
 * The 'instance' expression is populated with the underlying 'raw' data table.
 * This exposes all of the DataTables functionality to the controller, but
 * should be used with care!
 *
 * The 'selected-rows' expression, when provided, enables row selection, and is
 * 2-way bound with the currently selected rows. Row selection has certain
 * requirements: see 'addRowSelectionUI' documentation below.
 *
 * Custom bulk operations on all selected rows can be defined and performed via
 * the 'bulk-ops' attribute. The format is as follows:
 *
 *   {
 *     bulkOpKey1: {
 *       name: 'some name',
 *       action: function () { // Perform some action... }
 *     },
 *     bulkOpKey2: { ... },
 *      :
 *   }
 */
angular.module('DataTable', [])
  .directive('datatable', [
    '$compile',
    function ($compile) {
      /**
       * Adds a 'row selection' checkbox column to the data table.
       * To do so, it manipulates
       * 1. The HTML
       * 1. The options passed into the scope
       *
       * IMPORTANT: This column is added at index 0, which means all other
       * columns are shifted right by 1. This will impact any options that rely
       * on column indices!
       *
       * @param {Object} scope - The scope passed to the link function.
       * @param {Object} element - The element passed to the link function.
       */
      function addRowSelectionUI (scope, element) {
        var options = scope.options;

        // Prepend a checkbox column to the table HTML

        var th =
          '<th class="dt-head-center">'
            + '<input type="checkbox" class="select-all-rows">' +
          '</th>';

        element.find('thead > tr').prepend(th);
        element.find('tfoot > tr').prepend(th);

        // Add a corresponding checkbox column to the data table options

        var cbColumnDef = {
          searchable: false,
          orderable: false,
          className: 'dt-body-center',
          render: function (data, type, full, meta) {
            return '<input type="checkbox" class="select-row">';
          }
        };

        if (options.columns) {
          options.columns.unshift(cbColumnDef);
        } else if (options.columnDefs) {
          options.columnDefs.unshift(_.extend(cbColumnDef, { targets: 0 }));
        }

        // By default, DataTables performs an initial sort on the first column,
        // which in our case will now be the checkbox column. Hence we shift
        // the initial sort to the right by 1.
        if (!options.order) {
          options.order = [[1, 'asc']];
        }
      }

      /**
       * Adds all logic required for selecting rows.
       * Supports both client- and server-side processing.
       *
       * Be aware that:
       * 1. The server must set the DT_RowId property on the rows it returns
       * 1. Selections persist across paging, sorting and filtering operations
       * 1. The 'select all' checkbox in the table header only targets currently
       *    visible rows.
       *
       * @param {Object} scope - The scope passed to the link function.
       * @param {Object} element - The element passed to the link function.
       */
      function addRowSelectionLogic (scope, element) {
        var options = scope.options;
        var selectedRows = scope.selectedRows;
        var selectAllCheckbox = $(element).find('.select-all-rows');

        /**
         * Mark a row as selected/un-selected on screen.
         *
         * @param {Object|string|number} rowOrId - The row or row id.
         * @param {boolean} selected - Whether to mark selected or un-selected.
         */
        function setRowSelectedUI (rowOrId, selected) {
          var row = (_.isString(rowOrId) || _.isNumber(rowOrId))
            ? $(element).find('#' + rowOrId)
            : rowOrId;

          if (row) {
            if (selected) {
              $(row).addClass('selected');
              $(row).find('.select-row').prop('checked', true);
            } else {
              $(row).removeClass('selected');
              $(row).find('.select-row').prop('checked', false);
            }
          }
        }

        /**
         * Checks/Un-checks the 'select all' checkbox, depending on whether all
         * visible rows are currently selected or not.
         */
        function updateSelectAllCheckbox () {
          var unselectedRows = $(element).find('.select-row:not(:checked)');

          if (unselectedRows.length == 0) {
            selectAllCheckbox.prop('checked', true);
          } else {
            selectAllCheckbox.prop('checked', false)
          }
        }

        // Select/Un-select row when the prepended checkbox column is clicked

        $(element).on('click', '.select-row', function () {
          var row = $(this).closest('tr');
          var rowId = row.attr('id');
          var index = _.indexOf(selectedRows, rowId);

          if (index === -1) {
            selectedRows.push(rowId);
          } else {
            selectedRows.splice(index, 1);
          }

          scope.$apply();
        });

        selectAllCheckbox.on('click', function () {
          var rows = $(element).find('tbody > tr');

          if ($(this).prop('checked')) {
            rows.each(function () {
              var index = _.indexOf(selectedRows, $(this).attr('id'));

              if (index === -1) {
                selectedRows.push($(this).attr('id'));
              }
            });
          } else {
            rows.each(function () {
              var index = _.indexOf(selectedRows, $(this).attr('id'));

              if (index !== -1) {
                selectedRows.splice(index, 1);
              }
            });
          }

          scope.$apply();
        });

        scope.$watch('selectedRows', function (value) {
          var rows = $(element).find('tbody > tr');

          rows.each (function () {
            setRowSelectedUI($(this).attr('id'), false);
          });

          $.each(value, function (index, value) {
            setRowSelectedUI(value, true);
          });

          updateSelectAllCheckbox();
        }, true);

        // Persist selections across paging, sorting and filtering operations

        var origRowCallback = options.rowCallback;

        /**
         * Called back by the data table before a row is drawn.
         * For argument details, see
         * https://datatables.net/reference/option/rowCallback.
         */
        function rowCallback (row, data, index) {
          var rowId = data.DT_RowId.toString();

          if (_.indexOf(selectedRows, rowId) !== -1) {
            setRowSelectedUI(row, true);
          }

          if (origRowCallback) origRowCallback(row, data, index);
        }

        options.rowCallback = rowCallback;

        var origDrawCallback = options.drawCallback;

        /**
         * Called back by the data table every time it performs a draw.
         * For argument details, see
         * https://datatables.net/reference/option/drawCallback.
         */
        function drawCallback (settings) {
          updateSelectAllCheckbox();

          if (origDrawCallback) origDrawCallback(settings);
        }

        options.drawCallback = drawCallback;
      }

      /**
       * Adds a bulk selection toolbar near the top of the data table.
       * Must be called AFTER the data table has been initialized.
       *
       * @param {Object} scope - The scope passed to the link function.
       * @param {Object} element - The element passed to the link function.
       * @param {Object} attrs - The attributes passed to the link function.
       */
      function addBulkSelectionToolbar (scope, element, attrs) {
        var bulkOps = attrs.bulkOps || {};

        // Add the 'Un-select All' operation of our own accord
        bulkOps.unSelectAll = {
          name: 'Un-select All',
          action: function () { scope.selectedRows.length = 0; }
        };

        /**
         * Perform a bulk operation (if found) defined within 'scope.bulkOps',
         * on all currently selected rows.
         *
         * @param bulkOpKey - The key of the operation in the 'scope.bulkOps'
         *   hash.
         */
        scope.performBulkOp = function (bulkOpKey) {
          var bulkOp = bulkOps[bulkOpKey];

          if (bulkOp) bulkOp.action();
        };

        var bulkOpsDiv =
          $('<div class="bulk-ops" ng-show="selectedRows.length > 0"></div>');

        for (var bulkOpKey in bulkOps) {
          var bulkOp = bulkOps[bulkOpKey];

          var bulkOpHtml =
            '<a href="" ng-click="performBulkOp(\'' + bulkOpKey + '\')">'
              + bulkOp.name + '</a>';

          bulkOpsDiv.append($(bulkOpHtml));
        }

        var bulkSelectionDiv =
          $('<div class="dataTables_bulk-selection"'
                + 'id="' + $(element).attr('id') + '">'
              + 'Total {{selectedRows.length}} rows selected'
              + bulkOpsDiv[0].outerHTML +
            '</div>');

        var lengthDiv = $(element).siblings('.dataTables_length');

        lengthDiv.after(bulkSelectionDiv);

        $compile(bulkSelectionDiv)(scope);
      }

      return {
        restrict: 'A',

        scope: {
          options: '=',
          instance: '=',
          selectedRows: '='
        },

        link: function (scope, element, attrs) {
          scope.selectedAll = false;

          if (scope.selectedRows !== undefined) {
            addRowSelectionUI(scope, element);
            addRowSelectionLogic(scope, element);
          }

          var instance = $(element).DataTable(scope.options || {});

          if (scope.selectedRows !== undefined) {
            addBulkSelectionToolbar(scope, element, attrs);
          }

          if (scope.instance !== undefined) {
            scope.instance = instance;
          }
        }
      };
    }]);
