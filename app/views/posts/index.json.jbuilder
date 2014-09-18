json.array! @posts do |post|
  json.(post, :id, :message, :created_at, :updated_at, :user_id)
  json.user_email post.user.email
end
