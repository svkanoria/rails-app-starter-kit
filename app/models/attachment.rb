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

class Attachment < ActiveRecord::Base
  validates :url, presence: true

  before_save :populate_missing_fields

  private

  def populate_missing_fields
    self[:name] ||= File.basename(url, '.*')
  end
end
