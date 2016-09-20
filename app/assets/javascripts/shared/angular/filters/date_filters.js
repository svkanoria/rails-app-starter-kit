// All date related filters.
angular.module('DateFilters', [])
  .filter('dateFormat', [
    function () {
      /**
       * Formats a date.
       * Calls `moment().format()` from the Moment.js library.
       *
       * @param {string|Date} value - The string or date object to format.
       * @param {string} [format='lll'] - The format, compatible with Moment.js.
       *
       * @returns {string} The formatted date.
       */
      return function (value, format) {
        return moment(value).format(format || 'lll');
      };
    }]);
