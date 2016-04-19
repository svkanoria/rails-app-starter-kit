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

# A twitter-like post.
class Post < ActiveRecord::Base
  acts_as_tenant :tenant

  include ActsAsAttachmentOwner

  acts_as_attachment_owner(
      accepts_roles: [
          { image: {
              count: 1,
              filter: lambda { |attachment, post|
                attachment.user_id == post.user_id && attachment.web_image?
              }
          } },
          :contributed_attachment
      ])

  validates :message, presence: true, length: { minimum: 10, maximum: 140 }
  validates :user_id, presence: true

  belongs_to :user
end
