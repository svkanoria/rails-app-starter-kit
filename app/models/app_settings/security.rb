class AppSettings::Security
  include StrongKeyValueStore

  strong_key_value_store keys: [:force_sign_in, :sign_up_whitelist]

  validates :force_sign_in, inclusion: [true, false], allow_blank: true
end
