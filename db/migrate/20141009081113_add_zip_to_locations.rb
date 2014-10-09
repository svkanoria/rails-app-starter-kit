class AddZipToLocations < ActiveRecord::Migration
  def change
    # We maintain the zip as a string, not an integer, for future flexibility,
    # since certain countries have non-numeric zip codes.
    add_column :locations, :zip, :string, index: true
  end
end
