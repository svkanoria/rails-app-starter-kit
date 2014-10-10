class CreateLocations < ActiveRecord::Migration
  def change
    create_table :locations do |t|
      t.string :slug, null: false
      t.string :name, null: false

      t.timestamps null: false
    end

    add_index :locations, :slug, unique: true
  end
end
