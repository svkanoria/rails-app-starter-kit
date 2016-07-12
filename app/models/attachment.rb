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

# An attachment is an object "pointing" via a URL to a file stored somewhere,
# in some backing store.
#
# Attachments belong to users, i.e., each user can build and manage their own
# "attachment library".
#
# Attachments can be associated with models that are designed to accept them.
# For example, a {Post} may accept a single 'main' image, and also accept zero
# or more files (images or anything else) as additional attachments.
#
# These associations are made using the {AttachmentJoin} join model, allowing
# many-to-many associations between attachments and things accepting them.
#
# Configuring a model to accept attachments (such as described in the scenario/
# constraints above) can be done by including in it the {ActsAsAttachmentOwner}
# concern (see its documentation for usage details).
#
# This class also provides some useful class and instance methods for working
# with attachments. These are:
# * {.backing_store}: Infers the backing store name (if possible), given a URL
# * {.delete_from_store}: Initiates a request to delete an attachment from the
#   backing store
# * {#access_url}: Returns a protected access URL. Always prefer this over the
#   raw URL, as there is no guarantee the latter will work (depending on backing
#   store security settings)
# * {#web_viewer_type}: The browser viewer type (if any) to use for viewing this
#   attachment
#
# To add support for additional backing stores, modify the code in these
# methods. Their documentation and comments within the code provide sufficient
# guidance for doing so.
class Attachment < ActiveRecord::Base
  validates :url, presence: true
  validates :user_id, presence: true

  before_save :populate_missing_fields
  after_destroy :delete_from_store

  belongs_to :user
  has_many :attachment_joins, dependent: :destroy

  # Infers the backing store name (if possible), given a URL.
  #
  # @param url [String] the URL
  #
  # @return [Symbol, nil] the store name, or nil if not recognized
  def self.backing_store (url)
    s3_bucket_url =
        "#{AwsUtils::S3_URL}/#{Rails.application.secrets.aws_s3_bucket}"

    # Add more conditions as and when supported
    case
      when url.start_with?(s3_bucket_url) then :own_aws_s3
      when url.start_with?(AwsUtils::S3_URL) then :other_aws_s3
      when url.start_with?('https://youtube.com') then :youtube
      when url.start_with?('https://docs.google.com') then :g_docs
      else nil
    end
  end

  # Initiates a request to delete an attachment from the backing store.
  #
  # Extracted out into a class method, so that it can be used to delete
  # just-uploaded files whose corresponding Attachment models were not created
  # successfully.
  #
  # @param url [String] the attachment URL
  def self.delete_from_store (url)
    # Add more conditions as and when supported
    case Attachment.backing_store(url)
      when :own_aws_s3 then AwsUtils.s3_delete(url)
    end
  end

  # The backing store for this attachment (AWS, YouTube etc.).
  #
  # @return [Symbol, nil] the store name, or nil if not recognized
  def backing_store
    Attachment.backing_store(url)
  end

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

      # Add more conditions as and when supported
      new_access_url =
          case backing_store
            when :own_aws_s3
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

  # Returns whether this is a standard web image.
  # Takes a conservative view that only PNGs, JP(E)Gs and GIFs qualify.
  #
  # @return [true, false]
  def web_image?
    %w(png jpg jpeg gif).each do |sub_type|
      return true if Rack::Mime.match?(mime_type, "image/#{sub_type}")
    end

    false
  end

  # Returns whether this is a standard web video.
  #
  # Incorporates a set of formats that cover all popular mobile and desktop
  # browsers. However, not all formats will play on all browsers. Furthermore,
  # care must be taken to ensure the correct profile, even within a format!
  #
  # For detailed browser coverage strategy, see:
  # http://blog.zencoder.com/2013/09/13/what-formats-do-i-need-for-html5-video
  #
  # @return [true, false]
  def web_video?
    %w(mp4 ogg webm).each do |sub_type|
      return true if Rack::Mime.match?(mime_type, "video/#{sub_type}")
    end

    false
  end

  # The browser viewer type (if any) to use for viewing this attachment.
  #
  # @return [Symbol, nil] the viewer type, or nil if it cannot be determined
  def web_viewer_type
    # Add more conditions as and when supported
    case
      when web_image? then :image
      when web_video? then :video
      when Rack::Mime.match?(mime_type, 'application/pdf') then :pdf
      when backing_store == :g_docs &&
          url.end_with?('/pub', '/pub?embedded=true')

        :g_docs_published
      else nil
    end
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
      # Although Dragonfly is not thread-safe, since this operation likely has
      # no side-effects, we don't place it within a critical section.
      # TODO Ensure Dragonfly processing works with multiple threads
      Dragonfly.app.fetch_url(access_url).thumb(size).url
    else
      'http://placehold.it/40?text=No+Image';
    end
  end

  private

  def populate_missing_fields
    if self[:name].blank?
      self[:name] =
          case
            # Google Docs file names are not user friendly, so use alternative
            when backing_store == :g_docs
              "attachment-#{Time.current.strftime('%s')}"
            else
              File.basename(url, '.*')
          end
    end
  end

  # Called after destruction.
  # In turn, this calls Attachment.delete_from_store.
  def delete_from_store
    Attachment.delete_from_store(url)
  end
end
