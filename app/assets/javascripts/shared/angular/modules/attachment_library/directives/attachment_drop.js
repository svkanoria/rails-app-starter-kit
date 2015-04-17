/*
 * A directive for:
 * * Viewing a server resource's currently attached attachments
 * * Attaching attachments via drag/drop from the attachment browser
 * * Detaching attachments from a server resource
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
 *   [{ id: id, name: 'some name', url: 'some url', join_id: id2 }, ...]
 *
 * where 'join_id' is the id of the join table entry linking attachments to
 * attachment owners.
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
          /**
           * Detaches an attachment from a server resource.
           *
           * @param index {number} - The index of the attachment in
           *   scope.attachments
           */
          scope.detachAttachmentAt = function (index) {
            var joinId = scope.attachments[index].join_id;

            AttachmentJoin.delete({attachmentJoinId: joinId},
              function (response) {
                scope.attachments.splice(index, 1);
              },
              function (failureResponse) {
                // Do something on failure
              });
          };

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
                // Do something on failure
              });
            }
          });
        }
      }
    }]);
