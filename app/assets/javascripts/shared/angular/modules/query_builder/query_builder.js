/*
 * A tool for graphically building SQL-like queries represented as JSON.
 *
 * Can be used stand-alone, or integrated with data-tables/grids like jQuery
 * DataTables etc.
 */
angular.module('QueryBuilder', [
  // Services
  'QBEditorProvider',

  // Directives
  'QueryBuilderDirective',
  'QBFilter'
]);
