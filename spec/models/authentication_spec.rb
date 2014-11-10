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
#

require 'rails_helper'

RSpec.describe Authentication, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
