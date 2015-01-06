class TenantsController < ApplicationController
  respond_to :json

  after_action :verify_authorized

  def create
    @tenant = Tenant.new(tenant_params)
    authorize @tenant

    @tenant.save

    respond_with @tenant
  end

  def destroy
    @tenant = ActsAsTenant.current_tenant
    authorize @tenant

    @tenant.destroy

    respond_with @tenant
  end

  private

  def tenant_params
    params.required(:tenant).permit(:name, :subdomain, :admin_email)
  end
end
