# == Schema Information
#
# Table name: roles
#
#  id            :integer          not null, primary key
#  name          :string
#  resource_id   :integer
#  resource_type :string
#  created_at    :datetime
#  updated_at    :datetime
#

require 'rails_helper'

RSpec.describe Role, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
