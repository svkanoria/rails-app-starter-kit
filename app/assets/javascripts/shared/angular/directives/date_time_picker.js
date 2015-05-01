// A solution for date and/or time user input, based on the
// http://eonasdan.github.io/bootstrap-datetimepicker jQuery plugin.
angular.module('DateTimePicker', []).
  /*
   * A directive for selecting dates and/or times.
   *
   * Usage:
   *   <date-time-picker ng-model="String expr"
   *                     ?options="Object expr">
   *   </date-time-picker>
   *
   * The ng-model expression must evaluate to one of the following:
   * * A string in ISO 8601 format. Example: '2015-04-15T12:11:17.139Z'
   * * Just the date portion of the above string. Example: '2015-04-15'
   * * Just the time portion of the above string. Example: 'T12:11:17.139Z'
   */
  directive('dateTimePicker', [
    function () {
      return {
        restrict: 'E',
        templateUrl: 'shared/directives/date_time_picker.html',
        replace: true,
        require: ['dateTimePicker', 'ngModel'],
        controller: 'DateTimePickerCtrl',

        scope: {
          options: '='
        },

        link: function (scope, element, attrs, ctrls) {
          var dateTimePicker = ctrls[0];
          var ngModel = ctrls[1];

          var input = $(element).find('input');
          var instance = input.datetimepicker(scope.options || {});
          var initialized = false;

          instance.on('dp.change', function () {
            if (!initialized) return;

            var viewValue = input.data('DateTimePicker').date();

            scope.$evalAsync(function () {
              ngModel.$setViewValue(viewValue);
            });
          });

          ngModel.$formatters.push(function (modelValue) {
            // If time only, add a dummy date portion to be able to parse and
            // display correctly.
            var fullModelValue = (modelValue[0] === 'T') ?
              moment(moment().format('YYYY-MM-DD') + modelValue) :
              moment(modelValue);

            input.data('DateTimePicker').date(fullModelValue);
            if (!initialized) initialized = true;

            return fullModelValue.format(dateTimePicker.format());
          });

          ngModel.$parsers.push(function (viewValue) {
            switch (dateTimePicker.granularity(dateTimePicker.format())) {
              case 1: // Date only
                return viewValue.format('YYYY-MM-DD');
              case 2: // Time only
                // Convoluted way to convert to UTC, but required
                var viewValueUtc = moment(viewValue).utc();
                return viewValueUtc.format('[T]hh:mm:ss.SSS[Z]');
              case 3: // Both
                return viewValue.toISOString();
              default:
                console.log('Invalid datetime granularity');
            }
          });
        }
      }
    }]).

  // Controller for the date-time-picker directive.
  controller('DateTimePickerCtrl', [
    '$scope',
    function ($scope) {
      // These cover all Moment.js possibilities
      var DATE_REGEXP = /MQdDeEwWYgG/;
      var TIME_REGEXP = /hHmsSxX/;
      var LOCALE_DATE_REGEXP = /^l{1,4}$/i;
      var LOCALE_TIME_REGEXP = /^(LT|LTS|lll|LLL|llll|LLLL)$/;

      /**
       * Returns the format (if any) provided in the options.
       *
       * @returns {?String} The format.
       */
      this.format = function () {
        return ($scope.options) ? $scope.options['format'] : null;
      };

      /**
       * Returns the granularity implied by the given format.
       *
       * Used by the link function to suitably format the value to be sent to
       * the server, based on which the server decides the type of comparison:
       * date only, time only or both.
       *
       * @param [format] {String} - The format.
       *
       * @returns {number} 1 => date only, 2 => time only, 3 => both
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
    }]);
