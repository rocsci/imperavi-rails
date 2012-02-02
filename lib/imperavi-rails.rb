require "imperavi-rails/engine"

module ImperaviRails
  if defined?(ActionController)
    require File.join(File.dirname(__FILE__), '..', 'app', 'helpers', 'imperavi_rails', 'imperavi_helper')
    ActionController::Base.helper(ImperaviHelper)
  end
end
