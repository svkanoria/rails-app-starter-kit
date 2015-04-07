# Authorization policy for attachments controller actions.
class AttachmentPolicy < ApplicationPolicy
  def index?
    user && user.id
  end

  def show?
    user && user.id == record.user_id
  end

  def create?
    false # Attachments are created via the uploader controller
  end

  def update?
    user && user.id == record.user_id
  end

  def destroy?
    update?
  end

  class Scope
    attr_reader :user, :scope

    def initialize(user, scope)
      @user = user
      @scope = scope
    end

    def resolve
      scope.where(user_id: @user.id)
    end
  end
end
