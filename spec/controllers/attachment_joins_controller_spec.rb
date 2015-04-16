require 'rails_helper'

RSpec.describe AttachmentJoinsController, type: :controller do
  before :each do
    request.accept = 'application/json'
  end

  context 'for a guest user' do
    let(:attachment_join) { FactoryGirl.create(:attachment_join) }

    describe 'POST create' do
      it 'forbids the request' do
        attachment_join_attrs = FactoryGirl.attributes_for(:attachment_join)

        post :create, attachment_join: attachment_join_attrs

        expect(response).to have_http_status(:unauthorized)
      end
    end

    describe 'DELETE destroy' do
      it 'forbids the request' do
        delete :destroy, id: attachment_join.id

        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  context 'for a signed in user' do
    let(:user) { FactoryGirl.create(:user) }
    let(:attachment_join) { FactoryGirl.create(:attachment_join) }
    let(:pozt) { FactoryGirl.create(:post, user: user) } # Attachment owner

    before :each do
      sign_in_user(user) # Sign in a user
    end

    context 'for an attachment created by someone else' do
      let(:attachment) { FactoryGirl.create(:attachment) }

      describe 'POST create' do
        it 'forbids the request' do
          attachment_join_attrs =
              FactoryGirl.attributes_for(:attachment_join).
                  merge!(attachment_id: attachment.id,
                         attachment_owner_id: pozt.id,
                         attachment_owner_type: pozt.class)

          post :create, attachment_join: attachment_join_attrs

          expect(response).to have_http_status(:unauthorized)
        end
      end
    end

    context 'for an attachment created by the user' do
      let(:attachment) { FactoryGirl.create(:attachment, user: user) }

      describe 'POST create' do
        it 'successfully creates the attachment join' do
          attachment_join_attrs =
              FactoryGirl.attributes_for(:attachment_join).
                  merge!(attachment_id: attachment.id,
                         attachment_owner_id: pozt.id,
                         attachment_owner_type: pozt.class)

          post :create, attachment_join: attachment_join_attrs

          expect(response).to have_http_status(:created)
        end
      end
    end

    context 'for an attachment join created by someone else' do
      describe 'DELETE destroy' do
        it 'forbids the request' do
          delete :destroy, id: attachment_join.id

          expect(response).to have_http_status(:unauthorized)
        end
      end
    end

    context 'for an attachment join created by the user' do
      let!(:attachment_join) { # Note the bang (!) in let
        attachment = FactoryGirl.create(:attachment, user: user)

        FactoryGirl.create(:attachment_join, attachment: attachment)
      }

      describe 'DELETE destroy' do
        it 'deletes the attachment join' do
          expect {
            delete :destroy, id: attachment_join.id
          }.to change(AttachmentJoin, :count).by(-1)
        end
      end
    end
  end
end
