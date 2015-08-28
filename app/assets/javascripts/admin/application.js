// Comment out the 2 lines below. Instead, use what Bower installed along with
// jQuery UI.
// require jquery
// require jquery_ujs
//
// jQuery from vendor
//= require jquery/dist/jquery
// Still need this from above though, for unobtrusive Javascript such as
// <a ... 'data-method="delete"'></a> to work.
//= require jquery_ujs
// jQuery UI from vendor (only the stuff that we need, and stuff that does not
// conflict with Bootstrap). Add more files as required.
// To help ensure that you have required any and all dependencies, refer to
// http://jqueryui.com/download/
//= require jquery-ui/ui/core
//= require jquery-ui/ui/widget
//= require jquery-ui/ui/mouse
//= require jquery-ui/ui/position
//= require jquery-ui/ui/draggable
//= require jquery-ui/ui/droppable
//
// See comments in assets/javascripts/bootstrap-custom.js
//= require bootstrap-custom
//
// From vendor/bower_components:
//= require angular/angular
//= require ui-router/release/angular-ui-router.js
//= require angular-resource/angular-resource
//= require angular-animate/angular-animate
//= require angular-rails-templates
//= require ng-rails-csrf
//= require underscore/underscore
//= require underscore.string/dist/underscore.string
// Note the 'min'. This is needed since flashular.js does not minify correctly.
//= require flashular/dist/flashular.min
//= require moment/moment
//= require eonasdan-bootstrap-datetimepicker/src/js/bootstrap-datetimepicker
//= require selectize/dist/js/standalone/selectize
//
// Files shared between client and admin apps
//= require_tree ../shared
//= require_tree ../templates/shared
//
//= require_tree ../templates/admin
//= require_tree ./angular
//= require ./angular/app
//= require ./angular/routes

// Mixin Underscore.string functions with Underscore
_.mixin(s.exports());

// OmniAuth Facebook authentication can add junk like '#_=_', to the URL being
// redirected to. Angular interprets this as a route, which causes mayhem.
// This is a workaround.
// TODO Find a better solution to the OmniAuth Facebook junk chars problem
if (window.location.hash.search('#_') >= 0) {
  window.location.hash = '';
}
