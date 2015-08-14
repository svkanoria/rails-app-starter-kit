class Admin::PostsController < Admin::ApplicationController
  include BatchActions

  respond_to :json

  after_action :verify_authorized

  def index
    authorize Post

    posts_filter = QueryBuilder.new(Post, params[:filters])

    @posts_adapter = DataTableAdapter.new(Post, params, posts_filter.query)

    respond_with @posts_adapter
  end

  def destroy
    @post = Post.find(params[:id])
    authorize @post

    @post.destroy

    respond_with @post
  end
end
