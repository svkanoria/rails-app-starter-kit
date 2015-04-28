/*
 * A directive for http://eonasdan.github.io/bootstrap-datetimepicker.
 *
 * Usage:
 *   <date-time-picker model="String expr"></date-time-picker>
 *
 * The model expression must evaluate to a date string in ISO 8601 format.
 * An example of this format: '2015-04-15T12:11:17.139Z'.
 */
angular.module('DateTimePicker', []).
  directive('dateTimePicker', [
    function () {
      return {
        restrict: 'E',
        templateUrl: 'shared/directives/date_time_picker.html',
        replace: true,

        scope: {
          model: '='
        },

        link: function (scope, element, attrs) {
          var input = $(element).find('input');
          var instance = input.datetimepicker();
          var baseModel = null;

          var listenOnce = scope.$watch('model', function (value) {
            if (value) {
              input.data('DateTimePicker').date(moment(value));

              listenOnce(); // De-register the watcher
            }
          });

          instance.on('dp.change', function () {
            scope.$evalAsync(function () {
              scope.baseModel = input.data('DateTimePicker').date();
              scope.model = scope.baseModel.toISOString();
            });
          });

          scope.$watch('baseModel', function (value) {
            scope.prettyModel = (value) ? value.format('LLL') : null;
          });
        }
      }
    }]);
