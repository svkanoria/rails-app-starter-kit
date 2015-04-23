// Manages the AttachmentJoin resource on the server.
angular.module('AttachmentJoin', ['ResourceUtils']).
  factory('AttachmentJoin', [
    'CancelableResourceFactory',
    function(CancelableResourceFactory) {
      return CancelableResourceFactory.createResource(
        '/attachment_joins/:collectionAction/:attachmentJoinId/:memberAction.json',
        { attachmentJoinId: '@id' });
    }]);
