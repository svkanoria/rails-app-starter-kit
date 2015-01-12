// Provides initial data for PostsCtrl actions.
angular.module('PostsCtrlInitSvc', ['Post']).
  factory('PostsCtrlInitSvc', [
    '$route', 'Post',
    function($route, Post) {
      // The 'index' action data is fetched directly in the controller.
      // Hence there is no 'actionIndex' method here.

      /**
       * Initial data for the 'show' action.
       * @returns {Object} The post corresponding to the current route, as a
       * promise.
       */
      var actionShow = function () {
        return Post.get({ postId: $route.current.params.id }).$promise;
      };

      /**
       * Initial data for the 'new' action.
       * @returns {Post} A new unsaved post.
       */
      var actionNew = function () {
        return new Post({
          message: '' // It is good practice to initialize to non-null values
        });
      };

      /**
       * Initial data for the 'edit' action.
       * @returns {Object} The post corresponding to the current route, as a
       * promise.
       */
      var actionEdit = function () {
        return Post.get({ postId: $route.current.params.id }).$promise;
      };

      // Return the service object
      return {
        actionShow: actionShow,
        actionNew: actionNew,
        actionEdit: actionEdit
      };
    }]);
