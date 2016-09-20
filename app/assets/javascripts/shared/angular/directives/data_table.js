/*
 * A directive for jQuery DataTables.
 * See http://datatables.net/.
 * Note the slight aberration in the name of the directive. Ideally, it should
 * be 'data-table', but because of the special treatment of 'data-' attributes
 * in HTML, we have named it 'datatable'.
 *
 * Usage: ('!' indicates the attribute is watched for changes)
 *   <table datatable
 *          ?options="Object expr",
 *          ?instance="Empty expr"
 *          ?row-ops="Object expr"
 *          !?selected-rows="Array expr"
 *          ?bulk-ops="Object expr"
 *          ?expanded-row-info="Function expr">
 *     :
 *   </table>
 *
 * The `instance` expression is populated with the underlying 'raw' data table.
 * This exposes the entire DataTables functionality to the controller. Using it
 * for readonly operations without side effects is perfectly safe, but
 * otherwise, use with care!
 *
 * Custom row operations (such as edit/delete), to be carried out on a single
 * row, can be defined via the `row-ops` attribute, as follows:
 *
 *   {
 *     rowOpKey1: {
 *       icon: 'glyphicon-something',
 *       ?link: function (rowId) { // return a link (eg. to the edit page) },
 *       ?action: function (rowId) { // Do some action (such as delete)... }
 *     },
 *     rowOpKey2: { ... },
 *      :
 *   }
 *
 * The icon provided must be a Glyphicon, for now.
 * TODO Remove datatable directive's dependency on Glyphicons
 * Either `link` or `action` must be provided, but not both.
 *
 * The `selected-rows` expression, when provided, enables row selection, and is
 * 2-way bound with the currently selected rows. Row selection has certain
 * requirements: see `addRowSelectionUI` documentation below.
 *
 * Custom bulk operations (such as bulk delete), to be carried out on currently
 * selected rows, can be defined via the `bulk-ops` attribute, as follows:
 *
 *   {
 *     bulkOpKey1: {
 *       name: 'some name',
 *       action: function () { // Do some action (such as bulk delete)... },
 *       ?translation_id: 'see i18n information below'
 *     },
 *     bulkOpKey2: { ... },
 *      :
 *   }
 *
 * The `expanded-row-info` expression, when provided, enables each row to expand
 * and show any custom information desired. The expression must evaluate to
 * a function, as follows:
 *
 *   function someName (data) { // where `data` is the row data object
 *     // The returned HTML can also contain directives. These directives are
 *     // compiled using a newly constructed scope, with just one property, viz.
 *     // 'data', that contains the row data.
 *     return someHtmlConstructedFromData;
 *   }
 *
 * Translations for columns and all strings displayed (messages, bulk op names
 * etc.) can be provided as follows:
 *
 * Columns:
 *   Translation ids are constructed as follows:
 *
 *     "some-table-id-or-'data_table'.columns.data-prop-of-column-or-def"
 *
 *   These can also be overridden. For a complete understanding of the rules of
 *   construction, see the `translateTableHeadFoots` function documentation.
 *   
 * Messages:
 *   The following translation ids are available:
 *
 *     * 'data_table.total_rows_selected'
 *
 * Bulk operation names:
 *   Translation ids are constructed as follows:
 *
 *     'data_table.key-in-object-passed-to-directive-thru-bulk-ops-attr'
 *
 *   The 'selectAll' bulk op is included by default. Other bulk ops are to be
 *   defined by you, the programmer. Such an id is constructed for each one.
 *
 *   It is possible to override the translation id, either partially or fully,
 *   on a per-bulk-op basis, by specifying a `translation_id` property as shown
 *   further up. If the value of the property begins with a '.', it replaces
 *   only the 'key-in-object...' portion, otherwise it overrides it completely.
 */
