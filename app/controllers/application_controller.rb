class ApplicationController < ActionController::Base
  include Pundit

  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception

  # For requests coming from a native app, an 'app access token' is used to
  # verify authenticity, because the CSRF token is only visible to web apps.
  # Another solution could be to turn off CSRF protection for JSON requests
  # altogether, and secure our Angular code via access tokens. However, our
  # approach has some advantages:
  # * Much simpler authentication code in Angular
  # * Makes it safe for the web app to operate over plain HTTP
  skip_before_action :verify_authenticity_token, if: :valid_app_access_token?

  before_action :set_sign_in_redirect

  rescue_from Pundit::NotAuthorizedError, with: :deny_access

  protected

  # Checks for a valid app access token in the 'X-App-Access-Token' header.
  def valid_app_access_token?
    app_access_token = request.headers['X-App-Access-Token']

    app_access_token.present? &&
        app_access_token == Rails.application.secrets.app_access_token
  end

  # Sets where Devise should redirect on sign-in.
  # Works in conjunction with the 'authLinks' directive.
  def set_sign_in_redirect
    if (hash = params[:x_return_to]).present?
      session[:user_return_to] =
          "#{request.protocol}#{request.host_with_port}/##{hash}"
    end
  end

  # Responds with a 401 (:unauthorized) HTTP status code.
  def deny_access
    respond_to do |format|
      format.json {
        # Some schools of thought advocate the use of 404 (:not_found). See
        # http://www.bennadel.com/blog/2400-handling-forbidden-restful-requests-401-vs-403-vs-404.htm
        render json: {}, status: :unauthorized
      }
    end
  end
end
