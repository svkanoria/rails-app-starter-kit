# Exposes the 'logger' object to any class, to enable it to log in the same
# manner as models and controllers.
module Loggable
  extend ActiveSupport::Concern

  # Returns a logger object.
  #
  # @return [ActiveSupport::Logger]
  def logger
    Rails.logger
  end
end
