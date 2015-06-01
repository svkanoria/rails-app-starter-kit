// The service behind the attachment-library directive.
angular.module('AttachmentLibrarySvc', [])
  .factory('AttachmentLibrarySvc', [
    '$rootScope',
    function ($rootScope) {
      var visible = false;
      var minimized = true;
      var uploadsInProgress = false;
      var alertCount = 0;

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
       * Gets whether there are any uploads currently in progress.
       *
       * @returns {boolean} Whether uploads are in progress or not.
       */
      var getUploadsInProgress = function () {
        return uploadsInProgress;
      };

      /**
       * Sets whether there are any uploads currently in progress.
       *
       * Must be called by the uploader directive.
       *
       * @param {boolean} value - Whether uploads are in progress or not.
       */
      var setUploadsInProgress = function (value) {
        uploadsInProgress = value;
      };

      /**
       * Gets the number of alerts pending user action.
       *
       * @returns {number}
       */
      var getAlertCount = function () {
        return alertCount;
      };

      /**
       * Increments the number of alerts pending user action.
       *
       * Must be called whenever there is an alert (usually from the uploader)
       * that is pending user action. In case of any such alerts, the library
       * remains partially visible even when set otherwise.
       *
       * @param {number} delta - A positive or negative number.
       */
      var incrementAlertCount = function (delta) {
        alertCount += delta;
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
        getUploadsInProgress: getUploadsInProgress,
        setUploadsInProgress: setUploadsInProgress,
        getAlertCount: getAlertCount,
        incrementAlertCount: incrementAlertCount,
        emitUploadSuccessful: emitUploadSuccessful
      };
    }])

  // Initialization
  .run([
    '$rootScope', 'AttachmentLibrarySvc',
    function ($rootScope, AttachmentLibrarySvc) {
      // Hide by default.
      // To force show the library in some view, the view's controller should
      // call setVisible(true).
      $rootScope.$on('$routeChangeStart', function () {
        AttachmentLibrarySvc.setVisible(false);
      });
    }]);
