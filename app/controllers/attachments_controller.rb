class AttachmentsController < ApplicationController
  respond_to :json

  after_action :verify_authorized

  def index
    authorize Attachment

    attachments_filter = QueryBuilder.new(policy_scope(Attachment),
                                          params[:filters])

    # We need to select some additional columns (see the last argument) for
    # including the results of certain Attachment methods in the rendered JSON
    # (see the corresponding JBuilder file).
    @attachments_adapter = DataTableAdapter.new(
        Attachment, params, attachments_filter.query,
        %w(url access_url access_expires_at))

    respond_with @attachments_adapter
  end

  def show
    @attachment = Attachment.find(params[:id])
    authorize @attachment

    respond_with @attachment
  end

  def create
    @attachment = Attachment.new(attachment_params)
    authorize @attachment

    @attachment.user = current_user
    @attachment.save

    respond_with @attachment
  end

  private

  def attachment_params
    params.required(:attachment).permit(:url)
  end
end
