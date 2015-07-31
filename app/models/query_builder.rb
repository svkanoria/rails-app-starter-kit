# Processes queries sent by the query-builder directive.
#
# Usage:
#   # In your controller action (typically the index action):
#   filter = QueryBuilder.new(SomeModelClass, params[:filters])
#   filtered_results = filter.query
class QueryBuilder
  attr_accessor :query

  # Maps filter operators to SQL operators
  OP_MAP = {
      '=' => '=',
      '<' => '<',
      '<=' => '<=',
      '>' => '>',
      '>=' => '>=',
      'contains' => 'ILIKE',
      'range' => 'BETWEEN'
  }

  # Creates a new instance.
  #
  # Can be passed a block/Proc that builds and returns a custom 'where'
  # condition, given a filter. This allows great flexibility, especially for
  # supporting and handling filters that are not directly mapped to database
  # columns. See the documentation for {#build_condition} to better understand
  # how to write such a block.
  #
  # @param model_klass [Class] the class of the model being queried
  # @param filters [Array] the filters sent via the HTTP request parameters
  # @param seed_query [ActiveRecord::Relation] the query to use as the "base"
  #   for building upon. If not provided, model_klass is used.
  # @param build_custom_cond [Proc] an optional block/Proc for custom handling
  #   of filters
  def initialize (model_klass, filters, seed_query = nil, &build_custom_cond)
    @model_klass = model_klass
    @filters = filters
    @query = seed_query || model_klass
    @build_custom_cond = build_custom_cond

    apply_filters
  end

  private

  # Augments the model class or seed query, by applying all filters.
  # This augmented query can be retrieved via the 'query' method.
  #
  # If any of the filters is invalid and would lead to no results, the entire
  # query is modified to return no results.
  #
  # A filter is deemed invalid if the 'apply_filter' method returns false.
  def apply_filters
    if @filters.present?
      @filters.map {|i| i[1]}.each do |filter|
        unless apply_filter(filter)
          @query = @query.none

          return
        end
      end
    end
  end

  # Applies a single filter.
  #
  # @param filter [Hash] the filter to apply
  #
  # @return [Boolean] whether the filter is valid and was applied, or not
  def apply_filter (filter)
    values = filter[:values]
    return true unless values.present? && values.is_a?(Array)
    return true unless values[0].present?

    condition = (@build_custom_cond && @build_custom_cond.call(filter)) ||
        build_condition(filter)

    return false unless condition

    @query = @query.where(condition)
  end

  # Builds a string suitable for a 'where' condition.
  # At this point, the filter is guaranteed to have at least one value.
  #
  # @param filter [Hash] the filter, with a minimum format as follows:
  #   { column: 'some-column-name', value: [val1, ...], op: 'some-op' }
  #
  # @return [String, nil] a string suitable for the 'where' condition, if it
  #   makes semantic sense
  def build_condition (filter)
    column = filter[:column]
    values = filter[:values]
    op = filter[:op]

    column_type = Utils.column_type(@model_klass, column)

    values_expr = build_values_expr(values, column_type, op)
    return nil unless values_expr

    column_expr = build_column_expr(column, column_type, op)
    return nil unless column_expr

    op_expr = build_op_expr(op)
    return nil unless op_expr

    "#{column_expr} #{op_expr} #{values_expr}"
  end

  def build_column_expr (column, column_type, op)
    # To disambiguate the column in join queries
    full_column = "#{@model_klass.table_name}.#{column}"

    case column_type
      when :integer, :float, :decimal
        (op == 'contains') ? "CAST (#{full_column} AS text)" : full_column
      when :datetime, :timestamp
        "CAST (#{full_column} AS date)"
      else
        full_column
    end
  end

  def build_values_expr (values, column_type, op)
    value = values[0]

    case op
      when 'contains'
        # Since we cast the column to a string anyway, we don't need to call
        # value_str
        "'%#{value}%'"
      when 'range'
        return nil unless values[1].present?

        "#{value_str(value, column_type)} AND #{value_str(values[1], column_type)}"
      else
        value_str(value, column_type)
    end
  end

  def build_op_expr (op)
    OP_MAP[op]
  end

  def value_str (value, column_type)
    case column_type
      when :integer, :float, :decimal
        Utils.is_numeric?(value) ? value : nil
      else
        "'#{value}'"
    end
  end
end
