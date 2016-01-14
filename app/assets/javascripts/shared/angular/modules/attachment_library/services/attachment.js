// Manages the Attachment resource on the server.
angular.module('Attachment', ['ResourceUtils'])
  .factory('Attachment', [
    'CancelableResourceFactory',
    function(CancelableResourceFactory) {
      return CancelableResourceFactory.createResource(
        '/attachments/:collectionAction/:attachmentId/:memberAction.json',
        { attachmentId: '@id' },
        // Extra methods for compatibility with Rails, and our data format
        {
          batch_destroy: {
            method: 'POST',
            params: { collectionAction: 'batch_destroy' }
          }
        });
    }]);
