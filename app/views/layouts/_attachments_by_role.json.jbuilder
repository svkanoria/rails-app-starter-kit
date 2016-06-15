# Locals:
# * attachment_joins_by_role: The result from
#     ActsAsAttachmentOwner#all_attachment_joins_by_role

attachment_joins_by_role.each do |role, attachment_joins|
  json.set! role do
    json.array! attachment_joins do |attachment_join|
      json.(attachment_join.attachment, :id, :name, :created_at)
      json.thumb attachment_join.attachment.thumb('40x40#')
      json.join_id attachment_join.id
    end
  end
end
