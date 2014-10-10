json.array! @locations do |location|
  json.(location, :id, :slug, :name, :zip, :abbrs)
end
