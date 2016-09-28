// Manages the Post resource on the server.
angular.module('Post', ['I18n', 'ArrayMetadataResponseAdapter'])
  .factory('Post', [
    '$resource', 'I18n', 'ArrayMetadataResponseAdapter',
    function($resource, I18n, ArrayMetadataResponseAdapter) {
      return $resource(
        '/:locale/posts/:collectionAction/:postId/:memberAction.json',
        {
          postId: '@id',
          locale: I18n.getLocaleUrlParam()
        },
        // Extra methods for compatibility with Rails, and our data format
        {
          query: ArrayMetadataResponseAdapter.adaptToArray(
            'items', 'metadata', {
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
