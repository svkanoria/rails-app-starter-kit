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
#

class AttachmentJoin < ActiveRecord::Base
  validates :attachment_id, presence: true
  validates :attachment_owner_id, presence: true
  validates :attachment_owner_type, presence: true

  belongs_to :attachment
  belongs_to :attachment_owner, polymorphic: true
end
