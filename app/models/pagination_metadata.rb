# Provides useful metadata for paginated queries.
#
# Usage:
#   query = SomeQuery
#   # Create the metadata
#   metadata = PaginationMetadata.new(query, some_page_num, some_page_size)
#   # Do the actual pagination (for example with Kaminari)
#   query.page(metadata.page).per(metadata.per)
class PaginationMetadata
  attr_reader :page, :per, :total, :remaining

  # Creates a new instance.
  # Cleanly handles nil values for pagination arguments.
  #
  # @param query [ActiveRecord::Relation] the query to be paginated. No further
  #   changes should be made to this query after this point
  # @param page [Integer, String] the page number
  # @param per [Integer, String] the number of results per page (truncates to a
  #   maximum of 100)
  def initialize (query, page = 1, per = 20)
    @page = (page || 1).to_i
    @per = [(per || 20).to_i, 100].min
    @total = query.count
    @remaining = [@total - (@page * @per), 0].max
  end
end
