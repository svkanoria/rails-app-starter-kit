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
  'User',
  'UsersCtrlInitSvc',

  // Controllers
  'AppCtrl',
  'HomeCtrl',
  'PostsCtrl',
  'UsersCtrl',

  // Directives
  'AuthenticationLinks',
  'FormErrors',
  'PleaseWait',
  'DataTable',
  'DateTimePicker',
  'Selectize',

  // Filters
  'StringFilters',

  // Modules
  'ResourceUtils',
  'QueryBuilder'
]);

app.config([
  'QBEditorProvider',
  function (QBEditorProvider) {
    QBEditorProvider.addEditorFactory({
      createEditorHtml: function (column, op) {
        if (column.type === 'date') {
          var editorHtml = '';
          var opArity = (op === 'range') ? 2 : 1;

          for (var i = 0; i < opArity; ++i) {
            editorHtml +=
              '<date-time-picker class="filter-value"'
                + ' ng-model="model.values[' + i + ']"'
                + ' options="{ format: \'LL\' }">' +
              '</date-time-picker>'
          }

          return editorHtml;
        }
      }
    });
  }]);
