module ApplicationHelper
  # Currently signed in user details (if any) to be passed to the client-side
  # JS code.
  def current_user_json
    if current_user
      { id: current_user.id,
        email: current_user.email,
        roles: current_user.roles.pluck(:name) }.to_json
    end
  end

  # Map for adapting Rails flash messages to Bootstrap alerts. Contains only
  # those entries that do not map unchanged.
  FLASH_TYPE_MAP = { notice: 'success', alert: 'error' }

  # Server-side flash messages rendered as HTML.
  # Created as a helper (rather than a view partial) for better performance.
  #
  # Take care to maintain similarity with client-side flash messages created
  # via the 'flash-alerts' directive included in the flashular library.
  def server_flash_alerts
    content_tag :div, class: 'alerts' do
      flash.each do |type, message|
        unless type == :timedout # Devise uses :timedout for its internal use
          bootstrap_class = "alert-#{FLASH_TYPE_MAP[type.to_sym] || type}"

          message_div = content_tag :div, class: "alert #{bootstrap_class}" do
            concat message

            concat content_tag :button, raw('&times;'), class: 'close',
                               data: { dismiss: 'alert'}
          end

          concat message_div
        end
      end
    end
  end
end
