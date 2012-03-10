module ImperaviRails
  module Generators
    class InstallGenerator < Rails::Generators::Base

      desc "Creates required entries in routes.rb"
      def add_routes
        route 'mount ImperaviRails::Engine => "/imperavi"'
      end

      desc "Add assets paths to production configuration"
      def configure_assets
        gsub_file 'config/environments/production.rb', '# config.assets.precompile += %w( search.js )' do
          <<-CONTENT.gsub(/^ {12}/, '')
            config.assets.precompile += ['imperavi-rails/imperavi/redactor.css', 'imperavi-rails/imperavi.js']
          CONTENT
        end
      end
    end
  end
end
