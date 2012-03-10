module ImperaviRails
  module Generators
    class InstallGenerator < Rails::Generators::Base
      desc "Creates required entries in routes.rb"

      def add_routes
        route 'mount ImperaviRails::Engine => "/imperavi"'
      end
    end
  end
end
