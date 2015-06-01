/*
 * A directive for:
 * * Viewing a server resource's currently attached attachments
 * * Attaching attachments via drag/drop from the attachment browser
 * * Detaching attachments from a server resource
 *
 * Usage:
 *   <attachment-drop attachments="Object expr"
 *                    attachment-owner-id="some id"
 *                    attachment-owner-type="some server model class"
 *                    role="some role">
 *   </attachment-drop>
 *
 * The 'attachments' attribute must be provided in the following format:
 *
 *   {
 *     role1: [
 *       { id: id, name: 'some name', url: 'some url', join_id: id2 },
 *         :
 *     ],
 *     role2: [ ... ],
 *       :
 *   }
 *
 * where 'join_id' is the id of the join table entry linking attachments to
 * attachment owners.
 *
 * The 'role' attribute narrows the focus of the directive to just one role
 * within the 'attachments' object. Thus, note that you need one directive per
 * role.
 */
angular.module('AttachmentDrop', ['AttachmentJoin'])
  .directive('attachmentDrop', [
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
          if (!scope.attachments[attrs.role]) {
            scope.attachments[attrs.role] = [];
          }

          // The array of attachments of the provided role
          scope.roleAttachments = scope.attachments[attrs.role];

          /**
           * Detaches an attachment from a server resource.
           *
           * @param index {number} - The index of the attachment in
           *   scope.roleAttachments
           */
          scope.detachAttachmentAt = function (index) {
            var joinId = scope.roleAttachments[index].join_id;

            AttachmentJoin.delete({attachmentJoinId: joinId},
              function (response) {
                scope.roleAttachments.splice(index, 1);
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
                scope.roleAttachments.push(response);
              }, function (failureResponse) {
                // Do something on failure
              });
            }
          });
        }
      }
    }]);
