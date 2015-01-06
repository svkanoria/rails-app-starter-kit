require 'rails_helper'

describe TenantPolicy do
  subject { TenantPolicy.new(user, tenant) }

  let(:tenant) { FactoryGirl.create(:tenant) }
  let(:user) { nil }

  # For completeness (see policy class)
  it { should_not permit(:index) }
  it { should_not permit(:show) }
  it { should_not permit(:new) }
  it { should_not permit(:update) }
  it { should_not permit(:edit) }

  context 'for creating a tenant' do
    it { should permit(:create) }
  end

  context 'for destroying a tenant' do
    # Set a current tenant for the tests in this section
    include RequiresTenant

    context 'for a guest user' do
      it { should_not permit(:destroy) }
    end

    context 'for a non-admin user' do
      let(:user) { FactoryGirl.create(:user) }

      it { should_not permit(:destroy) }
    end

    context 'for an admin user' do
      let(:user) { FactoryGirl.create(:user, roles: [:admin]) }

      it { should permit(:destroy) }
    end
  end
end
