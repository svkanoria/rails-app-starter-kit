json.(@user, :id, :email)
json.confirmed @user.confirmed? if @user.respond_to?(:confirmed?)

if !@user.respond_to?(:confirmed?) || @user.confirmed?
  json.authentication_token @user.authentication_token
end
