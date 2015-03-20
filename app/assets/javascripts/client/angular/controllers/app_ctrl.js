/*
 * The 'top level' controller.
 * Conceptually, this is much like the ApplicationController in Rails.
 * Anything added to its scope will be available to all other controllers, and
 * subsequently views.
 */
angular.module('AppCtrl', ['AuthSvc', 'PleaseWait']).
  controller('AppCtrl', [
    '$scope', 'AuthSvc', 'PleaseWaitSvc',
    function($scope, AuthSvc, PleaseWaitSvc) {
      $scope.authSvc = AuthSvc;
      $scope.pleaseWaitSvc = PleaseWaitSvc;

      // For the media library uploader directive declared in the Rails layout
      // file
      $scope.uploaderOptions = {
        debug: CommonInfo.env == 'development',
        request: {
          endpoint: CommonInfo.aws_s3_bucket + '.s3.amazonaws.com',
          accessKey: CommonInfo.aws_access_key_id
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
        retry: {
          enableAuto: true // defaults to false
        },
        deleteFile: {
          enabled: true,
          endpoint: '/fine_uploader/s3_delete_file'
        }
      };
    }]);
