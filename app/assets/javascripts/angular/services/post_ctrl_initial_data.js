// Provides initial data for PostCtrl actions.
angular.module('PostCtrlInitialData', ['Post']).
  factory('PostCtrlInitialData', [
    '$route', 'Post',
    function($route, Post) {
      /**
       * Initial data for the 'index' action.
       * @returns {*}
       */
      var actionIndex = function () {
        return Post.query();
      };

      /**
       * Initial data for the 'show' action.
       * @returns {*}
       */
      var actionShow = function () {
        return Post.get({ postId: $route.current.params.id });
      };

      /**
       * Initial data for the 'new' action.
       * @returns {Post}
       */
      var actionNew = function () {
        return new Post({
          message: '' // It is good practice to initialize to non-null values
        });
      };

      /**
       * Initial data for the 'edit' action.
       * @returns {*}
       */
      var actionEdit = function () {
        return Post.get({ postId: $route.current.params.id });
      };

      // Return the service object
      return {
        actionIndex: actionIndex,
        actionShow: actionShow,
        actionNew: actionNew,
        actionEdit: actionEdit
      };
    }]);
