# Custom Devise mailer, integrated with our configurable outgoing email
# settings.
#
# Taken almost as-is from
# https://github.com/plataformatec/devise/wiki/How-To:-Use-custom-mailer.
class MyDeviseMailer < Devise::Mailer
  include ConfigurableDeliveryMailer

  # Gives access to all helpers defined within `application_helper`.
  helper :application

  include Devise::Controllers::UrlHelpers # Optional. eg. `confirmation_url`

  # To make sure that your mailer uses the Devise views
  default template_path: 'devise/mailer'
end
