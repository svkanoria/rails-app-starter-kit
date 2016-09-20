/*
 * A directive for the JWPlayer video player.
 * See http://support.jwplayer.com.
 *
 * Usage:
 *   <div jw-player id="some-id"
 *                  options="Object expr">
 *   </div>
 */
angular.module('JWPlayer', [])
  .directive('jwPlayer', [
    function () {
      /**
       * Sensible defaults likely to always apply.
       * Can be overridden by any options directly passed to the directive.
       *
       * @type {Object}
       */
      var DEFAULT_OPTS = {
        width: '100%',
        aspectratio: '16:9'
      };

      return {
        restrict: 'A',

        scope: {
          options: '<'
        },

        link: function (scope, element, attrs) {
          var finalOpts = {};
          _.extend(finalOpts, DEFAULT_OPTS, scope.options);

          jwplayer(attrs.id).setup(finalOpts);
        }
      }
    }]);
