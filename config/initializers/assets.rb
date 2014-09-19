# Be sure to restart your server when you modify this file.

# Version of your assets, change this if you want to expire all your assets.
Rails.application.config.assets.version = '1.0'

# Add additional assets to the asset load path
# Rails.application.config.assets.paths << Emoji.images_path

# Precompile additional assets.
# application.js, application.css, and all non-JS/CSS in app/assets folder are
# already added.
# Rails.application.config.assets.precompile += %w( search.js )

# MY NOTE: Added the code block below. This is needed for the Teaspoon testing
# framework to function. It's a bit of a hack but it can't be helped. It seems
# the Rails 4.1+ pipeline changes make this necessary.
unless Rails.env.production?
  Rails.application.config.assets.precompile += %w(teaspoon.css
      teaspoon-teaspoon.js jasmine/1.3.1.js teaspoon-jasmine.js)
end
