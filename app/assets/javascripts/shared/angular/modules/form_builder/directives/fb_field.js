/*
 * A directive for easily creating a form field.
 *
 * Integrates automatically with the 'fb-errors' directive (which integrates
 * Angular forms with server-side validation).
 *
 * Usage:
 *   <form ?fb-errors="Object expr" ...>
 *     <fb-field ?type="{{String expr}}"
 *               ?label="{{String expr}}"
 *               ?hint="{{String expr}}"
 *               ?required="Boolean expr"
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
 *   mechanism's HTML must be explicitly provided nested within the <fb-field>
 *   tags. The two are mutually exclusive. If providing nested HTML, be sure to
 *   set the 'name' attribute on any Angular input elements (even select etc.)
 *   within, for any corresponding 'fb-errors' errors to display correctly.
 * * If no label is specified, it is inferred from the ng-model path provided
 * * A hint can be given via either the 'hint' attribute, or an <fb-hint> tag.
 *   Only the latter can contain HTML. The two are mutually exclusive.
 */
angular.module('FBField', [])
  .directive('fbField', [
    function () {
      return {
        restrict: 'E',
        require: '?^fbErrors',
        templateUrl: 'shared/directives/fb_field.html',
        transclude: true,

        scope: {
          type: '@',
          label: '@',
          hint: '@',
          required: '=',
          ngModel: '='
        },

        link: function (scope, element, attrs, fbErrors) {
          var path = attrs.ngModel;
          scope.name = path.split('.')[1];

          scope.$watchGroup(['label', 'required'], function (values) {
            scope.adjLabel = values[0] || _.humanize(scope.name);

            if (values[1]) scope.adjLabel += '*';
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
