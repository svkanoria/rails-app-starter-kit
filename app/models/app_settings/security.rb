class AppSettings::Security
  include StrongKeyValueStore

  strong_key_value_store keys: [:force_sign_in, :disable_3rd_party_sign_in,
                                :sign_up_whitelist, :force_sign_up_via_admin]

  validates :force_sign_in, inclusion: [true, false], allow_blank: true
  validates :disable_3rd_party_sign_in, inclusion: [true, false],
            allow_blank: true
  validates :force_sign_up_via_admin, inclusion: [true, false],
            allow_blank: true
end
