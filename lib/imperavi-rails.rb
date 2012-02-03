require "imperavi-rails/engine"
require "imperavi-rails/controller_methods"
require File.join(File.dirname(__FILE__), '..', 'app', 'helpers', 'imperavi_rails', 'imperavi_helper')

module ImperaviRails
  extend ActiveSupport::Autoload

  autoload :ControllerMethods
  
  ActiveSupport.on_load(:action_controller) do
    helper ImperaviHelper
    include ImperaviRails::ControllerMethods
  end
end
