require 'rails_helper'

RSpec.describe PostsController, type: :controller do
  before :each do
    request.accept = 'application/json' # For testing JSON requests
  end

  context 'for a guest user' do
    describe 'POST create' do
      it 'forbids the request' do
        # Create data to send to the 'create' action
        post_attrs = FactoryGirl.attributes_for(:post)

        # Run the create action
        post :create, {post: post_attrs}

        # Analyze action result
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  context 'for a signed in user' do
    before :each do
      sign_in_user # Sign in a user
    end

    describe 'POST create' do
      it 'successfully creates a post' do
        # Create data to send to the 'create' action
        post_attrs = FactoryGirl.attributes_for(:post)

        # Run the create action
        post :create, {post: post_attrs}

        # Analyze action result
        expect(response).to have_http_status(:created)
      end
    end
  end
end
