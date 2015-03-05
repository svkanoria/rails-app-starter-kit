/*
 * The directive for creating a graphical query builder.
 *
 * Usage:
 *   <query-builder options="Object expr"
 *                  filters="Object expr">
 *   </query-builder>
 *
 * The 'options' attribute must be as follows:
 *   {
 *     columns: [
 *       { name: 'some-name', type: 'some-type' },
 *         :
 *     ],
 *     ?onSubmit: function () {
 *       // Generally, submit the created filter to the server
 *     }
 *   }
 *
 * All and only HTML5 input types can be used as column types.
 * Normally, it is best to use 'text' as it is the most flexible, and we won't
 * really care about validation.
 *
 * Presently we do not support custom operators. However, we will do so in the
 * future.
 * TODO Support custom operators
 *
 * The 'filters' attribute must be as follows:
 *   [
 *     { column: 'some-column-name', values: [val1, ...], op: 'some-op' },
 *       :
 *   ]
 *
 * This attribute holds the current filters applied (represented as JSON), and
 * also serves to restore filters from some saved state. At the very least, it
 * must be an empty array.
 */
angular.module('QueryBuilderDirective', []).
  directive('queryBuilder', [
    function () {
      return {
        restrict: 'E',
        templateUrl: 'shared/directives/query_builder.html',
        replace: true,
        require: 'form',

        scope: {
          options: '=',
          filters: '='
        },

        link: function (scope, element, attrs, form) {
          // For use in the template
          scope.form = form;

          // Dummy id for ng-repeat to track by
          var nextFilterId = 0;

          /**
           * Adds a filter.
           */
          scope.addFilter = function () {
            scope.filters.push({
              _id: nextFilterId++,
              column: scope.options.columns[0].name

              // Let qb-filter decide what to set as 'values' and 'op'
            });

            form.$setDirty();
          };

          /**
           * Removes the filter at an index.
           *
           * @param {Number} index - The index of the filter to remove.
           */
          scope.removeFilter = function (index) {
            scope.filters.splice(index, 1);

            form.$setDirty();
          };

          /**
           * Merely calls the 'options.onSubmit' callback, if provided.
           *
           * The callback must do the real work of using the created filter to
           * display some data.
           */
          scope.submit = function () {
            if (scope.options.onSubmit) {
              scope.options.onSubmit();
            }

            form.$setPristine();
          };
        }
      };
    }]);
