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
      /**
       * Returns whether the model, when massaged (converted to an array of
       * strings), is item-wise equal to the selected items as exposed by the
       * Selectize API.
       *
       * @param items {string[]} - The array of selected items, as exposed by
       * the 'items' property of the Selectize API.
       * @param model {object|object[]} - The model as given to the 'ng-model'
       * attribute.
       *
       * @returns {true|false}
       */
      function looselyEqual (items, model) {
        var adjModel = null;

        if (!model) {
          adjModel = [];
        } else if (Array.isArray(model)) {
          adjModel = model;
        } else {
          adjModel = [model];
        }

        adjModel = _.map(adjModel, function (i) { return i.toString(); });

        return angular.equals(items, adjModel);
      }

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

          ngModel.$parsers.push(function (viewValue) {
            return (options.maxItems === 1) ? viewValue[0] : viewValue;
          });

          ngModel.$formatters.push(function (modelValue) {
            return (options.maxItems === 1) ? [modelValue] : modelValue;
          });

          var origOnChange = options.onChange;

          options.onChange = function () {
            if (!looselyEqual(selectize.items, scope.ngModel)) {
              var value = angular.copy(selectize.items);

              ngModel.$setViewValue(value);
            }

            if (origOnChange) origOnChange.apply(this, arguments);
          };

          $(element).selectize(options);
          selectize = element[0].selectize;

          // To play well with Bootstrap forms
          $(element).next('.selectize-control').find('.selectize-input')
            .addClass('form-control');

          scope.$watchCollection('ngModel', function (value) {
            if (!looselyEqual(selectize.items, value)) {
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
