module ImperaviRails
  module ImperaviHelper
    def include_imperavi_stylesheet
      stylesheet_link_tag 'imperavi-rails/imperavi/redactor'
    end

    def include_imperavi_javascript
      javascript_include_tag 'imperavi-rails/imperavi/redactor'
    end

    def imperavi(element, options = {})
      raw %Q(
        <script>
        $(document).ready(function() {
          $('##{element}').redactor({
            toolbar      : 'custom',
            includeCss   : #{options[:include_css].to_json},
            image_upload : '',
            imageGetJson : '',
          })
        });
        </script>
      )
    end
  end
end
