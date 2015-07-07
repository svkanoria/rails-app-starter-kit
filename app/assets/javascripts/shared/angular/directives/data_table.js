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
 *          ?instance="Empty expr">
 *     :
 *   </table>
 *
 * The 'instance' expression is populated with the underlying 'raw' data table.
 * This exposes all of the DataTables functionality to the controller, but
 * should be used with care!
 */
angular.module('DataTable', [])
  .directive('datatable', [
    function () {
      /**
       * Adds a 'row selection' column to the data table.
       * To do so, it manipulates both the HTML, as well as the options passed
       * into the scope.
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

        var checkboxColumnDef = {
          searchable: false,
          orderable: false,
          className: 'dt-body-center',
          render: function (data, type, full, meta) {
            return '<input type="checkbox" class="select-row">';
          }
        };

        var columnDefs = options.columnDefs;

        if (options.columns) {
          options.columns.unshift(checkboxColumnDef);
        } else if (columnDefs) {
          columnDefs.unshift(_.extend(checkboxColumnDef, { targets: 0 }));
        }

        // Adjust predefined column defs to accommodate the prepended checkbox
        // column.
        if (columnDefs) {
          for (var i = 0; i < columnDefs.length; ++i) {
            columnDefs[i].targets += 1;
          }
        }

        // Adjust initial column sorting to accommodate the prepended checkbox
        // column.

        var order = options.order;

        if (order && order.length > 0) {
          for (var i = 0; i < order.length; ++i) {
            order[i][0] += 1;
          }
        } else {
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

        // Persist selections across paging, sorting and filtering operations

        var origRowCallback = options.rowCallback;

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
            selectedRows.push(rowId);
          } else {
            $(row).removeClass('selected');
            selectedRows.splice(index, 1);
            selectAllCheckbox.prop('checked', false);
          }
        });

        selectAllCheckbox.on('click', function () {
          var checked = $(this).is(':checked');
          var selectorSuffix = (checked) ? ':not(:checked)' : ':checked';

          $(element).find('.select-row' + selectorSuffix).trigger('click');
        });

        var origDrawCallback = options.drawCallback;

        function drawCallback (settings) {
          var unselectedRows = $(element).find('.select-row:not(:checked)');

          if (unselectedRows.length == 0) {
            selectAllCheckbox.prop('checked', true);
          } else {
            selectAllCheckbox.prop('checked', false)
          }

          if (origDrawCallback) origDrawCallback(settings);
        }

        options.drawCallback = drawCallback;
      }

      return {
        restrict: 'A',

        scope: {
          options: '=',
          instance: '='
        },

        link: function (scope, element, attrs) {
          scope.selectedAll = false;
          scope.selectedRows = [];

          addRowSelectionUI(scope, element);
          addRowSelectionLogic(scope, element);

          var instance = $(element).DataTable(scope.options || {});

          if (scope.instance !== undefined) {
            scope.instance = instance;
          }
        }
      };
    }]);
