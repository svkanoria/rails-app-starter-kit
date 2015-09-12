// All date related filters.
angular.module('DateFilters', [])
  .filter('dateFormat', [
    function () {
      /**
       * Formats a date.
       * Calls moment().format() from the Moment.js library.
       *
       * @param value {string|Date} - The string or date object to format.
       * @param [format='lll'] {string} - The format, compatible with Moment.js.
       *
       * @returns {string} The formatted date.
       */
      return function (value, format) {
        return moment(value).format(format || 'lll');
      };
    }]);
