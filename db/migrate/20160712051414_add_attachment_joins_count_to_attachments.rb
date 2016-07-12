class AddAttachmentJoinsCountToAttachments < ActiveRecord::Migration
  def change
    add_column :attachments, :attachment_joins_count, :integer, null: false,
               default: 0

    reversible do |dir|
      dir.up do
        AttachmentJoin.counter_culture_fix_counts
      end
    end
  end
end
