/*
 * Angular entry point.
 * Include all other modules here.
 */
var app = angular.module('App', [
  'templates', // Used by angular-rails-templates
  'ngRoute',
  'ngAnimate',
  'ng-rails-csrf',
  'flashular',

  // Services
  'AuthSvc',
  'RouteUtils',
  'Post',
  'PostsCtrlInitSvc',
  'AttachmentJoin',
  'Attachment',
  'AttachmentsCtrlInitSvc',

  // Controllers
  'AppCtrl',
  'HomeCtrl',
  'PostsCtrl',
  'AttachmentsCtrl',

  // Directives
  'AuthenticationLinks',
  'FormErrors',
  'PleaseWait',

  // Modules
  'ResourceUtils',
  'AttachmentLibrary'
]);
