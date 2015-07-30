// Provides initial data for UsersCtrl actions.
angular.module('UsersCtrlInitSvc', ['User'])
  .factory('UsersCtrlInitSvc', [
    '$route', 'User',
    function($route, User) {
      // The 'index' action data is fetched directly in the controller.
      // Hence there is no 'actionIndex' method here.

      /**
       * Initial data for the 'new' action.
       *
       * @returns {User} A new unsaved user.
       */
      var actionNew = function () {
        return new User({
          email: '', // It is good practice to initialize to non-null values
          password: '',
          password_confirmation: ''
        });
      };

      // Return the service object
      return {
        actionNew: actionNew
      };
    }]);
