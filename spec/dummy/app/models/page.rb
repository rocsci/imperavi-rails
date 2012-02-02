class Page < ActiveRecord::Base
  validates :title, :article, :presence => true
  has_many :images, :as => :imageable
end
