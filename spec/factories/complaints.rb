# Read about factories at https://github.com/thoughtbot/factory_girl

FactoryGirl.define do
  factory :complaint do
    message "MyString"
    score 1
    tweet nil
    location "MyString"
    category "MyString"
  end
end
