# == Schema Information
#
# Table name: locations
#
#  id         :integer          not null, primary key
#  slug       :string           not null
#  name       :string           not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  abbrs      :text             default("{}"), is an Array
#  zip        :string
#

FactoryGirl.define do
  # Location factory
  factory :location do
    slug 'ConnaughtPlace'
    name 'Connaught Place'
    zip '110057'
    abbrs %w(CP ConnPl)
  end
end
