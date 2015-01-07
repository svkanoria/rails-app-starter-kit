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
    user
  end
end
