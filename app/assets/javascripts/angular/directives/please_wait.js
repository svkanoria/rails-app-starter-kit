/*
 * Functionality for showing any custom 'Please Wait...' message.
 * This is useful to show while the user is waiting on something to happen,
 * typically on a response from the server.
 */
angular.module('PleaseWait', []).
  /*
   * The directive that shows/hides the custom message.
   * This directive is provided for convenience. It is not required to use it.
   * You merely need to show/hide an element based on whether the 'getCounter'
   * method of 'PleaseWaitSvc' is greater than zero or not.
   *
   * Usage:
   *   <div please-wait>
   *     Custom HTML message
   *   </div>
   */
  directive('pleaseWait', ['PleaseWaitSvc', function (PleaseWaitSvc) {
    return {
      restrict: 'E',
      templateUrl: 'directives/please_wait.html',
      transclude: true,
      scope: {},

      link: function (scope, element, attrs) {
        scope.pleaseWaitSvc = PleaseWaitSvc;
      }
    }
  }]).
  /*
   * A service backing the 'please-wait' directive.
   *
   * Usage:
   *   To ask for the custom 'Please Wait...' message to be shown, invoke the
   *   'request' method.
   *
   *   When you no longer need the message to be displayed, call the 'release'
   *   method.
   */
  factory('PleaseWaitSvc', function () {
    var counter = 0;

    var request = function () {
      ++counter;
    };

    var release = function () {
      --counter;
    };

    var getCounter = function () {
      return counter;
    };

    return {
      request: request,
      release: release,
      getCounter: getCounter
    };
  });
