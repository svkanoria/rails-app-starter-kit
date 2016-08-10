# == Schema Information
#
# Table name: users
#
#  id                     :integer          not null, primary key
#  email                  :string           default(""), not null
#  encrypted_password     :string           default(""), not null
#  reset_password_token   :string
#  reset_password_sent_at :datetime
#  remember_created_at    :datetime
#  sign_in_count          :integer          default("0"), not null
#  current_sign_in_at     :datetime
#  last_sign_in_at        :datetime
#  current_sign_in_ip     :inet
#  last_sign_in_ip        :inet
#  confirmation_token     :string
#  confirmed_at           :datetime
#  confirmation_sent_at   :datetime
#  unconfirmed_email      :string
#  failed_attempts        :integer          default("0"), not null
#  unlock_token           :string
#  locked_at              :datetime
#  created_at             :datetime
#  updated_at             :datetime
#  authentication_token   :string
#

class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :lockable and :timeoutable
  devise :confirmable,
         :database_authenticatable,
         :registerable,
         :recoverable,
         :rememberable,
         :trackable,
         :validatable,
         # Comment this out if you don't need to authenticate via 3rd party
         # providers.
         # Add/remove providers from the array to control which providers can
         # be used for authentication.
         :omniauthable, omniauth_providers: [:facebook, :google_oauth2]

  rolify

  validates :authentication_token, uniqueness: true
  validate :email_in_sign_up_whitelist

  after_initialize :populate_locale_on_new
  before_save :ensure_authentication_token

  has_many :authentications, dependent: :destroy
  has_many :posts, dependent: :destroy
  has_many :attachments, dependent: :destroy

  # Skips password requirement when signing in via an external provider using
  # OmniAuth.
  def password_required?
    super && authentications.empty?
  end

  # Skips password requirement when updating a user that has signed in via an
  # external provider using Omniauth.
  def update_with_password(params, *options)
    if encrypted_password.blank?
      update_attributes(params, *options)
    else
      super
    end
  end

  # Alias the original method and make it public, so that it can be called by
  # the background job
  alias_method :orig_send_devise_notification, :send_devise_notification
  public :orig_send_devise_notification

  # Sends Devise notification emails in the background.
  def send_devise_notification (notification, *args)
    SendDeviseNotificationJob.perform_later(self, notification.to_s, *args)
  end

  # Returns a user matching the given Omniauth authentication data.
  # If no such user exists, attempts to create one.
  def self.from_omniauth (omniauth)
    authentication = Authentication.find_by(provider: omniauth.provider,
                                            uid: omniauth.uid)

    if authentication
      authentication.user
    else
      user = User.new
      user.apply_omniauth(omniauth)
      user.save

      user # return
    end
  end

  # When creating a new user, pre-populates its fields (if possible) with data
  # made available by OmniAuth.
  def self.new_with_session (params, session)
    if (omniauth = session['devise.omniauth'])
      user = User.new
      user.email = params[:email]
      user.apply_omniauth(omniauth)
      user.valid?
      user
    else
      super
    end
  end

  public

  # Pre-populates this user's fields (to the extent possible), with data made
  # available by OmniAuth.
  def apply_omniauth (omniauth)
    self.skip_confirmation!

    # Note that we use string keys (not symbols) for the 'omniauth' hash.
    # This is because depending on where 'apply_omniauth' is called from (from
    # 'from_omniauth' or 'new_with_session'), the hash provided may or may not
    # accept symbols as keys, but it always accepts strings.
    self.email = omniauth['info']['email'] if self.email.blank?
    authentications.build provider: omniauth['provider'], uid: omniauth['uid']
  end

  private

  def populate_locale_on_new
    self.locale = I18n.locale if self.new_record?
  end

  def email_in_sign_up_whitelist
    whitelist = AppSettings.get(:security, :sign_up_whitelist)

    if whitelist.present?
      whitelist_items = whitelist.split(/\s*,\s*/).delete_if(&:blank?)

      unless email.end_with?(*whitelist_items)
        errors.add(:email, :not_in_sign_up_whitelist)
      end
    end
  end

  def ensure_authentication_token
    if authentication_token.blank?
      self.authentication_token = create_authentication_token
    end
  end

  def create_authentication_token
    loop do
      token = Devise.friendly_token
      break token unless User.find_by(authentication_token: token)
    end
  end
end
