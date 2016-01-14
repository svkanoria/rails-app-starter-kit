// A complete attachment and uploads management solution.
angular.module('AttachmentLibrary', [
  // Services
  'Attachment',
  'AttachmentJoin',
  'AttachmentLibrarySvc',
  'AttachmentViewerProvider',

  // Directives
  'AttachmentLibraryDirective',
  'AttachmentBrowser',
  'FineUploader',
  'AttachmentDrop',
  'AttachmentViewer',
  'UrlReferrer'
]);
