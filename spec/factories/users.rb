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

FactoryGirl.define do
  # User factory.
  # Examples:
  #   FactoryGirl.create(:user)
  #   FactoryGirl.create(:user, roles: [:admin, :super_admin])
  factory :user do
    sequence(:email) {|n| "user#{n}@app.com"}
    password 'password'
    password_confirmation 'password'
    # Required if the devise confirmable module is used
    confirmed_at Time.now

    ignore do
      roles nil
    end

    # Allows creation of users with roles.
    # Example:
    #   FactoryGirl.create(:user, roles: [:admin, :super_admin])
    after(:create) do |user, evaluator|
      if (roles = evaluator.roles.presence)
        roles.each do |role|
          user.add_role(role)
        end
      end
    end
  end
end
