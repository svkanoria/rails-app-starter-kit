/*
 * The brains behind the attachment-library directive.
 */
angular.module('AttachmentLibrarySvc', []).
  factory('AttachmentLibrarySvc', [
    function () {
      var displayMode = 'progress';

      /**
       * Gets the display mode.
       *
       * @returns {string} The display mode.
       */
      var getDisplayMode = function () {
        return displayMode;
      };

      /**
       * Set the display mode.
       *
       * @param displayMode_ - The display mode (show, hide or progress).
       */
      var setDisplayMode = function (displayMode_) {
        displayMode = displayMode_;
      };

      // Return the service object
      return {
        getDisplayMode: getDisplayMode,
        setDisplayMode: setDisplayMode
      };
    }]);
