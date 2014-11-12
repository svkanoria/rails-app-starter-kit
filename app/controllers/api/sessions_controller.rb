module Api
  class SessionsController < Devise::SessionsController
    respond_to :json

    skip_before_filter :authenticate_entity!, only: [:create]

    def create
      warden.authenticate!(scope: resource_name)

      @user = current_user
    end
  end
end
