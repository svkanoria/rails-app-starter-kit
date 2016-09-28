// Manages the AttachmentJoin resource on the server.
angular.module('AttachmentJoin', ['I18n'])
  .factory('AttachmentJoin', [
    '$resource', 'I18n',
    function($resource, I18n) {
      return $resource(
        '/:locale/attachment_joins/:collectionAction/:attachmentJoinId/:memberAction.json',
        {
          attachmentJoinId: '@id',
          locale: I18n.getLocaleUrlParam()
        });
    }]);
