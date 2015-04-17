class AddRoleToAttachmentJoins < ActiveRecord::Migration
  def change
    add_column :attachment_joins, :role, :string
  end
end
