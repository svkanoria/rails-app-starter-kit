require 'rails_helper'

RSpec.describe PostsController, type: :controller do
  before :each do
    request.accept = 'application/json' # For testing JSON requests
  end

  context 'for a guest user' do
    # The name 'post' conflicts with a method of the same name in RSpec
    let(:pozt) { FactoryGirl.create(:post) }

    describe 'POST create' do
      it 'forbids the request' do
        # Create data to send to the 'create' action
        post_attrs = FactoryGirl.attributes_for(:post)

        # Run the create action
        post :create, post: post_attrs

        # Analyze action result
        expect(response).to have_http_status(:unauthorized)
      end
    end

    describe 'PUT update' do
      it 'forbids the request' do
        put :update, id: pozt.id, post: { message: 'This is an update.' }

        expect(response).to have_http_status(:unauthorized)
      end
    end

    describe 'DELETE destroy' do
      it 'forbids the request' do
        delete :destroy, id: pozt.id

        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  context 'for a signed in user' do
    let(:user) { FactoryGirl.create(:user) }
    let(:pozt) { FactoryGirl.create(:post) }

    before :each do
      sign_in_user(user) # Sign in a user
    end

    describe 'POST create' do
      it 'successfully creates a post' do
        # Create data to send to the 'create' action
        post_attrs = FactoryGirl.attributes_for(:post)

        # Run the create action
        post :create, post: post_attrs

        # Analyze action result
        expect(response).to have_http_status(:created)
      end
    end

    context 'for a post created by someone else' do
      describe 'PUT update' do
        it 'forbids the request' do
          put :update, id: pozt.id, post: { message: 'This is an update.' }

          expect(response).to have_http_status(:unauthorized)
        end
      end

      describe 'DELETE destroy' do
        it 'forbids the request' do
          delete :destroy, id: pozt.id

          expect(response).to have_http_status(:unauthorized)
        end
      end
    end

    context 'for a post created by the user' do
      # Create a post belonging to the signed-in user.
      # Note the let bang (!). Without it, the destroy action test fails.
      let!(:pozt) { FactoryGirl.create(:post, user: user) }

      describe 'PUT update' do
        it 'updates the post' do
          new_message = 'This is an update.'

          put :update, id: pozt.id, post: { message: new_message }
          pozt.reload

          expect(pozt.message).to eq(new_message)
        end
      end

      describe 'DELETE destroy' do
        it 'destroys the post' do
          expect {
            delete :destroy, id: pozt.id
          }.to change(Post, :count).by(-1)
        end
      end
    end
  end
end
