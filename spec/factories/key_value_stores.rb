# == Schema Information
#
# Table name: key_value_stores
#
#  id         :integer          not null, primary key
#  name       :string           not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

FactoryGirl.define do
  # KeyValueStore factory.
  # Examples:
  #   FactoryGirl.create(:key_value_store)
  #   FactoryGirl.create(:key_value_store, name: 'some-name')
  factory :key_value_store do
    name 'default'
  end
end
