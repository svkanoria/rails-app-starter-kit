//= require jquery
//= require jquery_ujs
// See comments in assets/javascripts/bootstrap-custom.js
//= require bootstrap-custom
//
// From vendor/bower_components:
//= require angular/angular
//= require angular-route/angular-route
//= require angular-resource/angular-resource
//= require angular-animate/angular-animate
//= require angular-rails-templates
//= require ng-rails-csrf
//= require underscore/underscore
//= require underscore.string/lib/underscore.string
// Note the 'min'. This is needed since flashular.js does not minify correctly.
//= require flashular/dist/flashular.min.js
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
_.mixin(_.str.exports());

// OmniAuth Facebook authentication can add junk like '#_=_', to the URL being
// redirected to. Angular interprets this as a route, which causes mayhem.
// This is a workaround.
// TODO Find a better solution to the OmniAuth Facebook junk chars problem
if (window.location.hash.search('#_') >= 0) {
  window.location.hash = '';
}
