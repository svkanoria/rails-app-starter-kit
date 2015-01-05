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
#  tenant_id  :integer          not null
#

FactoryGirl.define do
  # Authentication factory.
  #   FactoryGirl.create(:authentication)
  #   FactoryGirl.create(:authentication, user: some_user)
  factory :authentication do
    provider 'facebook'
    uid '10499594'
    user

    # We omit the tenant. It should generally be created as a side-effect of
    # setting the current tenant.
  end
end
