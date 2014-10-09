# == Schema Information
#
# Table name: locations
#
#  id         :integer          not null, primary key
#  slug       :string           not null
#  name       :string           not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

class Location < ActiveRecord::Base
  validates :slug, presence: true, uniqueness: true
  validates :name, presence: true
end
