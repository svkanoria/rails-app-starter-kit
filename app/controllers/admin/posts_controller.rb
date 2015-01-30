class Admin::PostsController < Admin::ApplicationController
  respond_to :json

  after_action :verify_authorized

  def index
    authorize Post

    @posts_adapter = DataTableAdapter.new(Post, params)

    respond_with @posts_adapter
  end
end
