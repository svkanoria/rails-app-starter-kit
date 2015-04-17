require 'rails_helper'

RSpec.describe FineUploaderController, type: :controller do
  before :each do
    request.accept = 'application/json'
  end

  context 'for a guest user' do
    describe 'POST s3_signature' do
      it 'forbids the request' do
        attrs = FactoryGirl.attributes_for(:fine_uploader_s3_signature)

        post :s3_signature, fine_uploader: attrs

        expect(response).to have_http_status(:unauthorized)
      end
    end

    describe 'POST s3_upload_success' do
      it 'forbids the request' do
        attrs = FactoryGirl.attributes_for(:fine_uploader_s3_upload_success)

        post :s3_upload_success, attrs

        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  context 'for a signed in user' do
    let(:user) { FactoryGirl.create(:user) }

    before :each do
      sign_in_user(user) # Sign in a user
    end

    describe 'POST s3_signature' do
      it 'allows the request' do
        attrs = FactoryGirl.attributes_for(:fine_uploader_s3_signature)

        post :s3_signature, fine_uploader: attrs

        expect(response).to have_http_status(:ok)
      end
    end

    describe 'POST s3_upload_success' do
      it 'successfully creates an attachment' do
        attrs = FactoryGirl.attributes_for(:fine_uploader_s3_upload_success)

        expect {
          post :s3_upload_success, attrs
        }.to change(Attachment, :count).by(1)
      end
    end
  end
end
