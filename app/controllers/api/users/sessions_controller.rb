module Api
  module Users
    class SessionsController < Devise::SessionsController
      respond_to :json

      def create
        warden.authenticate!(scope: resource_name)

        @user = current_user
      end
    end
  end
end
