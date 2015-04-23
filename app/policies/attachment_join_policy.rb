# Authorization policy for attachment joins controller actions.
class AttachmentJoinPolicy < ApplicationPolicy
  def index?
    false # n/a
  end

  def show?
    false # n/a
  end

  def create?
    user && user.id == record.attachment.user_id
  end

  def update?
    false # n/a
  end

  def destroy?
    create?
  end
end
