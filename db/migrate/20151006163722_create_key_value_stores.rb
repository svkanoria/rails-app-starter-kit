class CreateKeyValueStores < ActiveRecord::Migration
  def change
    create_table :key_value_stores do |t|
      t.string :name, null: false

      t.timestamps null: false
    end
  end
end
