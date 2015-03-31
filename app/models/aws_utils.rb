# AWS utilities.
class AwsUtils
  # S3 URL
  S3_URL = 'https://s3.amazonaws.com'

  # S3 instance
  S3 = Aws::S3::Client.new

  # Builds an AWS S3 URL, from a bucket name and an object key.
  #
  # @param bucket [String] the bucket name
  # @param key [String] the object key
  #
  # @return [String] the object's absolute URL
  def self.s3_build_url (bucket, key)
    "#{S3_URL}/#{bucket}/#{key}"
  end

  # Deconstructs an AWS S3 URL, into a bucket name and an object key.
  #
  # @param url [String] the URL
  #
  # @return [Hash] a hash of the form
  #   { bucket: 'bucket-name', key: 'object-key' }
  #
  # @raise [ArgumentError] if the URL is badly formatted
  def self.s3_parse_url (url)
    bucket_and_key = url[S3_URL.length + 1..-1]

    split_index = bucket_and_key.index('/')

    bucket = bucket_and_key[0..split_index - 1]
    key = bucket_and_key[split_index + 1..-1]

    { bucket: bucket, key: key }
  rescue
    raise ArgumentError, "URL must look like #{S3_URL}/bucket/key"
  end

  # Returns a signed AWS S3 policy document.
  #
  # @param policy_document [Hash] the policy document, extracted from the
  #   request parameters
  #
  # @return [Hash] the signed policy document
  def self.s3_sign_policy_document (policy_document)
    # Note the double-quotes around \n. This is important.
    policy = Base64.encode64(policy_document.to_json).gsub("\n", '')

    signature = Base64.encode64(
        OpenSSL::HMAC.digest(
            OpenSSL::Digest.new('sha1'),
            Rails.application.secrets.aws_secret_access_key, policy)
    ).gsub("\n",'')

    { policy: policy, signature: signature }
  end

  # Initiates a request to delete an object at a given URL.
  #
  # @param url [String] the URL
  def self.s3_delete (url)
    delete_params = s3_parse_url(url)

    AwsUtils::S3.delete_object(delete_params)
  end
end
