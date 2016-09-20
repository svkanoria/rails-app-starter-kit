// All array related utilities.
var ArrayUtils = (function () {
  /**
   * Removes an item from an array.
   *
   * @param {Object[]} array - The array.
   * @param {Object} item - The item to remove.
   *
   * @returns {number} The removed item's index (or -1 if nothing removed).
   */
  function remove (array, item) {
    var index = _.indexOf(array, item);

    if (index >= 0) array.splice(index, 1);

    return index;
  }

  // The exposed functionality
  return {
    remove: remove
  };
})();
