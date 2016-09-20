/*
 * Methods for adapting array responses containing metadata (such as total
 * count, remaining count etc.) into a regular Angular resource array, while
 * still keeping intact the metadata for further use.
 *
 * See the adaptToArray method.
 */
angular.module('ArrayMetadataResponseAdapter', [])
  .factory('ArrayMetadataResponseAdapter', [
    function () {
      /**
       * Adapts non-array responses into array ones.
       *
       * It is common for the index action of a server to return some metadata
       * along with the list of results, somewhat like this:
       *   {
       *     metadata: {
       *       total: 1000
       *     },
       *     items: [
       *       { ... },
       *       { ... },
       *         :
       *         :
       *     ]
       *   }
       *
       * Here, the standard $resource fails, as it needs a plain array.
       * Use this method to adapt the response to an array format, while still
       * keeping intact the metadata for further use. This metadata can be
       * retrieved through the `$metadata` property of the final result.
       *
       * Usage:
       *   In the resource file, do something like this:
       *
       *   angular.module('SomeModule', ['ngResource', 'ResourceUtils']).
       *     factory('SomeResource', [
       *       '$resource', 'ArrayMetadataResponseAdapter',
       *       function($resource, ArrayMetadataResponseAdapter) {
       *         return $resource(
       *             :
       *             :
       *           // Extra/overridden methods
       *           {
       *             query: ArrayMetadataResponseAdapter.adaptToArray(
       *               'results', 'extra', {
       *                 method: 'GET'
       *               }),
       *               :
       *               :
       *           });
       *       }]);
       *
       * @param {string} arrayKey - The response property containing the items.
       * @param {string} metadataKey - The response property containing the
       *   metadata.
       * @param {Object} opts - The properties you would have normally assigned
       *   directly to the $resource method.
       *
       * @returns {Object} The above opts, extended as required.
       */
      var adaptToArray = function (arrayKey, metadataKey, opts) {
        return _.extend({
          isArray: true,
          transformResponse: extractArray(arrayKey, metadataKey),
          interceptor: {
            response: passMetadata()
          }
        }, opts);
      };

      /**
       * Extracts out the array from a "wrapped" array response.
       * Called by `adaptToArray`.
       *
       * Can be used directly for more fine-grained control.
       * However, the `adaptToArray` method can successfully handle most cases.
       *
       * @param {string} arrayKey - The response property containing the items.
       * @param {string} metadataKey - The response property containing the
       *   metadata.
       *
       * @returns {Function} A function that can be assigned to the
       *   `transformResponse` property of a `$resource` method.
       */
      var extractArray = function (arrayKey, metadataKey) {
        arrayKey = arrayKey || 'items';
        metadataKey = metadataKey || 'metadata';

        return function (data) {
          if (!data) return data;

          var wrappedResult = angular.fromJson(data);
          wrappedResult[arrayKey].$metadata = wrappedResult[metadataKey];

          return wrappedResult[arrayKey];
        };
      };

      /**
       * Passes through the metadata for further use.
       * Called by `adaptToArray`.
       *
       * Can be used directly for more fine-grained control.
       * However, the `adaptToArray` method can successfully handle most cases.
       *
       * @returns {Function} A function that can be used as follows:
       *   some_method: {
       *       :
       *     interceptor: {
       *       response: ArrayMetadataResponseAdapter.passMetadata()
       *     }
       *   }
       */
      var passMetadata = function () {
        return function (response) {
          if (response.data) {
            response.resource.$metadata = response.data.$metadata;
          }

          return response.resource;
        };
      };

      // Return the service object
      return {
        adaptToArray: adaptToArray,
        extractArray: extractArray,
        passMetadata: passMetadata
      };
    }]);
