class Admin::ApplicationController < ApplicationController
  include Pundit

  layout 'admin/application'

  # Only allows admins access to the entire admin section.
  # This frees the programmer from having to remember to check everywhere.
  before_filter :authenticate_admin!

  private

  def authenticate_admin!
    if current_user.nil?
      authenticate_user!
    elsif !current_user.has_role?(:admin)
      raise Pundit::NotAuthorizedError
    end
  end
end
