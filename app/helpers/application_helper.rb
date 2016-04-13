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

  # Mapping of Rails flash keys to Bootstrap alert contexts. Contains only the
  # keys that do not map unchanged (i.e. keys that have no namesake Bootstrap
  # alert contexts).
  FLASH_KEY_MAP = { notice: 'success', alert: 'danger' }

  # Maps Rails flash keys to appropriate Bootstrap alert contexts.
  #
  # This is required because the most commonly used Rails flash keys (notice,
  # alert) have no namesake Bootstrap alert contexts.
  #
  # @param flash_key [String, Symbol]
  #
  # @return [String]
  def bootstrap_alert_context (flash_key)
    FLASH_KEY_MAP[flash_key.to_sym] || flash_key
  end
end
