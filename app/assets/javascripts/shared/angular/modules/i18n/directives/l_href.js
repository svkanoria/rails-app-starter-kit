/*
 * A directive for localizing URLs.
 *
 * For more information, see the documentation for the `l` method in
 * `I18nProvider`.
 *
 * Usage:
 *   <a l-href="some/:locale/izable/url">...</a>
 */
angular.module('LHref', ['I18n'])
  .directive('lHref', [
    'I18n',
    function (I18n) {
      return {
        restrict: 'A',

        link: function (scope, element, attrs) {
          attrs.$observe('lHref', function (url) {
            var localizedUrl = I18n.l(url);

            $(element).attr('href', localizedUrl);
          });
        }
      };
    }]);
