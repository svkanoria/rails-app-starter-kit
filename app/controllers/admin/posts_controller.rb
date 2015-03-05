class Admin::PostsController < Admin::ApplicationController
  respond_to :json

  after_action :verify_authorized

  def index
    authorize Post

    posts_filter = QueryBuilder.new(Post, params[:filters])

    @posts_adapter = DataTableAdapter.new(Post, params, posts_filter.query)

    respond_with @posts_adapter
  end
end
