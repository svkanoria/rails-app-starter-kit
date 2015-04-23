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

require 'rails_helper'

RSpec.describe AttachmentJoin, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
