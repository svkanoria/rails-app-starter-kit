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
//= require jquery
//= require jquery_ujs
//
// From vendor/bower_components:
//= require angular/angular
//= require angular-route/angular-route
//= require angular-resource/angular-resource
//= require angular-rails-templates
//= require ng-rails-csrf
//= require underscore/underscore
//= require underscore.string/lib/underscore.string
// Note the 'min'. This is needed since flashular.js does not minify correctly.
//= require flashular/dist/flashular.min.js
//
//= require_tree ./angular
//= require angular/app
//= require angular/routes

// Mixin Underscore.string functions with Underscore
_.mixin(_.str.exports());
