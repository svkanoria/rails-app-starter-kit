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

  // Modules
  'ResourceUtils',
  'QueryBuilder'
]);

app.config([
  'QBEditorProvider',
  function (QBEditorProvider) {
    QBEditorProvider.addEditorFactory({
      createEditorHtml: function (columnType, op) {
        // return some HTML
      }
    });
  }]);
