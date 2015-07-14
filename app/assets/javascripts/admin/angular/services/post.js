// Manages the Post resource on the server.
angular.module('Post', ['ResourceUtils'])
  .factory('Post', [
    'CancelableResourceFactory',
    function(CancelableResourceFactory) {
      return CancelableResourceFactory.createResource(
        '/admin/posts/:collectionAction/:postId/:memberAction.json',
        { postId: '@id' },
        // Extra methods for compatibility with Rails, and our data format
        {
          batch_destroy: {
            method: 'POST',
            params: { collectionAction: 'batch_destroy' }
          }
        });
    }]);
