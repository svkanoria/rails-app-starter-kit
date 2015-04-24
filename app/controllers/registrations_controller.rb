# Custom controller needed to support multitenancy.
class RegistrationsController < Devise::RegistrationsController
  include SetsCurrentTenantForDevise
end
