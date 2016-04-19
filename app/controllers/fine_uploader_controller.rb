# Handles requests from Fine Uploader.
class FineUploaderController < ApplicationController
  respond_to :json

  # TODO Find way to add CSRF token to FineUploader requests
  skip_before_action :verify_authenticity_token

  after_action :verify_authorized

  def s3_signature
    authorize :fine_uploader, :s3_signature?

    if (headers = params[:fine_uploader][:headers])
      render json: { signature: AwsUtils.s3_signature(headers) }
    else
      render json: AwsUtils.s3_sign_policy_document(params[:fine_uploader])
    end
  end

  def s3_upload_success
    authorize :fine_uploader, :s3_upload_success?

    url = AwsUtils.s3_build_url(params[:bucket], params[:key])

    @attachment = current_user.attachments.create(name: params[:name], url: url)

    Attachment.delete_from_store(url) unless @attachment.persisted?

    # Fine Uploader does not accept the default 201 'created' status code
    respond_with @attachment, location: nil, status: 200
  rescue Pundit::NotAuthorizedError => ex
    raise ex
  rescue
    # Do our best not to leave an 'orphan' in the backing store
    Attachment.delete_from_store(url)
  end
end
