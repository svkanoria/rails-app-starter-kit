var app = angular.module('App', [
  'templates', // Used by angular-rails-templates
  'ngRoute',
  'ngAnimate',
  'ng-rails-csrf',
  'flashular',

  // Services
  'AuthSvc',
  'RouteUtils',

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
