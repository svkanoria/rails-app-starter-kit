// Manages the User resource on the server.
angular.module('User', ['I18n'])
  .factory('User', [
    '$resource', 'I18n',
    function($resource, I18n) {
      return $resource(
        '/admin/:locale/users/:collectionAction/:userId/:memberAction.json',
        {
          userId: '@id',
          locale: I18n.getLocaleUrlParam()
        },
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
