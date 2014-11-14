// Provides initial data for PostCtrl actions.
angular.module('PostCtrlInitSvc', ['Post']).
  factory('PostCtrlInitSvc', [
    '$route', 'Post',
    function($route, Post) {
      /**
       * Initial data for the 'index' action.
       * @returns {Object} The list of posts, as a promise.
       */
      var actionIndex = function () {
        return Post.query().$promise;
      };

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
        actionIndex: actionIndex,
        actionShow: actionShow,
        actionNew: actionNew,
        actionEdit: actionEdit
      };
    }]);
