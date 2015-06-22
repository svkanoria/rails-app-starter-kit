// All string related filters.
angular.module('StringFilters', [])
  .filter('truncate', [
    function () {
      /**
       * Truncates a string.
       * Calls _.truncate() from the underscore.string library.
       *
       * @param value {string} - The string to truncate.
       * @param length {number} - The maximum length to truncate to.
       * @param [truncateString='...'] {string} - The string to append to the
       *   result, if truncated.
       *
       * @returns {string} The truncated string.
       */
      return function (value, length, truncateString) {
        return _.truncate(value, length, truncateString);
      };
    }]);
