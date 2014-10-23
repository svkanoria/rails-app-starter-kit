class ApplicationController < ActionController::Base
  include Pundit

  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception

  before_action :set_sign_in_redirect

  rescue_from Pundit::NotAuthorizedError, with: :deny_access

  protected

  # Sets where Devise should redirect on sign-in.
  # Works in conjunction with the 'authLinks' directive.
  def set_sign_in_redirect
    if (hash = params[:x_return_to]).present?
      session[:user_return_to] =
          "#{request.protocol}#{request.host_with_port}/##{hash}"
    end
  end

  # Sets where Devise should redirect on sign-out.
  # Required to prevent Angular's $routeChangeSuccess event from being fired
  # multiple times, thus causing Angular flash messages relying on the event,
  # not to work correctly.
  def after_sign_out_path_for(resource_or_scope)
    "#{request.protocol}#{request.host_with_port}/#/"
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
