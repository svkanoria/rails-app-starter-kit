// FineUploader based uploader for attachment library.
angular.module('FineUploader', []).
  directive('fineUploader', [
    function () {
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
            .on('complete', function(event, id) {
              var fileElement = $(this).fineUploaderS3('getItemByFileId', id);

              fileElement.delay(2000).slideUp({
                duration: 100,
                always: function () {
                  fileElement.remove();
                }
              });
            });
        }
      };
    }
  ]);
