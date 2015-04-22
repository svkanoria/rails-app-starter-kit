class AddAccessUrlFieldsToAttachments < ActiveRecord::Migration
  def change
    # See /db/migrate/20150324061551_create_attachments.rb for discussion
    add_column :attachments, :access_url, :string, limit: 1024
    add_column :attachments, :access_expires_at, :datetime
  end
end
