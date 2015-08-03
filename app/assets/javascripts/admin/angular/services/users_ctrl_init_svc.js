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

      /**
       * Initial data for the 'edit' action.
       *
       * @returns {Object} The post corresponding to the current route, as a
       * promise.
       */
      var actionEdit = function () {
        return User.edit({ userId: $route.current.params.id }).$promise;
      };

      // Return the service object
      return {
        actionNew: actionNew,
        actionEdit: actionEdit
      };
    }]);
