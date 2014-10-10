class Complaint < ActiveRecord::Base
  belongs_to :tweet
  belongs_to :location
end
