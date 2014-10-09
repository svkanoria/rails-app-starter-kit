# Finds a location by a search string.
#
# == Examples
#
#   # Simple
#   l = LocationFuzzySearch.new().find('connplace')
#
#   # More complex
#   l = LocationFuzzySearch.new(Location.where(verified: true))
#   l.find('vasantkj')
class LocationFuzzyMatch
  # The constructor.
  # @param search_space [ActiveRecord::Relation] The set of locations to search
  #   amongst.
  def initialize (search_space = nil)
    @search_space = search_space || Location
  end

  # Returns a 'best match' location, given a search string.
  # For search strings of 5 or less characters, looks only for an exact match,
  # to reduce the possibility of false positives.
  # @param str [String] The search string (can be nil).
  # @return A Location object, or nil if none found.
  def find (str)
    return nil if str.blank?

    if str.length <= 5
      find_exact(str)
    else
      find_fuzzy(str)
    end
  end

  private

  # Returns an *exact* match location, given a search string. Does *not* do a
  # fuzzy search!
  # @param str [String] The search string.
  # @return A Location object, or nil if none found.
  def find_exact (str)
    @search_space.where('lower(name) = ?', str.downcase).first
  end

  # Returns a 'best fuzzy match' location, given a search string.
  # @param str [String] The search string.
  # @return A Location object, or nil if none found.
  def find_fuzzy (str)
    FuzzyMatch.new(@search_space.all, read: :slug).find(str)
  end
end
