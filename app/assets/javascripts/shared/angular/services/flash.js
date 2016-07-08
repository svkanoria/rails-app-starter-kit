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
 * The flash message can be a HTML (although still supplied as a string), and
 * even better, can contain Angular directives! Any directives are compiled in
 * the same scope as the 'flash-alert' directive used to render the message.
 */
angular.module('Flash', [])
  .factory('Flash', [
    '$rootScope',
    function ($rootScope) {
      function Flash () {
        var items = [];

        this.getItems = function () {
          return items;
        };

        this.push = function (key, value) {
          items.push({ key: key, value: value });
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
        // ServerFlash global variable), into the flash.
        if (ServerFlash) {
          for (var key in ServerFlash) {
            flash.push(FLASH_KEY_MAP[key] || key, ServerFlash[key]);
          }
        }

        if (!args.redirectTo) { // To preserve flash across redirects
          flash.now.clear();
          flash.now.concat(flash.getItems());
          flash.clear();

          if (ServerFlash) {
            ServerFlash = null;
          }
        }
      });

      // Returns the service object, which in this case, it very neatly the
      // the Flash object itself.
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
