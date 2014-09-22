/*
 * Authentication and authorization service.
 *
 * Retrieves signed in user data from the global 'CurrentUser' variable set on
 * the server side.
 *
 * Authentication occurs via the 'devise' gem, whose workflow is deliberately
 * kept outside of Angular.
 *
 * Authorization is checked via simple rules defined herein. Add/modify rules
 * based on your requirements.
 */
angular.module('AuthSvc', []).
  factory('AuthSvc', [function () {
    /**
     * Gets the currently logged in user's details, if any.
     * @returns {*} Logged in user details, or null.
     */
    var currentUser = function () {
      return CurrentUser;
    };

    return {
      currentUser: currentUser
    };
  }]);
