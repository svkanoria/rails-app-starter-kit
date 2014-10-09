class CreateComplaints < ActiveRecord::Migration
  def change
    create_table :complaints do |t|
      t.string :text
      t.integer :likes
      t.references :tweet, index: true
      t.datetime :tweeted_at
      t.string :twitter_user_name
      t.integer :twitter_tweet_id, :limit => 8

      t.timestamps null: false
    end
  end
end
