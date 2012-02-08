(function( $ ) {
  $.fn.ImperaviPluginImage = function(o) { this.initialize(o) }

  $.fn.ImperaviPluginImage.prototype = {
    initialize: function(o) {
      this.o = o
      
      this.dialog = new $.fn.ImperaviDialog({
        title  : 'Insert image',
        width  : 800,
        height : 600,
        onOkay : function() {
          //alert(this.el.find('textarea').val())
          this.hide()
        }
      })

      this.dialog.show()
      this.dialog.el.addClass('imperavi-plugin-image')
      this.build()
    },

    build: function() {
      this.tabs_area = this.build_tabs_area()

      this.pick_tab = this.build_tab('Pick image', '')
        .appendTo(this.tabs_area)
        .addClass('current')

      this.upload_tab = this.build_tab('Upload image', '')
        .appendTo(this.tabs_area)

      this.link_tab = this.build_tab('Link to image', '')
        .appendTo(this.tabs_area)
      
      this.dialog.setContent(this.tabs_area)
    },

    build_tabs_area: function() {
      var article = $(document.createElement('article'))
        .addClass('imperavi-tabs')

      return article
    },

    build_tab: function(title, content) {
      var section = $(document.createElement('section'))
      var heading = $(document.createElement('h3'))
        .html(title)
        .appendTo(section)

      var content = $(document.createElement('div'))
        .appendTo(section)
        .html(content)

      return section
    }
  }
})(jQuery);