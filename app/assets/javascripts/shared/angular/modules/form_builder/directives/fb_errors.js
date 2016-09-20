/*
 * A directive for integrating Angular forms with server-side validation.
 *
 * Usage: ('!' indicates the attribute is watched for changes)
 *   <form ... !fb-errors='errorObject'> ...
 *
 * The error object must contain the validation errors from the server in the
 * following format:
 *
 *   {
 *     field1: ['error msg 1', 'error msg 2', ...],
 *     field2: ['...'],
 *       :
 *   }
 *
 * where `field1`, `field2` etc. must correspond to the form field names.
 * This object may be null or empty.
 *
 * Note that although this directive adds the appropriate 'ng-invalid' classes,
 * it does not display the actual error messages. This can be done either via
 * the `fb-field` directive for creating form fields (which integrates
 * automatically with `fb-errors`), or it can be done manually by adding this
 * snippet of code below an input named, say, 'field1':
 *
 *   <span ng-show="errorObject['field1']">
 *     {{errorObject['field1'][0]}} // Shows the first error message only
 *   </span>
 */
angular.module('FBErrors', [])
  .directive('fbErrors', [
    function () {
      return {
        restrict: 'A',
        require: ['fbErrors', 'form'],

        scope: {
          fbErrors: '<'
        },

        controller: [
          function () {
            var listeners = {};

            /**
             * Updates the form with errors given as a JSON object.
             *
             * @param {Object} form - The form controller.
             * @param {Object} errors - The errors, provided as follows:
             *   {
             *     field1: ['error msg 1', 'error msg 2', ...],
             *     field2: ['...'],
             *       :
             *   }
             */
            this.validateForm = function (form, errors) {
              var fields = {};

              _.each(form, function(value, key) {
                if (typeof value === 'object' &&
                  value.hasOwnProperty('$modelValue')) {
                  fields[key] = value;
                }
              });

              _.each(fields, function (field, key) {
                var fieldErrors = (errors) ? errors[key] : null;

                field.$setValidity(_.camelize(key) + 'Field', !!fieldErrors);

                _.each(listeners[key], function (listener) {
                  listener(fieldErrors);
                });
              });
            };

            /**
             * Adds (i.e. registers) a listener for error updates for a form
             * field.
             *
             * Each time the form field's errors are updated, this listener is
             * called back with the latest errors, if any.
             *
             * @param {string} fieldName - The form field name.
             * @param {Function} listener - A function accepting one argument -
             *   the latest errors.
             */
            this.addListener = function (fieldName, listener) {
              ObjectUtils.pushToProperty(listeners, fieldName, listener);
            };

            /**
             * Removes (i.e. de-registers) an error update listener.
             *
             * @param {string} fieldName - The form field name.
             * @param {Function} listener - A listener added via `addListener`.
             */
            this.removeListener = function (fieldName, listener) {
              if (listeners[fieldName]) {
                ArrayUtils.remove(listeners[fieldName], listener);
              }
            };
          }],

        link: function (scope, element, attrs, ctrls) {
          var fbErrors = ctrls[0];
          var form = ctrls[1];

          scope.$watch('fbErrors', function (errors) {
            fbErrors.validateForm(form, errors);
          });
        }
      };
    }]);
