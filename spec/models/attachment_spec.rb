# == Schema Information
#
# Table name: attachments
#
#  id                :integer          not null, primary key
#  name              :string
#  url               :string(1024)
#  user_id           :integer
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#  access_url        :string(1024)
#  access_expires_at :datetime
#

require 'rails_helper'

RSpec.describe Attachment, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
