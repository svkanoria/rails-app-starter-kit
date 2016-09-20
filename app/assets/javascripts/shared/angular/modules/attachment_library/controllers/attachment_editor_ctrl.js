// Controller powering the attachment editor modal.
angular.module('AttachmentEditorCtrl', ['Flash', 'RouteUtils', 'Attachment',
  'AttachmentLibrarySvc'])
  .controller('AttachmentEditorCtrl', [
    '$scope', '$element', '$rootScope', 'Flash', 'NavConfirmationSvc',
    'Attachment', 'AttachmentLibrarySvc', 'attachment', 'close',
    function ($scope, $element, $rootScope, Flash, NavConfirmationSvc,
              Attachment, AttachmentLibrarySvc, attachment, close) {

      // Make a copy, so that the original data is left alone
      $scope.attachment = new Attachment(angular.copy(attachment));

      /**
       * Closes the editor modal.
       */
      $scope.close = function () {
        $element.modal('hide');
        NavConfirmationSvc.setConfirmNav(false);

        close(null, 500); // Close, but give 500ms for Bootstrap to animate
      };

      /**
       * Saves changes and if successful closes the editor modal, else shows
       * form field validation errors preventing success.
       */
      $scope.updateAndClose = function () {
        $scope.attachment.$update(function (response) {
          $scope.close();
          Flash.now.push('success', 'Attachment renamed.');

          AttachmentLibrarySvc.emitAttachmentUpdated($scope.attachment);
        }, function (failureResponse) {
          $scope.attachmentErrors = failureResponse.data.errors;
        });
      };

      // Close the modal if the user navigates away.
      // Calling `$scope.close()` caused an exception, probably because some
      // promise initiated by angular-modal-service could not be resolved once
      // the current controller was "unloaded". However, trial and error shows
      // that leaving out `close(null, ...)` seems to work fine.
      // TODO Hide any open modals automatically if the user navigates away
      $rootScope.$on('$stateChangeSuccess', function () {
        $element.modal('hide');
        NavConfirmationSvc.setConfirmNav(false);
      });
    }]);
