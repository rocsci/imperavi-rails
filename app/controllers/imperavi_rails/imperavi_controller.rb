module ImperaviRails
  class ImperaviController < ApplicationController
    respond_to :html, :json
    layout :false

    def file
      
    end

    def file_edit
      
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

    def toolbar
      render "imperavi_rails/toolbars/#{params[:type]}"
    end

    def language
      render "imperavi_rails/languages/#{params[:lang]}"
    end

    def typograf

    end
  end
end