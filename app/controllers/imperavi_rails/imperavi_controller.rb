module ImperaviRails
  class ImperaviController < ApplicationController
    respond_to :html, :json
    layout :false

    def file
      
    end
    
    def image
      
    end
    
    def image_edit
      
    end
    
    def link
      
    end
    
    def table
      
    end
    
    def video
      
    end

    def toolbars
      render "imperavi_rails/toolbars/#{params[:type]}"
    end

    def languages
      render "imperavi_rails/languages/#{params[:lang]}"
    end
  end
end