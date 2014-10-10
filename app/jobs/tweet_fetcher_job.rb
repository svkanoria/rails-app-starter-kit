class TweetFetcherJob
  #queue_as :forever

  def self.perform
    # Do something later
    puts "Initializing"
    options = {
        :path   => '/1.1/statuses/filter.json',
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
      puts "Client started"
      client.each do |result|
        puts result
        puts result["id"]
        tweet = Tweet.create(
            raw_data: result
        )
        puts tweet.id
        createOrUpdateComplaint(tweet)
        puts "process complete"
      end

      client.on_error do |message|
        puts "oops: error: #{message}"
      end

      client.on_unauthorized do
        puts "oops: unauthorized"
      end

      client.on_forbidden do
        puts "oops: unauthorized"
      end

      client.on_not_found do
        puts "oops: not_found"
      end

      client.on_not_acceptable do
        puts "oops: not_acceptable"
      end

      client.on_too_long do
        puts "oops: too_long"
      end

      client.on_range_unacceptable do
        puts "oops: range_unacceptable"
      end

      client.on_enhance_your_calm do
        puts "oops: enhance_your_calm"
      end

      client.on_reconnect do |timeout, count|
        # called each time the client reconnects
        puts "reconnecting #{timeout} #{count}"
      end

      client.on_max_reconnects do |timeout, count|
        # called when the client has exceeded either:
        # 1. the maximum number of reconnect attempts
        # 2. the maximum timeout limit for reconnections
        puts "max reconnects #{timeout} #{count}"
      end
    end

  end

  def self.createOrUpdateComplaint(tweet)
    tweet_data = ActiveSupport::JSON.decode(tweet.raw_data)
    puts tweet_data
    original_twitter_id = tweet_data["retweeted_status"]["id"] if tweet_data["retweeted_status"].present?
    puts original_twitter_id

    if(original_twitter_id.present?)
      puts "retweet of "+ original_twitter_id.to_s
      original_complaint = Complaint.where(twitter_tweet_id: original_twitter_id)

      if(original_complaint.present?)
        # Increment the likes counter
        old_likes = original_complaint.first.likes
        original_complaint.first.update(likes: old_likes + 1)
      else

        temp_tweet_data = ActiveSupport::JSON.encode(tweet_data["retweeted_status"])
        puts "Retweet arrived before tweet "+ temp_tweet_data

        temp_tweet = Tweet.new(raw_data: temp_tweet_data)
        # Extracting original tweet, saving it and creating complaint
        newComplaint(temp_tweet)
      end

    else
      # Original tweet
      retweeted_complaint = Complaint.where(twitter_tweet_id: tweet_data["id"])
      if(retweeted_complaint.present?)
        # Original arrived after retweet so update the reference
        retweeted_complaint.first.update(tweet: tweet)
      else
        puts "Normal case"
        newComplaint(tweet)
      end

    end
  end

  def self.newComplaint(tweet)
    tweet_data = ActiveSupport::JSON.decode(tweet.raw_data)
    twitter_user_name = tweet_data["user"]["screen_name"]
    text = tweet_data["text"]
    twitter_tweet_id = tweet_data["id"]
    tweeted_at = tweet_data["created_at"].to_datetime
    likes = tweet_data["retweet_count"]

    location_array = tweet_data["entities"]["hashtags"].collect do |ht|
      LocationFuzzyMatch.new().find(ht["text"])
    end
    location = nil

    location_array.compact! unless location_array.nil?

    if location_array.nil? or location_array.empty?
      location = nil
    else
      location = location_array.first
    end

    Complaint.create(text: text,
        likes: likes,
        tweet: tweet,
        tweeted_at: tweeted_at,
        twitter_user_name: twitter_user_name,
        twitter_tweet_id: twitter_tweet_id,
        location: location)
    puts "Complaint created"
  end
end
