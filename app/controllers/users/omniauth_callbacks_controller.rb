# MY NOTE: Auto-generated as a result of running
# 'rails g devise:controllers users'. This command generated all the Devise
# related controllers into the 'controllers/users' folder. Some we've modified
# as per our needs, and the others we've left as is. Modifications are clear,
# since they are the only lines that aren't commented out.
class Users::OmniauthCallbacksController < Devise::OmniauthCallbacksController
  # Signs in the user, or redirects to the sign up page as required.
  # This method should work for most providers. All you should have to do, is
  # create aliases named to match the providers you wish to support.
  def all
    if AppSettings.get(:security, :disable_3rd_party_sign_in) ||
        AppSettings.get(:security, :force_sign_up_via_admin)

      raise ActionController::RoutingError.new('Not Found') # Triggers a 500
    end

    omniauth = request.env['omniauth.auth']
    @user = User.from_omniauth(omniauth)

    if @user.persisted?
      sign_in_and_redirect @user

      if is_navigational_format?
        set_flash_message(:notice, :success, kind: omniauth.provider.titleize)
      end
    else
      # This data is used to pre-populate user fields in the registration form
      session['devise.omniauth'] = omniauth

      redirect_to new_user_registration_url
    end
  end
  alias_method :facebook, :all
  alias_method :google_oauth2, :all

  # You should configure your model like this:
  # devise :omniauthable, omniauth_providers: [:twitter]

  # You should also create an action method in this controller like this:
  # def twitter
  # end

  # More info at:
  # https://github.com/plataformatec/devise#omniauth

  # GET|POST /resource/auth/twitter
  # def passthru
  #   super
  # end

  # GET|POST /users/auth/twitter/callback
  # def failure
  #   super
  # end

  # protected

  # The path used when OmniAuth fails
  # def after_omniauth_failure_path_for(scope)
  #   super(scope)
  # end
end
