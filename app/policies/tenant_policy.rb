# Authorization policy for tenants controller actions.
class TenantPolicy < ApplicationPolicy
  def create?
    true
  end

  def destroy?
    @user && @user.has_role?(:admin)
  end

  # The methods below are irrelevant for the tenants controller.
  # However, for completeness, we override them all to return false.

  def index?
    false
  end

  def show?
    false
  end

  def new?
    false
  end

  def update?
    false
  end
end
