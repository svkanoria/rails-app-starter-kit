// Manages the User resource on the server.
angular.module('User', [])
  .factory('User', [
    '$resource',
    function($resource) {
      return $resource(
        '/admin/users/:collectionAction/:userId/:memberAction.json',
        { userId: '@id' },
        // Extra methods for compatibility with Rails, and our data format
        {
          edit: {
            method: 'GET',
            params: { memberAction: 'edit' }
          },
          update: {
            method: 'PUT'
          },
          batch_destroy: {
            method: 'POST',
            params: { collectionAction: 'batch_destroy' }
          }
        });
    }]);
