class Admin::UsersController < Admin::ApplicationController
  include BatchActions

  respond_to :json

  # Unlike for params corresponding to User DB columns, Rails will not
  # automatically wrap non-column params within params[:user]. We fix this,
  # because we need this behaviour for non-column params as well (needed for
  # the users_param method below). For details, see:
  # * http://stackoverflow.com/questions/13850934/is-rails-creating-a-new-paramsmodel-hash
  # * http://api.rubyonrails.org/classes/ActionController/ParamsWrapper.html
  wrap_parameters include: User.attribute_names +
                      %w(password password_confirmation)

  after_action :verify_authorized

  def index
    authorize User

    users_filter = QueryBuilder.new(User, params[:filters]) do |filter|
      build_custom_condition(filter)
    end

    @users_adapter = DataTableAdapter.new(User, params, users_filter.query)

    respond_with @users_adapter
  end

  def create
    @user = User.new(user_params)
    authorize @user

    @user.save

    respond_with @user, location: admin_users_url
  end

  private

  def user_params
    params.required(:user).permit(:email, :password, :password_confirmation)
  end

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
