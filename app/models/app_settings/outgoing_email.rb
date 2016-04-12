class AppSettings::OutgoingEmail
  include StrongKeyValueStore

  # Available SMTP settings.
  SMTP_SETTINGS = [:smtp_address, :smtp_port,
                   :smtp_user_name, :smtp_password, :smtp_authentication,
                   :smtp_enable_starttls_auto, :smtp_openssl_verify_mode]

  strong_key_value_store keys: [:sender] + SMTP_SETTINGS

  # We accept all settings as strings or numbers, even though ActionMailer
  # requires some as booleans and symbols. This makes it easy to fall back on
  # any defaults set via environment variables, which only support strings and
  # numbers.
  #
  # However, this means that before ActionMailer can use some of these values,
  # it will need to convert them to the appropriate types.

  validates :smtp_port, numericality: { only_integer: true, greater_than: 0 },
            allow_blank: true
  validates :smtp_authentication, inclusion: %w(plain login cram_md5),
            allow_blank: true
  validates :smtp_enable_starttls_auto, inclusion: %w(true false),
            allow_blank: true
  validates :smtp_openssl_verify_mode,
            inclusion: %w(none peer client_once fail_if_no_peer_cert),
            allow_blank: true
end
