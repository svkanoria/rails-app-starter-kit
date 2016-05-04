# == Schema Information
#
# Table name: attachments
#
#  id                :integer          not null, primary key
#  name              :string
#  url               :string(1024)
#  user_id           :integer
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#  access_url        :string(1024)
#  access_expires_at :datetime
#

FactoryGirl.define do
  # Attachment factory.
  # Examples:
  #   FactoryGirl.create(:attachment)
  #   FactoryGirl.create(:attachment, user: some_user)
  factory :attachment do
    name 'attachment'
    # Note the '.jpg' extension. This is to satisfy the filter of the 'image'
    # role of the Post model. Of course it can be set dynamically when getting
    # an instance from factory, but it helps to have a file name that passes our
    # tests by default!
    url 'protocol//path/to/attachment.jpg'
    user
  end
end
