// FineUploader based uploader for attachment library.
angular.module('FineUploader', ['AttachmentLibrarySvc']).
  directive('fineUploader', [
    'AttachmentLibrarySvc',
    function (AttachmentLibrarySvc) {
      return {
        restrict: 'E',
        templateUrl: 'shared/directives/fine_uploader.html',
        replace: true,

        scope: {
          options: '='
        },

        link: function (scope, element, attrs) {
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
            // 'complete' is not fired when an upload is cancelled, so we must
            // handle this case separately.
            .on('cancel', function () {
              AttachmentLibrarySvc.incrementAlertCount(-1);

              // 'allComplete' is not fired when there are all and only
              // cancellations. However, we do know that cancelled upload alerts
              // are removed immediately. So all cancellation => no alerts =>
              // no uploads in progress!
              if (AttachmentLibrarySvc.getAlertCount() == 0) {
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
