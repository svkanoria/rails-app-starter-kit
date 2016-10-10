class SendDeviseNotificationJob < ActiveJob::Base
  # Sends a Devise notification.
  #
  # @param tenant [Tenant] the tenant to set as current
  # @param user_id [Integer] the user id. We cannot directly pass the user,
  #   since when Global ID tries to deserialize it, it fails due to the current
  #   tenant not being set. No trickery in the callbacks seems to fix this
  # @param notification_str [String] the Devise notification type (a symbol)
  #   converted to a string. Symbols are not serializable by ActiveJob
  # @param *args other arguments
  def perform (tenant, user_id, notification_str, *args)
    ActsAsTenant.with_tenant(tenant) do
      user = User.find(user_id)

      I18n.with_locale (user.locale || I18n.default_locale) do
        user.orig_send_devise_notification(notification_str.to_sym, *args)
      end
    end
  end
end
