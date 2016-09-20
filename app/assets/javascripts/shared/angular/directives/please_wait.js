/*
 * Functionality for showing a 'Please Wait...' indicator.
 * This is useful to show while the user is waiting on something to happen,
 * typically on a response from the server.
 */
angular.module('PleaseWait', [])
  /*
   * The directive that shows/hides the indicator.
   * This directive is provided for convenience. It is not required to use it.
   * You merely need to show/hide an element based on whether the `getCounter`
   * method of `PleaseWaitSvc` is greater than zero or not.
   *
   * Usage:
   *   <please-wait></please-wait>
   */
  .directive('pleaseWait', [
    'PleaseWaitSvc',
    function (PleaseWaitSvc) {
      return {
        restrict: 'E',
        templateUrl: 'shared/directives/please_wait.html',
        scope: {},

        link: function (scope, element, attrs) {
          scope.pleaseWaitSvc = PleaseWaitSvc;
        }
      };
    }])

  /*
   * A service backing the `please-wait` directive.
   *
   * Usage:
   *   To ask for the 'Please Wait...' indicator to be shown, invoke the
   *   `request` method.
   *
   *   When you no longer need the indicator to be shown, invoke the `release`
   *   method.
   *
   *   To ensure the indicator is hidden, invoke the `releaseAll` method.
   */
  .factory('PleaseWaitSvc', [
    '$timeout',
    function ($timeout) {
      var counter = 0;
      var timeout = null;
      var counterIncrement = 1;

      var request = function () {
        if (timeout) {
          ++counterIncrement;
        } else {
          timeout = $timeout(function () {
            counter += counterIncrement;
            counterIncrement = 1;
            timeout = null;
          }, 500);
        }
      };

      var release = function () {
        if (timeout) {
          $timeout.cancel(timeout);
          timeout = null;
        } else if (counter > 0) {
          --counter;
        }
      };

      var releaseAll = function () {
        if (timeout) {
          $timeout.cancel(timeout);
          timeout = null;
        }

        counter = 0;
      };

      var getCounter = function () {
        return counter;
      };

      return {
        request: request,
        release: release,
        releaseAll: releaseAll,
        getCounter: getCounter
      };
    }]);
