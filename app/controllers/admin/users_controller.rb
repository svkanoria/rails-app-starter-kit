class Admin::UsersController < Admin::ApplicationController
  respond_to :json

  after_action :verify_authorized

  def index
    authorize User

    users_filter = QueryBuilder.new(User, params[:filters])

    @users_adapter = DataTableAdapter.new(User, params, users_filter.query)

    respond_with @users_adapter
  end

  def batch_destroy
    authorize User

    @success_ids = []
    @failure_ids = []

    if (ids = params[:ids])
      ids.each do |id|
        begin
          if (deleted_post = User.destroy(id))
            @success_ids << deleted_post.id
          end
        rescue
          @failure_ids << id
        end
      end
    end
  end
end
