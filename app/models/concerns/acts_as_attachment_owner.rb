# Adds ability to accept attachments.
#
# Usage:
#   # In the model class:
#
#   include ActsAsAttachmentOwner
#
#   # Only if you need to specify custom options
#   acts_as_attachment_owner options_hash # See documentation
module ActsAsAttachmentOwner
  extend ActiveSupport::Concern

  included do
    @attachment_opts = {}

    acts_as_attachment_owner accepts_roles: [:default]

    has_many :attachment_joins, as: :attachment_owner, dependent: :destroy
    has_many :attachments, through: :attachment_joins
  end

  # Returns all attachment joins, grouped by role.
  #
  # @return [Hash{String, Array<AttachmentJoin>}]
  def all_attachment_joins_by_role
    result = {}

    attachment_joins.includes(:attachment).each do |attachment_join|
      role = attachment_join.role || 'default'

      result[role] ||= []
      result[role] << attachment_join
    end

    result
  end

  module ClassMethods
    # Gets the attachment options.
    def attachment_opts
      @attachment_opts
    end

    # Sets the attachment options.
    #
    # @param opts [Hash] as follows (? indicates optional keys):
    #   {
    #     # If not specified, then all attachments are accepted
    #     accepts_roles (?): [
    #       # A simple role
    #       :some_role,
    #       # A role with conditions
    #       { some_role: {
    #           count (?): some number (unlimited by default),
    #           filter (?): lambda { |attachment, owner|
    #             # Return whether or not the attachment is acceptable:
    #             # true => acceptable
    #             # false/nil => not acceptable. A default error msg will be
    #             #   shown to the user
    #             # :some_symbol => not acceptable. A custom error msg will be
    #             #   shown to the user. This message will be looked for in the
    #             #   appropriate i18n file, in the following key:
    #             #   'errors.models.attachment_join.attributes.attachment_id.
    #             #     rejected_by_filter_because.some_symbol'
    #           }
    #       } },
    #       # To accept attachments without roles:
    #       # Simple...
    #       :default,
    #       # ...or complex
    #       # { default: { ... } }
    #     ]
    #   }
    def acts_as_attachment_owner (opts = {})
      @attachment_opts.merge!(opts)
    end
  end
end
