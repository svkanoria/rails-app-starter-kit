class AddAbbrsToLocations < ActiveRecord::Migration
  def change
    add_column :locations, :abbrs, :text, array: true, default: []
  end
end
