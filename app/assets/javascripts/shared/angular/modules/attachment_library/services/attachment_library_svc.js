/*
 * The service behind the attachment-library directive.
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
       * In 'progress' mode, only uploads in progress (if any) are shown, and
       * nothing else.
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
    }]).

  // Initialization
  run([
    '$rootScope', 'AttachmentLibrarySvc',
    function ($rootScope, AttachmentLibrarySvc) {
      // By default, show iff any uploads are in progress.
      // To show or hide completely in any view, the view's controller should
      // set the display mode explicitly, to 'show' or 'hide'.
      $rootScope.$on('$routeChangeStart', function () {
        AttachmentLibrarySvc.setDisplayMode('progress');
      });
    }]);
