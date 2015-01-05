# Include in controller/policy spec files that need a current tenant.
# This will automatically create a tenant and set it to be current before each
# test.
module TenantedAccess
  extend ActiveSupport::Concern

  included do
    before(:each) do
      tenant = FactoryGirl.create(:tenant)
      ActsAsTenant.current_tenant = tenant

      # If we are a controller, then set the host
      @request.host = "#{tenant.subdomain}.example.com" if @request
    end

    after(:each) do
      ActsAsTenant.current_tenant = nil
    end
  end
end
