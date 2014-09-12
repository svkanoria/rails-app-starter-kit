class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :lockable, :omniauthable and :timeoutable
  devise :confirmable,
         :database_authenticatable,
         :registerable,
         :recoverable,
         :rememberable,
         :trackable,
         :validatable
end
