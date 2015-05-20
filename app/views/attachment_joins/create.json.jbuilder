if @attachment_join.errors.any?
  json.(@attachment_join, :errors)
else
  json.(@attachment_join.attachment, :id, :name, :created_at)
  json.thumb @attachment_join.attachment.thumb('40x40#')
  json.join_id @attachment_join.id
end
