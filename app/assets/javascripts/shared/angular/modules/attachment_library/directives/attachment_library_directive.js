/*
 * The attachment library directive.
 *
 * Usage:
 *   <attachment-library uploader-options="Object expr">
 *   </attachment-library>
 *
 * The uploader options are passed to the uploader directive.
 * We provide one uploader (which we then use by default): The 'fine-uploader'
 * directive. However, you can create you own if you wish. If you do roll your
 * own, you must also modify this directive's template to use your uploader
 * instead:
 * /app/assets/javascripts/templates/shared/directives/attachment_library.html
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
          scope.$watch(AttachmentLibrarySvc.getDisplayMode, function (value) {
            scope.displayMode = value;
          });
        }
      }
    }]);
