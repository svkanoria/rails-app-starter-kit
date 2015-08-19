/*
 * A directive for the Selectize jQuery plugin.
 * See http://brianreavis.github.io/selectize.js/.
 *
 * Usage:
 *   <selectize ?options="Object expr"
 *              ng-model="Object expr">
 *   </selectize>
 */
angular.module('Selectize', [])
  .directive('selectize', [
    function () {
      return {
        restrict: 'EA',
        require: '^ngModel',

        scope: {
          options: '=?',
          ngModel: '='
        },

        link: function (scope, element, attrs, ngModel) {
          var options = scope.options || {};

          var selectize;

          var origOnChange = options.onChange;

          options.onChange = function () {
            if (!angular.equals(selectize.items, scope.ngModel)) {
              var value = angular.copy(selectize.items);

              ngModel.$setViewValue(value);
            }

            if (origOnChange) origOnChange.apply(this, arguments);
          };

          $(element).selectize(options);
          selectize = element[0].selectize;

          scope.$watchCollection('ngModel', function (value) {
            if (!angular.equals(selectize.items, value)) {
              selectize.setValue(value);
            }
          });

          element.on('$destroy', function () {
            if (selectize) {
              selectize.destroy();
              element = null;
            }
          });
        }
      }
    }
  ]);
