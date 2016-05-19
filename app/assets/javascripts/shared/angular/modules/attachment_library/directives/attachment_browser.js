// The attachment browser, for use within the attachment-library directive.
angular.module('AttachmentBrowser', [
  'angularModalService', 'Flash', 'PleaseWait', 'DataTable', 'QueryBuilder',
  'Attachment', 'AttachmentLibrarySvc', 'AttachmentEditorCtrl'])
  .directive('attachmentBrowser', [
    '$rootScope', 'ModalService', 'Flash', 'PleaseWaitSvc', 'Attachment',
    'AttachmentLibrarySvc',
    function ($rootScope, ModalService, Flash, PleaseWaitSvc, Attachment,
              AttachmentLibrarySvc) {

      return {
        restrict: 'E',
        templateUrl: 'shared/directives/attachment_browser.html',
        replace: true,
        scope: {},

        link: {
          // The various options for the child directives (query-builder and
          // datatable) must be set during pre-link. By post-link, it will be
          // too late, as the children will be linked already.
          pre: function (scope, element, attrs) {
            //////////////////
            // Helper Stuff //
            //////////////////

            /**
             * Returns the name rendered using custom HTML.
             * Parameters are as required by the DataTables API.
             *
             * @returns {string} HTML string.
             */
            function renderName (data, type, row, meta) {
              return '<span>'
                + '<img src="' + row.thumb + '"> '
                + '<a ui-sref="app.attachments.show({ id:' + row.id + ' })"'
                    + ' target="_blank" title="' + data + '">'
                  + _.truncate(data, 35)
                  + ' <span class="glyphicon glyphicon-new-window"></span>'
                + '</a></span>';
            }

            //////////////////////
            // Procedural Stuff //
            //////////////////////

            scope.dataTableOptions = {
              serverSide: true,
              ajax: {
                url: '/attachments.json',
                data: function (d) {
                  // Just add the query builder filters to all AJAX requests
                  // sent by the data table!
                  d.filters = scope.queryBuilderFilters;
                }
              },
              searching: false, // Since we are using query builder
              processing: true, // Show the 'processing' indicator
              columns: [
                { data: 'id' },
                { data: 'name', render: renderName },
                { data: 'created_at',
                  render: function (data, type, row, meta) {
                    return moment(data).format('lll');
                  }
                }
              ],
              // Ensure table element has an id for this to work!
              stateSave: true,
              // Save/load the query builder state along with the table state
              stateSaveParams: function (settings, data) {
                data.filters = scope.queryBuilderFilters;
              },
              stateLoadParams: function (settings, data) {
                scope.queryBuilderFilters = data.filters;
              },
              createdRow: function (row, data, dataIndex) {
                // The attachment-drop directive only accepts draggables with
                // this class.
                $(row).addClass('droppable-attachment');

                $(row).draggable({
                  helper: function (event) {
                    return '<div class="attachment-drag-helper">'
                      + data.id + ': ' + data.name + '</div>';
                  },
                  appendTo: 'body',
                  cursor: 'crosshair',
                  cursorAt: { left: 5 },
                  start: function (event) {
                    // Hide attachment library, so that it doesn't obstruct any
                    // drop zones
                    AttachmentLibrarySvc.toggleMinimized();
                    scope.$apply();
                  }
                });
              }
            };

            // The 'raw' data table instance.
            // This is populated by the 'datatable' directive.
            scope.dataTableInstance = null;

            // For operations on a single row
            scope.dataTableRowOps = {
              edit: {
                icon: 'glyphicon-pencil',
                action: function (rowId) {
                  var rowData = scope.dataTableInstance.row('#' + rowId).data();

                  // For angular-modal-service usage, see
                  // https://github.com/dwmkerr/angular-modal-service.
                  ModalService.showModal({
                    templateUrl: 'shared/controllers/attachment_editor.html',
                    controller: 'AttachmentEditorCtrl',
                    inputs: {
                      attachment: rowData
                    }
                  }).then(function(modal) {
                    // It's a Bootstrap element, use 'modal' to show it
                    modal.element.modal();
                  });
                }
              },
              delete: {
                icon: 'glyphicon-remove',
                action: function (rowId) {
                  if (!window.confirm(
                      'Really delete attachment #' + rowId + '?')) return;

                  PleaseWaitSvc.request();
                  // When performing an operation on a single row, unselect all
                  // rows to avoid any ambiguity about the scope of the
                  // operation.
                  scope.dataTableSelectedRows.length = 0;

                  Attachment.remove({ attachmentId: rowId }, null,
                    function (response) {
                      PleaseWaitSvc.release();
                      Flash.now.push('success', 'Attachment deleted.');

                      AttachmentLibrarySvc.emitAttachmentsDeleted([rowId]);
                    }, function (failureResponse) {
                      PleaseWaitSvc.release();
                      Flash.now.push('danger',
                        failureResponse.data.error || 'Error deleting attachment.');
                    });
                }
              }
            };

            // To enable row selection
            scope.dataTableSelectedRows = [];

            // For bulk operations on currently selected rows
            scope.dataTableBulkOps = {
              deleteAll: {
                name: 'Delete all',
                action: function () {
                  if (!window.confirm('Really delete selected attachments?')) {
                    return;
                  }

                  PleaseWaitSvc.request();

                  Attachment.batch_destroy({},
                    { ids: scope.dataTableSelectedRows },
                    function (response) {
                      PleaseWaitSvc.release();
                      Flash.now.push('success', 'Attachments deleted.');

                      AttachmentLibrarySvc.emitAttachmentsDeleted(
                        response.success_ids);

                      scope.dataTableSelectedRows.length = 0;
                    },
                    function (failureResponse) {
                      PleaseWaitSvc.release();
                      Flash.now.push('danger',
                        failureResponse.data.error || 'Error deleting attachments.');
                    });
                }
              }
            };

            scope.queryBuilderOptions = {
              columns: [
                { name: 'name', label: 'Name', type: 'text' },
                // See query-builder for why 'id' column has type 'text'
                { name: 'id', label: 'ID', type: 'text' },
                { name: 'created_at', label: 'Created At', type: 'date' }
              ],
              onSubmit: function () {
                scope.dataTableInstance.ajax.reload(); // Reload the data table
              }
            };

            $rootScope.$on('attachment_library.upload_successful', function () {
              if (scope.dataTableInstance) {
                // Reorder by last created, to ensure latest upload is visible.
                // Due to the extra row selection column added by the datatable
                // directive, the created_at column is shifted over to index 3.
                scope.dataTableInstance.order([3, 'desc']);

                scope.dataTableInstance.ajax.reload();
              }
            });
            
            _.each([
              'attachment_library.attachment_updated',
              'attachment_library.attachments_deleted'],
              function (event) {
                $rootScope.$on(event, function () {
                  if (scope.dataTableInstance) {
                    scope.dataTableInstance.ajax.reload();
                  }
                });
              });
          }
        }
      };
    }]);
