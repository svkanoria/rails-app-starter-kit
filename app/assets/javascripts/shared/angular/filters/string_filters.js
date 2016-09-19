// All string related filters.
angular.module('StringFilters', [])
  .filter('truncate', [
    function () {
      /**
       * Truncates a string.
       * Calls `_.truncate()` from the underscore.string library.
       *
       * @param {string} value - The string to truncate.
       * @param {number} length - The maximum length to truncate to.
       * @param {string} [truncateString='...'] - The string to append to the
       *   result, if truncated.
       *
       * @returns {string} The truncated string.
       */
      return function (value, length, truncateString) {
        return _.truncate(value, length, truncateString);
      };
    }]);
