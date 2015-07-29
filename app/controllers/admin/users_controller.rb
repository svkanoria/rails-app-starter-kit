class Admin::UsersController < Admin::ApplicationController
  include BatchActions

  respond_to :json

  after_action :verify_authorized

  def index
    authorize User

    users_filter = QueryBuilder.new(User, params[:filters]) do |filter|
      build_custom_condition(filter)
    end

    @users_adapter = DataTableAdapter.new(User, params, users_filter.query)

    respond_with @users_adapter
  end

  private

  # Builds custom conditions for the query builder in the index action.
  # See {QueryBuilder#initialize} for an understanding.
  def build_custom_condition (filter)
    column = filter[:column]
    values = filter[:values]
    op = filter[:op]

    if column == 'confirmed?'
      "confirmed_at IS #{(values[0] == 'true') ? 'NOT NULL' : 'NULL'}"
    end
  end
end
