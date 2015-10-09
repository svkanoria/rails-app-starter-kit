# To enable multi-tenancy in 'ledermann-rails-settings'.
module RailsSettings
  class SettingObject
    acts_as_tenant :tenant
  end
end
