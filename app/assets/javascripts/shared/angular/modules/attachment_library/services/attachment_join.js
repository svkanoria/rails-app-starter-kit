// Manages the AttachmentJoin resource on the server.
angular.module('AttachmentJoin', [])
  .factory('AttachmentJoin', [
    '$resource',
    function($resource) {
      return $resource(
        '/attachment_joins/:collectionAction/:attachmentJoinId/:memberAction.json',
        { attachmentJoinId: '@id' });
    }]);
