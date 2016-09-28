# MY NOTE: Auto-generated as a result of running
# 'rails g devise:controllers users'. This command generated all the Devise
# related controllers into the 'controllers/users' folder. Some we've modified
# as per our needs, and the others we've left as is. Modifications are clear,
# since they are the only lines that aren't commented out.
class Users::SessionsController < Devise::SessionsController
# before_filter :configure_sign_in_params, only: [:create]

  # MY NOTE: Added this line on our own
  before_action :set_sign_in_redirect, only: [:new]

  # GET /resource/sign_in
  # def new
  #   super
  # end

  # POST /resource/sign_in
  # def create
  #   super
  # end

  # DELETE /resource/sign_out
  # def destroy
  #   super
  # end

  # protected

  # If you have extra params to permit, append them to the sanitizer.
  # def configure_sign_in_params
  #   devise_parameter_sanitizer.for(:sign_in) << :attribute
  # end

  # MY NOTE: Added this method on our own.
  # Sets where Devise should redirect on sign-in.
  # Works in conjunction with the 'authentication-links' directive.
  def set_sign_in_redirect
    if (url = params[:return_to]).present?
      session[:user_return_to] = url
    end
  end
end
