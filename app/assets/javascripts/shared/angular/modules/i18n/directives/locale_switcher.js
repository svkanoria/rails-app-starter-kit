/*
 * Locale switcher directive.
 *
 * Usage:
 *   // Within a Bootstrap nav bar, as follows:
 *   <nav class="nav-bar..." ...>
 *      :
 *     <li>
 *       <locale-switcher><locale-switcher>
 *     </li>
 *      :
 *   </nav>
 *
 * The locale switcher is a link that causes a modal to open up, with all
 * available locale options. Clicking on an option redirects to a URL that
 * conducts the locale switch. By default, clicking navigates directly to the
 * new locale. However, you might have your own workflow for conducting the
 * switch - such as have the server do some stuff like updating the user's
 * preferred locale. This is easily possible to do. See the documentation for
 * `I18n.setLocaleSwitcherUrlBuilder` for details.
 */
angular.module('LocaleSwitcher', ['I18n', 'angularModalService'])
  .directive('localeSwitcher', [
    'I18n', 'ModalService',
    function (I18n, ModalService) {
      return {
        restrict: 'E',
        templateUrl: 'shared/directives/locale_switcher.html',
        replace: true,
        scope: {},

        link: function (scope, element, attrs) {
          scope.currentLocaleName =
            I18n.getAvailableLocales()[I18n.getLocale()].name;

          scope.showModal = function () {
            ModalService.showModal({
              templateUrl: 'shared/directives/locale_switcher_modal.html',
              controller: 'LocaleSwitcherModalCtrl'
            }).then(function (modal) {
              // It's a Bootstrap element, use `modal` to show it
              modal.element.modal();
            });
          };
        }
      };
    }])

  // Locale switcher modal controller
  .controller('LocaleSwitcherModalCtrl', [
    '$scope', '$element', '$location', 'I18n', 'close',
    function ($scope, $element, $location, I18n, close) {
      $scope.availableLocales = I18n.getAvailableLocales();

      $scope.relocalizeCurrentUrl = function (newLocale) {
        var delocalizedUrl = I18n.dl($location.absUrl(), $location.url());
        var relocalizedUrl = I18n.l(delocalizedUrl, newLocale);

        var localeSwitchUrlBuilder = I18n.getLocaleSwitchUrlBuilder();
        
        return (localeSwitchUrlBuilder)
          ? localeSwitchUrlBuilder(newLocale, relocalizedUrl)
          : relocalizedUrl;
      };

      $scope.close = function () {
        $element.modal('hide');

        close(null, 500); // Close, but give 500ms for Bootstrap to animate
      };
    }]);
