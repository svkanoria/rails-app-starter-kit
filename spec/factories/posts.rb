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

    ignore do
      user nil
    end

    # Allows creation of a post belonging to a specific user.
    # Example:
    #   FactoryGirl.create(:post, user: some_user)
    before(:create) do |post, evaluator|
      if (user = evaluator.user.presence)
        post.user = user
      else
        post.user = create(:user)
      end
    end
  end
end
