class AddLocationToComplaints < ActiveRecord::Migration
  def change
    add_reference :complaints, :location, index: true
  end
end
