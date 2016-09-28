# I18n utilities.
module I18nUtils
  # Mapping of locales to UI friendly names.
  # Add more locales and names here as desired.
  LOCALE_NAMES = {
      en: 'English',
      hi: 'हिन्दी'
  }

  # Available locales for the main application.
  #
  # Note that these *do not* supersede available locales set via
  # `I18n.available_locales` in the config/application.rb file. Rather, they are
  # used to differentiate between locales available for the main and admin apps.
  # This is because one may not need the admin app to be internationalized.
  def self.avail_locales
    [:en, :hi]
  end

  # Available locales for the admin application.
  def self.admin_avail_locales
    [:en, :hi]
  end
end