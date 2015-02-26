/*
 * The directive for creating a graphical query builder.
 */
angular.module('QueryBuilderDirective', []).
  directive('queryBuilder', [
    function () {
      return {
        restrict: 'E',
        templateUrl: 'shared/directives/query_builder.html',

        scope: {
          options: '=',
          filters: '='
        },

        link: function (scope, element, attrs) {
          var DEFAULT_OPS = ['=', '<', '<=', '>=', '>', 'like'];

          // The operators to show (user specified, otherwise default)
          scope.ops = scope.options.ops || DEFAULT_OPS;

          /**
           * Adds a filter.
           */
          scope.addFilter = function () {
            scope.filters.push({
              column: scope.options.columns[0].name,
              values: [],
              op: scope.ops[0]
            });
          };

          /**
           * Removes the filter at an index.
           *
           * @param {Number} index - The index of the filter to remove.
           */
          scope.removeFilter = function (index) {
            scope.filters.splice(index, 1);
          };
        }
      };
    }]);
