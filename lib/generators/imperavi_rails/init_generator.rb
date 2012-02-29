module ImperaviRails
  module Generators
    class InitGenerator < Rails::Generators::Base
      desc "Creates required entries in routes.rb"

      def add_routes
        route 'mount ImperaviRails::Engine => "/imperavi"'
      end
    end
  end
end
