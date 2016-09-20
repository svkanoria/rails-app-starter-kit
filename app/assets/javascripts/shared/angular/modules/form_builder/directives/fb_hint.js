/*
 * A directive for providing an input hint within an `fb-field`.
 *
 * For usage instructions, see the `fb-field` directive. This is not meant for
 * use independent of `fb-field`.
 */
angular.module('FBHint', [])
  .directive('fbHint', [
    function () {
      return {
        restrict: 'E',
        require: '?^fbErrors',
        templateUrl: 'shared/directives/fb_hint.html',
        transclude: true,

        link: function (scope, element, attrs) {
        }
      }
    }]);
