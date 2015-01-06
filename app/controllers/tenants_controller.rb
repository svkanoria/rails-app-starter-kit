class TenantsController < ApplicationController
  respond_to :json

  def create
    @tenant = Tenant.new(tenant_params)

    @tenant.save

    respond_with @tenant
  end

  def destroy
    @tenant = Tenant.find(params[:id])

    @tenant.destroy

    respond_with @tenant
  end

  private

  def tenant_params
    params.required(:tenant).permit(:name, :subdomain, :admin_email)
  end
end
