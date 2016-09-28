require File.expand_path('../boot', __FILE__)

# Pick the frameworks you want:
require 'active_model/railtie'
require 'active_record/railtie'
require 'action_controller/railtie'
require 'action_mailer/railtie'
require 'action_view/railtie'
require 'sprockets/railtie'
require 'active_job/railtie' # MY NOTE: Added this to enable ActiveJob
# require "rails/test_unit/railtie"

# Require the gems listed in Gemfile, including any gems you've limited to
# :test, :development, or :production.
Bundler.require(*Rails.groups)

module RailsAppStarterKit
  class Application < Rails::Application
    # Settings in config/environments/* take precedence over those specified
    # here. Application configuration should go into files in
    # config/initializers - all .rb files in that directory are automatically
    # loaded.

    # Set Time.zone default to the specified zone and make Active Record
    # auto-convert to this zone. Run "rake -D time" for a list of tasks for
    # finding time zone names. Default is UTC.
    # config.time_zone = 'Central Time (US & Canada)'

    # The default locale is :en and all translations from
    # config/locales/*.rb,yml are auto loaded.
    # config.i18n.load_path += Dir[Rails.root.join('my', 'locales', '*.{rb,yml}').to_s]
    # config.i18n.default_locale = :de

    # MY NOTE: Added a list of available locales. We need to make this explicit
    # to Rails, otherwise by default, it throws an 'I18n::InvalidLocale' upon
    # encountering an unsupported locale.
    config.i18n.available_locales = [:en, :hi]

    # For not swallow errors in after_commit/after_rollback callbacks
    config.active_record.raise_in_transactional_callbacks = true

    # MY NOTE: Mailer concerns aren't autoloaded, even though Rails provides
    # this directory out of the box! So we autoload it manually.
    config.autoload_paths += %W(
      #{config.root}/app/mailers/concerns
    )

    # MY NOTE: bower-rails installs Bower components in the
    # vendor/assets/bower_components folder. Since this folder is not in the
    # Rails standard, we need to add it manually.
    config.assets.paths << Rails.root.join('vendor', 'assets',
                                           'bower_components')

    # MY NOTE: We keep Angular templates in app/assets/javascripts/templates,
    # which is non-standard for angular-rails-templates, so we need to tell it
    # where to look. We have chosen this non-standard approach to avoid name
    # collisions with identically named JS files. See
    # https://github.com/pitr/angular-rails-templates#5-avoid-name-collisions.
    config.angular_templates.ignore_prefix = %w(templates/)

    # MY NOTE: Stop generators from generating non-useful files
    config.generators do |g|
      g.assets = false
      g.helper = false
      g.template_engine = nil # Don't create views, since we're using Angular

      g.test_framework :rspec,
                       fixtures: true,
                       view_specs: false,
                       helper_specs: false,
                       routing_specs: false,
                       controller_specs: true,
                       request_specs: false

      g.fixture_replacement :factory_girl, dir: 'spec/factories'
    end

    # MY NOTE: Tell ActiveJob to use DelayedJob as the background task queue
    config.active_job.queue_adapter = :delayed_job

    # MY NOTE: Tell Rails to append a trailing slash when generating URLs, so
    # that they still nice after Angular adds the '#/'.
    config.action_controller.default_url_options = { trailing_slash: true }

    # MY NOTE: Enable Lograge for more concise Rails logging
    config.lograge.enabled = true

    # MY NOTE: Configure the server to support Angular's HTML5 mode. As HTML5
    # mode uses regular server style URLs instead of "hash-bang" ones, we need
    # to clearly delineate URL routing responsibilities between Angular and the
    # server. Otherwise there is confusion between the two, resulting in broken
    # navigation.
    config.middleware.insert_before(Rack::Runtime, Rack::Rewrite) do
      # Useful regex to use in rewriting rules.
      # Can't use `I18n.available_locales.` like we do in config/routes.rb, as
      # it does not yet seem to be fully initialized!
      locales_regex = %w(/en /hi).join('|')

      # Ignore all requests with a '.' anywhere. Assets and AJAX requests have
      # a '.' somewhere, and since we don't want to rewrite them, this works as
      # an easy catch-all!
      rewrite %r{^(.*\..*)$}, '$1'

      # Ignore all requests sent by the FineUploader library to the FineUploader
      # controller. Even though these are AJAX requests, they probably have no
      # '.', and hence sneak through the first rewrite rule above.
      rewrite %r{^/fine_uploader(.*)$}, '/fine_uploader$1'

      # Ignore all requests to `I18nController`, because of the way it works.
      rewrite %r{^/i18n(.*)$}, '/i18n$1'

      # Ignore all requests to '/user*', since these correspond to Devise views
      # that are rendered by the server, and not by Angular.
      rewrite %r{^(/?(#{locales_regex}))/users(.*)$}, '$1/users$3'
      rewrite %r{^/users(.*)$}, '/users$1'

      # Ignore all API calls
      rewrite %r{^/admin(/?(#{locales_regex}))/api/(.*)$}, '/admin/$1/api/$3'
      rewrite %r{^(/?(#{locales_regex}))/api/(.*)$}, '$1/api/$3'

      # Rewrite all other requests to the admin and main ('client') apps to the
      # root, thus leaving the responsibility of in-app routing to Angular.

      rewrite %r{^/admin(/?(#{locales_regex}))(.*)$}, '/admin/$1'
      rewrite %r{^(/?(#{locales_regex}))(.*)$}, '$1/'

      rewrite %r{^/admin(.*)$}, '/admin'
      rewrite %r{^(.*)$}, '/'
    end
  end
end
