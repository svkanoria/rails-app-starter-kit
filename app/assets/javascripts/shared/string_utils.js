// All string related utilities.
var StringUtils = (function () {
  /**
   * Concatenates the given array of strings.
   *
   * However, even if one of them is null or undefined, the concatenation
   * completely goes bust, and null or undefined is returned respectively.
   *
   * @param {string[]} strArray - The strings to concatenate.
   *
   * @returns {?string} The concatenated string.
   */
  function concatOrBust (strArray) {
    var result = '';

    for (var i = 0;i < strArray.length; ++i) {
      var str = strArray[i];

      if (str === null || str === undefined) return str;

      result += str;
    }

    return result;
  }

  // The exposed functionality
  return {
    concatOrBust: concatOrBust
  };
})();
