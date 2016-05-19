/*
 * Controller for app settings.
 *
 * When adding a new category of settings, you need to do the following:
 * * Add it on the server side (of course!)
 * * Create a template file named after the category in the
 *   /app/assets/javascripts/templates/admin/angular/controllers/app_settings
 *   directory, for displaying its settings on screen. For example, for a
 *   category called 'outgoing_email', create a template file called
 *   'outgoing_email.html'.
 * * In the above-mentioned template file, be sure to include something like a
 *   'submit' button, which when clicked, calls 'updateSettings()' to update
 *   the server. Also note that any validation errors from the server are made
 *   available on the 'settingsErrors' scope variable.
 * * Insert the appropriate entry into the 'categories' scope variable below
 */
angular.module('AppSettingsCtrl', ['Flash'])
  .controller('AppSettingsCtrl', [
    '$scope', '$http', '$state', 'Flash', 'initialData', 'initialData2',
    function($scope, $http, $state, Flash, initialData, initialData2) {
      $scope.category = initialData;
      $scope.settings = initialData2.data;

      /**
       * Submits the settings currently on screen to the server.
       */
      $scope.updateSettings = function () {
        $scope.pleaseWaitSvc.request();

        $http.put('/admin/app_settings.json', {
          category: $scope.category,
          settings: $scope.settings
        }).then(function (response) {
          Flash.now.push('success', 'Settings updated.');
          $scope.pleaseWaitSvc.release();
          $scope.settingsErrors = null;

          $scope.navConfirmationSvc.setConfirmNav(false);
        }, function (failureResponse) {
          $scope.pleaseWaitSvc.release();
          $scope.settingsErrors = failureResponse.data.errors;
        });
      };

      // A list of categories (and their display labels) used by the UI to
      // populate the app settings navigation menu. This keeps the UI DRY, by
      // not having to manually repeat the boilerplate HTML for every category
      // added.
      $scope.categories = [
        { category: 'outgoing_email', label: 'Outgoing Email' }
      ];
    }]);
