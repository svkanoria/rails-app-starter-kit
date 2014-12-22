// Manages the Post resource on the server.
angular.module('Post', ['ngResource', 'ResourceUtils']).
  factory('Post', [
    '$resource', 'ResourceUtils',
    function($resource, ResourceUtils) {
      return $resource(
        '/posts/:collectionAction/:postId/:memberAction.json',
        { postId: '@id' },
        // Extra methods for compatibility with Rails, and our data format
        {
          query: ResourceUtils.adaptToArray('items', 'metadata', {
            method: 'GET'
          }),
          edit: {
            method: 'GET',
            params: { memberAction: 'edit' }
          },
          update: {
            method: 'PUT'
          }
        });
    }]);
