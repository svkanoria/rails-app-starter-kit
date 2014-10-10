// Manages the Location resource on the server.
angular.module('Location', ['ngResource']).
  factory('Location', ['$resource', function($resource) {
    return $resource(
      '/locations/:collectionAction/:locationId/:memberAction.json',
      { locationId: '@id' },
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
