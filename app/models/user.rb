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
         # Comment this out if you don't need Facebook and/or other providers.
         # Add/remove providers from the array to control which providers can
         # be used for authentication.
         :omniauthable, omniauth_providers: [:facebook]

  rolify

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

  public

  # Pre-populates this user's fields (to the extent possible), with data made
  # available by OmniAuth.
  def apply_omniauth (omniauth)
    self.skip_confirmation!
    self.email = omniauth[:info][:email] if self.email.blank?
    authentications.build provider: omniauth[:provider], uid: omniauth[:uid]
  end
end
