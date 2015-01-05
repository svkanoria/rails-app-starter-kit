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

FactoryGirl.define do
  factory :tenant do
    sequence(:name) {|n| "Tenant #{n}"}
    sequence(:subdomain) {|n| "tenant#{n}"}
  end
end
