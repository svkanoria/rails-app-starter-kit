/*
 * A directive to view published Google Docs documents.
 *
 * Usage: ('!' indicates the attribute is watched for changes)
 *   <g-docs-viewer !url="String expr"></g-docs-viewer>
 */
angular.module('GDocsViewer', [])
  .directive('gDocsViewer', [
    '$sce',
    function ($sce) {
      return {
        restrict: 'E',
        templateUrl: 'shared/directives/g_docs_viewer.html',

        scope: {
          url: '<'
        },

        link: function (scope, element, attrs) {
          scope.trustedUrl = null;

          scope.$watch('url', function (value) {
            if (value) {
              var embeddedUrl = (_.endsWith(value, '/pub'))
                ? value + '?embedded=true'
                : value;

              scope.trustedUrl = $sce.trustAsResourceUrl(embeddedUrl);
            } else {
              scope.trustedUrl = null;
            }
          });
        }
      };
    }]);
