ImperaviRails::Engine.routes.draw do
  get '/plugins/file'       => 'imperavi#file',       :as => :file
  get '/plugins/image'      => 'imperavi#image',      :as => :image
  get '/plugins/image_edit' => 'imperavi#image_edit', :as => :image_edit
  get '/plugins/link'       => 'imperavi#link',       :as => :link
  get '/plugins/table'      => 'imperavi#table',      :as => :table
  get '/plugins/video'      => 'imperavi#video',      :as => :video
  get '/toolbars/:type'     => 'imperavi#toolbars',   :as => :toolbars
  get '/languages/:lang'    => 'imperavi#languages',  :as => :languages
end
