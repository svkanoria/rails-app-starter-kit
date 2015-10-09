# Tenantize models added since last tenantization.
# See migration: 20150423123509_tenantize_existing_models2
class TenantizeExistingModels3 < ActiveRecord::Migration
  def change
    add_column :settings, :tenant_id, :integer, null: false
    add_column :key_value_stores, :tenant_id, :integer, null: false
  end
end

