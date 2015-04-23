angular.module('AttachmentsCtrl', []).
  controller('AttachmentsCtrl', [
    '$scope', 'Attachment', 'initialData',
    function ($scope, Attachment, initialData) {
      /**
       * The 'show' action.
       */
      $scope.actionShow = function () {
        $scope.attachment = initialData;
      };
    }]);