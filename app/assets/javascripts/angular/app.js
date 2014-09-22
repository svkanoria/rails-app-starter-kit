// Angular entry point.
// Include all other modules here.
var app = angular.module('App', [
  'templates', // Used by angular-rails-templates
  'ngRoute',
  'ng-rails-csrf',

  // Services
  'AuthSvc',
  'Post',

  // Controllers
  'HomeCtrl',
  'PostsCtrl',

  // Directives
  'AuthenticationLinks',
  'FormErrors'
]);
