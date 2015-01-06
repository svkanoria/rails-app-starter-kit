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
#  tenant_id              :integer          not null
#

class User < ActiveRecord::Base
  acts_as_tenant :tenant

  # Include default devise modules. Others available are:
  # :validatable, :lockable and :timeoutable
  #
  # Leave out :validatable as it forces emails to be unique across tenants.
  # The only solution is to remove this module, and write our own email and
  # password validations.
  devise :confirmable,
         :database_authenticatable,
         :registerable,
         :recoverable,
         :rememberable,
         :trackable,
         # Comment this out if you don't need Facebook and/or other providers.
         # Add/remove providers from the array to control which providers can
         # be used for authentication.
         :omniauthable, omniauth_providers: [:facebook]

  rolify

  validates :email, presence: true, uniqueness: { scope: :tenant_id }
  validates :password, presence: true, length: { in: 8..20 },
            confirmation: true, if: :password_required?

  validates :authentication_token, uniqueness: true

  before_save :ensure_authentication_token

  has_many :authentications, dependent: :destroy
  has_many :posts, dependent: :destroy

  # Returns a user matching the given Omniauth authentication data.
  # If no such user exists, attempts to create one.
  def self.from_omniauth (omniauth)
    authentication = Authentication.find_by(omniauth.slice(:provider, :uid))

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

  # Skips password requirement when signing in via an external provider using
  # OmniAuth.
  def password_required?
    # From the Devise::Models::Validatable module, as we've left it out
    orig_cond = !persisted? || !password.nil? || !password_confirmation.nil?

    orig_cond && authentications.empty?
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

  # We scope the search for users to the current tenant.
  # Acts As Tenant purports to do this out of the box, but sadly it does not!
  def self.find_for_authentication (warden_conditions)
    ActsAsTenant.with_tenant(
        Tenant.find_by_subdomain(warden_conditions[:subdomain])) do

      User.find_by_email(warden_conditions[:email])
    end
  end

  alias_method :orig_send_devise_notification, :send_devise_notification
  # Need to make this public, for the job to be able to call it
  public :orig_send_devise_notification

  def send_devise_notification (notification, *args)
    SendDeviseNotificationJob.perform_later(tenant, id, notification.to_s,
                                            *args)
  end

  public

  # Pre-populates this user's fields (to the extent possible), with data made
  # available by OmniAuth.
  def apply_omniauth (omniauth)
    self.skip_confirmation!
    self.email = omniauth[:info][:email] if self.email.blank?
    authentications.build provider: omniauth[:provider], uid: omniauth[:uid]
  end

  private

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
