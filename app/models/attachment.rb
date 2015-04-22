# == Schema Information
#
# Table name: attachments
#
#  id                :integer          not null, primary key
#  name              :string
#  url               :string(1024)
#  user_id           :integer
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#  access_url        :string(1024)
#  access_expires_at :datetime
#

class Attachment < ActiveRecord::Base
  validates :url, presence: true
  validates :user_id, presence: true

  before_save :populate_missing_fields
  after_destroy :delete_from_provider

  belongs_to :user
  has_many :attachment_joins, dependent: :destroy

  # Whether the access URL has expired.
  #
  # @param time [ActiveSupport::TimeWithZone] the time for which to ascertain
  # expiry
  #
  # @return [true, false]
  def access_expired? (time = Time.current)
    access_expires_at && time > access_expires_at
  end

  # Returns a protected access URL.
  # Always use this URL to access the attachment.
  #
  # The 'raw' URL should not be used directly, as there is no guarantee it'll
  # work (depending on backing store security settings).
  #
  # @param expires_in [ActiveSupport::Duration] The duration for which the URL
  #   should be valid
  #
  # @return [String]
  def access_url (expires_in = 24.hours)
    now = Time.current

    if self[:access_url] && !access_expired?(now)
      self[:access_url]
    else
      new_access_expires_at = now + expires_in

      # Add more stores as and when supported
      new_access_url =
          case
            when url.start_with?(AwsUtils::S3_URL)
              # Sneakily double the validity!
              # This prevents an access URL from being returned with not enough
              # time left on it.
              AwsUtils.cf_signed_url(url, new_access_expires_at + expires_in)
            else
              url
          end

      update_columns access_url: new_access_url,
                     access_expires_at: new_access_expires_at

      new_access_url
    end
  end

  # Returns the file extension name (including the '.').
  #
  # @return [String]
  def extname
    File.extname(url)
  end

  # Returns the MIME type.
  #
  # @return [String]
  def mime_type
    Rack::Mime.mime_type(extname)
  end

  # Returns whether this is a standard web image (PNG or JPEG).
  #
  # @return [true, false]
  def web_image?
    Rack::Mime.match?(mime_type, 'image/*')
  end

  # Returns a URL to a small thumbnail image.
  # Falls back on a placeholder image if thumbnail generation is not supported
  # for this type of attachment.
  #
  # @param size [String] a size as accepted by ImageMagick. See
  #   http://markevans.github.io/dragonfly/imagemagick/ for reference.
  #
  # @return [String] a thumbnail or placeholder URL
  def thumb (size = '80x80#')
    if web_image?
      Dragonfly.app.fetch_url(access_url).thumb(size).url
    else
      'http://placehold.it/40&text=No+Image';
    end
  end

  private

  def populate_missing_fields
    self[:name] ||= File.basename(url, '.*')
  end

  # Called after destruction.
  # In turns, this calls Attachment.delete_from_store.
  def delete_from_provider
    Attachment.delete_from_store(url)
  end

  # Initiates a request to delete an attachment from the backing store.
  #
  # Extracted out into a class method, so that it can be used to delete
  # just-uploaded files whose corresponding Attachment models were not created
  # successfully.
  #
  # @param url [String] the attachment URL
  def self.delete_from_store (url)
    # Add more stores as and when supported
    if url.start_with? AwsUtils::S3_URL
      AwsUtils.s3_delete(url)
    end
  end
end
