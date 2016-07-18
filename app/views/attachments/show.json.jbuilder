json.(@attachment, :id, :name, :created_at)
json.access_url @attachment.access_url
json.web_viewer_type @attachment.web_viewer_type

json.joins do
  json.array! @attachment.attachment_joins do |attachment_join|
    json.(attachment_join, :id, :created_at)
    json.owner_type attachment_join.attachment_owner_type
    json.owner_id attachment_join.attachment_owner_id
  end
end
