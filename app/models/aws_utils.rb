# AWS utilities.
class AwsUtils
  ######
  # S3 #
  ######

  # S3 URL
  S3_URL = 'https://s3.amazonaws.com'

  # S3 client
  @@S3 = nil
  @@S3_mutex = Mutex.new

  # S3 client (lazily evaluated).
  # Use this, and not @@S3 directly.
  #
  # @return [Aws::S3::Client]
  def self.S3
    @@S3_mutex.synchronize do # Because S3 is a class variable!
      @@S3 ||= Aws::S3::Client.new
    end
  end

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

  # The signature for anything.
  #
  # @param obj [Object] the thing to sign
  #
  # @return [String] the signature
  def self.s3_signature (obj)
    Base64.encode64(
        OpenSSL::HMAC.digest(
            OpenSSL::Digest.new('sha1'),
            Rails.application.secrets.aws_secret_access_key, obj)
    ).gsub("\n",'')
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

    { policy: policy, signature: s3_signature(policy) }
  end

  # Initiates a request to delete an object at a given URL.
  #
  # @param url [String] the URL
  def self.s3_delete (url)
    delete_params = s3_parse_url(url)

    AwsUtils.S3.delete_object(delete_params)
  end

  ##############
  # CloudFront #
  ##############

  # Returns a signed CloudFront URL.
  #
  # @param url [String] the S3 URL to sign
  # @param expires_at [ActiveSupport::TimeWithZone] the date/time until which
  #   the URL should be valid (must be UTC time)
  #
  # @return [String] the signed URL
  def self.cf_signed_url (url, expires_at = (Time.current + 24.hours))
    s3_key = s3_parse_url(url)[:key]

    # 1. Base URL
    cf_url = "#{Rails.application.secrets.aws_cf_distribution}/#{URI.encode(s3_key)}"

    # 2. Separator
    separator = cf_url =~ /\?/ ? '&' : '?'

    # 3. Expires at
    # AWS works on UTC, so make sure we are not using local time
    expires_at_str = expires_at.to_i.to_s

    private_key = OpenSSL::PKey::RSA.new(
        Rails.application.secrets.aws_cf_private_key.gsub('\n', "\n"))

    policy = %Q[{"Statement":[{"Resource":"#{cf_url}","Condition":{"DateLessThan":{"AWS:EpochTime":#{expires_at_str}}}}]}]
    signature = Base64.strict_encode64(
        private_key.sign(OpenSSL::Digest::SHA1.new, policy))

    # 4. Signature
    # Not sure why we need this, but it's in Amazon's perl script and it seems
    # necessary. Different base64 implementations maybe?
    signature.tr!('+=/', '-_~')

    # 5. Key Pair ID
    key_pair_id = Rails.application.secrets.aws_cf_key_pair_id

    # The signed URL (Concatenation of 1 through 5)
    "#{cf_url}#{separator}Expires=#{expires_at_str}&Signature=#{signature}&Key-Pair-Id=#{key_pair_id}"
  end
end
