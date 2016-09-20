/*
 * A directive for easily creating a form field.
 *
 * Integrates automatically with the `fb-errors` directive (which integrates
 * Angular forms with server-side validation).
 *
 * Usage: ('!' indicates the attribute is watched for changes)
 *   <form ?fb-errors="Object expr" ...>
 *     <fb-field ?type="{{String expr}}"
 *               !?label="{{String expr}}"
 *               !?label-translation-id="{{String expr}}"
 *               !?hint="{{String expr}}"
 *               !?hint-translation-id="{{String expr}}"
 *               !?required="Boolean expr"
 *               ng-model="Object expr">
 *
 *       <?some-input-mechanism-html ...>
 *       <?fb-hint>
 *         Some hint (hints provided via the 'hint' attr cannot contain HTML,
 *         but these can!)
 *       </fb-hint>
 *     </fb-field>
 *
 * * The type can be any valid HTML input type. If none specified, the input
 *   mechanism's HTML must be explicitly provided nested within the `fb-field`
 *   tags. The two are mutually exclusive. If providing nested HTML, be sure to
 *   set the `name` attribute on any Angular input elements (even `select` etc.)
 *   within, for any corresponding `fb-errors` errors to display correctly.
 *
 * * If no label is specified, it is inferred in the following order:
 *   * By looking up the 'forms.[form-name.].labels.field-name' translation id,
 *     where
 *     * form-name = the `name` attribute on the `form` element (optional)
 *     * field-name = the `name` attribute on the input element (required)
 *   * By deducing it directly from the `ngModel` path provided
 *
 * * A hint can be optionally specified using the following three methods:
 *   * Via a value for the 'forms.[form-name.].hints.field-name' translation id
 *     (HTML is allowed!)
 *   * As text (no HTML allowed!) via the `hint` attribute, as shown above. This
 *     also acts as the default hint if the above translation is not provided.
 *   * As text (HTML is allowed!) within a nested `fb-hint` directive, as shown
 *     above
 *     
 *  It is possible to override the label/hint translation id, either partially
 *  or fully, by specifying a `(label/hint)-translation-id` attribute. If the
 *  value of the attribute begins with a '.', it replaces only the 'field-name'
 *  portion, otherwise it overrides it completely.
 */
angular.module('FBField', ['I18n'])
  .directive('fbField', [
    '$q', 'I18n',
    function ($q, I18n) {
      return {
        restrict: 'E',
        require: '?^fbErrors',
        templateUrl: 'shared/directives/fb_field.html',
        transclude: true,

        scope: {
          type: '@',
          label: '@',
          labelTranslationId: '@',
          hint: '@',
          hintTranslationId: '@',
          required: '<?',
          ngModel: '='
        },

        link: function (scope, element, attrs, fbErrors) {
          var path = attrs.ngModel;
          scope.name = path.split('.')[1];

          var formName = $(element).closest('form').attr('name');
          var translationPath = 'forms';
          if (formName) translationPath += '.' + formName;

          scope.$watchGroup(['label', 'labelTranslationId', 'required'],
            function (values) {
              I18n.t(
                values[1] || '.' + scope.name,
                translationPath + '.labels',
                values[0] || _.humanize(scope.name)
              ).then(function (result) {
                scope.adjLabel = result;

                if (values[2]) scope.adjLabel += '*';
              });
          });

          scope.$watchGroup(['hint', 'hintTranslationId'],
            function (values) {
              I18n.t(
                values[1] || '.' + scope.name,
                translationPath + '.hints',
                values[0]
              ).then(function (result) {
                scope.adjHint = result;
              });
          });

          function onErrorsUpdated (errors) {
            scope.errors = errors;
          }

          if (fbErrors) {
            fbErrors.addListener(scope.name, onErrorsUpdated);
          }

          scope.$on('$destroy', function () {
            fbErrors.removeListener(scope.name, onErrorsUpdated);
          });
        }
      };
    }]);
