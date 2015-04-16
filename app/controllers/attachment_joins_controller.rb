class AttachmentJoinsController < ApplicationController
  respond_to :json

  after_action :verify_authorized

  def create
    @attachment_join = AttachmentJoin.new(attachment_join_params)
    authorize @attachment_join

    @attachment_join.save

    # Explicitly set HTTP status code to 201 (created) when successful, else
    # respond_with returns 200 on encountering the JBuilder template
    respond_with @attachment_join, status: :created
  end

  def destroy
    @attachment_join = AttachmentJoin.find(params[:id])
    authorize @attachment_join

    @attachment_join.destroy

    respond_with @attachment_join
  end

  private

  def attachment_join_params
    params.required(:attachment_join).
        permit(:attachment_id, :attachment_owner_id, :attachment_owner_type,
               :role)
  end
end
