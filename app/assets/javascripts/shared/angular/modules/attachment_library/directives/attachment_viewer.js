// An "abstract" attachment viewer directive.
angular.module('AttachmentViewer', ['AttachmentViewerProvider'])
  .directive('attachmentViewer', [
    '$compile', 'AttachmentViewer',
    function ($compile, AttachmentViewer) {
      return {
        restrict: 'E',
        templateUrl: 'shared/directives/attachment_viewer.html',

        scope: {
          attachment: '<'
        },

        link: function (scope, element, attrs) {
          /**
           * Sets the concrete viewer.
           *
           * @param {Object} attachment - The attachment.
           */
          function setViewer (attachment) {
            var viewerContainer = $(element).children().first();

            viewerContainer.html('');

            var editorHtml = AttachmentViewer.getViewerHtml(attachment);
            viewerContainer.html(editorHtml);

            // Note: We compile the control AFTER inserting into the DOM. This
            // way the control registers itself with any parents, if required.
            $compile(viewerContainer.contents())(scope);
          }

          scope.$watch('attachment', function (value) {
            setViewer(value);
          });
        }
      }
    }]);
