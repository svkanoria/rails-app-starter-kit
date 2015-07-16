// Manages the Attachment resource on the server.
angular.module('Attachment', ['ResourceUtils'])
  .factory('Attachment', [
    'CancelableResourceFactory',
    function(CancelableResourceFactory) {
      return CancelableResourceFactory.createResource(
        '/attachments/:collectionAction/:attachmentId/:memberAction.json',
        { attachmentId: '@id' });
    }]);
