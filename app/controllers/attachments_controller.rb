class AttachmentsController < ApplicationController
  respond_to :json

  after_action :verify_authorized

  def index
    authorize Attachment

    @attachments = policy_scope(Attachment)

    @metadata = PaginationMetadata.new(@attachments, params[:page],
                                       params[:per])

    @attachments = @attachments.page(@metadata.page).per(@metadata.per)

    respond_with @attachments
  end
end
