class LocationsController < ApplicationController
  respond_to :json

  before_action :load_basics, except: [:index, :create]
  after_action :verify_authorized, except: [:index, :show]

  def index
    @locations = Location.all

    respond_with @locations
  end

  def show
    respond_with @location
  end

  def create
    @location = Location.new(location_params)
    authorize @location

    @location.save

    respond_with @location
  end

  def update
    authorize @location

    @location.update_attributes(location_params)

    respond_with @location
  end

  def destroy
    authorize @location

    @location.destroy

    respond_with @location
  end

  private

  def location_params
    params.required(:location).permit(:slug, :name, :zip, :abbrs)
  end

  def load_basics
    @location = Location.find(params[:id])
  end
end
