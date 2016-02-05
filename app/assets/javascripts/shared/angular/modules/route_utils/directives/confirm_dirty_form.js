/*
 * A directive that triggers a user confirmation before navigating away from a
 * view/page containing a form that is dirty.
 *
 * Usage:
 *   <form ... confirm-dirty-form>
 *     :
 *   </form>
 *
 * Unfortunately, this will also unwantedly trigger a user confirmation when the
 * act of submitting a dirty form causes a view/page change (such as redirecting
 * after creating/updating a resource). To prevent this, add the following line
 * just before the instruction to change the view/page:
 *
 *   NavConfirmationSvc.setConfirmNav(false)
 */
angular.module('ConfirmDirtyForm', ['NavConfirmationSvc'])
  .directive('confirmDirtyForm', [
    'NavConfirmationSvc',
    function (NavConfirmationSvc) {
      return {
        restrict: 'A',
        require: 'form',

        link: function (scope, element, attrs, form) {
          scope.form = form;

          scope.$watch('form.$dirty', function (value) {
            if (value) {
              NavConfirmationSvc.setConfirmNav('Form has unsaved field(s)!');
            } else {
              NavConfirmationSvc.setConfirmNav(false);
            }
          });
        }
      };
    }]);
