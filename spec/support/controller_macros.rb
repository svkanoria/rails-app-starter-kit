# Utility methods for use in controller tests.
module ControllerMacros
  # For signing in a user (optionally with certain roles), for controller tests
  # requiring an authenticated user.
  #
  # @param user_or_roles [User, Array<String>] A user object, an array of roles
  #   or nil. In the latter two cases, a user is created.
  def sign_in_user (user_or_roles = nil)
    @request.env['devise.mapping'] = Devise.mappings[:user]

    if user_or_roles.is_a? User
      user = user_or_roles
    else
      user = FactoryGirl.create(:user, roles: roles)
    end

    sign_in user
  end
end
