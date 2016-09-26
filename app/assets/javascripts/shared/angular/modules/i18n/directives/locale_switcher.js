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

        return I18n.l(delocalizedUrl, newLocale);
      };

      $scope.close = function () {
        $element.modal('hide');

        close(null, 500); // Close, but give 500ms for Bootstrap to animate
      };
    }]);
