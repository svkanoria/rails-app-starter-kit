web: bundle exec thin start -p $PORT
worker: rails runner 'TweetFetcherJob.start_independently'
