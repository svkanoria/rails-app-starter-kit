class Admin::PostsController < Admin::ApplicationController
  respond_to :json

  after_action :verify_authorized

  def index
    authorize Post
  end
end
