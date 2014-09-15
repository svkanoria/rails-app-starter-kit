class PostPolicy < ApplicationPolicy
  def index?
    true
  end

  def create?
    @user.id
  end

  def update?
    @user.id == @record.id
  end

  def destroy?
    update?
  end
end
