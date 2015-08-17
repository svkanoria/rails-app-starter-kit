angular.module('Selectize', [])
  .directive('selectize', [
    function () {
      return {
        restrict: 'EA',
        require: '^ngModel',

        scope: {
          options: '=?',
          ngModel: '='
        },

        link: function (scope, element, attrs) {
          $(element).selectize(scope.options || {});
        }
      }
    }
  ]);
