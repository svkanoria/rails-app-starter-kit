class TweetFetcherJob < ActiveJob::Base
  queue_as :forever

  def perform (*args)
    # Do something later
  end
end
