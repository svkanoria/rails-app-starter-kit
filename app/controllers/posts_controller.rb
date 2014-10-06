class PostsController < ApplicationController
  respond_to :json

  # This is good practice, as it provides a check that 'authorize' calls have
  # not been inadvertantly skipped.
  after_action :verify_authorized, except: [:index, :show]

  def index
    @posts = Post.includes(:user).all

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

    # respond_with cleanly handles error conditions.
    # If @post has errors, then the response is of the form:
    #   {
    #     <other stuff>,
    #     errors: {
    #       field1: ['error msg 1', 'error msg 2', ...],
    #       field2: [...],
    #        :
    #     }
    #   }
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
