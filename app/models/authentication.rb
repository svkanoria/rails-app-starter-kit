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
#  tenant_id  :integer          not null
#

# Omniauth authentication information.
class Authentication < ActiveRecord::Base
  acts_as_tenant :tenant

  validates :provider, presence: true
  validates :uid, presence: true
  # Cannot validate this, since it interferes with new user creation
  #validates :user_id, presence: true

  belongs_to :user
end
