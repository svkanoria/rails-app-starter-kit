module Api
  module Users
    class RegistrationsController < Devise::RegistrationsController
      respond_to :json

      def create
        if params[:user][:provider]
          create_omniauth
        else
          super
        end
      end

      def destroy
        resource.destroy
        Devise.sign_out_all_scopes ? sign_out : sign_out(resource_name)

        respond_with resource
      end

      protected

      def create_omniauth
        build_resource(sign_up_params)

        resource.skip_confirmation!
        resource.authentications.build provider: params[:user][:provider],
                                       uid: params[:user][:uid]

        if resource.save
          if resource.active_for_authentication?
            sign_up(resource_name, resource)
            respond_with resource
          else
            respond_with resource
          end
        else
          respond_with resource
        end
      end
    end
  end
end
