class CreateAttachments < ActiveRecord::Migration
  def change
    create_table :attachments do |t|
      t.string :name
      # The limit below should be enough for most URLs.
      # If you need to support even longer ones, modify via a new migration.
      # Since we are on Postgres, we could use the 'text' type instead (as it
      # is equivalent in performance to 'string' which translates to varchar).
      # However, we want to try and remain as DB agnostic as possible.
      t.string :url, limit: 1024
      t.belongs_to :user

      t.timestamps null: false
    end

    add_index :attachments, :user_id
  end
end
