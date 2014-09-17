FactoryGirl.define do
  # User factory.
  # Examples:
  #   FactoryGirl.create(:user)
  #   FactoryGirl.create(:user, roles: [:admin, :super_admin])
  factory :user do
    ignore do
      roles nil
    end

    email 'user@app.com'
    password 'password'
    password_confirmation 'password'
    # Required if the devise confirmable module is used
    confirmed_at Time.now

    # Allows creation of users with roles. Example:
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
