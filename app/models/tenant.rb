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
  # For creating an admin along with the tenant
  attr_accessor :admin_email

  validates :name, presence: true
  validates :subdomain, presence: true,
            format: { with: /\A[a-z\d]+[a-z\d-]*[a-z\d]\z/},
            length: { minimum: 3, maximum: 12 }

  validates :admin_email, presence: true, if: :new_record?

  after_create :create_admin

  # While destroying, set this tenant as current, so that all dependent data
  # is correctly destroyed.
  around_destroy :set_as_current_tenant

  # Enough to destroy everything, since all other models belong to some user.
  # If there are any models directly under tenants, add them here.
  has_many :users, dependent: :destroy

  private

  def create_admin
    ActsAsTenant.with_tenant(self) do
      user = User.new email: admin_email,
                      password: Devise.friendly_token.first(8)

      # Required if the devise confirmable module is used.
      # Skips confirmation while testing, which makes it possible to sign in
      # with this user in a test, if required. As a side effect, it also
      # skips sending a confirmation email, which is efficient!
      user.skip_confirmation! if Rails.env.test?

      user.save!
      user.add_role :admin
    end
  end

  def set_as_current_tenant
    ActsAsTenant.with_tenant(self) do
      yield
    end
  end
end
