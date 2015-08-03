json.(@user, :id, :email, :created_at, :confirmed_at)
json.roles @user.roles.pluck(:name)
