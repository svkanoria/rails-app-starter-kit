def prepare_user (user)
  user.password = 'password'
  user.skip_confirmation!
  user.save!

  user.posts.create! message: 'Seed post from the seeded administrator.'
end

tenant1 = Tenant.create! name: 'Test', subdomain: 'test',
                         admin_email: 'admin@test.com'

ActsAsTenant.with_tenant tenant1 do
  prepare_user User.first
end

tenant2 = Tenant.create! name: 'Test2', subdomain: 'test2',
                         admin_email: 'admin@test2.com'

ActsAsTenant.with_tenant tenant2 do
  prepare_user User.first
end
