# Finds a location by a search string.
#
# == Examples
#
#   # Simple
#   l = LocationFuzzySearch.new().find('connplace')
#   l = LocationFuzzySearch.new().find('110001')
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

  # Returns the most likely location, given a search string.
  # For search strings of 5 or less characters, looks only for an exact match,
  # to reduce the possibility of false positives.
  # @param str [String] The search string (can be nil).
  # @return A Location object, or nil if none found.
  def find (str)
    return nil if str.blank?

    location = find_exact_by_zip(str)

    unless location
      if str.length <= 5
        location = find_exact_by_name(str)
      else
        location = find_fuzzy_by_name(str)
      end
    end

    unless location
      location = find_exact_by_abbr(str)
    end

    location
  end

  private

  # Returns a location whose zip *exactly* matches a search string.
  # @param str [String] The search string.
  # @return A Location object, or nil if none found.
  def find_exact_by_zip (str)
    @search_space.where('upper(zip) = ?', str.upcase).first
  end

  # Returns a location whose name *exactly* matches a search string.
  # @param str [String] The search string.
  # @return A Location object, or nil if none found.
  def find_exact_by_name (str)
    @search_space.where('upper(name) = ?', str.upcase).first
  end

  # Returns a location whose name *fuzzily* matches a search string.
  # @param str [String] The search string.
  # @return A Location object, or nil if none found.
  def find_fuzzy_by_name (str)
    FuzzyMatch.new(@search_space.all, read: :slug).find(str)
  end

  # Returns a location whose some abbreviation *exactly* matches a search
  # string.
  # @param str [String] The search string.
  # @return A Location object, or nil if none found.
  def find_exact_by_abbr (str)
    @search_space.where('? = any(abbrs)', str.upcase).first
  end
end
