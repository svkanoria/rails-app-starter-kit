/*
 * The directive for a single filter in a query-builder.
 */
angular.module('QBFilter', []).
  directive('qbFilter', [
    function () {
      return {
        restrict: 'E',
        templateUrl: 'shared/directives/qb_filter.html',

        scope: {
          qbOptions: '=', // The options passed to query-builder
          model: '='
        },

        link: function (scope, element, attrs) {
          var DEFAULT_OPS = ['=', '<', '<=', '>=', '>', 'like'];

          // The operators to show (user specified, otherwise default)
          scope.ops = scope.qbOptions.ops || DEFAULT_OPS;

          if (!scope.model.values) {
            scope.model.values = [];
          }

          if (!scope.model.op) {
            scope.model.op = scope.ops[0];
          }
        }
      };
    }]);