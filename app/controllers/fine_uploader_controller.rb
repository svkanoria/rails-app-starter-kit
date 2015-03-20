# Handles requests from FineUploader.
class FineUploaderController < ApplicationController
  respond_to :json

  skip_before_action :verify_authenticity_token

  def s3_signature
    render json: signed_policy_document(params[:fine_uploader])
  end

  def s3_upload_success
  end

  def s3_delete_file
  end

  private

  # Returns a signed AWS S3 policy document.
  #
  # @param policy_document [Hash] the policy document, extracted from the
  #   request parameters
  #
  # @return [Hash] the signed policy document
  def signed_policy_document (policy_document)
    policy = Base64.encode64(policy_document.to_json).gsub('\n', '')

    signature = Base64.encode64(
        OpenSSL::HMAC.digest(
            OpenSSL::Digest::Digest.new('sha1'),
            Rails.application.secrets.aws_secret_access_key, policy)
    ).gsub('\n','')

    { policy: policy, signature: signature }
  end
end
