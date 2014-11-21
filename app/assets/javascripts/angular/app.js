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
  'Post',
  'PostsCtrlInitSvc',

  // Controllers
  'AppCtrl',
  'HomeCtrl',
  'PostsCtrl',

  // Directives
  'AuthenticationLinks',
  'FormErrors',
  'PleaseWait'
]);
