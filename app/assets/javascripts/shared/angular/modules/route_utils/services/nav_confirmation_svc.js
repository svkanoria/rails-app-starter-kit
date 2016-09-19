/*
 * A service for user confirmation before navigating away from a view/page.
 *
 * Works for Angular route changes, *and* when navigating to external URLs.
 *
 * Usage:
 *   // Examples of enabling/disabling user confirmation
 *   NavConfirmationSvc.setConfirmNav(true);
 *   NavConfirmationSvc.setConfirmNav('Unsaved form fields');
 *   NavConfirmationSvc.setConfirmNav(false);
 */
angular.module('NavConfirmationSvc', [])
  .factory('NavConfirmationSvc', [
    function () {
      var confirmNav = false;

      /**
       * Sets whether to ask for user confirmation before navigating away.
       *
       * @param {boolean|string} value - True or a confirmation message when
       *   confirmation is required, false otherwise.
       */
      function setConfirmNav (value) {
        confirmNav = value;

        if (confirmNav) {
          window.onbeforeunload = function () {
            return confirmNav;
          }
        } else {
          window.onbeforeunload = null;
        }
      }

      /**
       * If required, prompts the user for confirmation and returns whether
       * to navigate away or not.
       *
       * Used in `RouteUtilsConst.onAppRun`. Ideally, this will not need to be
       * called manually anywhere else.
       *
       * @returns {boolean} Whether to navigate away or not.
       */
      function isNavConfirmed () {
        if (!confirmNav) return true;

        if (confirm(getConfirmMessage())) {
          setConfirmNav(false);

          return true;
        } else {
          return false;
        }
      }

      function getConfirmMessage () {
        var prefix = (typeof(confirmNav) === 'string')
          ? confirmNav
          : '';

        return prefix + '\n\nAre you sure you want to leave this page?';
      }

      // Return the service object
      return {
        setConfirmNav: setConfirmNav,
        isNavConfirmed: isNavConfirmed
      };
    }]);
