# Tenantize models added since last tenantization.
# See migration: 20150105110447_tenantize_existing_models.
class TenantizeExistingModels2 < ActiveRecord::Migration
  def change
    add_column :attachments, :tenant_id, :integer, null: false
    add_column :attachment_joins, :tenant_id, :integer, null: false
  end
end
