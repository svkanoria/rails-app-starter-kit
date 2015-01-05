# == Schema Information
#
# Table name: tenants
#
#  id         :integer          not null, primary key
#  name       :string           not null
#  subdomain  :string           not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

class Tenant < ActiveRecord::Base
  validates :name, presence: true
  validates :subdomain, presence: true,
            format: { with: /\A[a-z\d]+[a-z\d-]*[a-z\d]\z/},
            length: { minimum: 3, maximum: 12 }
end
