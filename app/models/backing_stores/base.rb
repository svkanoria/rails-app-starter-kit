module BackingStore
  class Base
    def initialize (attachment)
      @attachment = attachment
    end

    def self.delete (url)

    end

    def access_url (expires_in = 24.hours)
      @attachment.url
    end

    def thumb
      if web_image?
        # Although Dragonfly is not thread-safe, since this operation likely has
        # no side-effects, we don't place it within a critical section.
        # TODO Ensure Dragonfly processing works with multiple threads
        Dragonfly.app.fetch_url(@attachment.access_url).thumb(size).url
      else
        'http://placehold.it/40?text=No+Image';
      end
    end

    def web_viewer_type
      case
        when web_image? then :image
        when web_video? then :video
        when Rack::Mime.match?(mime_type, 'application/pdf') then :pdf
        else nil
      end
    end

    def web_viewer_data
      access_url
    end
  end
end
