// Provides initial data for AttachmentsCtrl actions.
angular.module('AttachmentsCtrlInitSvc', ['Attachment']).
  factory('AttachmentsCtrlInitSvc', [
    '$route', 'Attachment',
    function($route, Attachment) {
      /**
       * Initial data for the 'show' action.
       *
       * @returns {Object} The attachment corresponding to the current route, as
       * a promise.
       */
      var actionShow = function () {
        return Attachment.get({
          attachmentId: $route.current.params.id
        }).$promise;
      };

      // Return the service object
      return {
        actionShow: actionShow
      };
    }]);
