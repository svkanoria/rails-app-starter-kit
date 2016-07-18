angular.module('AttachmentsCtrl', ['Attachment'])
  .controller('AttachmentsCtrl', [
    '$scope', 'Attachment', 'initialData',
    function ($scope, Attachment, initialData) {
      /**
       * The 'show' action.
       */
      $scope.actionShow = function () {
        $scope.attachment = initialData;

        $scope.dataTableOptions = {
          data: $scope.attachment.joins,
          columns: [
            {
              render: function (data, type, row, meta) {
                var resource = _.underscored(row.owner_type);
                var routerState = 'app.' + resource + 's.show';
                var fullRouterState =
                  routerState + '({ id: ' + row.owner_id + ' })"';

                var html =
                  '<a ui-sref="' + fullRouterState + '" target="_blank">'
                    + row.owner_type + ' #' + row.owner_id +
                  '</a>';

                return html;
              }
            },
            { data: 'created_at',
              render: function (data, type, row, meta) {
                return moment(data).format('lll');
              }
            }
          ],
          order: [[1, 'desc']]
        };

        $scope.dataTableInstance = null;
      };
    }]);
