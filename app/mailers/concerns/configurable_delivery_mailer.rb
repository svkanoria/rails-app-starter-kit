# Include in all mailers.
#
# This integrates the mailer with our configurable outgoing email settings.
module ConfigurableDeliveryMailer
  extend ActiveSupport::Concern

  included do
    after_action :set_delivery_options
  end

  SMTP_SETTINGS = AppSettings::OutgoingEmail::SMTP_SETTINGS

  def sender
    AppSettings.get(:outgoing_email, :sender).presence ||
        Rails.application.secrets.outgoing_email_sender ||
        "no-reply@#{Rails.application.secrets.application_host}"
  end

  def app_smtp_settings
    AppSettings.get(:outgoing_email, *SMTP_SETTINGS)
  end

  def default_smtp_settings
    SMTP_SETTINGS.inject({}) { |h, s| h[s] = Rails.application.secrets[s]; h }
  end

  def use_app_smtp_settings? (app_smtp_settings)
    SMTP_SETTINGS.any? { |s| app_smtp_settings[s].present? }
  end

  def type_correct_smtp_settings (smtp_settings)
    smtp_settings[:smtp_authentication] =
        smtp_settings[:smtp_authentication].to_sym

    smtp_settings[:smtp_enable_starttls_auto] =
        ActiveRecord::Type::Boolean.new.type_cast_from_user(
            smtp_settings[:smtp_enable_starttls_auto])
  end

  def format_smtp_settings_for_rails (smtp_settings)
    smtp_settings.reject! { |k, v| v.blank? }

    # Remove the 'smtp_' prefix from each key
    smtp_settings.transform_keys! { |key| key[5..-1].to_sym }
  end

  def final_smtp_settings
    result = app_smtp_settings
    result = default_smtp_settings unless use_app_smtp_settings?(result)
    result.merge!(smtp_domain: Rails.application.secrets.application_host)

    type_correct_smtp_settings(result)
    format_smtp_settings_for_rails(result)

    result
  end

  def set_delivery_options
    mail.from = sender

    mail.delivery_method.settings.merge!(final_smtp_settings)
  end
end
