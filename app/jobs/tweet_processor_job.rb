class TweetProcessorJob < ActiveJob::Base
  queue_as :default

  def perform (*args)
    # Do something later
    #puts "start processing"
    checkpoint = TweetCheckpoint.last

    if checkpoint
      last_tweet = checkpoint.tweet
      tweets_array = Tweet.where("id > ?", last_tweet.id)
      #puts "checkpoint found"
      processTweets(tweets_array)
    else
      tweets_array = Tweet.all
      #puts "checkpoint not found"
      processTweets(tweets_array)
    end
  end

  def processTweets(tweets_array)
    max_id = 0
    tweets_array.each do |tweet|

      tweet_id = tweet.id
      #puts "processing tweet " + tweet_id.to_s
      createOrUpdateComplaint(tweet)

      if(tweet_id > max_id)
        max_id = tweet_id
      end
    end

    if(max_id > 0)
      TweetCheckpoint.create(tweet_id: max_id)

    end
  end

  def createOrUpdateComplaint(tweet)
    tweet_data = ActiveSupport::JSON.decode(tweet.raw_data)
    #puts tweet_data
    original_twitter_id = tweet_data["retweeted_status"]["id"] if tweet_data["retweeted_status"].present?
    #puts original_twitter_id

    if(original_twitter_id.present?)
      #puts "retweet of "+ original_twitter_id.to_s
      original_complaint = Complaint.where(twitter_tweet_id: original_twitter_id)

      if(original_complaint.present?)
        # Increment the likes counter
        old_likes = original_complaint.first.likes
        original_complaint.first.update(likes: old_likes + 1)
      else

        temp_tweet_data = ActiveSupport::JSON.encode(tweet_data["retweeted_status"])
        #puts "Retweet arrived before tweet "+ temp_tweet_data

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
        # Normal case.
        newComplaint(tweet)
      end

    end
  end

  def newComplaint(tweet)
    tweet_data = ActiveSupport::JSON.decode(tweet.raw_data)
    twitter_user_name = tweet_data["user"]["screen_name"]
    text = tweet_data["text"]
    twitter_tweet_id = tweet_data["id"]
    tweeted_at = tweet_data["created_at"].to_datetime
    likes = tweet_data["retweet_count"]

    Complaint.create(text: text,
                    likes: likes,
                    tweet: tweet,
                    tweeted_at: tweeted_at,
                    twitter_user_name: twitter_user_name,
                    twitter_tweet_id: twitter_tweet_id)

  end
end
