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
  'ServerFlashSvc',
  'Post',

  // Controllers
  'HomeCtrl',
  'PostsCtrl',

  // Directives
  'AuthenticationLinks',
  'FormErrors'
]);

// Convert any server flash messages to flashular flash messages
app.run(['ServerFlashSvc', function(ServerFlashService) {
  ServerFlashService.convert();
}]);
