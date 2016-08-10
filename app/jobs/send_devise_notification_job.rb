class SendDeviseNotificationJob < ActiveJob::Base
  # Sends a Devise notification.
  #
  # @param user [User] the user
  # @param notification_str [String] the Devise notification type (a symbol)
  #   converted to a string. Symbols are not serializable by ActiveJob
  # @param args other arguments
  def perform (user, notification_str, *args)
    I18n.with_locale (user.locale || I18n.default_locale) do
      user.orig_send_devise_notification(notification_str.to_sym, *args)
    end
  end
end
