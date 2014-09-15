// Angular entry point.
// Include all other modules here.
var app = angular.module('App', [
  'templates', // Used by angular-rails-templates
  'ngRoute',

  // Services
  'Post',

  // Controllers
  'HomeCtrl',
  'PostsCtrl',

  // Directives
  'AuthLinks'
]);
