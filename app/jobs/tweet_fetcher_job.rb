# Sets up a persistent connection to the Twitter Streaming API, and stores
# tweets as they arrive.
#
# Can be run within a background job runner, or as standalone code (although
# within a Rails environment) via 'rails runner'.
class TweetFetcherJob < ActiveJob::Base
  # Options for passing on to em-twitter.
  @@options = {
      path: '/1/statuses/filter.json',
      params: { track: '@bmcpl' },
      oauth: {
          consumer_key: Rails.application.secrets.twitter_consumer_key,
          consumer_secret: Rails.application.secrets.twitter_consumer_secret,
          token: Rails.application.secrets.twitter_access_token,
          token_secret: Rails.application.secrets.twitter_access_token_secret
      }
  }

  # Does the actual work of setting up a persistent connection, and storing
  # incoming tweets.
  def perform
    EM.run do
      client = EM::Twitter::Client.connect(@@options)

      client.each do |result|
        puts result
      end
    end
  end

  # Can be used to start the job outside of any background job runner, as
  # follows:
  #
  #   $ rails runner 'TweetFetcherJob.start_independently'
  def self.start_independently
    TweetFetcherJob.new.perform
  end
end
