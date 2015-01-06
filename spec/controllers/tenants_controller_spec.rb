require 'rails_helper'

RSpec.describe TenantsController, type: :controller do
  before :each do
    request.accept = 'application/json' # For testing JSON requests
  end

  context 'for creating a tenant' do
    describe 'POST create' do
      it 'successfully creates a tenant' do
        tenant_attrs = FactoryGirl.attributes_for(:tenant)
        # We populate the admin email manually, since attributes_for does not
        tenant_attrs[:admin_email] = "admin@#{tenant_attrs[:subdomain]}.com"

        post :create, tenant: tenant_attrs

        expect(response).to have_http_status(:created)
      end
    end
  end

  context 'for destroying a tenant' do
    # Set a current tenant for the tests in this section
    include RequiresTenant

    context 'for a guest user' do
      describe 'DELETE destroy' do
        it 'forbids the request' do
          delete :destroy

          expect(response).to have_http_status(:unauthorized)
        end
      end
    end

    context 'for a non-admin user' do
      let(:user) { FactoryGirl.create(:user) }

      before :each do
        sign_in_user(user)
      end

      describe 'DELETE destroy' do
        it 'forbids the request' do
          delete :destroy

          expect(response).to have_http_status(:unauthorized)
        end
      end
    end

    context 'for an admin user' do
      let(:user) { FactoryGirl.create(:user, roles: [:admin]) }

      before :each do
        sign_in_user(user)
      end

      describe 'DELETE destroy' do
        it 'destroys the tenant' do
          expect {
            delete :destroy
          }.to change(Tenant, :count).by(-1)
        end
      end
    end
  end
end
