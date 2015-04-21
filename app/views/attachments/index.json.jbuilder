json.draw @attachments_adapter.draw
json.recordsTotal @attachments_adapter.records_total
json.recordsFiltered @attachments_adapter.records_filtered

json.data do
  json.array! @attachments_adapter.data do |attachment|
    json.(attachment, :id, :name, :created_at)
    json.url attachment.access_url
  end
end
