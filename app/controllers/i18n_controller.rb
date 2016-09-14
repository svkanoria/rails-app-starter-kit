class I18nController < ApplicationController
  def translations
    locale = params[:lang]
    translations = File.expand_path("../../../public/locales/#{locale}.yml",
                                    __FILE__)

    render json: YAML::load(File.read(translations))
  end
end
