class CreateTweetCheckpoints < ActiveRecord::Migration
  def change
    create_table :tweet_checkpoints do |t|
      t.references :tweet, index: true

      t.timestamps null: false
    end
  end
end
