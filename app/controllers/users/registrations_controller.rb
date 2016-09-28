# MY NOTE: Auto-generated as a result of running
# 'rails g devise:controllers users'. This command generated all the Devise
# related controllers into the 'controllers/users' folder. Some we've modified
# as per our needs, and the others we've left as is. Modifications are clear,
# since they are the only lines that aren't commented out.
class Users::RegistrationsController < Devise::RegistrationsController
# before_filter :configure_sign_up_params, only: [:create]
# before_filter :configure_account_update_params, only: [:update]

  # GET /resource/sign_up
  def new
    if AppSettings.get(:security, :force_sign_up_via_admin)
      # Not particularly apt, but we need to trigger a 404
      raise ActiveRecord::RecordNotFound
    else
      super
    end
  end

  # POST /resource
  def create
    if AppSettings.get(:security, :force_sign_up_via_admin)
      raise ActionController::RoutingError.new('Not Found') # Triggers a 500
    else
      super
    end
  end

  # GET /resource/edit
  # def edit
  #   super
  # end

  # PUT /resource
  # def update
  #   super
  # end

  # DELETE /resource
  # def destroy
  #   super
  # end

  # GET /resource/cancel
  # Forces the session data which is usually expired after sign
  # in to be expired now. This is useful if the user wants to
  # cancel oauth signing in/up in the middle of the process,
  # removing all OAuth session data.
  # def cancel
  #   super
  # end

  # protected

  # If you have extra params to permit, append them to the sanitizer.
  # def configure_sign_up_params
  #   devise_parameter_sanitizer.for(:sign_up) << :attribute
  # end

  # If you have extra params to permit, append them to the sanitizer.
  # def configure_account_update_params
  #   devise_parameter_sanitizer.for(:account_update) << :attribute
  # end

  # The path used after sign up.
  # MY NOTE: To redirect to the referrer upon sign up. However, note that if
  # awaiting confirmation, `after_inactive_sign_up_path_for` is used instead.
  def after_sign_up_path_for(resource)
    after_sign_in_path_for(resource)
  end

  # The path used after sign up for inactive accounts.
  # MY NOTE: Mandatorily overridden along with `after_sign_up_path_for`. Also,
  # this work to retain the locale when redirecting upon (inactive) sign up.
  def after_inactive_sign_up_path_for(resource)
    localized_root_path
  end
end
