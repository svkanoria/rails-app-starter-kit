// All object related utilities.
var ObjectUtils = (function () {
  /**
   * "Pushes" a value to an object property, rather than "set" it.
   *
   * This allows you to add multiple values to an object property. Basically,
   * this just makes the object property hold an array of all the values you
   * push into it.
   *
   * @param {Object} obj  - The object.
   * @param {string} property - The object property.
   * @param {Object} value - The value to push into the property.
   */
  function pushToProperty (obj, property, value) {
    var values = (obj[property]) ? obj[property] : (obj[property] = []);

    values.push(value);
  }

  // The exposed functionality
  return {
    pushToProperty: pushToProperty
  };
})();
