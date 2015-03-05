/*
 * The directive for a single filter in a query-builder.
 */
angular.module('QBFilter', ['QBEditorProvider']).
  directive('qbFilter', [
    '$compile', 'QBEditor',
    function ($compile, QBEditor) {
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

          // Default comparison operators
          var DEFAULT_OPS = ['=', '<', '<=', '>', '>=', 'contains', 'range'];

          // For caching editor values by 'column-name;op'.
          // Used to pre-populate editors for user friendliness.
          var editorCache = {};

          /**
           * Returns the column type (from qbOptions), given its name.
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
           * Sets the value editor, based on:
           * * The type of the column selected
           * * The operator selected
           *
           * @param [columnType='text'] {string} - A column type.
           * @param op {string} - An operator.
           */
          function setEditor (columnType, op) {
            var editorContainer = $(element).find('.filter-values');

            editorContainer.html('');

            var editorHtml = QBEditor.getEditorHtml(columnType, op);
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

          // The operators to show.
          // For now, we just show the default ops. Later, we will have to add
          // some code for determining which ops to show.
          // TODO Support custom operators
          scope.ops = DEFAULT_OPS;

          if (!scope.model.values) {
            scope.model.values = [];
          }

          if (!scope.model.op) {
            scope.model.op = scope.ops[0];
          }

          scope.$watch('[model.column, model.op]',
            function (newValue, oldValue) {
              if (oldValue[0] && oldValue[1]) {
                // Cache the value of the editor going out
                editorCache[oldValue[0]] = scope.model.values;
              }

              if (newValue[0] && newValue[1]) {
                // Load the value for the editor coming in
                scope.model.values = editorCache[newValue[0]] || [];

                setEditor(getColumnType(newValue[0]), newValue[1]);
              }
            }, true);
        }
      };
    }]);
