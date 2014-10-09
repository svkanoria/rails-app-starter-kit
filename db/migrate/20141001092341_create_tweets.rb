class CreateTweets < ActiveRecord::Migration
  def change
    create_table :tweets do |t|
      t.string :raw_data
      t.integer :error

      t.timestamps null: false
    end
  end
end
