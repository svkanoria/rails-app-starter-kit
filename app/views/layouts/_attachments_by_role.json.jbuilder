# Locals:
# * attachments_by_role: The result from
#     ActsAsAttachmentOwner#all_attachments_by_role

attachments_by_role.each do |role, attachments|
  json.set! role do
    json.array! attachments, :id, :name, :url, :created_at
  end
end
