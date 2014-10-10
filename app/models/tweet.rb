class Tweet < ActiveRecord::Base

  has_one :complaint
end
