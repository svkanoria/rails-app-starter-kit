/*
 * Creates resources whose requests can be canceled.
 *
 * A drop-in replacement for $resource.
 * Just replace $resource with CancelableResourceFactory.createResource.
 *
 * Adapted from:
 * * http://stackoverflow.com/questions/21666960/how-to-cancel-resource-requests
 * * https://developer.rackspace.com/blog/cancelling-ajax-requests-in-angularjs-applications
 */
angular.module('CancelableResourceFactory', ['ngResource'])
  .factory('CancelableResourceFactory', [
    '$q', '$resource',
    function($q, $resource) {
      /**
       * Wraps the standard promise returned by a $resource.
       *
       * @param {Object} promise - The original resource promise.
       * @param {Object} deferred - A deferred object, to wrap the promise.
       * @param {Array<Object>} outstanding - Currently outstanding requests.
       */
      var abortablePromiseWrap = function (promise, deferred, outstanding) {
        promise.then(function () {
          deferred.resolve.apply(deferred, arguments);
        });

        promise.catch(function () {
          deferred.reject.apply(deferred, arguments);
        });

        // Remove from outstanding array on abort, when deferred is rejected
        // and/or promise is resolved/rejected.
        deferred.promise.finally(function () {
          var index = _.indexOf(outstanding, deferred);
          outstanding.splice(index, 1);
        });

        outstanding.push(deferred);
      };

      /**
       * Creates a resource whose requests can be cancelled.
       * Just replace $resource with CancelableResourceFactory.createResource.
       *
       * @param {String} url - The resource URL.
       * @param {Object} options - The resource options.
       * @param {Object} actions - The various resource actions.
       *
       * @returns {Object} - An object as returned by $resource.
       */
      var createResource = function (url, options, actions) {
        var resource;
        var outstanding = [];
        actions = actions || {};

        Object.keys(actions).forEach(function(action) {
          var canceller = $q.defer();
          actions[action].timeout = canceller.promise;
          actions[action].Canceller = canceller;
        });

        resource = $resource(url, options, actions);

        Object.keys(actions).forEach(function(action) {
          var method = resource[action];

          resource[action] = function() {
            var deferred = $q.defer();
            var promise = method.apply(null, arguments).$promise;

            abortablePromiseWrap(promise, deferred, outstanding);

            return {
              $promise: deferred.promise,

              abort: function() {
                deferred.reject('Aborted');
              },

              cancel: function() {
                actions[action].Canceller.resolve('Call cancelled');

                // Recreate the canceler so that request can be executed again
                var canceller = $q.defer();
                actions[action].timeout = canceller.promise;
                actions[action].Canceller = canceller;
              }
            };
          };
        });

        /**
         * Aborts all the outstanding requests on this resource.
         * Calls promise.reject() on outstanding array.
         */
        resource.abortAll = function() {
          for (var i = 0; i < outstanding.length; i++) {
            outstanding[i].reject('Aborted all');
          }

          outstanding = [];
        };

        return resource;
      };

      // Return the service object
      return {
        createResource: createResource
      };
    }
  ]);
