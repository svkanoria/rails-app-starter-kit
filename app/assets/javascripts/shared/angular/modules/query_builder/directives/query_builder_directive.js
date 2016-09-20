/*
 * The directive for creating a graphical query builder.
 *
 * Usage:
 *   <query-builder options="Object expr"
 *                  filters="Object expr">
 *   </query-builder>
 *
 * The `options` attribute must be as follows:
 *
 *   {
 *     columns: [
 *       { name: 'some-name', label: 'some-label', type: 'some-type' },
 *         :
 *     ],
 *     ?initialColumns: [ 'some-name', ... ], // Seed filters
 *     ?onSubmit: function () {
 *       // Generally, submit the created filter to the server
 *     }
 *   }
 *
 * All and only HTML5 input types can be used as column types, even 'select'.
 * Normally it is best to use 'text', as it is the most flexible, and we won't
 * really care about validation.
 *
 * For columns of type 'select', we use the excellent Selectize jQuery plugin
 * instead of the standard, rather basic HTML select. In the column definition,
 * you must provide a `selectizeOptions` property, containing at a minimum the
 * the options available for selection:
 *
 *   selectizeOptions: {
 *     options: [{ label: 'something', value: something }, ...],
 *       :
 *   }
 *
 * `selectizeOptions` can contain ANY option that Selectize accepts. This lets
 * you configure Selectize on a per column basis, to exactly suit your needs.
 * See http://selectize.github.io/selectize.js/ for more information.
 *
 * By default, our implementation of Selectize looks for translations for all
 * options provided up-front (see the selectize directive docs for a detailed
 * understanding). If you do not need or want this to happen, you can skip the
 * performance overhead that comes with translation, by providing the following
 * property in the column definition:
 *
 *   selectizeSkipTranslation: true
 *
 * Presently we do not support custom operators. However, we will do so in
 * future.
 * TODO Support custom operators
 *
 * The `filters` attribute must be as follows:
 *   [
 *     { column: 'some-column-name', values: [val1, ...], op: 'some-op' },
 *       :
 *   ]
 *
 * This attribute holds the current filters applied (represented as JSON), and
 * also serves to restore filters from some saved state. At the very least, it
 * must be an empty array.
 */
angular.module('QueryBuilderDirective', ['I18n'])
  .directive('queryBuilder', [
    '$q', 'I18n',
    function ($q, I18n) {
      return {
        restrict: 'E',
        templateUrl: 'shared/directives/query_builder.html',
        replace: true,
        require: ['queryBuilder', 'form'],
        controller: 'QueryBuilderCtrl',

        scope: {
          options: '<',
          filters: '<'
        },

        link: function (scope, element, attrs, ctrls) {
          var queryBuilder = ctrls[0];
          var form = ctrls[1];
          
          scope.translationComplete = false;

          function translateItems (items, translationPath) {
            return I18n.ts({
              items: items,
              idExtractor: '.name',
              translationPath: translationPath,
              success: function (item, result) {
                item.label = result;
              }
            });
          }

          var promise1 = translateItems(scope.options.columns,
            'query_builder.columns');

          var promise2 = translateItems(queryBuilder.defaultOps,
            'query_builder.operators');

          $q.all([promise1, promise2]).then(function () {
            scope.translationComplete = true;
          });

          // For use in the template
          scope.form = form;

          if (!scope.filters) {
            scope.filters = [];
          }

          // Dummy id for `ng-repeat` to track by
          var nextFilterId = 0;

          if (scope.filters.length > 0) {
            var usedIds = _.map(scope.filters, function (filter) {
              return filter._id;
            });

            nextFilterId = _.max(usedIds) + 1;
          }

          /**
           * Adds a filter.
           *
           * @param {string} [column] - The initial column to choose, if any.
           */
          scope.addFilter = function (column) {
            scope.filters.push({
              _id: nextFilterId++,
              column: column || scope.options.columns[0].name

              // Let `qb-filter` decide what to set as `values` and `op`
            });

            form.$setDirty();
          };

          /**
           * Removes the filter at an index.
           *
           * @param {number} index - The index of the filter to remove.
           */
          scope.removeFilter = function (index) {
            scope.filters.splice(index, 1);

            form.$setDirty();
          };

          /**
           * Merely calls the `options.onSubmit` callback, if provided.
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

          // Add seed filters (if any and if necessary)
          if (scope.filters.length === 0) {
            var initialColumns = scope.options.initialColumns;

            if (initialColumns) {
              for (var i = 0; i < initialColumns.length; ++i) {
                scope.addFilter(initialColumns[i]);
              }
            }
          }
        }
      };
    }])

  .controller('QueryBuilderCtrl', [
    function () {
      // Default comparison operators
      this.defaultOps = [
        { name: 'contains', label: 'contains' },
        { name: '=', label: '=' },
        { name: '<', label: '<' },
        { name: '<=', label: '<=' },
        { name: '>', label: '>' },
        { name: '>=', label: '>=' },
        { name: 'range', label: 'range' }
      ];
    }]);
