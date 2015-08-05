# Adapts data to work with jQuery DataTables.
#
# Usage:
#   # In your controller action (typically the index action):
#   @data_adapter = DataTableAdapter.new(SomeModelClass, params)
#
#   # Then, assuming that you render the JSON using JBuilder:
#
#   json.draw @data_adapter.draw
#   json.recordsTotal @data_adapter.records_total
#   json.recordsFiltered @data_adapter.records_filtered
#
#   json.data do
#     json.array! @data_adapter.data do |item|
#       # Render the item
#     end
#   end
class DataTableAdapter
  # All and only attributes required for the JSON response
  attr_reader :draw, :records_total, :records_filtered, :data

  # Creates a new instance.
  #
  # @param model_klass [Class] the class of the model being queried
  # @param request_params [Hash] the HTTP request parameters, as is
  # @param seed_query [ActiveRecord::Relation] the query to use as the "base"
  #   for building upon. If not provided, model_klass is used.
  # @param extra_columns [Array<String>] any extra columns to be selected from
  #   the model. This can be useful if the JSON being rendered depends on
  #   columns that are not being requested by the client.
  def initialize (model_klass, request_params, seed_query = nil,
                  extra_columns = nil)

    @model_klass = model_klass
    @request_params = request_params
    @data = seed_query || model_klass

    @draw = request_params[:draw].to_i
    @records_total = @data.count

    parse_request_params

    apply_filters

    @records_filtered = @data.count

    apply_sorting
    apply_pagination
    apply_column_selection(extra_columns)
  end

  private

  # From the request params, extracts out all data required for building upon
  # the base query.
  def parse_request_params
    @column_names = []
    @searchable_column_names = []

    @request_params[:columns].map {|i| i[1]}.each do |column|
      @column_names << column[:data]
      @searchable_column_names << column[:data] if column[:searchable]
    end

    @search_value = @request_params[:search][:value].presence

    @orders = []

    @request_params[:order].map {|i| i[1]}.each do |order|
      @orders << "#{@column_names[order[:column].to_i]} #{order[:dir]}"
    end

    @start = @request_params[:start]
    @length = @request_params[:length]
  end

  def apply_filters
    # TODO Support not only global search, but also column search
    if @search_value && @searchable_column_names.any?
      conditions = []

      @searchable_column_names.each do |column_name|
        if (c = build_column_search_condition(column_name, @search_value))
          conditions << c
        end
      end

      @data = @data.where(conditions.join(' OR '))
    end
  end

  # Builds an SQL search condition on a given column.
  #
  # @param column_name [String] the model's database column name
  # @param search_value [String] the search value to apply to the column
  #
  # @return [String, nil] the search condition, if it makes semantic sense. A
  #   search of the id column for a non-number is pointless, for example.
  def build_column_search_condition (column_name, search_value)
    full_column_name = "#{@model_klass.table_name}.#{column}"

    case Utils.column_type(@model_klass, column_name)
      when :string
        "#{full_column_name} ILIKE '%#{search_value}%'"
      when :integer, :float, :decimal
        if Utils.is_numeric?(search_value)
          "#{full_column_name} = #{search_value}"
        end
      else
        # TODO Support more data types in column search conditions
        nil
    end
  end

  def apply_sorting
    if @orders.any?
      @data = @data.order(@orders.join(','))
    end
  end

  def apply_pagination
    @data = @data.offset(@start)
    @data = @data.limit(@length) unless @length == -1
  end

  def apply_column_selection (extra_columns = nil)
    model_columns = @model_klass.column_names.sort

    # Select only those requested columns that actually exist
    valid_columns = @column_names.select do |requested_column|
      found_column = model_columns.bsearch { |c| c >= requested_column }

      found_column == requested_column
    end

    @data = @data.select(valid_columns + (extra_columns || []))
  end
end
