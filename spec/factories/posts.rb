# == Schema Information
#
# Table name: posts
#
#  id         :integer          not null, primary key
#  message    :string
#  user_id    :integer
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  tenant_id  :integer          not null
#

FactoryGirl.define do
  # Post factory.
  # Examples:
  #   FactoryGirl.create(:post)
  #   FactoryGirl.create(:post, user: some_user)
  factory :post do
    message 'This is a post!'
    user

    # We omit the tenant. It should generally be created as a side-effect of
    # setting the current tenant.
  end
end
