# Authorization policy for users controller actions.
class UserPolicy < ApplicationPolicy
  def index?
    user && user.has_role?(:admin)
  end

  # The methods below are not relevant for the controller.
  # However, for completeness, we override them all to return false.

  def show?
    false
  end

  def create?
    false
  end

  def update?
    false
  end

  def destroy?
    false
  end
end
