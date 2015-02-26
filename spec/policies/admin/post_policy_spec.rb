require 'rails_helper'

describe Admin::PostPolicy do
  include RequiresTenant

  subject { Admin::PostPolicy.new(user, post) }

  context 'assuming prior admin check' do
    let(:user) { nil }
    let(:post) { FactoryGirl.create(:post) }

    it { should permit(:index) }

    # For completeness (see policy class)
    it { should_not permit(:show) }
    it { should_not permit(:create) }
    it { should_not permit(:new) }
    it { should_not permit(:update) }
    it { should_not permit(:edit) }
    it { should_not permit(:destroy) }
  end
end
