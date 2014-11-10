# == Schema Information
#
# Table name: authentications
#
#  id         :integer          not null, primary key
#  provider   :string
#  uid        :string
#  user_id    :integer
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

FactoryGirl.define do
  # Authentication factory.
  #   FactoryGirl.create(:authentication)
  #   FactoryGirl.create(:authentication, user: some_user)
  factory :authentication do
    provider 'facebook'
    uid '10499594'

    ignore do
      user nil
    end

    # Allows creation of an authentication belonging to a specific user.
    # Example:
    #   FactoryGirl.create(:authentication, user: some_user)
    before(:create) do |authentication, evaluator|
      if (user = evaluator.user.presence)
        authentication.user = user
      else
        authentication.user = create(:user)
      end
    end
  end
end
