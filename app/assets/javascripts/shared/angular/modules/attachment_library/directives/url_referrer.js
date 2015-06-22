// Directive for creating attachments that merely reference external URLs, and
// don't require uploading.
angular.module('UrlReferrer', ['AttachmentLibrarySvc'])
  .directive('urlReferrer', [
    'AttachmentLibrarySvc',
    function (AttachmentLibrarySvc) {
      return {
        restrict: 'E',
        templateUrl: 'shared/directives/url_referrer.html',

        scope: {
          options: '='
        },

        link: function (scope, element, attrs) {
          console.log(scope.options);
        }
      }
    }]);
