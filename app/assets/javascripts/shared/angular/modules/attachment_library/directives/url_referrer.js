// Directive for creating attachments that merely reference external URLs, and
// don't require uploading.
angular.module('UrlReferrer', ['I18n', 'Attachment', 'AttachmentLibrarySvc'])
  .directive('urlReferrer', [
    'I18n', 'Attachment', 'AttachmentLibrarySvc',
    function (I18n, Attachment, AttachmentLibrarySvc) {
      return {
        restrict: 'E',
        templateUrl: 'shared/directives/url_referrer.html',
        scope: {},

        link: function (scope, element, attrs) {
          scope.url = null;

          I18n.t('.enter_a_url', 'url_referrer', 'Enter a URL')
            .then(function(result) {
              scope.enterAUrl = result;
            });

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
