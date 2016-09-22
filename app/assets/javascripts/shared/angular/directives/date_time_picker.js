/*
 * A solution for date and/or time user input, based on the
 * http://eonasdan.github.io/bootstrap-datetimepicker jQuery plugin.
 */
angular.module('DateTimePicker', ['I18n', 'DateTimeQuicker'])
  /*
   * A directive for selecting dates and/or times.
   *
   * Usage: ('!' indicates the attribute is watched for changes)
   *   <date-time-picker !ng-model="String expr"
   *                     ?options="Object expr">
   *   </date-time-picker>
   *
   * The `ng-model` expression must evaluate to one of the following:
   * * A string in ISO 8601 format. Example: '2015-04-15T12:11:17.139Z'
   * * Just the date portion of the above string. Example: '2015-04-15'
   * * Just the time portion of the above string. Example: 'T12:11:17.139Z'
   */
  .directive('dateTimePicker', [
    '$compile', 'I18n',
    function ($compile, I18n) {
      return {
        restrict: 'E',
        templateUrl: 'shared/directives/date_time_picker.html',
        replace: true,
        require: ['dateTimePicker', 'ngModel'],
        controller: 'DateTimePickerCtrl',

        scope: {
          options: '<?',
          ngModel: '=' // Needed only for use by date-time-quicker
        },

        link: function (scope, element, attrs, ctrls) {
          var dateTimePicker = ctrls[0];
          var ngModel = ctrls[1];

          var input = $(element).find('input');

          var options = scope.options || {};

          if (I18n.getLocale() && !options.locale) {
            options.locale = I18n.getLocale();
          }

          var instance = input.datetimepicker(options);
          var initialized = false;

          // Integrate an instance of date-time-quicker, to provide useful
          // shortcuts or "macros" for entering dates and times.
          instance.on('dp.show', function () {
            var dateTimeQuickerHtml =
              $('<date-time-quicker></date-time-quicker>');

            $(element).find('.bootstrap-datetimepicker-widget')
              .append(dateTimeQuickerHtml);

            $compile(dateTimeQuickerHtml)(scope);
          });

          // Respond when the user presses Enter, by:
          // 1. Updating the model. This is best achieved by the convoluted
          //    method of blurring and re-focusing the input field.
          // 2. Causing the enclosing form (if any) to submit. This is achieved
          //    by triggering 'click' on the form's `input[type=submit]`. Again
          //    convoluted, but this ensures that submission is processed via
          //    the regular Angular channels, and nothing is bypassed.
          instance.on('keydown', function (event) {
            if (event.which === 13) {
              input.trigger('blur');
              input.trigger('focus');
              input.data('DateTimePicker').hide();

              var form = $(element).closest('form');
              if (!form) return;

              var submitButton = form.find('[type=submit]');
              if (!submitButton) return;

              submitButton.trigger('click');
            }
          });

          instance.on('dp.change', function () {
            if (!initialized) return;

            var viewValue = input.data('DateTimePicker').date();

            scope.$evalAsync(function () {
              ngModel.$setViewValue(viewValue);
            });
          });

          ngModel.$parsers.push(function (viewValue) {
            if (!viewValue) return null;

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

          ngModel.$formatters.push(function (modelValue) {
            var viewValue = null;

            if (modelValue) {
              // If time only, add dummy date portion to be able to parse and
              // display correctly.
              var fullModelValue = (modelValue[0] === 'T') ?
                moment(moment().format('YYYY-MM-DD') + modelValue) :
                moment(modelValue);

              input.data('DateTimePicker').date(fullModelValue);

              viewValue = fullModelValue.format(dateTimePicker.format());
            }

            if (!initialized) initialized = true;

            return viewValue;
          });

          element.on('$destroy', function () {
            instance.off('dp.change');

            ngModel.$formatters.length = 0;
            ngModel.$parsers.length = 0;
          });
        }
      }
    }])

  // Controller for the `date-time-picker` directive.
  .controller('DateTimePickerCtrl', [
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
       * @returns {?string} The format.
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
       * @param {string} [format] - The format.
       *
       * @returns {number} 1 => date only, 2 => time only, 3 => both.
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
