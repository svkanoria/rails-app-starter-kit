/*
 * The attachment library directive.
 *
 * Usage:
 *   <attachment-library uploader-options="Object expr">
 *   </attachment-library>
 *
 * The uploader options are passed to the uploader directive.
 * We provide one uploader (which we then use by default): The 'fine-uploader'
 * directive. However, you can create you own if you wish.
 *
 * To create your own uploader, refer to fine_uploader.js for guidance.
 * In particular, take care to do the following:
 * * Modify this directive's template to use your uploader instead:
 *   /app/assets/javascripts/templates/shared/directives/attachment_library.html
 * * Have your uploader call AttachmentLibrarySvc.emitUploadSuccessful() upon
 *   any successful upload
 */
angular.module('AttachmentLibraryDirective', ['AttachmentLibrarySvc']).
  directive('attachmentLibrary', [
    'AttachmentLibrarySvc',
    function (AttachmentLibrarySvc) {
      return {
        restrict: 'E',
        templateUrl: 'shared/directives/attachment_library.html',
        replace: true,

        scope: {
          uploaderOptions: '='
        },

        link: function (scope, element, attrs) {
          scope.alSvc = AttachmentLibrarySvc;
        }
      }
    }]);
