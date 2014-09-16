angular.module('PostsCtrl', ['Post']).
  controller('PostsCtrl', ['$scope', 'Post', function($scope, Post) {
    $scope.create = function () {
      var post = new Post({
        message: this.message
      });

      post.$save(function (response) {
        // TODO Show post creation success message?
      }, function (failureResponse) {
        $scope.validateForm($scope['new-post-form'], failureResponse);
      });
    };

    /**
     * Extracts validation errors (if any) out of the failure response of an
     * AJAX request, and updates the form UI.
     * @param form - The form object.
     * @param failureResponse - The failure response from the error callback
     * of an Angular JSON request.
     */
    $scope.validateForm = function (form, failureResponse) {
      if (failureResponse.data.errors) {
        _.each(failureResponse.data.errors, function (errors, key) {
          var camelizedKey = _.camelize(key);

          _.each(errors, function (error) {
            var field = form[camelizedKey];

            field.$dirty = true;
            field.$setValidity(camelizedKey, false);
          });
        });
      }
    };

    /**
     * Populates scope.posts with a list of posts retrieved from the server.
     */
    $scope.find = function () {
      $scope.posts = Post.query();
    };
  }]);
