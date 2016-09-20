/*
 * The 'top level' controller.
 * Conceptually, this is much like the `ApplicationController` in Rails.
 * Anything added to its scope will be available to all other controllers, and
 * subsequently views.
 */
angular.module('AppCtrl', ['AuthSvc', 'PleaseWait', 'RouteUtils'])
  .controller('AppCtrl', [
    '$scope', 'AuthSvc', 'PleaseWaitSvc', 'NavConfirmationSvc',
    function($scope, AuthSvc, PleaseWaitSvc, NavConfirmationSvc) {
      // Near-ubiquitous functionality, added to this scope to prevent
      // repetition in each controller.
      $scope.authSvc = AuthSvc;
      $scope.pleaseWaitSvc = PleaseWaitSvc;
      $scope.navConfirmationSvc = NavConfirmationSvc;

      // For the attachment library directive declared in the Rails application
      // layout.

      $scope.uploaderOptions = {
        debug: Static.env == 'development',
        request: {
          endpoint: Static.aws_s3_bucket + '.s3.amazonaws.com',
          accessKey: Static.aws_access_key_id
        },
        signature: {
          endpoint: '/fine_uploader/s3_signature'
        },
        uploadSuccess: {
          endpoint: '/fine_uploader/s3_upload_success'
        },
        iframeSupport: {
          localBlankPagePath: '/upload_success.html'
        },
        objectProperties: {
          key: function (id) {
            var prefix = (AuthSvc.currentUser())
              ? 'uploads/users/' + AuthSvc.currentUser().id
              : 'uploads/common';

            // `getUuid` and `getName` are part of the FineUploader API
            return prefix + '/' + this.getUuid(id) + '_' + this.getName(id);
          }
        },
        retry: {
          enableAuto: true // Defaults to false
        },
        chunking: {
          enabled: true
        },
        resume: {
          enabled: true
        }
      };

      // Localize FineUploader
      _.extend($scope.uploaderOptions, Static.fine_uploader_messages || {});
    }]);
