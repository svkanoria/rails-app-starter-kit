source 'https://rubygems.org'

# For Heroku to be able to use the desired Ruby version
ruby '2.2.4'

# Bundle edge Rails instead: gem 'rails', github: 'rails/rails'
gem 'rails', '4.2.2'

# Use postgresql as the database for Active Record
gem 'pg'

# Use Sass for stylesheets.
# If you would like to use another CSS preprocessor, remove this.
# However, people do tend to favor Sass with Rails.
gem 'sass-rails'

# Use Uglifier as compressor for JavaScript assets
gem 'uglifier', '>= 1.3.0'

# See https://github.com/sstephenson/execjs#readme for more supported runtimes
# gem 'therubyracer', platforms: :ruby

# Use jquery as the JavaScript library
gem 'jquery-rails'

# Build JSON APIs with ease. Read more: https://github.com/rails/jbuilder.
gem 'jbuilder', '~> 2.0'

# bundle exec rake doc:rails generates the API under doc/api
gem 'sdoc', '~> 0.4.0', group: :doc

# Use ActiveModel has_secure_password
# gem 'bcrypt', '~> 3.1.7'

# Use Rails Html Sanitizer for HTML sanitization
gem 'rails-html-sanitizer', '~> 1.0'

# For annotating models with database column information
gem 'annotate'

# For managing front-end assets via Bower
gem 'bower-rails'

# For serving Angular templates through the Rails asset pipeline
gem 'angular-rails-templates'

# For Angular to work with CSRF protection
gem 'ng-rails-csrf'

# For authentication.
gem 'devise', '~> 3.5.0'

# For authentication via 3rd party providers
gem 'omniauth-facebook'
gem 'omniauth-google-oauth2'

# For assigning roles to users
gem 'rolify'

# For role-based authorization
gem 'pundit'

# For using respond_with
gem 'responders'

# For running background tasks
gem 'delayed_job_active_record'

# Web server that supports concurrent request handling
gem 'puma'

# Bootstrap front-end framework.
# We use the gem, rather than Bower, due to the former's ease of integration
# over the latter.
gem 'bootstrap-sass', '~> 3.3.0'

# For Bootstrap compatible Rails form helpers
gem 'bootstrap_form'

# For pagination
gem 'kaminari'

# For AWS integration
gem 'aws-sdk', '~> 2'

# For auto-prefixing Sass/CSS styles with vendor prefixes
gem 'autoprefixer-rails'

# For on-the-fly image manipulation (and subsequent caching, for efficiency).
# Can do uploads too, but we don't use it for that.
gem 'dragonfly', '~> 1.0.7'

# Database backed key value store for app-wide or model specific data, such as
# settings, flags etc.
gem 'ledermann-rails-settings'

# For more concise Rails logging
gem 'lograge'

# To make finding the number of objects that belong to an ActiveRecord object
# more efficient.
gem 'counter_culture', '~> 0.2'

# To support Angular HTML5 mode. For a detailed discussion, see
# http://mbell697.github.io/2014/02/04/yeoman-angular-rails-html5mode.
# Also take a look within /config/application.rb (search for 'rewrite'), for
# code and comments that help explain the server support this feature requires.
gem 'rack-rewrite'

# Use Unicorn as the app server
# gem 'unicorn'

# Use Capistrano for deployment
# gem 'capistrano-rails', group: :development

# Gems required for deploying on Heroku
group :production, :staging do
  gem 'rails_12factor'
  gem 'rails_stdout_logging'
  gem 'rails_serve_static_assets'
end

group :development, :test do
  # Call 'debugger' anywhere in the code to stop execution and get a debugger
  # console
  # MY NOTE: Since we're using the RubyMine debugger on our machine, we comment
  # this out, as it interferes. Otherwise, uncomment it!
  #gem 'byebug'

  # Access an IRB console on exceptions page and /console in development
  gem 'web-console', '~> 2.0.0.beta2'

  # Spring speeds up development by keeping your application running in the
  # background. Read more: https://github.com/rails/spring.
  gem 'spring'

  # For Rails code testing
  gem 'rspec'
  gem 'rspec-rails'

  # For creating mock objects while testing
  gem 'factory_girl_rails'

  # For Angular and JS code testing
  gem 'teaspoon'
end

group :development do
  # For documentation
  gem 'yard'
end
