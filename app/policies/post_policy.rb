class PostPolicy < ApplicationPolicy
  def index?
    true
  end

  def create?
    @user && @user.id
  end

  def update?
    @user && @user.id == @record.user_id
  end

  def destroy?
    update?
  end
end
