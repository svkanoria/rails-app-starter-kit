source 'https://rubygems.org'

# Bundle edge Rails instead: gem 'rails', github: 'rails/rails'
gem 'rails', '4.2.0.beta1'

# Use postgresql as the database for Active Record
gem 'pg'

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
# For now, we use a special branch for Rails 4.2 compatibility. However, devise
# is sure to make a compatible release soon.
# TODO Use official 4.2 compatible release of devise when available
gem 'devise', git: 'https://github.com/plataformatec/devise.git',
    branch: 'lm-rails-4-2'

# For assigning roles to users
gem 'rolify'

# For role-based authorization
gem 'pundit'

# For using respond_with
gem 'responders'

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
  gem 'byebug'

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
