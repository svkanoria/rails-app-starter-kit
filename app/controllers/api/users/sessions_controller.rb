module Api
  module Users
    # Handles user authentication via JSON.
    class SessionsController < Devise::SessionsController
      respond_to :json

      def create
        if (user_params = params[:user])[:provider]
          if AppSettings.get(:security, :disable_3rd_party_sign_in)
            render_op_error 'api.users', :third_party_sign_in_disabled

            return
          end

          self.resource = User.from_omniauth(
              user_params.merge(info: { email: user_params[:email] }))

          if resource.persisted?
            sign_in(resource_name, resource)
          elsif (errors = resource.errors).any?
            render json: errors, status: :unprocessable_entity
          end
        else
          warden.authenticate!(scope: resource_name)
        end

        # At this point the user is guaranteed to have been signed in, since any
        # errors would already have been rendered.
        @user = current_user

        # Explicitly set HTTP status code to 201 (created) when successful, else
        # respond_with returns 200 on encountering the JBuilder template.
        respond_with @user, status: :created
      end
    end
  end
end
