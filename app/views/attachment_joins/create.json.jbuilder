if @attachment_join.errors.any?
  json.(@attachment_join, :errors)
else
  json.(@attachment_join.attachment, :id, :name, :url, :created_at)
end