angular.module('DataTable', ['I18n'])
  .directive('datatable', [
    '$compile', '$q', '$timeout', 'I18n',
    function ($compile, $q, $timeout, I18n) {
      /**
       * Instructs the data table to use the current locale, if set.
       *
       * The data table then requests the translations file from
       * /public/locales/data_table.locale-id.json,
       * where 'locale-id' is something like 'en', 'hi' etc. So, ensure the
       * existence of such a file for each locale to be supported.
       *
       * @param {Object} scope - The scope passed to the link function.
       */
      function setLocaleIfPresent (scope) {
        var locale = I18n.getLocale();

        if (locale) {
          scope.options.language = {
            url: '/locales/data_table.' + locale + '.json'
          };
        }
      }

      /**
       * Enables table cells to contain directives.
       * This addresses the common use case of the programmer wanting to use
       * directives within the column definition `render` property.
       *
       * @param {Object} scope - The scope passed to the link function.
       */
      function enableDirectivesInCells (scope) {
        var origCreatedRow = scope.options.createdRow;

        scope.options.createdRow = function (row, data, dataIndex) {
          if (origCreatedRow) origCreatedRow(row, data, dataIndex);

          // Compile in parent's scope (sort of like transclusion)
          $compile(row)(scope.$parent);
        };
      }

      /**
       * Optimizes for display on small screens.
       * Uses the following logic:
       * * If the `table` element has the class 'responsive', then leave alone
       * * If the options provided specify `scrollX = false`, then leave alone
       * * Else, set `scrollX = true` to enable horizontal scrolling
       *
       * @param {Object} scope - The scope passed to the link function.
       * @param {Object} element - The element passed to the link function.
       */
      function optimizeForSmallScreens (scope, element) {
        if (!$(element).hasClass('responsive')) {
          var options = scope.options;

          if (!options.scrollX) {
            options.scrollX = true;
          }
        }
      }

      /**
       * Appends a 'row ops' column to the datatable.
       * This is done iff the `row-ops` attribute is provided to the directive.
       *
       * @param {Object} scope - The scope passed to the link function.
       * @param {Object} element - The element passed to the link function.
       */
      function addRowOpsColumnIfNeeded (scope, element) {
        if (!scope.rowOps) return;

        var options = scope.options;

        // Append a 'row ops' column to the table HTML

        var th =
          '<th class="dt-head-center"'
              + ' translation-id="data_table.columns.actions">'
            + 'Actions' +
          '</th>';

        element.find('thead > tr').append(th);
        element.find('tfoot > tr').append(th);

        // Add a corresponding 'row ops' column to the data table options

        /**
         * Perform a row operation (if found) defined within `scope.rowOps`.
         *
         * ALERT: Attached to the parent scope. Why? Because:
         * * It is called by the `ng-click` directive in the last column, and...
         * * We compile all directives in data table rows in the parent scope
         *   (see function `enableDirectivesInCells` for more)
         *
         * TODO Don't set `__performRowOp` on the parent scope - bad practice!
         *
         * @param {string} rowOpKey - The key of the operation in the
         *   `scope.rowOps` hash.
         */
        scope.$parent.__performRowOp = function (rowOpKey, rowId) {
          var rowOp = scope.rowOps[rowOpKey];

          if (rowOp) rowOp.action(rowId);
        };

        var roColumnDef = {
          searchable: false, orderable: false,
          className: 'dt-body-center',
          render: function (data, type, row, meta) {
            var rowOpHtmls = [];

            for (var rowOpKey in scope.rowOps) {
              var rowOp = scope.rowOps[rowOpKey];

              var aTagAttr = (rowOp.link)
                ? 'href="' + rowOp.link(row.id) + '"'
                : 'ng-click="__performRowOp(\'' + rowOpKey + '\', ' + row.id + ')"';

              var rowOpHtml =
                '<a ' + aTagAttr + '>'
                  + '<span class="glyphicon ' + rowOp.icon + '"></span>' +
                '</a>';

              rowOpHtmls.push(rowOpHtml);
            }

            return rowOpHtmls.join('&nbsp;');
          }
        };

        if (options.columns) {
          options.columns.push(roColumnDef);
        } else if (options.columnDefs) {
          options.columnDefs.push(
            _.extend(roColumnDef, { targets: options.columnDefs.length - 1 }));
        }
      }

      /**
       * Adds a 'row selection' checkbox column to the data table.
       * To do so, it manipulates
       * 1. The HTML
       * 1. The options passed into the scope
       *
       * IMPORTANT: This column is added at index 0, which means all other
       * columns are shifted right by 1. This will impact any options that rely
       * on column indices!
       *
       * @param {Object} scope - The scope passed to the link function.
       * @param {Object} element - The element passed to the link function.
       */
      function addRowSelectionUI (scope, element) {
        var options = scope.options;

        // Prepend a checkbox column to the table HTML

        var th =
          '<th class="dt-head-center">'
            + '<input type="checkbox" class="select-all-rows">' +
          '</th>';

        element.find('thead > tr').prepend(th);
        element.find('tfoot > tr').prepend(th);

        // Add a corresponding checkbox column to the data table options

        var cbColumnDef = {
          searchable: false, orderable: false,
          className: 'dt-body-center',
          render: function (data, type, full, meta) {
            return '<input type="checkbox" class="select-row">';
          }
        };

        if (options.columns) {
          options.columns.unshift(cbColumnDef);
        } else if (options.columnDefs) {
          options.columnDefs.unshift(_.extend(cbColumnDef, { targets: 0 }));
        }

        // By default, DataTables performs an initial sort on the first column,
        // which in our case will now be the checkbox column. Hence we shift
        // the initial sort to the right by 1.
        if (!options.order) {
          options.order = [[1, 'asc']];
        }
      }

      /**
       * Adds all logic required for selecting rows.
       * Supports both client- and server-side processing.
       *
       * Be aware that:
       * 1. The server must set the `DT_RowId` property on the rows it returns
       * 1. Selections persist across paging, sorting and filtering operations
       * 1. The 'select all' checkbox in the table header only targets currently
       *    visible rows.
       *
       * @param {Object} scope - The scope passed to the link function.
       * @param {Object} element - The element passed to the link function.
       */
      function addRowSelectionLogic (scope, element) {
        var options = scope.options;
        var selectedRows = scope.selectedRows;
        var selectAllCheckbox = $(element).find('.select-all-rows');

        /**
         * Mark a row as selected/un-selected on screen.
         *
         * @param {Object|string|number} rowOrId - The row or row id.
         * @param {boolean} selected - Whether to mark selected or un-selected.
         */
        function setRowSelectedUI (rowOrId, selected) {
          var row = (_.isString(rowOrId) || _.isNumber(rowOrId))
            ? $(element).find('#' + rowOrId)
            : rowOrId;

          if (row) {
            if (selected) {
              $(row).addClass('selected');
              $(row).find('.select-row').prop('checked', true);
            } else {
              $(row).removeClass('selected');
              $(row).find('.select-row').prop('checked', false);
            }
          }
        }

        /**
         * Checks/Un-checks the 'select all' checkbox, depending on whether all
         * visible rows are currently selected or not.
         */
        function updateSelectAllCheckbox () {
          var unselectedRows = $(element).find('.select-row:not(:checked)');

          if (unselectedRows.length == 0) {
            selectAllCheckbox.prop('checked', true);
          } else {
            selectAllCheckbox.prop('checked', false)
          }
        }

        // Select/Un-select row when the prepended checkbox column is clicked

        $(element).on('click', '.select-row', function () {
          var row = $(this).closest('tr');
          var rowId = row.attr('id');
          var index = _.indexOf(selectedRows, rowId);

          if (index === -1) {
            selectedRows.push(rowId);
          } else {
            selectedRows.splice(index, 1);
          }

          scope.$apply();
        });

        selectAllCheckbox.on('click', function () {
          var rows = $(element).find('tbody > tr');

          if ($(this).prop('checked')) {
            rows.each(function () {
              var index = _.indexOf(selectedRows, $(this).attr('id'));

              if (index === -1) {
                selectedRows.push($(this).attr('id'));
              }
            });
          } else {
            rows.each(function () {
              var index = _.indexOf(selectedRows, $(this).attr('id'));

              if (index !== -1) {
                selectedRows.splice(index, 1);
              }
            });
          }

          scope.$apply();
        });

        scope.$watch('selectedRows', function (value) {
          var rows = $(element).find('tbody > tr');

          rows.each (function () {
            setRowSelectedUI($(this).attr('id'), false);
          });

          $.each(value, function (index, value) {
            setRowSelectedUI(value, true);
          });

          updateSelectAllCheckbox();
        }, true);

        // Persist selections across paging, sorting and filtering operations

        var origRowCallback = options.rowCallback;

        /**
         * Called back by the data table before a row is drawn.
         * For argument details, see
         * https://datatables.net/reference/option/rowCallback.
         */
        function rowCallback (row, data, index) {
          var rowId = data.DT_RowId.toString();

          if (_.indexOf(selectedRows, rowId) !== -1) {
            setRowSelectedUI(row, true);
          }

          if (origRowCallback) origRowCallback(row, data, index);
        }

        options.rowCallback = rowCallback;

        var origDrawCallback = options.drawCallback;

        /**
         * Called back by the data table every time it performs a draw.
         * For argument details, see
         * https://datatables.net/reference/option/drawCallback.
         */
        function drawCallback (settings) {
          updateSelectAllCheckbox();

          if (origDrawCallback) origDrawCallback(settings);
        }

        options.drawCallback = drawCallback;
      }

      /**
       * Adds a bulk selection toolbar near the top of the data table.
       * Must be called AFTER the data table has been initialized.
       *
       * @param {Object} scope - The scope passed to the link function.
       * @param {Object} element - The element passed to the link function.
       */
      function addBulkSelectionToolbar (scope, element) {
        // Add the 'Un-select all' operation of our own accord
        var bulkOps = {
          unselectAll: {
            name: 'Un-select all',
            action: function () { scope.selectedRows.length = 0; }
          }
        };

        _.extend(bulkOps, scope.bulkOps);

        /**
         * Perform a bulk operation (if found) defined within `scope.bulkOps`,
         * on all currently selected rows.
         *
         * @param {string} bulkOpKey - The key of the operation in the
         *   `scope.bulkOps` hash.
         */
        scope.performBulkOp = function (bulkOpKey) {
          var bulkOp = bulkOps[bulkOpKey];

          if (bulkOp) bulkOp.action();
        };

        var translationItems = _.chain(bulkOps)
          .mapObject(function (v, k) {
            v['__key'] = '.' + k;
            return v;
          })
          .values()
          .value();
        
        I18n.ts({
          items: translationItems,
          idExtractor: '__key',
          translationPath: 'data_table.bulk_ops',
          success: function (item, result) {
            item.name = result;
          }
        }).then(function () {
          var bulkOpsDiv =
            $('<div class="bulk-ops" ng-show="selectedRows.length > 0"></div>');

          for (var bulkOpKey in bulkOps) {
            var bulkOp = bulkOps[bulkOpKey];

            var bulkOpHtml =
              '<a href="" ng-click="performBulkOp(\'' + bulkOpKey + '\')">'
                + bulkOp.name + '</a>';

            bulkOpsDiv.append($(bulkOpHtml));
          }

          var bulkSelectionDiv =
            $('<div class="dataTables_bulk-selection"'
                  + 'id="' + $(element).attr('id') + '">'
                + '<span translate="data_table.total_rows_selected"'
                  + 'translate-default="Total # of rows selected:"></span>'
                + '&nbsp;{{selectedRows.length}}'
                + bulkOpsDiv[0].outerHTML +
              '</div>');

          var lengthDiv = $(element).closest('.dataTables_wrapper')
            .find('.dataTables_length');

          lengthDiv.after(bulkSelectionDiv);

          $compile(bulkSelectionDiv)(scope);
        });
      }

      /**
       * Adds row expansion functionality.
       * This is done iff the `expanded-row-info` attribute is provided to the
       * directive.
       *
       * @param {Object} scope - The scope passed to the link function.
       * @param {Object} element - The element passed to the link function.
       */
      function addRowExpansionIfNeeded (scope, element) {
        if (!scope.expandedRowInfo) return;

        var options = scope.options;

        var firstColumn = (options.columns)
          ? options.columns[0]
          : _.where(options.columnDefs, { targets: 0 });

        var origRender = firstColumn.render;

        firstColumn.render = function (data, type, row, meta) {
          var togglerHtml =
            '<a href="" class="dt-expand-row">'
              + '<span class="glyphicon glyphicon-chevron-down"></span>' +
            '</a>';

          var origRenderedHtml = (origRender)
            ? origRender(data, type, row, meta)
            : data;

          return togglerHtml + origRenderedHtml;
        };

        $(element).on('click', '.dt-expand-row', function () {
          var tr = $(this).closest('tr');
          var tableObj = $(element).DataTable();
          var rowObj = tableObj.row(tr);

          if (rowObj.child.isShown()) {
            rowObj.child.hide();
          } else {
            var rowData = rowObj.data();
            var expRowHtml =
              '<div class="dt-expanded-row">'
                + scope.expandedRowInfo(rowData) +
              '</div>';

            var expRowScope = scope.$new(true);
            expRowScope.data = rowData;

            var compiledExpRowHtml = $compile(expRowHtml)(expRowScope);

            rowObj.child(compiledExpRowHtml).show();
          }

          $(this).find('span')
            .toggleClass('glyphicon-chevron-up')
            .toggleClass('glyphicon-chevron-down');
        });
      }

      /**
       * Translates column names within headers and footers.
       *
       * This is a helper function called by `translateTableHeadFoots`.
       *
       * @param {Object[]} elements - A collection of elements (given via a
       * jQuery selector) to attempt translating.
       * @param {Object} options - The data table's config options passed via
       * the `options` property on this directive's scope.
       * @param {string} [tableId] - The id of the underlying `table` element
       *
       * @returns {Promise} A promise, as returned by the `I18n.ts` function.
       */
      function translateColNameElems (elements, options, tableId) {
        return I18n.ts({
          items: elements,
          idExtractor: function (item, index) {
            var translationId = $(item).attr('translation-id');

            if (!translationId) {
              if (options.columns) {
                translationId = options.columns[index].data;
              } else if (options.columnDefs) {
                translationId =
                  _.findWhere(options.columnDefs, { targets: index }).data;
              }

              if (translationId) {
                translationId = '.' + translationId;
              }
            }

            return translationId;
          },
          translationPath: (tableId || 'data_table') + '.columns',
          success: function (item, result) {
            $(item).html(result);
          }
        });
      }

      /**
       * Translates column names present in the underlying `table` element's
       * headers and footers.
       *
       * Translation ids are computed from the `columns` or `columnDefs`
       * properties in the data table configuration options, whenever possible,
       * as follows:
       *
       *   "some-table-id-or-'data_table'.columns.data-prop-of-column-or-def"
       *
       * To override or set these explicitly, add a `translation-id` attribute
       * on each desired `th` element within `thead` or `tfoot`. If this begins
       * with a '.', only the 'data-prop...' part is replaced. Else, the entire
       * translation id is replaced.
       *
       * @param {Object} scope - The scope passed to the link function.
       * @param {Object} element - The element passed to the link function.
       *
       * @returns {Promise} A promise that is never rejected, and resolves when
       * all header and footer translation attempts have been completed.
       */
      function translateTableHeadFoots (scope, element) {
        var options = scope.options;
        var tableId = $(element).attr('id');

        var p1 =
          translateColNameElems($(element).find('thead th'), options, tableId);

        var p2 =
          translateColNameElems($(element).find('tfoot th'), options, tableId);

        return $q.all([p1, p2]);
      }

      return {
        restrict: 'A',

        scope: {
          options: '<?',
          instance: '=?',
          rowOps:'<?',
          selectedRows: '<?',
          bulkOps: '<?',
          expandedRowInfo: '<?'
        },

        link: function (scope, element, attrs) {
          scope.selectedAll = false;

          if (!scope.options) scope.options = {};

          setLocaleIfPresent(scope);

          enableDirectivesInCells(scope);

          optimizeForSmallScreens(scope, element);

          addRowOpsColumnIfNeeded(scope, element);

          if (scope.selectedRows !== undefined) {
            addRowSelectionUI(scope, element);
            addRowSelectionLogic(scope, element);
          }

          addRowExpansionIfNeeded(scope, element);

          $(element).on('preInit.dt', function () {
            if (scope.selectedRows !== undefined) {
              addBulkSelectionToolbar(scope, element);
            }

            // We need this timeout. Calling `$apply()` synchronously causes
            // a duplicate digest, when no locale is set (i.e. when the locale
            // file does not have to be fetched from the server.
            $timeout(function () {
              scope.$apply();
            });
          });

          translateTableHeadFoots(scope, element).then(function () {
            var instance = $(element).DataTable(scope.options);

            if (scope.instance !== undefined) {
              scope.instance = instance;
            }
          });
        }
      };
    }]);
