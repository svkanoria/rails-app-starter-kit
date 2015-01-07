# == Schema Information
#
# Table name: posts
#
#  id         :integer          not null, primary key
#  message    :string
#  user_id    :integer
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

FactoryGirl.define do
  # Post factory.
  # Examples:
  #   FactoryGirl.create(:post)
  #   FactoryGirl.create(:post, user: some_user)
  factory :post do
    message 'This is a post!'
    user
  end
end
