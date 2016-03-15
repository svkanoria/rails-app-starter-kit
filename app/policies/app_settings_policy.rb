# Authorization policy for app settings controller actions.
class AppSettingsPolicy < ApplicationPolicy
  def index?
    false # n/a
  end

  def show?
    user && user.has_role?(:admin)
  end

  def create?
    false # n/a
  end

  def update?
    user && user.has_role?(:admin)
  end

  def destroy?
    false # n/a
  end
end
