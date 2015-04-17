json.(@post, :id, :message, :created_at, :updated_at)

json.attachments do
  json.partial! 'layouts/attachments_by_role',
                attachment_joins_by_role: @post.all_attachment_joins_by_role
end
