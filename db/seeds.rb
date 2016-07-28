# Create an administrator
admin = User.new email: 'admin@test.com', password: 'password'
admin.skip_confirmation!
admin.grant :admin
admin.save!

# Create a post on behalf of the administrator
admin.posts.create! message: 'Seeded post from the seeded administrator.'
