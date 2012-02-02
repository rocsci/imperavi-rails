$:.push File.expand_path("../lib", __FILE__)

# Maintain your gem's version:
require "imperavi-rails/version"

# Describe your gem and declare its dependencies:
Gem::Specification.new do |s|
  s.name        = "imperavi-rails"
  s.version     = ImperaviRails::VERSION
  s.authors     = ["Andrew Kozloff"]
  s.email       = ["demerest@gmail.com"]
  s.homepage    = "https://github.com/tanraya/imperavi-rails"
  s.summary     = "Imparavi wysiwyg editor for Rails 3.1+"
  s.description = ""

  s.files = Dir["{app,config,db,lib}/**/*"] + ["MIT-LICENSE", "Rakefile", "README.rdoc"]
  s.test_files = Dir["test/**/*"]

  s.add_dependency "rails", "~> 3.1"
  s.add_dependency "jquery-rails"

  #s.add_development_dependency "sqlite3"
end
