class TweetFetcherJob < ActiveJob::Base
  queue_as :forever

  def perform (*args)
    # Do something later

    options = {
        :path   => '/1/statuses/filter.json',
        :params => { :track => '@bmcpl' },
        :oauth  => {
            :consumer_key     => ENV['CONSUMER_KEY'],
            :consumer_secret  => ENV['CONSUMER_SECRET'],
            :token            => ENV['OAUTH_TOKEN'],
            :token_secret     => ENV['OAUTH_TOKEN_SECRET']
        }
    }

    EM.run do
      client = EM::Twitter::Client.connect(options)

      client.each do |result|
        puts result

        Tweet.create(
            raw_data: result
        )
      end
    end

  end
end
