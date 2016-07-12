# == Schema Information
#
# Table name: attachment_joins
#
#  id                    :integer          not null, primary key
#  attachment_id         :integer
#  attachment_owner_id   :integer
#  attachment_owner_type :string
#  created_at            :datetime         not null
#  updated_at            :datetime         not null
#  role                  :string
#

class AttachmentJoin < ActiveRecord::Base
  validates :attachment_id, presence: true
  validates :attachment_owner_id, presence: true
  validates :attachment_owner_type, presence: true
  validate :owner_accepts_attachment

  belongs_to :attachment
  counter_culture :attachment

  belongs_to :attachment_owner, polymorphic: true

  private

  def owner_accepts_attachment
    return unless attachment_owner_type.present?

    owner_klass = attachment_owner_type.constantize

    # Owner class must include ActsAsAttachmentOwner
    unless owner_klass.included_modules.include?(ActsAsAttachmentOwner)
      errors.add(:attachment_owner_type,
                 :does_not_act_as_attachment_owner) and return
    end

    opts = owner_klass.attachment_opts
    role_def = find_role_definition(role, opts[:accepts_roles])

    # Then, role must be accepted
    errors.add(:role, :not_accepted) and return unless role_def

    if role_def.is_a?(Hash)
      count = role_def[:count]

      # Then, role must have free quota available
      if count && get_duplicate_count >= count
        errors.add(:role, :quota_exceeded) and return
      end

      filter = role_def[:filter]

      # Lastly, filter must "pass" the attachment
      if filter
        filter_result = filter.call(attachment, attachment_owner)

        if !filter_result
          errors.add(:attachment_id, :rejected_by_filter)
        elsif filter_result.is_a?(Symbol)
          errors.add(:attachment_id,
                     "rejected_by_filter_because.#{filter_result}".to_sym)
        end

        return
      end
    end
  end

  # Finds a role definition in an array of accepted roles.
  #
  # @param role [Symbol] the role to find
  # @param accepted_roles [Array<Symbol, Hash> an array of accepted roles, as
  #   defined in OwnerKlass#attachment_opts
  #
  # @return [Symbol, Hash, nil] the simple or complex role definition
  def find_role_definition (role, accepted_roles)
    return nil if accepted_roles.blank?

    role = (role || 'default').to_sym

    accepted_roles.each do |accepted_role|
      if accepted_role.is_a?(Symbol) && accepted_role == role
        return accepted_role
      elsif accepted_role.is_a?(Hash) && accepted_role.has_key?(role)
        return accepted_role[role]
      end
    end

    nil
  end

  # Gets the number of attachment joins with this role that already exist for
  # this owner.
  #
  # @return [Fixnum]
  def get_duplicate_count
    AttachmentJoin.where(attachment_owner_id: attachment_owner_id,
                         attachment_owner_type: attachment_owner_type,
                         role: role).count
  end
end
