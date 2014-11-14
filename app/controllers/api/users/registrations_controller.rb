module Api
  module Users
    # Handles user registration via JSON.
    class RegistrationsController < Devise::RegistrationsController
      respond_to :json

      # create need not be overridden

      # update needs to be overridden
      # TODO Override the JSON registration controller 'update' action

      def destroy
        resource.destroy
        Devise.sign_out_all_scopes ? sign_out : sign_out(resource_name)

        respond_with resource
      end
    end
  end
end
