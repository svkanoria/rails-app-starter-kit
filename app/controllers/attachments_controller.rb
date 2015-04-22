class AttachmentsController < ApplicationController
  respond_to :json

  after_action :verify_authorized

  def index
    authorize Attachment

    attachments_filter = QueryBuilder.new(policy_scope(Attachment),
                                          params[:filters])

    # We need the additional 'url' column for including the small thumb in the
    # rendered JSON (see the corresponding JBuilder file).
    @attachments_adapter = DataTableAdapter.new(
        Attachment, params, attachments_filter.query, ['url'])

    respond_with @attachments_adapter
  end

  def show
    @attachment = Attachment.find(params[:id])
    authorize @attachment

    respond_with @attachment
  end
end
