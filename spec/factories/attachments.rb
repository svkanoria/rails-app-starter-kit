# == Schema Information
#
# Table name: attachments
#
#  id         :integer          not null, primary key
#  name       :string
#  url        :string(1024)
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

FactoryGirl.define do
  # Attachment factory
  factory :attachment do
    name 'attachment'
    url 'protocol//path/to/attachment'
  end
end
