# Custom controller needed to support multitenancy.
class SessionsController < Devise::SessionsController
  include SetsCurrentTenantForDevise
end
