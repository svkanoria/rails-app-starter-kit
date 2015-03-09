/*
 * The media library directive.
 */
angular.module('MediaLibraryDirective', ['MediaLibrarySvc']).
  directive('mediaLibrary', [
    'MediaLibrarySvc',
    function (MediaLibrarySvc) {
      return {
        restrict: 'E',
        templateUrl: 'shared/directives/media_library.html',
        replace: true,
        scope: {},

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
