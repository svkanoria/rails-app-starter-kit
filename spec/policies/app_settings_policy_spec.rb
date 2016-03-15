require 'rails_helper'

describe AppSettingsPolicy do
  subject { AppSettingsPolicy.new(user, AppSettings) }

  context 'for a guest user' do
    let(:user) { nil }

    it { should_not permit(:index) }
    it { should_not permit(:show) }
    it { should_not permit(:create) }
    it { should_not permit(:new) }
    it { should_not permit(:update) }
    it { should_not permit(:edit) }
    it { should_not permit(:destroy) }
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
  end

  context 'for a signed in admin user' do
    let(:user) { FactoryGirl.create(:user, roles: [:admin]) }

    it { should_not permit(:index) }
    it { should permit(:show) }
    it { should_not permit(:create) }
    it { should_not permit(:new) }
    it { should permit(:update) }
    it { should permit(:edit) }
    it { should_not permit(:destroy) }
  end
end
