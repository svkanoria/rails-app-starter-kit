# Adds ability to perform batch actions on records.
#
# Usage:
#   # In the model class:
#
#   include BatchActions
#
#   # Only if you need to specify custom options
#   batch_actions options_hash # See documentation
#
#   # In config/routes.rb:
#   # Add routes to the batch actions. For example:
#   resources :something do
#     collection do
#       post 'batch_destroy'
#         :
#     end
#   end
module BatchActions
  extend ActiveSupport::Concern

  included do
    @batch_opts = {}

    batch_actions model: inferred_model, authorize: inferred_model

    before_action :authorize_batch_action
  end

  # Destroys multiple records.
  #
  # Expects the 'ids' request parameter to be populated with the ids of the
  # records to destroy.
  #
  # Exposes two instance variables to the view:
  # * @success_ids - an array (non nil) of record ids for which the operation
  #   was a success
  # * @failure_ids - an array (non nil) or record ids for which the operation
  #   was a failure
  def batch_destroy
    @success_ids = []
    @failure_ids = []

    if (ids = params[:ids])
      ids.each do |id|
        begin
          if (deleted_record = self.class.batch_opts[:model].destroy(id))
            @success_ids << deleted_record.id
          end
        rescue
          @failure_ids << id
        end
      end
    end

    render 'layouts/batch_actions/batch_destroy'
  end

  # If the 'authorize' batch option is set, authorizes the action by invoking
  # the desired Pundit policy.
  def authorize_batch_action
    if (record = self.class.batch_opts[:authorize])
      authorize record
    end
  end

  module ClassMethods
    # Gets the batch options.
    def batch_opts
      @batch_opts
    end

    # Sets the batch options.
    #
    # @param opts [Hash] as follows (? indicates optional keys):
    #   !{
    #     # The model the controller corresponds to.
    #     # If not specified, it is inferred from the controller name.
    #     model (?): some_class,
    #     # The record to use for authorization using a Pundit policy.
    #     # If not specified, it is inferred from the controller name.
    #     # If specified as nil, then authorization (if required) must be done
    #     # manually, via before_action callbacks.
    #     authorize (?): some_class
    #   }
    def batch_actions (opts = {})
      @batch_opts.merge!(opts)
    end

    # Returns the model class inferred from the controller name.
    def inferred_model
      @inferred_model ||= self.name.split('::').last.gsub('Controller', '')
                              .singularize.constantize
    end
  end
end
