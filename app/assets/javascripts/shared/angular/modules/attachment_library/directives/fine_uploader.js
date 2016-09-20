// FineUploader based uploader for attachment library.
angular.module('FineUploader', ['AttachmentLibrarySvc'])
  .directive('fineUploader', [
    'AttachmentLibrarySvc',
    function (AttachmentLibrarySvc) {
      return {
        restrict: 'E',
        templateUrl: 'shared/directives/fine_uploader.html',
        replace: true,

        scope: {
          options: '<'
        },

        link: function (scope, element, attrs) {
          //////////////////
          // Helper Stuff //
          //////////////////

          //All statuses that qualify an upload as 'idle'
          var IDLE_STATUSES = [
            qq.status.UPLOAD_FAILED, qq.status.UPLOAD_SUCCESSFUL,
            qq.status.CANCELED, qq.status.REJECTED, qq.status.DELETED,
            qq.status.DELETE_FAILED];

          /**
           * Returns the number of uploads in progress (i.e. not idle).
           *
           * @returns {number}
           */
          function uploadsInProgress () {
            var allUploads = $(element).fineUploader('getUploads');

            var idleUploads = $(element).fineUploader('getUploads', {
              status: IDLE_STATUSES
            });

            return allUploads.length - idleUploads.length;
          }

          //////////////////////
          // Procedural Stuff //
          //////////////////////

          $(element)
            .fineUploaderS3(scope.options)
            .on('submit', function (id, name) {
              AttachmentLibrarySvc.incrementAlertCount(1);
              AttachmentLibrarySvc.setUploadsInProgress(true);
              scope.$apply();
            })
            // Enable user to hide the progress bar when done
            .on('complete', function (event, id, name, responseJSON) {
              var fileElement = $(this).fineUploaderS3('getItemByFileId', id);

              var hideFileElement = fileElement.find('.dismiss-progress-bar');

              hideFileElement.css('display', 'inline');

              hideFileElement.on('click', function (event) {
                event.preventDefault();

                fileElement.slideUp({
                  duration: 100,
                  always: function () {
                    fileElement.remove();
                    AttachmentLibrarySvc.incrementAlertCount(-1);
                    scope.$apply();
                  }
                });
              });

              if (responseJSON.success) {
                AttachmentLibrarySvc.emitUploadSuccessful();
              }
            })
            .on('allComplete', function () {
              AttachmentLibrarySvc.setUploadsInProgress(false);
              scope.$apply();
            })
            // 'complete' (and sometimes even 'allComplete') is not fired when
            // an upload is cancelled, so we must handle this case separately.
            .on('cancel', function () {
              // Since cancelled upload alerts are removed automatically
              AttachmentLibrarySvc.incrementAlertCount(-1);

              // Note the comparison against 1, and not 0. This is because the
              // just-cancelled upload has not yet marked as 'canceled' by
              // FineUploader.
              if (uploadsInProgress() <= 1) {
                AttachmentLibrarySvc.setUploadsInProgress(false);
              }

              scope.$apply();
            });

          // Hide the 'Upload' button when in alert-only mode
          scope.$watch(AttachmentLibrarySvc.getVisible, function (visible) {
            var uploadButtonElement =
              $(element).find('.qq-upload-button-selector');

            if (visible) {
              uploadButtonElement.show();
            } else {
              uploadButtonElement.hide();
            }
          });
        }
      };
    }
  ]);
