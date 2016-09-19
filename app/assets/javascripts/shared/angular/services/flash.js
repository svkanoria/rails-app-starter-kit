/*
 * Flash service (similar to the Rails flash).
 *
 * Usage:
 *   // Display a flash message at the next state/route/location change
 *   // (depending on which routing library is being used)
 *   Flash.push('some-Bootstrap-alert-context', 'some-text-or-HTML-msg');
 *
 *   // Display a flash message now
 *   Flash.now.push('some-Bootstrap-alert-context', 'some-text-or-HTML-msg');
 *
 *   // Display a *localized* flash message at the next state/route/location
 *   // change. Looks up a translation for 'some_translation_id', and if not
 *   // found, falls back on 'some-fallback-text-or-HTML'.
 *   Flash.push('some-Bootstrap-alert-context', 'some-fallback-text-or-HTML',
 *     'some_translation_id');
 *
 *   // Display a *localized* flash message at the next state/route/location
 *   // change. Looks up a translation for 'flash.some_translation_id' (note
 *   // that if the translation id starts with a '.', it is first prefixed with
 *   // 'flash' to obtain an "absolute" id.
 *   Flash.push('some-Bootstrap-alert-context', 'some-fallback-text-or-HTML',
 *     '.some_translation_id');
 *
 *   // Similarly, localization is available for `Flash.now`.
 *
 * The flash message can be HTML (although still supplied as a string), and
 * better still, can contain Angular directives! Any directives are compiled in
 * the same scope as the `flash-alert` directive used to render the message.
 */
angular.module('Flash', ['I18n'])
  .factory('Flash', [
    '$rootScope', '$timeout', 'I18n',
    function ($rootScope, $timeout, I18n) {
      function Flash () {
        var items = [];

        this.getItems = function () {
          return items;
        };

        /**
         * Pushes a {key, value} into the flash.
         * Beware that it keeps only the most recent item!
         * TODO Remove hard-coded Angular flash message limit
         *
         * If a `translationId` is supplied, then a translation retrieval is
         * attempted via angular-translate's `$translate` service. If the id
         * starts with a '.', it is prefixed with the string 'flash' to obtain
         * an "absolute" id first. `value` is then used as the fallback in case
         * no translation is found.
         *
         * @param {string} key - The key to insert.
         * @param {string} value - The value to insert.
         * @param {string} [translationId] - The translation id.
         */
        this.push = function (key, value, translationId) {
          var adjValue = null;

          I18n.t(translationId, 'flash', value).then(function (result) {
            adjValue = result;
          }, function (rejection) {
            adjValue = rejection || value;
          })['finally'](function () {
            if (items.length === 1) {
              $timeout(function () {
                items.shift();
              }, 300);
            }

            items.push({ key: key, value: adjValue });
          });
        };

        this.concat = function (itemArray) {
          items = [].concat(itemArray);
        };

        this.removeAt = function (index) {
          items.splice(index, 1);
        };

        this.clear = function () {
          items = [];
        };
      }

      function isModuleLoaded (moduleName) {
        try {
          angular.module(moduleName);
        } catch (e) {
          return false;
        }

        return true;
      }

      var eventName = null;

      if (isModuleLoaded('ngRoute')) {
        eventName = '$routeChangeSuccess';
      } else if (isModuleLoaded('ui.router')) {
        eventName = '$stateChangeSuccess';
      } else {
        eventName = '$locationChangeSuccess';
      }

      var flash = new Flash();
      flash.now = new Flash();

      // Maps Rails flash keys to Bootstrap alert types
      var FLASH_KEY_MAP = { notice: 'success', alert: 'danger' };

      $rootScope.$on(eventName, function (event, args) {
        // Push any server side flash messages (available through the
        // `Static.server_flash` global variable property), into the flash.
        if (Static.server_flash) {
          for (var key in Static.server_flash) {
            flash.now.push(FLASH_KEY_MAP[key] || key, Static.server_flash[key]);
          }
        }

        if (!args.redirectTo) { // To preserve flash across redirects
          flash.now.clear();
          flash.now.concat(flash.getItems());
          flash.clear();

          if (Static.server_flash) {
            Static.server_flash = null;
          }
        }
      });

      // Returns the service object, which in this case, is very neatly the
      // `Flash` object itself.
      return flash;
    }])

  // Helper directive for rendering a flash message.
  .directive('flashAlert', [
    '$compile',
    function ($compile) {
      return {
        restrict: 'A',

        scope: {
          flashAlert: '@'
        },

        link: function (scope, element, attrs) {
          scope.$watch('flashAlert', function (value) {
            if (value) {
              var wrappedValue = '<span>' + value + '</span>';
              // Allow directives within flash messages
              var compiledValue = $compile(wrappedValue)(scope);
              $(element).html(compiledValue);
            }
          })
        }
      };
    }])

  // The directive for rendering all flash messages.
  .directive('flashAlerts', [
    'Flash',
    function (Flash) {
      return {
        restrict: 'E',
        templateUrl: 'shared/directives/flash_alerts.html',
        replace: true,

        link: function (scope, element, attrs) {
          scope.flash = Flash.now;

          scope.$watch('flash.getItems()', function (value) {
            scope.flashItems = value;
          });
        }
      };
    }]);
