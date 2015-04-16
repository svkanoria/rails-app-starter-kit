/*
 * An area for users to drop attachments dragged from the attachment browser,
 * and associate the dropped attachments with a model.
 *
 * Usage:
 *   <attachment-drop attachments="Array expr"
 *                    attachment-owner-id="some id"
 *                    attachment-owner-type="some server model class"
 *                    role="some role">
 *   </attachment-drop>
 *
 * The 'attachments' attribute must be passed an array of attachments in the
 * following format (at a minimum):
 *
 *   [{ id: id, name: 'some name', url: 'some url' }, ...]
 */
angular.module('AttachmentDrop', ['AttachmentJoin']).
  directive('attachmentDrop', [
    'AttachmentJoin',
    function (AttachmentJoin) {
      return {
        restrict: 'E',
        templateUrl: 'shared/directives/attachment_drop.html',
        replace: true,

        scope: {
          attachments: '='
        },

        link: function (scope, element, attrs) {
          var dropAreaElement = $(element).find('.attachment-drop-area');

          dropAreaElement.droppable({
            accept: '.droppable-attachment',
            hoverClass: 'attachment-drop-area-active',
            drop: function (event, ui) {
              var attachmentId = ui.helper.text().split(';')[0];

              var attachmentAttrs = {
                attachment_id: attachmentId,
                attachment_owner_id: attrs.attachmentOwnerId,
                attachment_owner_type: attrs.attachmentOwnerType,
                role: attrs.role
              };

              AttachmentJoin.save(attachmentAttrs, function (response) {
                scope.attachments.push(response);
              }, function (failureResponse) {
                console.log(failureResponse);
              });
            }
          });
        }
      }
    }]);
