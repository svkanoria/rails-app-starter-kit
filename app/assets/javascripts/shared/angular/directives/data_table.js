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
 *          ?selected-rows="Empty array expr">
 *     :
 *   </table>
 *
 * The 'instance' expression is populated with the underlying 'raw' data table.
 * This exposes all of the DataTables functionality to the controller, but
 * should be used with care!
 *
 * The 'selected-rows' expression, when provided, enables row selection, and is
 * populated with the currently selected rows. Row selection has certain
 * requirements: see 'addRowSelectionUI' documentation below.
 */
angular.module('DataTable', [])
  .directive('datatable', [
    function () {
      /**
       * Adds a 'row selection' checkbox column to the data table.
       * To do so, it manipulates
       * 1. The HTML
       * 2. The options passed into the scope
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

        // Persist selections across paging, sorting and filtering operations

        var origRowCallback = options.rowCallback;

        /**
         * Called back by the data table when a row is drawn.
         * For argument details, see
         * https://datatables.net/reference/option/rowCallback.
         */
        function rowCallback (row, data, index) {
          var rowId = data.DT_RowId.toString();

          if (_.indexOf(selectedRows, rowId) !== -1) {
            $(row).addClass('selected');
            $(row).find('.select-row').prop('checked', true);
          }

          if (origRowCallback) origRowCallback(row, data, index);
        }

        options.rowCallback = rowCallback;

        // Toggle row selection when the checkbox in the newly added column is
        // clicked. Also add 'select all' logic.

        var selectAllCheckbox = $(element).find('.select-all-rows');

        $(element).on('click', '.select-row', function () {
          var row = $(this).closest('tr');
          var rowId = row.attr('id');
          var index = _.indexOf(selectedRows, rowId);

          if (index === -1) {
            $(row).addClass('selected');
            updateSelectAllCheckbox();

            // Note use of '$applyAsync' vs '$apply'.
            // This is an optimization, as it queues up the push statements to
            // be all executed within the same digest cycle.
            scope.$applyAsync(selectedRows.push(rowId));
          } else {
            $(row).removeClass('selected');
            selectAllCheckbox.prop('checked', false);

            scope.$applyAsync(selectedRows.splice(index, 1));
          }
        });

        selectAllCheckbox.on('click', function () {
          var checked = $(this).is(':checked');
          var selectorSuffix = (checked) ? ':not(:checked)' : ':checked';

          $(element).find('.select-row' + selectorSuffix).trigger('click');
        });

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

          if (scope.instance !== undefined) {
            scope.instance = instance;
          }
        }
      };
    }]);
