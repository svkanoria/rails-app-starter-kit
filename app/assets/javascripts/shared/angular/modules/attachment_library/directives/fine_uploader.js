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
            // Hide the progress bar when complete
            .on('complete', function(event, id, name, responseJSON) {
              var fileElement = $(this).fineUploaderS3('getItemByFileId', id);

              var hideFileElement = fileElement.find('.dismiss-progress-bar');

              hideFileElement.css('display', 'inline');

              hideFileElement.on('click', function (event) {
                event.preventDefault();

                fileElement.slideUp({
                  duration: 100,
                  always: function () {
                    fileElement.remove();
                  }
                });
              });

              if (responseJSON.success) {
                AttachmentLibrarySvc.emitUploadSuccessful();
              }
            });

          // Hide the 'Upload' button unless in 'show' mode
          scope.$watch(AttachmentLibrarySvc.getDisplayMode, function (value) {
            var uploadButtonElement =
              $(element).find('.qq-upload-button-selector');

            if (value === 'show') {
              uploadButtonElement.show();
            } else {
              uploadButtonElement.hide();
            }
          });
        }
      };
    }
  ]);
