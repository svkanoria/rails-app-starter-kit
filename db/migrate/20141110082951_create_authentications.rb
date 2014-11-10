class CreateAuthentications < ActiveRecord::Migration
  def change
    create_table :authentications do |t|
      t.string :provider
      t.string :uid
      t.belongs_to :user

      t.timestamps null: false
    end

    add_index :authentications, [:provider, :uid], unique: true
  end
end
