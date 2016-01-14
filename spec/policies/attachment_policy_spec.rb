require 'rails_helper'

describe AttachmentPolicy do
  subject { AttachmentPolicy.new(user, attachment) }

  context 'for a guest user' do
    let(:user) { nil }
    let(:attachment) { FactoryGirl.create(:attachment) }

    it { should_not permit(:index) }
    it { should_not permit(:show) }
    it { should_not permit(:create) }
    it { should_not permit(:new) }
    it { should_not permit(:update) }
    it { should_not permit(:edit) }
    it { should_not permit(:destroy) }
    it { should_not permit(:batch_destroy) }
  end

  context 'for a signed in user' do
    let(:user) { FactoryGirl.create(:user) }
    let(:attachment) { FactoryGirl.create(:attachment) }

    it { should permit(:index) }
    it { should permit(:create) }
    it { should permit(:new) }

    context 'for an attachment created by someone else' do
      it { should_not permit(:show) }
      it { should_not permit(:update) }
      it { should_not permit(:edit) }
      it { should_not permit(:destroy) }
      it { should_not permit(:batch_destroy) }
    end

    context 'for an attachment created by the user' do
      # Create an attachment belonging to the signed-in user
      let(:attachment) { FactoryGirl.create(:attachment, user: user) }

      it { should permit(:show) }
      it { should permit(:update) }
      it { should permit(:edit) }
      it { should permit(:destroy) }
      it { should permit(:batch_destroy) }
    end
  end
end
