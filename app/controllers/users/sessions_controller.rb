# MY NOTE: Auto-generated as a result of running
# 'rails g devise:controllers users'. This command generated all the Devise
# related controllers into the 'controllers/users' folder. Some we've modified
# as per our needs, and the others we've left as is. Modifications are clear,
# since they are the only lines that aren't commented out.
class Users::SessionsController < Devise::SessionsController
# before_filter :configure_sign_in_params, only: [:create]

  # GET /resource/sign_in
  # def new
  #   super
  # end

  # POST /resource/sign_in
  def create
    if session[:user_return_to]
      url_param = (I18n.locale == I18n.default_locale) ? '' : I18n.locale

      localized_return_to = (url_param.present?) ?
          session[:user_return_to].gsub(/:locale\/?/, "#{url_param}/") :
          session[:user_return_to].gsub(/:locale\/?/, '')


      session[:user_return_to] = localized_return_to
    end

    super
  end

  # DELETE /resource/sign_out
  # def destroy
  #   super
  # end

  # protected

  # If you have extra params to permit, append them to the sanitizer.
  # def configure_sign_in_params
  #   devise_parameter_sanitizer.for(:sign_in) << :attribute
  # end
end
