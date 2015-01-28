/*
 * A directive for jQuery DataTables.
 * See http://datatables.net/.
 * Note the slight aberration in the name of the directive. Ideally, it should
 * be 'data-table', but because of the special treatment of 'data-' attributes
 * in HTML, we have named it 'datatable'.
 *
 * Usage:
 *   <table datatable
 *          ?options="Object expr">
 *     :
 *   </table>
 */
angular.module('DataTable', []).
  directive('datatable', [function () {
    return {
      restrict: 'A',

      scope: {
        options: '='
      },

      link: function (scope, element, attrs) {
        $(element).DataTable(scope.options || {});
      }
    };
  }]);
