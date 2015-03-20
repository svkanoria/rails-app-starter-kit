/*
 * The media library directive.
 *
 * Usage:
 *   <media-library uploader-options="Object expr">
 *   </media-library>
 *
 * The uploader options are passed to the uploader directive.
 * We provide one uploader (which we then use by default): The 'fine-uploader'
 * directive. However, you can create you own if you wish. If you do roll your
 * own, you must also modify this directive's template to use your uploader
 * instead:
 * /app/assets/javascripts/templates/shared/directives/media_library.html
 */
angular.module('MediaLibraryDirective', ['MediaLibrarySvc']).
  directive('mediaLibrary', [
    'MediaLibrarySvc',
    function (MediaLibrarySvc) {
      return {
        restrict: 'E',
        templateUrl: 'shared/directives/media_library.html',
        replace: true,

        scope: {
          uploaderOptions: '='
        },

        link: function (scope, element, attrs) {
          scope.$watch(MediaLibrarySvc.getDisplayMode, function (value) {
            scope.displayMode = value;
          });

          // By default, show iff any uploads are in progress.
          // To show or hide completely in any view, the view's controller must
          // set the display mode explicitly, to 'show' or 'hide'.
          scope.$on('$routeChangeStart', function () {
            MediaLibrarySvc.setDisplayMode('progress');
          });
        }
      }
    }]);
