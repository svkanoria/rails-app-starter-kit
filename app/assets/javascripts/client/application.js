// This is a manifest file that'll be compiled into application.js, which will
// include all the files listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts,
// vendor/assets/javascripts, or vendor/assets/javascripts of plugins, if any,
// can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do it'll appear at
// the bottom of the compiled file.
//
// Read Sprockets README
// (https://github.com/sstephenson/sprockets#sprockets-directives) for details
// about supported directives.
//
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
// From vendor:
//= require angular/angular
//= require angular-route/angular-route
//= require angular-resource/angular-resource
//= require angular-animate/angular-animate
//= require angular-rails-templates
//= require ng-rails-csrf
//= require underscore/underscore
//= require underscore.string/lib/underscore.string
// Note the 'min'. This is needed since flashular.js does not minify correctly.
//= require flashular/dist/flashular.min
//= require moment/moment
//= require eonasdan-bootstrap-datetimepicker/src/js/bootstrap-datetimepicker
//
// Files shared between client and admin apps
//= require_tree ../shared
//= require_tree ../templates/shared
//
//= require_tree ../templates/client
//= require_tree ./angular
//= require ./angular/app
//= require ./angular/routes

// Mixin Underscore.string functions with Underscore
_.mixin(_.str.exports());

// OmniAuth Facebook authentication can add junk like '#_=_', to the URL being
// redirected to. Angular interprets this as a route, which causes mayhem.
// This is a workaround.
// TODO Find a better solution to the OmniAuth Facebook junk chars problem
if (window.location.hash.search('#_') >= 0) {
  window.location.hash = '';
}
