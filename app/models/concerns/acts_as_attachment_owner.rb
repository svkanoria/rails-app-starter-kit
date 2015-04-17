# Adds ability to accept attachments.
#
# Usage:
#   # In the model class:
#   include ActsAsAttachmentOwner
#   acts_as_attachment_owner options_hash # See documentation
module ActsAsAttachmentOwner
  extend ActiveSupport::Concern

  included do
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
    # @param opts [Hash] As follows (? indicates optional keys):
    #   {
    #     # If not specified, then all attachments are accepted
    #     accepts_roles (?): [
    #       # A simple role
    #       :some_role,
    #       # A role with conditions
    #       { some_role: {
    #           count (?): some number (unlimited by default),
    #           filter (?): lambda { |attachment, owner|
    #             true/false # Whether or not the attachment is acceptable
    #           }
    #       } },
    #       # To accept attachments without roles:
    #       # Simple...
    #       :default,
    #       # ...or complex
    #       # { default: { ... } }
    #     ]
    #   }
    def acts_as_attachment_owner (opts)
      opts ||= {}

      opts.reverse_merge! accepts_roles: [ :default ]

      @attachment_opts = opts
    end
  end
end