// Directive for creating attachments that merely reference external URLs, and
// don't require uploading.
angular.module('UrlReferrer', ['Attachment', 'AttachmentLibrarySvc'])
  .directive('urlReferrer', [
    'Attachment', 'AttachmentLibrarySvc',
    function (Attachment, AttachmentLibrarySvc) {
      return {
        restrict: 'E',
        templateUrl: 'shared/directives/url_referrer.html',
        scope: {},

        link: function (scope, element, attrs) {
          scope.url = null;

          /**
           * Creates an attachment using the text entered as the URL.
           */
          scope.createAttachment = function () {
            AttachmentLibrarySvc.setUploadsInProgress(true);

            Attachment.save({}, { url: scope.url }, function (response) {
              scope.url = null;

              AttachmentLibrarySvc.emitUploadSuccessful();
              AttachmentLibrarySvc.setUploadsInProgress(false);
            }, function (failureResponse) {
              AttachmentLibrarySvc.setUploadsInProgress(false);
            });
          };
        }
      }
    }]);
