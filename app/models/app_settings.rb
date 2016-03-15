# Manages "dynamic" application settings.
#
# All applications need or can benefit from "application level" settings that
# dictate their operation. This starter kit provides two ways of managing such
# settings, based on who is responsible for setting their value:
# 1. Statically, via /config/secrets.yml
#    These settings can either be hard-coded, or can defer to environment
#    variables, and are intended to be set either by developers or by system
#    administrators.
# 1. Dynamically, using this class's {set} method
#    These settings are intended to be set dynamically on-the-fly from within
#    the app's admin UI, by app administrators.
#
# This class concerns itself with the latter. It expects these settings to be
# grouped into categories, and provides methods to then retrieve and set them.
#
# Creating a category is as simple as creating a class bearing the category's
# name, and defining within it its available settings. For example, a category
# called 'outgoing_email' may be defined as follows (note the namespace!):
#
#   class AppSettings::OutgoingEmail
#     # Specify a key for each available setting. See StrongKeyValueStore for
#     # a better understanding.
#     include StrongKeyValueStore
#     strong_key_value_store keys: [:smtp_address, :smtp_port, ...]
#
#     # Add any desired validations
#     validates :smtp_address, presence: true
#     validates :smtp_port, numericality: { ... }
#       :
#   end
#
#   -- OR --
#
#   class AppSettings::OutgoingEmail < ActiveRecord::Base
#     # Write a corresponding migration to create a table with one column for
#     # each available setting.
#
#     # Expose an 'instance' method, to return the singleton instance.
#     # The line below requires https://github.com/hyperoslo/singleton-rails.
#     # However, you could just as easily implement your own 'instance' method.
#     # Warning: Do *not* use the Ruby Singleton module. It does not work well
#     # with ActiveRecord.
#     include ActiveRecord::Singleton
#
#     # Add any desired validations
#     validates :smtp_address, presence: true
#     validates :smtp_port, numericality: { ... }
#       :
#   end
#
# Shown above are two possible ways of creating a category. However, in theory
# you can use *any* class that responds to the following three methods:
#   * instance (to fetch the singleton instance)
#   * setting (where 'setting' is the name of any available setting)
#   * update_attributes (in the style of ActiveRecord models)
#
# Communication between the server and the admin UI for managing these settings
# is handled by {Admin::AppSettingsController}. In most cases, its JSON
# rendering should be satisfactory, but if not, it can be overridden on a per
# category basis, by writing a custom view. For example, for a category called
# 'outgoing_email', create this view:
# '/views/admin/app_settings/outgoing_email.json.jbuilder'.
#
# Usage:
#   # To get a setting:
#   AppSettings.get(:outgoing_email, :smtp_address)
#   AppSettings.get('outgoing_email', 'smtp_address')
#
#   # To get more than one setting:
#   # Favour this over getting settings individually whenever possible, as each
#   # 'get' invocation results in *exactly one* database query.
#   AppSettings.get(:outgoing_email, :smtp_address, :smtp_port, ...)
#   AppSettings.get('outgoing_email', 'smtp_address', 'smtp_port', ...)
#
#   # To set setting(s) for a category:
#   AppSettings.set :outgoing_email, smtp_address: 'some.smtp.provider', ...
#   AppSettings.set 'outgoing_email', smtp_address: 'some.smtp.provider', ...
class AppSettings
  # Gets setting(s).
  #
  # @overload get(category, setting)
  #   @param category [Symbol, String] the category
  #   @param setting [Symbol, String] the setting name
  #
  #   @return [Object] the setting value
  #
  # @overload get(category, setting, ...)
  #   @param category [Symbol, String] the category
  #   @param setting [Symbol, String] the setting name
  #   @param ... [Symbol, String] more setting names
  #
  #   @return [Hash{Symbol => Object}] the setting names and values
  def self.get (category, *settings)
    settings_obj = settings_object(category)

    if settings.length == 1
      settings_obj.send(settings[0])
    else
      settings.inject({}) { |h, s| h[s] = settings_obj.send(s); h }
    end
  end

  # Sets setting(s) for a category.
  #
  # @param category [Symbol, String] the category
  # @param hash [Hash{Symbol => Object}] the setting names and values
  #
  # @return [Object] the singleton instance of the class corresponding to the
  #   given category
  def self.set (category, hash)
    settings_obj = settings_object(category)

    settings_obj.update_attributes(hash)

    settings_obj
  end

  # Returns the singleton instance of the class corresponding to the given
  # category.
  #
  # @param category [Symbol, String] the category
  #
  # @return [Object]
  #
  # @raise [ActiveRecord::RecordNotFound] if no settings object exists for the
  #   given category
  def self.settings_object (category)
    settings_class = "AppSettings::#{category.to_s.camelize}".constantize

    settings_class.instance
  rescue NameError
    raise ActiveRecord::RecordNotFound
  end
end
