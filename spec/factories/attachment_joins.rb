# == Schema Information
#
# Table name: attachment_joins
#
#  id                    :integer          not null, primary key
#  attachment_id         :integer
#  attachment_owner_id   :integer
#  attachment_owner_type :string
#  created_at            :datetime         not null
#  updated_at            :datetime         not null
#  role                  :string
#

FactoryGirl.define do
  # AttachmentJoin factory.
  # Examples:
  #   # Sets attachment owner to a Post.
  #   # The attachment and post belong to the same user.
  #   # Also sets to the role to 'image'.
  #   FactoryGirl.create(:attachment_join)
  #
  #   FactoryGirl.create(:attachment_join, attachment: some_attachment,
  #                      attachment_owner: some_owner)
  factory :attachment_join do
    ignore do
      attachment_owner nil
    end

    attachment
    role 'image'

    after(:build) do |attachment_join, evaluator|
      attachment_join.attachment_owner = evaluator.attachment_owner ||
          create(:post, user: attachment_join.attachment.user)
    end
  end
end
