class Admin::UsersController < Admin::ApplicationController
  respond_to :json

  after_action :verify_authorized

  def index
    authorize User

    users_filter = QueryBuilder.new(User, params[:filters])

    @users_adapter = DataTableAdapter.new(User, params, users_filter.query)

    respond_with @users_adapter
  end
end
