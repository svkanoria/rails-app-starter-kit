# Random utilities.
class Utils
  # Returns the type of a database column.
  #
  # @param model_klass [Class] the model class
  # @param column_name [String] the column name
  #
  # @return [Symbol] the column type
  def self.column_type (model_klass, column_name)
    model_klass.columns_hash[column_name].type
  end

  # Returns whether a value represents a number.
  # Adapted from
  # http://mentalized.net/journal/2011/04/14/ruby-how-to-check-if-a-string-is-numeric/.
  #
  # @param value [Object] the value
  #
  # @return [Boolean]
  def self.is_numeric? (value)
    Float(value.to_s) != nil rescue false
  end
end
