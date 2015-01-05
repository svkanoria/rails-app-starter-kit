# Multi-tenancy is being added retrospectively,
# So we must modify all existing models to support this feature.
class TenantizeExistingModels < ActiveRecord::Migration
  def change
    add_column :users, :tenant_id, :integer, null: false
    add_column :roles, :tenant_id, :integer, null: false
    add_column :posts, :tenant_id, :integer, null: false
    add_column :authentications, :tenant_id, :integer, null: false
  end
end
