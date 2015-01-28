# Authorization policy for admin/posts controller actions.
# Note that Admin::ApplicationController already blocks non-admins, so we don't
# need to check for that in this policy.
class Admin::PostPolicy < Admin::ApplicationPolicy
  def index?
    true
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
