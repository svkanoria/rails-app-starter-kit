// FineUploader based uploader for attachment library.
angular.module('FineUploader', []).
  directive('fineUploader', [
    function () {
      return {
        restrict: 'E',
        templateUrl: 'shared/directives/fine_uploader.html',
        replace: true,

        scope: {
          options: '='
        },

        link: function (scope, element, attrs) {
          $(element).fineUploaderS3(scope.options);
        }
      };
    }
  ]);
