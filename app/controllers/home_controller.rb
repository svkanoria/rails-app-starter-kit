class HomeController < ApplicationController
  def index
    # Currently signed in user details (if any) to be passed on to the
    # client-side JS code.
    if current_user
      @current_user_json = {
          id: current_user.id,
          email: current_user.email,
          roles: current_user.roles.pluck(:name)
      }.to_json
    end
  end
end
