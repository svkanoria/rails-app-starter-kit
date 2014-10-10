class LocationPolicy < ApplicationPolicy
  def index?
    true
  end

  def show?
    true
  end

  def create?
    user_admin?
  end

  def update?
    user_admin?
  end

  def destroy?
    user_admin?
  end

  private

  def user_admin?
    @user.has_role? :admin
  end
end
