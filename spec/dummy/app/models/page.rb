class Page < ActiveRecord::Base
  validates :title, :article, :presence => true
end
