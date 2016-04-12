# By default, Devise's migration for creating the users table forces emails to
# be unique. However, we only require that emails be unique *within a tenant*.
# Hence, this fix.
class ModifyEmailIndexInUsers < ActiveRecord::Migration
  def change
    remove_index :users, :email
    add_index :users, [:tenant_id, :email] ,unique: true
  end
end
