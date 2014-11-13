module Api
  module Users
    class SessionsController < Devise::SessionsController
      respond_to :json

      def create
        if (user_params = params[:user])[:provider]
          self.resource = User.from_omniauth(
              user_params.merge(info: { email: user_params[:email] }))

          if resource.persisted?
            sign_in(resource_name, resource)
          elsif (errors = resource.errors).any?
            render json: errors
          end
        else
          warden.authenticate!(scope: resource_name)
        end

        # At this point, the user is guaranteed to have been signed in, since
        # any errors would already have been rendered.
        @user = current_user
      end
    end
  end
end
