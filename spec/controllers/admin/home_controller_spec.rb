require 'rails_helper'

RSpec.describe Admin::HomeController, type: :controller do
  context 'for a guest user' do
    describe 'GET index' do
      it 'redirects to sign-in page' do
        get :index

        expect(response).to have_http_status(:found) # 302
      end
    end
  end

  context 'for a signed-in non-admin' do
    let(:user) { FactoryGirl.create(:user) }

    before :each do
      sign_in_user(user) # Sign in a non-admin
    end

    describe 'GET index' do
      it 'redirects to client app home page' do
        get :index

        expect(response).to have_http_status(:found) # 302
      end
    end
  end

  context 'for a signed-in admin' do
    let(:user) { FactoryGirl.create(:user, roles: [:admin]) }

    before :each do
      sign_in_user(user) # Sign in an admin
    end

    describe 'GET index' do
      it 'returns http success' do
        get :index

        expect(response).to have_http_status(:success)
      end
    end
  end
end
