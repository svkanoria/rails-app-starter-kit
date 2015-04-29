/*
 * A directive for http://eonasdan.github.io/bootstrap-datetimepicker.
 *
 * Usage:
 *   <date-time-picker model="String expr"
 *                     ?options="Object expr">
 *   </date-time-picker>
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
          model: '=',
          options: '='
        },

        controller: ['$scope', function ($scope) {
          // These cover all Moment.js possibilities
          var DATE_REGEXP = /MQdDeEwWYgG/;
          var TIME_REGEXP = /hHmsSxX/;
          var LOCALE_DATE_REGEXP = /^l{1,4}$/i;
          var LOCALE_TIME_REGEXP = /^(LT|LTS|lll|LLL|llll|LLLL)$/;

          /**
           * Returns the format (if any) given in the options.
           *
           * @returns {?String} The format.
           */
          this.format = function () {
            return ($scope.options) ? $scope.options['format'] : null;
          };

          /**
           * Returns the granularity implied by the given format.
           *
           * Used by the link function to determine how to format the value to
           * be sent to the server. The format indicates to the server the type
           * of comparison to use: dates only, times only, or both.
           *
           * @param [format] {String} - The format.
           *
           * @returns {number} 1 => date only, 2 => time only, 3 => date & time
           */
          this.granularity = function (format) {
            if (!format) return 3;

            var result = 0;

            if (DATE_REGEXP.test(format) || LOCALE_DATE_REGEXP.test(format)) {
              result += 1;
            }

            if (TIME_REGEXP.test(format) || LOCALE_TIME_REGEXP.test(format)) {
              result += 2;
            }

            return result;
          };
        }],

        link: function (scope, element, attrs, ctrl) {
          var input = $(element).find('input');
          var instance = input.datetimepicker(scope.options || {});
          var baseModel = null;

          // Initial value set
          var listenOnce = scope.$watch('model', function (value) {
            if (value) {
              input.data('DateTimePicker').date(moment(value));

              listenOnce(); // De-register the watcher
            }
          });

          // Subsequent changes
          instance.on('dp.change', function () {
            scope.$evalAsync(function () {
              scope.baseModel = input.data('DateTimePicker').date();

              switch (ctrl.granularity(ctrl.format())) {
                case 1:
                  scope.model = scope.baseModel.format('YYYY-MM-DD');
                  break;
                case 2:
                case 3:
                  scope.model = scope.baseModel.toISOString();
                  break;
                default:
                  scope.model = scope.baseModel.toISOString();
              }

            });
          });

          scope.$watch('baseModel', function (value) {
            scope.prettyModel = (value) ? value.format(ctrl.format()) : null;
          });
        }
      }
    }]);
