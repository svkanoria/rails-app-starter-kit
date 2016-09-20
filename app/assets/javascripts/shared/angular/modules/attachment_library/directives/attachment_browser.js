// The attachment browser, for use within the `attachment-library` directive.
angular.module('AttachmentBrowser', [
  'angularModalService', 'I18n', 'Flash', 'PleaseWait', 'DataTable',
  'QueryBuilder', 'Attachment', 'AttachmentLibrarySvc', 'AttachmentEditorCtrl'])
  .directive('attachmentBrowser', [
    '$rootScope', 'ModalService', 'I18n', 'Flash', 'PleaseWaitSvc',
    'Attachment', 'AttachmentLibrarySvc',
    function ($rootScope, ModalService, I18n, Flash, PleaseWaitSvc, Attachment,
              AttachmentLibrarySvc) {

      return {
        restrict: 'E',
        templateUrl: 'shared/directives/attachment_browser.html',
        replace: true,
        scope: {},

        link: {
          // The various options for the child directives (`query-builder` and
          // `datatable`) must be set during pre-link. By post-link, it will be
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

            /**
             * Updates desired usage counts in the data table.
             *
             * Designed to work off local data only, in the interests of speed.
             * The easiest way would have been to do an AJAX reload, to get the
             * latest usage counts, but would need a trip to the server.
             *
             * Update: It so happens that the `draw` function in the DataTables
             * API (which we rely on to draw the data table after updating its
             * data) also triggers a server request, so we're back to square
             * one! However, we keep the extra work intact, in the hope that
             * DataTables will fix this issue some day soon - after all, its
             * `.ajax.reload()` call already does the same thing as `.draw()`!!
             *
             * @param {number[]} attachmentIds - The ids of the attachments for
             *   which to updated usage counts.
             * @param {number} usageCountDelta - The amount to adjust the usage
             *   counts by (should generally be 1 or -1).
             */
            function updateUsageCounts (attachmentIds, usageCountDelta) {
              if (scope.dataTableInstance) {
                _.each(attachmentIds, function (attachmentId) {
                  var row = scope.dataTableInstance.row('#' + attachmentId);
                  var rowData = row.data();

                  if (rowData) {
                    rowData.joins_count += usageCountDelta;

                    // 'full-hold' means that current sorting, filtering and
                    // paging will 1) not be lost, and 2) be recomputed to take
                    // into account updated data.
                    scope.dataTableInstance.draw('full-hold');
                  }
                });
              }
            }

            //////////////////////
            // Procedural Stuff //
            //////////////////////

            scope.dataTableOptions = {
              serverSide: true,
              ajax: {
                url: I18n.l('/:locale/attachments.json'),
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
                },
                { data: 'joins_count' }
              ],
              // Ensure `table` element has an id for this to work!
              stateSave: true,
              // Save/load the query builder state along with the table state
              stateSaveParams: function (settings, data) {
                data.filters = scope.queryBuilderFilters;
              },
              stateLoadParams: function (settings, data) {
                scope.queryBuilderFilters = data.filters;
              },
              createdRow: function (row, data, dataIndex) {
                // The `attachment-drop` directive only accepts draggables with
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
            // This is populated by the `datatable` directive.
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
                    // It's a Bootstrap element, use `modal` to show it
                    modal.element.modal();
                  });
                }
              },
              delete: {
                icon: 'glyphicon-remove',
                action: function (rowId) {
                  I18n.confirm('Really delete attachment #' + rowId + '?',
                    'attachment_browser.really_delete_attachment_id',
                    { id: rowId }
                  ).then(function () {
                    PleaseWaitSvc.request();
                    // When performing an operation on a single row, unselect
                    // all rows to avoid any ambiguity about the scope of the
                    // operation.
                    scope.dataTableSelectedRows.length = 0;

                    Attachment.remove({ attachmentId: rowId }, null,
                      function (response) {
                        PleaseWaitSvc.release();
                        Flash.now.push('success', 'Attachment deleted.',
                          'attachment_browser.attachment_deleted');

                        AttachmentLibrarySvc.emitAttachmentsDeleted([rowId]);
                      }, function (failureResponse) {
                        PleaseWaitSvc.release();
                        if (failureResponse.data.error) {
                          // We assume messages from the server are localized,
                          // so we don't need to provide a translation id.
                          Flash.now.push('danger', failureResponse.data.error);
                        } else {
                          Flash.now.push('danger', 'Error deleting attachment.',
                            'attachment_browser.error_deleting_attachment');
                        }
                      });
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
                  I18n.confirm('Really delete attachments?',
                    'really_delete_attachments').then(function () {

                    PleaseWaitSvc.request();

                    Attachment.batch_destroy({},
                      { ids: scope.dataTableSelectedRows },
                      function (response) {
                        PleaseWaitSvc.release();
                        Flash.now.push('success', 'Attachments deleted.',
                          'attachment_browser.attachments_deleted');

                        AttachmentLibrarySvc.emitAttachmentsDeleted(
                          response.success_ids);

                        scope.dataTableSelectedRows.length = 0;
                      },
                      function (failureResponse) {
                        PleaseWaitSvc.release();

                        if (failureResponse.data.error) {
                          // We assume messages from the server are localized,
                          // so we don't need to provide a translation id.
                          Flash.now.push('danger', failureResponse.data.error);
                        } else {
                          Flash.now.push('danger',
                            'Error deleting attachments.',
                            'attachment_browser.error_deleting_attachments');
                        }
                      });
                  });
                }
              }
            };

            scope.queryBuilderOptions = {
              columns: [
                { name: 'name', label: 'Name', type: 'text',
                  translation_id: 'attachment_browser.columns.name' },
                // See query-builder for why 'id' column has type 'text'
                { name: 'id', label: 'ID', type: 'text',
                  translation_id: 'attachment_browser.columns.id' },
                { name: 'created_at', label: 'Created At', type: 'date',
                  translation_id: 'attachment_browser.columns.created_at' },
                { name: 'joins_count', label: '# Usages', type: 'number',
                  translation_id: 'attachment_browser.columns.num_usages' }
              ],
              onSubmit: function () {
                scope.dataTableInstance.ajax.reload(); // Reload the data table
              }
            };

            $rootScope.$on('attachment_library.upload_successful', function () {
              if (scope.dataTableInstance) {
                // Reorder by last created, to ensure latest upload is visible.
                // Because of the additional row selection column added by the
                // `datatable` directive, the 'created_at' column gets shifted
                // over to index 3.
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

            $rootScope.$on('attachment_library.attachments_attached',
              function (event, data) {
                updateUsageCounts(data, 1);
              });

            $rootScope.$on('attachment_library.attachments_detached',
              function (event, data) {
                updateUsageCounts(data, -1);
              });
          }
        }
      };
    }]);
