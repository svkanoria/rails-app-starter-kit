// A complete attachment and uploads management solution.
angular.module('AttachmentLibrary', [
  // Services
  'Attachment',
  'AttachmentJoin',
  'AttachmentLibrarySvc',
  'AttachmentViewerProvider',

  // Controllers
  'AttachmentEditorCtrl',

  // Directives
  'AttachmentLibraryDirective',
  'AttachmentBrowser',
  'FineUploader',
  'AttachmentDrop',
  'AttachmentViewer',
  'UrlReferrer'
]);
