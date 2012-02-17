class ImagesController < ApplicationController
  respond_to :html, :json

  def index
    @images = Image.scoped

    respond_with @images do |format|
      format.json { render :json => json_images(@images), :layout => false }
    end
  end

  def create
    @image = Image.new(params[:image])

    if @image.save
      render :json => {
        :name          => 'suxx',
        :size          => @image.image.size,
        :url           => @image.image.url,
        :thumbnail_url => @image.image.thumb('300x250#').url,
        :delete_url    => 'delete-url-here',#image_path(@image),
        :delete_type   => 'DELETE'
      }
    else
      render :json => { :errors => @image.errors }
    end
  end

private

  def json_images(images)
    json_images = []

    images.each do |image|
      json_images << {
        :thumb => resize_image(image, 120, 100).url,
        :image => resize_image(image, 300, 250).url
      }
    end

    json_images
  end

  def resize_image(image, width = 100, height = 100, gravity = :c)
    image.image.process(:resize_and_crop, :width => width, :height => height, :gravity => gravity.to_s)
  end
end