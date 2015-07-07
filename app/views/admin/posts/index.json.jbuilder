json.draw @posts_adapter.draw
json.recordsTotal @posts_adapter.records_total
json.recordsFiltered @posts_adapter.records_filtered

json.data do
  json.array! @posts_adapter.data do |post|
    json.(post, :id, :message, :created_at)
    json.DT_RowId post.id
  end
end
