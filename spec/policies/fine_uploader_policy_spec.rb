require 'rails_helper'

describe FineUploaderPolicy do
  subject { FineUploaderPolicy.new(user, obj) }

  context 'for a guest user' do
    let(:user) { nil }
    let(:obj) { nil }

    it { should_not permit(:s3_signature) }
    it { should_not permit(:s3_upload_success) }
  end

  context 'for a signed in user' do
    let(:user) { FactoryGirl.create(:user) }
    let(:obj) { nil }

    it { should permit(:s3_signature) }
    it { should permit(:s3_upload_success) }
  end
end
