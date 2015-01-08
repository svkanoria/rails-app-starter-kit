var app = angular.module('App', [
  'templates', // Used by angular-rails-templates
  'ngRoute',
  'ngAnimate',
  'ng-rails-csrf',
  'flashular',

  // Constants
  'RouteUtils',

  // Services
  'AuthSvc',

  // Controllers
  'AppCtrl',
  'HomeCtrl',

  // Directives
  'AuthenticationLinks',
  'FormErrors',
  'PleaseWait',

  // Modules
  'ResourceUtils'
]);
