/*
 * The directive for a single filter in a query-builder.
 */
angular.module('QBFilter', []).
  directive('qbFilter', [
    '$compile',
    function ($compile) {
      return {
        restrict: 'E',
        templateUrl: 'shared/directives/qb_filter.html',

        scope: {
          qbOptions: '=', // The options passed to query-builder
          model: '='
        },

        link: function (scope, element, attrs) {
          //////////////////
          // Helper Stuff //
          //////////////////

          /**
           * Returns the column type (by looking it up in qbOptions), given a
           * column name.
           *
           * @param columnName {string} - A column name.
           *
           * @returns {?string} The column type, or null if no such column is
           * found.
           */
          function getColumnType (columnName) {
            for (var i = 0; i < scope.qbOptions.columns.length; ++i) {
              var column = scope.qbOptions.columns[i];

              if (column.name === columnName) {
                return column.type;
              }
            }

            return null;
          }

          /**
           * Sets the value editor, based on the type of the column selected.
           *
           * @param [columnType='text'] {string} - A column type.
           */
          function setEditor (columnType) {
            var input = '<input type="' + (columnType || 'text') +
              '" class="filter-value" ng-model="model.values[0]">';

            var el = $compile(input)(scope);

            $(element).find('.filter-values').html(el);
          }

          /**
           * Default comparison operators.
           */
          var DEFAULT_OPS = ['=', '<', '<=', '>=', '>', 'like'];

          //////////////////////
          // Procedural Stuff //
          //////////////////////

          // The operators to show (user specified, otherwise default)
          scope.ops = scope.qbOptions.ops || DEFAULT_OPS;

          if (!scope.model.values) {
            scope.model.values = [];
          }

          if (!scope.model.op) {
            scope.model.op = scope.ops[0];
          }

          scope.$watch('model.column', function (value) {
            if (value) {
              setEditor(getColumnType(value));
            }
          });
        }
      };
    }]);