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

  # Overridden from Devise::Mailers::Helpers#headers_for.
  #
  # Set the emails' 'from' & 'reply_to' fields, by explicitly calling
  # {ConfigurableDeliveryMailer#sender}. Due to Devise's design, that module's
  # code for automatically setting these fields does not work as desired.
  def headers_for (action, opts)
    headers = super(action, opts)

    headers[:from] = headers[:reply_to] = sender

    headers
  end
end
