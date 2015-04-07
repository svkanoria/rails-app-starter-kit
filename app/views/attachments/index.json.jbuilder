json.metadata do
  json.(@metadata, :total, :remaining)
end

json.items do
  json.array! @attachments do |attachment|
    json.(attachment, :id, :name, :url, :created_at, :updated_at)
  end
end
