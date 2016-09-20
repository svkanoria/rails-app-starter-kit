/*
 * A drop-in replacement for the `ng-transclude` directive that replaces the
 * `<... ng-transclude>` element completely, rather than nest the transcluded
 * content within it.
 *
 * Taken largely from Angular's code, with changes made where necessary. See:
 * https://github.com/angular/angular.js/blob/v1.3.20/src/ng/directive/ngTransclude.js
 *
 * Usage:
 *   <!-- In your directive template -->
 *   <ng-transclude-replace></ng-transclude-replace>
 */
angular.module('ngTranscludeReplace', [])
  .directive('ngTranscludeReplace', [
    '$log',
    function ($log) {
      return {
        restrict: 'EAC',

        link: function (scope, element, attrs, controller, transclude) {
          if (!transclude) {
            $log.error('orphan',
              'Illegal use of ngTransclude directive in the template! ' +
              'No parent directive that requires a transclusion found.');

            return;
          }

          transclude(function (clone) {
            if (clone.length) {
              element.replaceWith(clone);
            }
            else {
              element.remove();
            }
          });
        }
      }
    }]);
