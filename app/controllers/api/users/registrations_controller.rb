module Api
  module Users
    class RegistrationsController < Devise::RegistrationsController
      respond_to :json

      def destroy
        resource.destroy
        Devise.sign_out_all_scopes ? sign_out : sign_out(resource_name)

        respond_with resource
      end
    end
  end
end
