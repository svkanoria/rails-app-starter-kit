# Authorization policy for users controller actions.
class UserPolicy < ApplicationPolicy
  def index?
    user && user.has_role?(:admin)
  end

  def show?
    false # n/a
  end

  def create?
    user && user.has_role?(:admin)
  end

  def update?
    user && user.has_role?(:admin)
  end

  def destroy?
    user && user.has_role?(:admin)
  end

  def batch_destroy?
    user && user.has_role?(:admin)
  end
end
