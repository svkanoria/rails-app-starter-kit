// Manages the User resource on the server.
angular.module('User', ['ResourceUtils'])
  .factory('User', [
    'CancelableResourceFactory',
    function(CancelableResourceFactory) {
      return CancelableResourceFactory.createResource(
        '/admin/users/:collectionAction/:userId/:memberAction.json',
        { userId: '@id' },
        // Extra methods for compatibility with Rails, and our data format
        {
          batch_destroy: {
            method: 'POST',
            params: { collectionAction: 'batch_destroy' }
          }
        });
    }]);
