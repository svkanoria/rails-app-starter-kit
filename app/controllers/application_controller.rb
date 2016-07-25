class ApplicationController < ActionController::Base
  include Pundit

  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception

  # For requests coming from a native app, an 'app access token' is used to
  # verify authenticity, because the CSRF token is only visible to web apps.
  #
  # Another solution could be to turn off CSRF protection for JSON requests
  # altogether, and secure our Angular code via access tokens. However, our
  # approach has some advantages:
  # * Much simpler authentication code in Angular
  # * Makes it safe for the web app to operate over plain HTTP
  skip_before_action :verify_authenticity_token, if: :valid_app_access_token?

  before_action :authenticate_user_from_token,
                :set_sign_in_redirect,
                :force_sign_in_if_required

  rescue_from Pundit::NotAuthorizedError, with: :deny_access

  public

  # Renders a JSON error for any failed operation for any reason, as follows:
  #   { error: 'Some error message' }
  #
  # The reason for failure could be anything:
  # * An exception was thrown
  # * The request did not have a required query parameter
  # * A query parameter was badly formatted
  #
  # Supports localization of error messages.
  # For example, if i18n_prefix is 'klass.method', and error is 'some_error',
  # then it will look for this localized error message:
  #   op_errors:
  #     klass:
  #       method:
  #         some_error: Some error message
  #
  # @param i18n_prefix [String] usually 'class_name.method_name'. Can be nil
  # @param error [String, Symbol] eg. :some_parameter_missing
  # @param status [Symbol] the HTTP status code to be used for the response
  def render_op_error (i18n_prefix, error, status = :bad_request)
    respond_to do |format|
      format.json {
        i18n_key = 'op_errors.'
        i18n_key += "#{i18n_prefix}." if i18n_prefix.present?
        i18n_key += error.to_s

        render json: { error: I18n.t(i18n_key, default: error.to_s.humanize) },
               status: status
      }
    end
  end

  private

  # Checks for a valid app access token in the 'X-App-Access-Token' header.
  def valid_app_access_token?
    token = request.headers['X-App-Access-Token']

    token.present? && token == Rails.application.secrets.app_access_token
  end

  # Authenticates a user from the email and authentication supplied via the
  # 'X-User-Email' and 'X-User-Authentication-Token' headers.
  def authenticate_user_from_token
    email = request.headers['X-User-Email']

    if email && (user = User.find_by(email: email))
      token = request.headers['X-User-Authentication-Token']

      if Devise.secure_compare(user.authentication_token, token)
        sign_in user, store: false
      end
    end
  end

  # Sets where Devise should redirect on sign-in.
  # Works in conjunction with the 'authLinks' directive.
  def set_sign_in_redirect
    if (hash = params[:return_to]).present?
      session[:user_return_to] =
          "#{request.protocol}#{request.host_with_port}#{hash}"
    end
  end

  # Forces users to sign in to access the application, iff an app admin has
  # configured the app to do.
  #
  # Unfortunately, upon sign-in the user will be redirected to the root page,
  # i.e. the hash portion of the URL will be ignored. This is a limitation of
  # keeping a server view based authentication UI, despite having an SPA. For
  # now, we'll just learn to live with it!
  def force_sign_in_if_required
    authenticate_user! if AppSettings.get(:security, :force_sign_in)
  end

  # Responds with a 401 (:unauthorized) HTTP status code.
  def deny_access
    respond_to do |format|
      format.html {
        flash[:alert] = 'You are not authorized to perform this action'

        redirect_to root_path
      }

      format.json {
        # Some schools of thought advocate the use of 404 (:not_found). See
        # http://www.bennadel.com/blog/2400-handling-forbidden-restful-requests-401-vs-403-vs-404.htm
        render json: {}, status: :unauthorized
      }
    end
  end
end
