/*
 * A directive for the Selectize jQuery plugin.
 * See http://brianreavis.github.io/selectize.js/.
 *
 * Usage: ('!' indicates the attribute is watched for changes)
 *   <selectize ?options="Object expr"
 *              ?skip-translation="boolean expr"
 *              !ng-model="Object expr">
 *   </selectize>
 *
 *   Translations for option labels can be provided via translation ids
 *   following format: 'selectize.[elem-name.]opt-value', where
 *   * elem-name = the `name` attribute on the `selectize` element (optional)
 *   * opt-value = the contents of the value field of the option (required)
 *
 *   It is possible to override the translation id, either partially or fully,
 *   on a per-option basis, by specifying a `translation_id` property within an
 *   option entry. If the value of the property begins with a '.', it replaces
 *   only the 'opt-value' portion, otherwise it overrides it completely.
 *
 *   This directive only looks for translations for options provided up-front.
 *   Those loaded asynchronously from the server are ignored. This makes sense,
 *   because the server can easily respond with localized (when it makes sense)
 *   results.
 *
 *   In some cases, such as if you have a large number of options up-front, or
 *   do not need localization at all, you can prevent the performance overhead
 *   that comes with translation, by specifying the property
 *   `skip-translation="true"`.
 */
angular.module('Selectize', ['I18n'])
  .directive('selectize', [
    'I18n',
    function (I18n) {
      /**
       * Returns whether the model, when massaged (converted to an array of
       * strings), is item-wise equal to the selected items as exposed by the
       * Selectize API.
       *
       * @param {string[]} items - The array of selected items, as exposed by
       *   the `items` property of the Selectize API.
       * @param {Object|Object[]} model - The model as given to the `ng-model`
       *   attribute.
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
          options: '<?',
          skipTranslation: '<?',
          ngModel: '='
        },

        link: function (scope, element, attrs, ngModel) {
          var options = scope.options || {};
          var origOnChange = options.onChange;
          var selectize;

          options.onChange = function () {
            if (!looselyEqual(selectize.items, scope.ngModel)) {
              var value = angular.copy(selectize.items);

              ngModel.$setViewValue(value);
            }

            if (origOnChange) origOnChange.apply(this, arguments);
          };

          ngModel.$parsers.push(function (viewValue) {
            return (options.maxItems === 1) ? viewValue[0] : viewValue;
          });

          ngModel.$formatters.push(function (modelValue) {
            return (options.maxItems === 1) ? [modelValue] : modelValue;
          });

          var translationPath = 'selectize';
          if ('name' in attrs) translationPath += '.' + attrs.name;
          
          I18n.ts({
            items: options.options,
            idExtractor: '.' + (options.valueField || 'value'),
            translationPath: translationPath,
            skipTranslation: scope.skipTranslation,
            success: function (entry, result) {
              entry[options.labelField || 'label'] = result;
            }
          }).then(function () {
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
          });
        }
      }
    }
  ]);
