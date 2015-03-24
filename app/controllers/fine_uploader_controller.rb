# Handles requests from Fine Uploader.
class FineUploaderController < ApplicationController
  respond_to :json

  # TODO Find way to add CSRF token to FineUploader requests
  skip_before_action :verify_authenticity_token

  def s3_signature
    render json: sign_policy_document(params[:fine_uploader])
  end

  def s3_upload_success
    url = s3_build_url(params[:bucket], params[:key])

    @attachment = Attachment.create(name: params[:name], url: url)

    # Fine Uploader won't accept the default 201 'created' status
    respond_with @attachment, location: nil, status: 200
  end

  private

  # Returns a signed AWS S3 policy document.
  #
  # @param policy_document [Hash] the policy document, extracted from the
  #   request parameters
  #
  # @return [Hash] the signed policy document
  def sign_policy_document (policy_document)
    # Note the double-quotes around \n. This is important.
    policy = Base64.encode64(policy_document.to_json).gsub("\n", '')

    signature = Base64.encode64(
        OpenSSL::HMAC.digest(
            OpenSSL::Digest.new('sha1'),
            Rails.application.secrets.aws_secret_access_key, policy)
    ).gsub("\n",'')

    { policy: policy, signature: signature }
  end

  # Returns an AWS S3 URL, given a bucket name and an object key.
  #
  # @param bucket [String] the bucket name
  # @param key [String] the object key
  #
  # @return [String] the object's absolute URL
  def s3_build_url (bucket, key)
    "https://s3.amazonaws.com/#{bucket}/#{key}"
  end
end
