(function( $ ) {
  $.fn.ImperaviPluginHyperlink = function(o) { this.initialize(o) }

  $.fn.ImperaviPluginHyperlink.prototype = {
    initialize: function(o) {
      this.o = o
      
      this.dialog = new $.fn.ImperaviDialog({
        title  : 'Insert hyperlink',
        width  : 400,
        height : 200,
        onOkay : function() {
          this.hide()
        }
      })

      this.dialog.show()
      this.dialog.el.addClass('imperavi-plugin-hyperlink')
      this.build()
    },

    build: function() {
      //var textarea = $(document.createElement('textarea'))
      //this.dialog.setContent(textarea)
    }
  }
})(jQuery);