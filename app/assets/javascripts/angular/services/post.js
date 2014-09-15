// Manages the Post resource on the server.
angular.module('Post', ['ngResource']).
  factory('Post', ['$resource', function($resource) {
    return $resource(
      '/posts/:collectionAction/:postId/:memberAction.json',
      { postId: '@id' },
      // Extra methods (for Rails compatibility)
      {
        edit: {
          method: 'GET',
          params: { memberAction: 'edit' }
        },
        update: {
          method: 'PUT'
        }
      });
  }]);
