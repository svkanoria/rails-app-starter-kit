require 'rails_helper'

RSpec.describe LocationsController, type: :controller do
  before :each do
    request.accept = 'application/json'
  end

  context 'for a non-admin user' do
    before :each do
      sign_in_user # Sign in a non-admin
    end

    describe 'POST create' do
      it 'forbids the request' do
        location_attrs = FactoryGirl.attributes_for(:location)
        post :create, {location: location_attrs}
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  context 'for an admin user' do
    before :each do
      sign_in_user(%w(admin)) # Sign in an admin
    end

    describe 'POST create' do
      it 'successfully creates a location' do
        location_attrs = FactoryGirl.attributes_for(:location)
        post :create, {location: location_attrs}
        expect(response).to have_http_status(:created)
      end
    end
  end
end
