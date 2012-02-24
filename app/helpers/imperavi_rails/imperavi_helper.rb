module ImperaviRails
  module ImperaviHelper
    include ActionView::Helpers::AssetTagHelper

    def include_imperavi_stylesheet
      stylesheet_link_tag "imperavi-rails/imperavi/redactor"
    end

    def include_imperavi_javascript
      javascript_include_tag "imperavi-rails/imperavi"
    end

    def imperavi(element, options = {}, wrap = true)
      result = %Q(
        $(document).ready(function() {
          $('##{element}').redactor(#{imperavi_options(options).to_json});
        });
      )

      raw(wrap ? "<script>#{result}</script>" : result)
    end

    def imperavi_options(options)
      imperavi_default_options.deep_merge!(options)
    end

    def imperavi_default_options
      {
        :air                 => false,
        :autosave            => false,
        :interval            => 20,   
        :resize              => true,
        :visual              => true,
        :focus               => false,
        :autoclear           => true,
        :removeClasses       => false,
        :removeStyles        => true,
        :convertLinks        => true,
        :autoformat          => true,
        :clearOnInit         => false,
        :overlay             => true, 
        :fileUploadCallback  => false,
        :imageUploadCallback => false,
      
        # Paths to various handlers
        :paths => {
          # Editor css
          # TODO stylesheet_path does not work here.
          # this is temoarary fix I hope
          :stylesheets => [stylesheet_link_tag('wym').match(/href="([^"]+)"/)[1]], # Ugly but works

          # Toolbar
          :toolbar => imperavi_rails.toolbar_path(:format => :js),

          # Interface translations
          :language =>  imperavi_rails.language_path(:format => :js),

          # Typograf
          :typograf => imperavi_rails.typograf_path,

          # Dialogs
          # TODO Add dialogs sizes
          :dialogs => {
            :file      => imperavi_rails.file_path,
            :fileEdit  => imperavi_rails.file_edit_path,
            :image     => imperavi_rails.image_path,
            :imageEdit => imperavi_rails.image_edit_path,
            :link      => imperavi_rails.link_path,
            :table     => imperavi_rails.table_path,
            :video     => imperavi_rails.video_path,
          },

          # Images
          :images => {
            :upload   => '',#'/imperavi/images',
            :download => '',#'/imperavi/images/777',
            :list     => '',#'/imperavi/images.json'
          },

          # Files
          :files => {
            :upload   => '',#'/imperavi/files',
            :download => '',#'/imperavi/files/777', # /tests/file_download.php?file=
            :remove   => '',#'/imperavi/files/777'  # /tests/file_delete.php?delete=
          }
        }
      }
    end
  end
end
