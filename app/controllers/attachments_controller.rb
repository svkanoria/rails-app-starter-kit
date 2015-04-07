class AttachmentsController < ApplicationController
  respond_to :json

  after_action :verify_authorized

  def index
    authorize Attachment

    attachments_filter = QueryBuilder.new(Attachment, params[:filters])

    @attachments_adapter = DataTableAdapter.new(Attachment, params,
                                                attachments_filter.query)

    respond_with @attachments_adapter
  end
end
