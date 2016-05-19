// Manages the Post resource on the server.
angular.module('Post', [])
  .factory('Post', [
    '$resource',
    function($resource) {
      return $resource(
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
