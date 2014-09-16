class PostsController < ApplicationController
  respond_to :json

  after_action :verify_authorized, except: [:index, :show, :new]

  def index
    @posts = Post.all

    respond_with @posts
  end

  def show
    @post = Post.find(params[:id])

    respond_with @post
  end

  def create
    @post = Post.new(post_params)
    authorize @post

    @post.user = current_user
    @post.save

    respond_with @post
  end

  def update
  end

  def destroy
  end

  private

  def post_params
    params.required(:post).permit(:message)
  end
end
