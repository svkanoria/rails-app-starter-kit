/*
 * A directive that provides useful shortcuts or "macros" for entering dates
 * and times.
 *
 * This is generally not to be used directly. Rather, it should be integrated
 * into a full date and/or time picker directive, as follows:
 *
 * * Expose an `ngModel` property holding the date and/or time
 * * Insert `<date-time-quicker></date-time-quicker>` into the HTML where it
 *   makes the most sense (generally in the date and/or time picker drop-down)
 * * Compile it using the `$compile` service, in the same scope as the parent
 *   date and/or time picker directive
 * * Style as required, because no default styling is provided
 */
angular.module('DateTimeQuicker', [])
  .directive('dateTimeQuicker', [
    function () {
      return {
        restrict: 'E',
        templateUrl: 'shared/directives/date_time_quicker.html',

        link: function (scope, element, attrs) {
          /**
           * Rounds `ngModel` to the nearest interval length.
           *
           * @param {string} direction - 'down', 'up]' or 'up)':
           *   * ']' => latest instant in the interval
           *   * ')' => earliest instant in the next interval
           *
           * @param {string} interval - A string compatible with
           *   `moment.startOf()` or `moment().endOf()`, like 'year', 'month',
           *   'week', 'day', 'hour' etc.
           */
          scope.round = function (direction, interval) {
            var mom = (scope.ngModel)
              ? moment(scope.ngModel)
              : moment();

            if (direction === 'down') {
              scope.ngModel = mom.startOf(interval);
            } else if (direction === 'up]') {
              scope.ngModel = mom.endOf(interval);
            } else if (direction === 'up)') {
              scope.ngModel = mom.add(1, interval).startOf(interval);
            }
          }
        }
      }
    }]);
