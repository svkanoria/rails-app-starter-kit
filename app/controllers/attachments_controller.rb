class AttachmentsController < ApplicationController
  include BatchActions

  respond_to :json

  before_action :load_basics, only: [:show, :update, :destroy]

  after_action :verify_authorized

  def index
    authorize Attachment

    attachments_filter =
        QueryBuilder.new(policy_scope(Attachment), params[:filters]) {
            |filter, query| build_custom_logic(filter, query) }

    # We need to select some additional columns (see the last argument) for
    # including the results of certain Attachment methods in the rendered JSON
    # (see the corresponding JBuilder file).
    @attachments_adapter = DataTableAdapter.new(
        Attachment, params, attachments_filter.query,
        %w(url access_url access_expires_at attachment_joins_count))

    respond_with @attachments_adapter
  end

  def show
    authorize @attachment

    respond_with @attachment
  end

  def create
    @attachment = Attachment.new(attachment_create_params)
    authorize @attachment

    @attachment.user = current_user
    @attachment.save

    respond_with @attachment
  end

  def update
    authorize @attachment

    @attachment.update_attributes attachment_update_params

    respond_with @attachment
  end

  def destroy
    authorize @attachment

    @attachment.destroy

    respond_with @attachment
  end

  private

  def attachment_create_params
    params.required(:attachment).permit(:url)
  end

  def attachment_update_params
    params.required(:attachment).permit(:name)
  end

  # Builds custom filter logic for the query builder used in the index action.
  # See {QueryBuilder#initialize} for an understanding.
  def build_custom_logic (filter, query)
    if filter[:column] == 'joins_count'
      filter[:column] = 'attachment_joins_count'

      filter
    end
  end

  def load_basics
    @attachment = Attachment.find(params[:id])
  end
end
