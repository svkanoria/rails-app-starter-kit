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

# A twitter-like post.
class Post < ActiveRecord::Base
  include ActsAsAttachmentOwner

  acts_as_attachment_owner(
      accepts_roles: [
          { image: {
              count: 1,
              filter: lambda { |attachment, post|
                if !attachment.web_image?
                  :not_an_image
                else
                  true
                end
              }
          } },
          :others
      ])

  validates :message, presence: true, length: { minimum: 10, maximum: 140 }
  validates :user_id, presence: true

  belongs_to :user
end
