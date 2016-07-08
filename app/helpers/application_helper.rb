module ApplicationHelper
  # Currently signed in user details (if any) to be passed to the client-side
  # JS code.
  def current_user_json
    if current_user
      { id: current_user.id,
        email: current_user.email,
        roles: current_user.roles.pluck(:name) }.to_json
    end
  end
end
