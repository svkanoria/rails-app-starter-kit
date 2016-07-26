module ApplicationHelper
  # Currently signed in user details (if any) to be passed to the client-side
  # JS code.
  def current_user_json
    if current_user
      { id: current_user.id,
        email: current_user.email,
        roles: current_user.roles.pluck(:name) }.to_json
    end
  end

  # Maps Rails flash keys to Bootstrap alert types.
  FLASH_KEY_MAP = { notice: 'success', alert: 'danger' }

  # Maps Rails flash keys to Bootstrap alert types.
  #
  # Generally, flash messages (even those from the server!) are rendered using
  # Angular. However, for the Devise views, which are plain vanilla Rails views
  # that don't use Angular, we need to render the Rails flash server-side. This
  # is where this bit of code is needed.
  #
  # @param flash_key [String, Symbol]
  #
  # @return [String]
  def bootstrap_alert_type (flash_key)
    FLASH_KEY_MAP[flash_key.to_sym] || flash_key
  end
end
