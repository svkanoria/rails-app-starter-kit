/*
 * Locale switcher component.
 *
 * Usage:
 *   // Within a Bootstrap nav bar, as follows:
 *   <nav class="nav-bar..." ...>
 *      :
 *     <locale-switcher><locale-switcher>
 *      :
 *   </nav>
 */
angular.module('LocaleSwitcher', ['I18n', 'angularModalService'])
  .component('localeSwitcher', {
    templateUrl: 'shared/directives/locale_switcher.html',
    controller: 'LocaleSwitcherCtrl'
  })

  // Component controller
  .controller('LocaleSwitcherCtrl', [
    'I18n', 'ModalService',
    function (I18n, ModalService) {
      this.currentLocaleName =
        I18n.getAvailableLocales()[I18n.getLocale()].name;

      this.showModal = function () {
        ModalService.showModal({
          templateUrl: 'shared/directives/locale_switcher_modal.html',
          controller: 'LocaleSwitcherModalCtrl'
        }).then(function(modal) {
          // It's a Bootstrap element, use `modal` to show it
          modal.element.modal();
        });
      }
    }])

  // Locale switcher modal controller
  .controller('LocaleSwitcherModalCtrl', [
    '$scope', '$element', '$location', 'I18n', 'close',
    function ($scope, $element, $location, I18n, close) {
      $scope.availableLocales = I18n.getAvailableLocales();

      $scope.relocalizeCurrentUrl = function (locale) {
        var currentAbsUrl = $location.absUrl();
        var currentLocale = I18n.getLocale();
        var endLocaleRegExp = new RegExp('/' + currentLocale + '$');
        var midLocaleRegExp = new RegExp('/' + currentLocale + '/');
        var newUrl = null;

        if (endLocaleRegExp.test(currentAbsUrl)) {
          newUrl = currentAbsUrl.replace(endLocaleRegExp, '/:locale');
        } else if (midLocaleRegExp.test(currentAbsUrl)) {
          newUrl = currentAbsUrl.replace(midLocaleRegExp, '/:locale/');
        } else {
          var currentUrl = $location.url();
          var localeAddIndex = currentAbsUrl.length - currentUrl.length;

          newUrl = _.insert(currentAbsUrl, localeAddIndex, '/:locale');
        }

        return I18n.l(newUrl, locale);
      };

      $scope.close = function () {
        $element.modal('hide');

        close(null, 500); // Close, but give 500ms for Bootstrap to animate
      };
    }]);
