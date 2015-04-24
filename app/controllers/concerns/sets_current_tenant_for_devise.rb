# Augments Devise controllers to support multitenancy.
#
# Some Devise controllers have a prepended filter for fetching the user. This
# fails since the current tenant is not set at this time. This module provides a
# workaround by setting the current tenant in a prepended filter itself, thus
# making it available in time for fetching the user.
#
# Usage:
#   # In any Devise controller:
#   include SetsCurrentTenantForDevise
module SetsCurrentTenantForDevise
  extend ActiveSupport::Concern

  included do
    set_current_tenant_through_filter
    prepend_before_action :set_tenant
  end

  def set_tenant
    set_current_tenant(Tenant.find_by(subdomain: request.subdomain))
  end
end
