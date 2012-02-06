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
      //var textarea = $(document.createElement('textarea'))
      //this.dialog.setContent(textarea)
    }
  }
})(jQuery);