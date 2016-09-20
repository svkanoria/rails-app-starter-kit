/*
 * A directive for:
 * * Viewing a server resource's currently attached attachments
 * * Attaching attachments via drag/drop from the attachment browser
 * * Detaching attachments from a server resource
 *
 * Usage: ('!' indicates the attribute is watched for changes)
 *   <attachment-drop !attachments="Object expr"
 *                    attachment-owner-id="some id"
 *                    attachment-owner-type="some server model class"
 *                    role="some role"
 *                    ?count="number expr">
 *   </attachment-drop>
 *
 * The `attachments` attribute must be provided in the following format:
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
 * where `join_id` is the id of the join table entry linking attachments to
 * attachment owners.
 *
 * The `role` attribute narrows the focus of the directive to just one role
 * within the `attachments` object. Thus, note that you need one directive per
 * role.
 */
angular.module('AttachmentDrop', [
  'I18n', 'Flash', 'AttachmentJoin', 'AttachmentLibrarySvc'])
  .directive('attachmentDrop', [
    '$rootScope', 'I18n', 'Flash', 'AttachmentJoin', 'AttachmentLibrarySvc',
    function ($rootScope, I18n, Flash, AttachmentJoin, AttachmentLibrarySvc) {
      return {
        restrict: 'E',
        templateUrl: 'shared/directives/attachment_drop.html',
        replace: true,

        scope: {
          attachments: '<',
          count: '@?'
        },

        link: function (scope, element, attrs) {
          if (!scope.attachments[attrs.role]) {
            scope.attachments[attrs.role] = [];
          }

          // The array of attachments of the provided role
          scope.roleAttachments = scope.attachments[attrs.role];

          /*
           * Computes how many more attachments can be added before the limit
           * is reached. See /app/models/concerns/acts_as_attachment_owner.rb -
           * it is possible to cap the number of attachments for a given role.
           *
           * The `count` attribute to this directive can and should be used to
           * reflect any cap set at the server end.
           */
          function computeCountRemaining () {
            scope.countRemaining = (scope.count)
              ? (parseInt(scope.count) - scope.roleAttachments.length)
              : Number.POSITIVE_INFINITY;
          }

          computeCountRemaining();

          /**
           * Detaches an attachment from a server resource.
           *
           * @param {number} index - The index of the attachment in
           *   `scope.roleAttachments`.
           */
          scope.detachAttachmentAt = function (index) {
            var attachment = scope.roleAttachments[index];

            AttachmentJoin.delete({ attachmentJoinId: attachment.join_id },
              function (response) {
                scope.roleAttachments.splice(index, 1);
                scope.countRemaining += 1;

                AttachmentLibrarySvc.emitAttachmentsDetached([attachment.id]);
              },
              function (failureResponse) {
                if (failureResponse.data.error) {
                  // We assume messages from the server are localized, so we
                  // don't need to provide a translation id.
                  Flash.now.push('danger', failureResponse.data.error);
                } else {
                  Flash.now.push('danger', 'Error removing attachment.',
                    'attachment_drop.error_removing_attachment');
                }
              });
          };

          var dropAreaElement = $(element).find('.attachment-drop-area');

          dropAreaElement.droppable({
            accept: '.droppable-attachment',
            hoverClass: 'attachment-drop-area-active',
            drop: function (event, ui) {
              var attachmentId = ui.helper.text().split(':')[0];

              var attachmentAttrs = {
                attachment_id: attachmentId,
                attachment_owner_id: attrs.attachmentOwnerId,
                attachment_owner_type: attrs.attachmentOwnerType,
                role: attrs.role
              };

              AttachmentJoin.save(attachmentAttrs, function (response) {
                scope.roleAttachments.push(response);
                scope.countRemaining -= 1;

                AttachmentLibrarySvc.emitAttachmentsAttached([attachmentId]);
              }, function (failureResponse) {
                var errors = failureResponse.data.errors;

                if (errors) {
                  var firstError = errors[Object.keys(errors)[0]];

                  I18n.t('.error_adding_attachment_prefix',
                    'attachment_drop', 'Error adding attachment:'
                  ).then(function (result) {
                    Flash.now.push('danger', result + ' ' + firstError);
                  });
                } else {
                  if (failureResponse.data.error) {
                    // We assume messages from the server are localized, so we
                    // don't need to provide a translation id.
                    Flash.now.push('danger', failureResponse.data.error);
                  } else {
                    Flash.now.push('danger', 'Error adding attachment.',
                      'attachment_drop.error_adding_attachment');
                  }
                }
              });
            }
          });

          $rootScope.$on('attachment_library.attachment_updated',
            function (event, updatedAttachment) {
              scope.roleAttachments = _.map(scope.roleAttachments,
                function (attachment) {
                  return (attachment.id === updatedAttachment.id)
                    ? updatedAttachment
                    : attachment;
                });
            });

          $rootScope.$on('attachment_library.attachments_deleted',
            function (event, attachmentIds) {
              scope.roleAttachments = _.reject(scope.roleAttachments,
                function (attachment) {
                  return _.contains(attachmentIds, attachment.id);
                });

              computeCountRemaining();
            });
        }
      }
    }]);
