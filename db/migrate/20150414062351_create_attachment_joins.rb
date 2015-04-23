class CreateAttachmentJoins < ActiveRecord::Migration
  def change
    create_table :attachment_joins do |t|
      t.belongs_to :attachment
      t.belongs_to :attachment_owner, polymorphic: true

      t.timestamps null: false
    end
  end
end
