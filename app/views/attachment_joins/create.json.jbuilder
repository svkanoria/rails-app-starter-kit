if @attachment_join.errors.any?
  json.(@attachment_join, :errors)
else
  json.(@attachment_join.attachment, :id, :name, :created_at)
  json.join_id @attachment_join.id
end
