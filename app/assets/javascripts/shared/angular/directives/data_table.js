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
      return {
        restrict: 'A',

        scope: {
          options: '=',
          instance: '='
        },

        link: function (scope, element, attrs) {
          var instance = $(element).DataTable(scope.options || {});

          if (scope.instance !== undefined) {
            scope.instance = instance;
          }
        }
      };
    }]);
