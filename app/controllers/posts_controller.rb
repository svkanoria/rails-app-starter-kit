class PostsController < ApplicationController
  respond_to :json

  before_action :load_basics, except: [:index, :create]

  # This is good practice, as it provides a check that 'authorize' calls have
  # not been inadvertantly skipped.
  after_action :verify_authorized

  def index
    authorize Post

    @posts = policy_scope(Post).includes(:user)

    @metadata = PaginationMetadata.new(@posts, params[:page], params[:per])

    @posts = @posts.page(@metadata.page).per(@metadata.per)

    respond_with @posts
  end

  def show
    authorize @post

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

  def edit
    authorize @post

    respond_with @post
  end

  def update
    authorize @post

    @post.update_attributes(post_params)

    # respond_with cleanly handles error conditions.
    # See comments in 'create' above.
    respond_with @post
  end

  def destroy
    authorize @post

    @post.destroy

    respond_with @post
  end

  private

  def post_params
    params.required(:post).permit(:message)
  end

  def load_basics
    @post = Post.find(params[:id])
  end
end
