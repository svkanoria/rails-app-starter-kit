// Manages the Attachment resource on the server.
angular.module('Attachment', ['I18n'])
  .factory('Attachment', [
    '$resource', 'I18n',
    function($resource, I18n) {
      return $resource(
        '/:locale/attachments/:collectionAction/:attachmentId/:memberAction.json',
        {
          attachmentId: '@id',
          locale: I18n.getLocaleUrlParam()
        },
        // Extra methods for compatibility with Rails, and our data format
        {
          update: {
            method: 'PUT'
          },
          batch_destroy: {
            method: 'POST',
            params: { collectionAction: 'batch_destroy' }
          }
        });
    }]);
