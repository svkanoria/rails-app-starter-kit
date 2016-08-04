module Api
  module Users
    # Handles user registration via JSON.
    class RegistrationsController < Devise::RegistrationsController
      respond_to :json

      def create
        if AppSettings.get(:security, :force_sign_up_via_admin)
          render_op_error 'api.users', :sign_up_disabled
        else
          super
        end
      end

      # update needs to be overridden
      # TODO Override the 'update' action

      def destroy
        resource.destroy
        Devise.sign_out_all_scopes ? sign_out : sign_out(resource_name)

        respond_with resource
      end
    end
  end
end
