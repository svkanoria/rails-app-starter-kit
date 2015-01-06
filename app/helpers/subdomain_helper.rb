# Mostly for use in Devise mailers, to support multi-tenancy.
module SubdomainHelper
  # Returns action mailer's default host, with a subdomain prepended.
  #
  # @param subdomain [String] the subdomain
  #
  # @return [String]
  def with_subdomain (subdomain)
    subdomain = (subdomain || '')
    subdomain += '.' unless subdomain.empty?

    host = Rails.application.config.action_mailer.default_url_options[:host]

    [subdomain, host].join
  end

  # Overrides Rails' url_for helper method, to support generating URLs with
  # subdomains.
  #
  # @param options [Hash] options as accepted by Rails' url_for method, but
  #   with this extra one:
  #     * subdomain: the subdomain to prepend to the URL generated
  #
  # @return [String] a URL
  def url_for (options = nil)
    if options.kind_of?(Hash) && options.has_key?(:subdomain)
      options[:host] = with_subdomain(options.delete(:subdomain))
    end

    super
  end
end
