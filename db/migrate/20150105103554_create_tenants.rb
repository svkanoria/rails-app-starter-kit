class CreateTenants < ActiveRecord::Migration
  def change
    create_table :tenants do |t|
      t.string :name, null: false
      t.string :subdomain, null: false

      t.timestamps null: false
    end

    add_index :tenants, :subdomain, unique: true
  end
end
