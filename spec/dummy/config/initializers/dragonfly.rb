require 'dragonfly/rails/images'
require 'dragonfly-minimagick'

# Retrieve Dragonfly Rack app
app = Dragonfly::App[:images]

# Configure Dragonfly with mini_magick
Dragonfly[:images].configure_with(:minimagick)