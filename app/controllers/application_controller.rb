class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception

  before_filter :set_sign_in_redirect

  # Sets where Devise should redirect on sign-in.
  # Works in conjunction with the 'authLinks' directive.
  def set_sign_in_redirect
    if (hash = params[:x_return_to]).present?
      session[:user_return_to] = "#{request.fullpath}/##{hash}"
    end
  end
end
