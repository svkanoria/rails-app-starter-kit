class Admin::PostsController < Admin::ApplicationController
  respond_to :json

  after_action :verify_authorized

  def index
    authorize Post

    posts_filter = QueryBuilder.new(Post, params[:filters])

    @posts_adapter = DataTableAdapter.new(Post, params, posts_filter.query)

    respond_with @posts_adapter
  end

  def batch_destroy
    authorize Post

    @success_ids = []
    @failure_ids = []

    if (ids = params[:ids])
      ids.each do |id|
        begin
          if (deleted_post = Post.destroy(id))
            @success_ids << deleted_post.id
          end
        rescue
          @failure_ids << id
        end
      end
    end
  end
end
