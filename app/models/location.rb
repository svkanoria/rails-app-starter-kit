# == Schema Information
#
# Table name: locations
#
#  id         :integer          not null, primary key
#  slug       :string           not null
#  name       :string           not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  abbrs      :text             default("{}"), is an Array
#  zip        :string
#

class Location < ActiveRecord::Base
  validates :slug, presence: true, uniqueness: true
  validates :name, presence: true
  validates :zip, length: { maximum: 16 }
  validate :abbrs_well_formed

  public

  # Overrides to automatically convert a string to an array.
  # @param str [String] Comma-separated string of abbreviations.
  # @return [Array<String>] An array of abbreviations.
  def abbrs= (str)
    self[:abbrs] = str.split(/\s*,\s*/).map {|token| token.upcase}
  end

  # Overrides to automatically convert an array to a string.
  # @return [String] Comma-separated string of abbreviations.
  def abbrs
    self[:abbrs].join(', ')
  end

  private

  # Validates that the string of abbreviations is well-formed.
  def abbrs_well_formed
    return if self[:abbrs].blank?

    self[:abbrs].each do |token|
      unless token =~ /\A[a-zA-Z0-9]+\z/
        errors[:abbrs] = 'can only contain single words (made up of letters and numbers), separated by commas'
        return
      end
    end
  end
end
