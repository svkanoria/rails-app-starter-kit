// Manages the Attachment resource on the server.
angular.module('Attachment', [])
  .factory('Attachment', [
    '$resource',
    function($resource) {
      return $resource(
        '/attachments/:collectionAction/:attachmentId/:memberAction.json',
        { attachmentId: '@id' },
        // Extra methods for compatibility with Rails, and our data format
        {
          update: {
            method: 'PUT'
          },
          batch_destroy: {
            method: 'POST',
            params: { collectionAction: 'batch_destroy' }
          }
        });
    }]);
