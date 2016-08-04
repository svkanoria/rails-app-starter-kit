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
                      %w(password password_confirmation roles)

  before_action :load_basics, only: [:edit, :update, :destroy]
  around_action :prevent_deleting_self, only: [:batch_destroy]
  after_action :verify_authorized

  def index
    authorize User

    users_filter = QueryBuilder.new(User, params[:filters]) {
        |filter, query| build_custom_logic(filter, query) }

    @users_adapter = DataTableAdapter.new(User, params, users_filter.query)

    respond_with @users_adapter
  end

  def create
    @user = User.new(user_params)
    authorize @user

    if (roles = params[:user][:roles])
      roles.each { |role| @user.add_role role }
    end

    @user.save

    respond_with @user, location: admin_users_url
  end

  def edit
    authorize @user

    respond_with @user
  end

  def update
    authorize @user

    ActiveRecord::Base.transaction do
      @user.roles = []

      if (roles = params[:user][:roles])
        roles.each { |role| @user.add_role role }
      end
    end

    respond_with @user, location: admin_users_url
  end

  def destroy
    authorize @user

    if @user != current_user
      @user.destroy

      respond_with @user
    else
      render_op_error('admin.users_controller', :cannot_delete_self,
                      :unauthorized)
    end
  end

  private

  def user_params
    params.required(:user).permit(:email, :password, :password_confirmation)
  end

  def prevent_deleting_self
    if params[:ids].include? current_user.id.to_s
      render_op_error('admin.users_controller', :cannot_delete_self,
                      :unauthorized)
    else
      yield
    end
  end

  # Builds custom filter logic for the query builder used in the index action.
  # See {QueryBuilder#initialize} for an understanding.
  def build_custom_logic (filter, query)
    column = filter[:column]
    values = filter[:values]
    op = filter[:op]

    if column == 'confirmed?'
      not_null = values[0] == 'true' || values[0] == '1'

      "confirmed_at IS #{not_null ? 'NOT NULL' : 'NULL'}"
    elsif column == 'role'
      query.with_role(values[0])
    end
  end

  def load_basics
    @user = User.find(params[:id])
  end
end
