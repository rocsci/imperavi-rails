class Image < ActiveRecord::Base
  ALLOWED_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']
  ALLOWED_EXTENSIONS = [:jpeg, :jpg, :png, :JPEG, :JPG, :PNG]

  image_accessor :image # accessor to image_uid

  validates :image, :presence => true, :on => :create
  validates :image, :length => { :maximum => 6.megabytes }

  # Dragonfly custom validators for image
  # see: github.com/markevans/dragonfly
  validates_property :format,    :of => :image, :in => ALLOWED_EXTENSIONS
  validates_property :mime_type, :of => :image, :in => ALLOWED_MIME_TYPES
  validates_property :width,     :of => :image, :in => (150..3000)
  validates_property :height,    :of => :image, :in => (150..3000)

  default_scope order(:updated_at)
end