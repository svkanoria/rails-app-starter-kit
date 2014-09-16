/*
 * A directive for integrating Angular forms with server-side validation.
 *
 * Usage:
 *   <form ... form-errors='errorObject'> ...
 *
 * The error object must contain the validation errors from the server in the
 * following format:
 *   {
 *     field1: ['error msg 1', 'error msg 2', ...],
 *     field2: ['...'],
 *       :
 *   }
 * where field1, field2 etc. must correspond to the names of the form fields.
 * This object may be null or empty.
 *
 * Note that although this directive adds the appropriate ng-invalid classes,
 * the actual error messages must be displayed manually. This can be done by
 * adding this snippet of code below an input named, say, 'field1':
 *   <span ng-show="errorObject['field1']">
 *     {{errorObject['field1'][0]}} // Shows the first error message only
 *   </span>
 */
angular.module('FormErrors', []).
  directive('formErrors', function () {
    return {
      restrict: 'A',
      require: ['formErrors', 'form'],

      scope: {
        formErrors: '='
      },

      controller: [function () {
        /**
         * Updates the form with errors given as a JSON object.
         * @param form - The form controller.
         * @param errors - The errors, provided as follows:
         *   {
         *     field1: ['error msg 1', 'error msg 2', ...],
         *     field2: ['...'],
         *       :
         *   }
         */
        this.validateForm = function (form, errors) {
          if (errors) {
            _.each(errors, function (fieldErrors, key) {
              var camelizedKey = _.camelize(key);

              _.each(fieldErrors, function (fieldError) {
                var field = form[camelizedKey];

                field.$dirty = true;
                field.$setValidity(camelizedKey + 'Field', false);
              });
            });
          }
        };
      }],

      link: function (scope, element, attrs, ctrls) {
        var formErrors = ctrls[0];
        var form = ctrls[1];

        scope.$watch('formErrors', function (errors) {
          formErrors.validateForm(form, errors);
        });
      }
    };
  });