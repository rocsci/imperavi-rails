module ImperaviRails
  module ImperaviHelper
    include ActionView::Helpers::AssetTagHelper

    def include_imperavi_stylesheet
      stylesheet_link_tag "imperavi-rails"
    end

    def include_imperavi_javascript
      javascript_include_tag "imperavi-rails"
    end
  end
end

