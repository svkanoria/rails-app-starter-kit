require 'rails_helper'

describe AttachmentJoinPolicy do
  subject { AttachmentJoinPolicy.new(user, attachment_join) }

  context 'for a guest user' do
    let(:user) { nil }
    let(:attachment_join) { FactoryGirl.create(:attachment_join) }

    it { should_not permit(:index) }
    it { should_not permit(:show) }
    it { should_not permit(:create) }
    it { should_not permit(:new) }
    it { should_not permit(:update) }
    it { should_not permit(:edit) }
    it { should_not permit(:destroy) }
  end

  context 'for a signed in user' do
    let(:user) { FactoryGirl.create(:user) }
    let(:attachment_join) { FactoryGirl.create(:attachment_join) }

    it { should_not permit(:index) }
    it { should_not permit(:show) }
    it { should_not permit(:update) }
    it { should_not permit(:edit) }

    context 'for an attachment created by someone else' do
      it { should_not permit(:create) }
      it { should_not permit(:new) }
      it { should_not permit(:destroy) }
    end

    context 'for an attachment created by the user' do
      let(:attachment_join) {
        attachment = FactoryGirl.create(:attachment, user: user)

        # Note: The factory automatically assigns the attachment user to the
        # attachment owner user (unless explicitly passed an owner object via
        # attachment_owner). FYI.
        FactoryGirl.create(:attachment_join, attachment: attachment)
      }

      it { should permit(:create) }
      it { should permit(:new) }
      it { should permit(:destroy) }
    end
  end
end