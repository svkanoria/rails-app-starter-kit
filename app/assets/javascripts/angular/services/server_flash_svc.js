// Service to convert server flash messages to flashular flash messages.
angular.module('ServerFlashSvc', []).
  factory('ServerFlashSvc', ['flash', function (flash) {
    /**
     * A map of server flash properties to flashular flash properties, only in
     * the case of mismatches.
     */
    var propMap = {
      'notice': 'success',
      'alert': 'error'
    };

    /**
     * Converts server flash messages to flashular flash messages, for instant
     * display.
     */
    var convert = function () {
      for (prop in ServerFlash) {
        // We set flash instead of flash.now, since the router will trigger a
        // route change and cause flashular to purge flash.now and replace it
        // with the contents of flash anyway.
        flash.set(propMap[prop] || prop, ServerFlash[prop]);
      }

      ServerFlash = {}; // Clear the server flash
    };

    // Return the service object
    return {
      convert: convert
    }
  }]);
