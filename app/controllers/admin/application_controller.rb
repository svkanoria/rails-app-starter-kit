class Admin::ApplicationController < ApplicationController
  include Pundit

  layout 'admin/application'

  before_filter :authenticate_admin!

  private

  # Only allows admins access to the entire admin section.
  # This frees the programmer from having to remember to check everywhere.
  #
  # Unfortunately, upon sign-in the user will be redirected to the root page,
  # i.e. the hash portion of the URL will be ignored. This is a limitation of
  # keeping a server view based authentication UI, despite having an SPA. For
  # now, we'll just learn to live with it!
  def authenticate_admin!
    if current_user.nil?
      authenticate_user!
    elsif !current_user.has_role?(:admin)
      raise Pundit::NotAuthorizedError
    end
  end
end
