require 'rails_helper'

describe LocationPolicy do
  subject { LocationPolicy.new(user, location) }

  context 'for a non-admin user' do
    let(:user) { FactoryGirl.create(:user) }
    let(:location) { FactoryGirl.create(:location) }

    it { should permit(:index) }
    it { should permit(:show) }
    it { should_not permit(:create) }
    it { should_not permit(:new) }
    it { should_not permit(:update) }
    it { should_not permit(:edit) }
    it { should_not permit(:destroy) }
  end

  context 'for an admin user' do
    let(:user) { FactoryGirl.create(:user, roles: [:admin]) }
    let(:location) { FactoryGirl.create(:location) }

    it { should permit(:index) }
    it { should permit(:show) }
    it { should permit(:create) }
    it { should permit(:update) }
    it { should permit(:edit) }
    it { should permit(:destroy) }
  end
end
