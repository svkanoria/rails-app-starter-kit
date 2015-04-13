// The service behind the attachment-library directive.
angular.module('AttachmentLibrarySvc', []).
  factory('AttachmentLibrarySvc', [
    '$rootScope',
    function ($rootScope) {
      var visible = false;
      var minimized = false;

      /**
       * Gets visibility.
       *
       * See also the documentation for setVisible.
       *
       * @returns {boolean} Whether visible or not.
       */
      var getVisible = function () {
        return visible;
      };

      /**
       * Sets visibility.
       *
       * The invisibility is 'weak', in the sense that if there are uploads
       * pending or progress alerts unacknowledged, these will continue to be
       * visible.
       *
       * @param {boolean} value - Whether visible or not.
       */
      var setVisible = function (value) {
        visible = value;
      };

      /**
       * Gets whether minimized.
       *
       * @returns {boolean} Whether minimized or not.
       */
      var getMinimized = function () {
        return minimized;
      };

      /**
       * Toggles whether minimized.
       */
      var toggleMinimized = function () {
        minimized = !minimized;
      };

      /**
       * Emits the 'attachment_library.upload_successful' event on $rootScope
       * to announce a successful upload.
       *
       * Listeners such as the attachment browser, can then update themselves
       * accordingly.
       *
       * Must be called by the uploader directive.
       */
      var emitUploadSuccessful = function () {
        $rootScope.$emit('attachment_library.upload_successful');
      };

      // Return the service object
      return {
        getVisible: getVisible,
        setVisible: setVisible,
        getMinimized: getMinimized,
        toggleMinimized: toggleMinimized,
        emitUploadSuccessful: emitUploadSuccessful
      };
    }]).

  // Initialization
  run([
    '$rootScope', 'AttachmentLibrarySvc',
    function ($rootScope, AttachmentLibrarySvc) {
      // Hide by default.
      // To force show the library in some view, the view's controller should
      // call setVisible(true).
      $rootScope.$on('$routeChangeStart', function () {
        AttachmentLibrarySvc.setVisible(false);
      });
    }]);
