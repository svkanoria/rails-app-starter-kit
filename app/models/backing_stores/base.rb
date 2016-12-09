module BackingStore
  class Base
    def initialize (attachment)
      @attachment = attachment
    end

    # Deletes an attachment from the backing store.
    #
    # Is a class method, in case a file needs to be deleted from the backing
    # store, but due to some error no corresponding {Attachment} model has been
    # created for the file.
    #
    # @param url [String] the attachment URL
    def self.delete (url)

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
      @attachment.url
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
      if @attachment.web_image?
        # Although Dragonfly is not thread-safe, since this operation likely has
        # no side-effects, we don't place it within a critical section.
        # TODO Ensure Dragonfly processing works with multiple threads
        Dragonfly.app.fetch_url(@attachment.access_url).thumb(size).url
      else
        'http://placehold.it/40?text=No+Image';
      end
    end

    # The browser viewer type (if any) to use for viewing this attachment.
    #
    # @return [Symbol, nil] the viewer type, or nil if it cannot be determined
    def web_viewer_type
      case
        when @attachment.web_image? then :image
        when @attachment.web_video? then :video
        when Rack::Mime.match?(mime_type, 'application/pdf') then :pdf
        else nil
      end
    end
  end
end
