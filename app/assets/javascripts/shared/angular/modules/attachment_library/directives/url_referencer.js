// Directive for creating attachments that reference external URLs.
angular.module('UrlReferencer', ['AttachmentLibrarySvc'])
  .directive('urlReferencer', [
    'AttachmentLibrarySvc',
    function (AttachmentLibrarySvc) {
      return {
        restrict: 'E',
        templateUrl: 'shared/directives/url_referencer.html',

        scope: {
          options: '='
        },

        link: function (scope, element, attrs) {

        }
      }
    }]);
