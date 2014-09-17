# Utility methods for use in controller tests.
module ControllerMacros
  # For signing in a user (optionally with certain roles) for controller tests
  # requiring a user to be logged in.
  def sign_in_user (roles = nil)
    @request.env['devise.mapping'] = Devise.mappings[:user]
    user = FactoryGirl.create(:user, roles: roles)
    sign_in user
  end
end
