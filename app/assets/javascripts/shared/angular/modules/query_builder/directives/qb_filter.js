// The directive for a single filter in a `query-builder`.
angular.module('QBFilter', ['QBEditorProvider'])
  .directive('qbFilter', [
    '$compile', 'QBEditor',
    function ($compile, QBEditor) {
      return {
        restrict: 'E',
        require: '^queryBuilder',
        templateUrl: 'shared/directives/qb_filter.html',

        scope: {
          qbOptions: '<', // The options passed to `query-builder`
          model: '='
        },

        link: function (scope, element, attrs, queryBuilder) {
          //////////////////
          // Helper Stuff //
          //////////////////

          // Column type based refinements to `DEFAULT_OPS`.
          // Add more rules as and when more column types are supported.
          var ALLOWED_OPS = {
            date: { except: ['contains'] },
            select: { only: ['='] }
          };

          // For preserving editor values across filter operator changes
          var editorCache = {};

          /**
           * Returns a column from `qbOptions`, given its name.
           *
           * @param {string} columnName - A column name.
           *
           * @returns {Object} The column.
           *
           * @throws An error if no column found by the given name.
           */
          function getColumn (columnName) {
            var column =
              _.findWhere(scope.qbOptions.columns, { name: columnName });

            if (column) {
              return column;
            } else {
              throw 'Column ' + columnName + ' not found';
            }
          }

          /**
           * Returns a list of allowed operators, given a column type.
           *
           * @param {string} columnType - A column type.
           *
           * @returns {string[]} The array of allowed operators, or the entire
           *   `DEFAULT_OPS` if no refinement rules have been specified via
           *   `ALLOWED_OPS`.
           */
          function getAllowedOps (columnType) {
            var rules = ALLOWED_OPS[columnType];

            if (rules) {
              if (rules.only) {
                return _.filter(queryBuilder.defaultOps, function (op) {
                  return _.contains(rules.only, op.name);
                });
              } else if (rules.except) {
                return _.filter(queryBuilder.defaultOps, function (op) {
                  return !_.contains(rules.except, op.name);
                });
              }
            }

            return queryBuilder.defaultOps;
          }

          /**
           * Sets the value editor, based on:
           * * The column (from `qbOptions`) selected
           * * The operator selected
           *
           * @param {Object} column - A column.
           * @param {string} op - An operator.
           */
          function setEditor (column, op) {
            var editorContainer = $(element).find('.filter-values');

            editorContainer.html('');

            var editorHtml = QBEditor.getEditorHtml(column, op);
            editorContainer.html(editorHtml);

            // Note: We compile the control AFTER inserting into the DOM. This
            // way the control registers itself with the parent form, which is
            // required for the various form states ('$dirty' etc.) and
            // validation to work.
            $compile(editorContainer.contents())(scope);
          }

          //////////////////////
          // Procedural Stuff //
          //////////////////////

          scope.ops = queryBuilder.defaultOps;

          if (!scope.model.values) {
            scope.model.values = [];
          }

          scope.$watch('model.column', function (value) {
            var ops = getAllowedOps(getColumn(value).type);

            // If the new ops list does not contain the currently selected op,
            // un-select the current op, else `ngOptions` acts up!
            if (scope.model.op && !_.findWhere(ops, { name: scope.model.op })) {
              scope.model.op = null;
            }

            scope.ops = ops;

            if (!scope.model.op) {
              scope.model.op = scope.ops[0].name;
            }
          });

          scope.$watch('[model.column, model.op]',
            function (newValue, oldValue) {
              if (oldValue[0] && oldValue[1]) {
                // Cache the value of the editor going out
                editorCache[oldValue[0]] = scope.model.values;
              }

              if (newValue[0] && newValue[1]) {
                // Expose this filter's `qbOptions` column on the scope, for
                // editors to use if they require (for example, for the list of
                // options for a `select` tag).
                scope.column = getColumn(newValue[0]);

                // Load the value for the editor coming in
                scope.model.values = editorCache[newValue[0]] || [];

                setEditor(scope.column, newValue[1]);
              }
            }, true);
        }
      };
    }]);
