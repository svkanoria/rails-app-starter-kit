class CreatePosts < ActiveRecord::Migration
  def change
    create_table :posts do |t|
      t.string :message
      t.belongs_to :user

      t.timestamps null: false
    end

    add_index :posts, :user_id
  end
end
