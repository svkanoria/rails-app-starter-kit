json.(@post, :id, :message, :created_at, :updated_at)

json.attachments do
  json.partial! 'layouts/attachments_by_role',
                attachments_by_role: @post.all_attachments_by_role
end
