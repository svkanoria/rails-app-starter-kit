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
  'PostsCtrl',

  // Directives
  'AuthenticationLinks',
  'FormErrors',
  'PleaseWait',
  'DataTable',
  'QueryBuilder',

  // Modules
  'ResourceUtils'
]);
