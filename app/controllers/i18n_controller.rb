class I18nController < ApplicationController
  def translations
    locale = params[:lang]
    translations = File.expand_path("../../../public/locales/#{locale}.yml",
                                    __FILE__)

    render json: YAML::load(File.read(translations))
  end

  def switch_locale
    current_user.update_attribute(:locale, params[:locale]) if current_user

    redirect_to params[:return_to]
  end
end
