/*
 * A directive for the video.js player.
 * See http://www.videojs.com/.
 *
 * Usage:
 *   <video-js player-id="some-id"
 *             ?options="Object expr">
 *     :
 *   </video-js>
 */
angular.module('VideoJS', []).
  directive('videoJs', [
    function () {
      return {
        restrict: 'E',
        templateUrl: 'shared/directives/video_js.html',
        replace: false,
        transclude: true,

        scope: {
          options: '='
        },

        link: function (scope, element, attrs) {
          scope.playerId = attrs.playerId;

          var player = videojs(scope.playerId, scope.options || {});
        }
      };
    }]);
