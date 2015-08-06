require 'rails_helper'

describe UserPolicy do
  subject { UserPolicy.new(user, target_user) }

  let(:target_user) { FactoryGirl.create(:user) }

  context 'for a guest user' do
    let(:user) { nil }

    it { should_not permit(:index) }
    it { should_not permit(:show) }
    it { should_not permit(:create) }
    it { should_not permit(:new) }
    it { should_not permit(:update) }
    it { should_not permit(:edit) }
    it { should_not permit(:destroy) }
    it { should_not permit(:batch_destroy) }
  end

  context 'for a signed in non-admin user' do
    let(:user) { FactoryGirl.create(:user) }

    it { should_not permit(:index) }
    it { should_not permit(:show) }
    it { should_not permit(:create) }
    it { should_not permit(:new) }
    it { should_not permit(:update) }
    it { should_not permit(:edit) }
    it { should_not permit(:destroy) }
    it { should_not permit(:batch_destroy) }
  end

  context 'for a signed in admin user' do
    let(:user) { FactoryGirl.create(:user, roles: [:admin]) }

    it { should permit(:index) }
    it { should_not permit(:show) }
    it { should permit(:create) }
    it { should permit(:new) }
    it { should permit(:update) }
    it { should permit(:edit) }
    it { should permit(:destroy) }
    it { should permit(:batch_destroy) }
  end
end
