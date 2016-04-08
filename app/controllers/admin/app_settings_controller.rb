class Admin::AppSettingsController < Admin::ApplicationController
  respond_to :json

  after_action :verify_authorized

  def show
    authorize AppSettings

    category = params[:category]
    @settings_object = AppSettings.settings_object(category)

    respond_to do |format|
      format.json {
        if lookup_context.template_exists?(category, ['admin/app_settings'])
          render category
        else
          render json: @settings_object
        end
      }
    end
  end

  def update
    authorize AppSettings

    @settings_object = AppSettings.set(params[:category], params[:settings])

    respond_with @settings_object
  end
end
