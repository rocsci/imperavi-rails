(function( $ ) {
  $.fn.ImperaviPluginHyperlink = function(o) { this.initialize(o) }

  $.fn.ImperaviPluginHyperlink.prototype = {
    initialize: function(o) {
      this.o = o
      
      this.dialog = new $.fn.ImperaviDialog({
        title    : 'Insert hyperlink',
        width    : 400,
        height   : 200,
        onRemove : function() {
          alert('fuck yeah!')
          this.hide()
        },
        onOkay : function() {
          alert('fuck')
          this.hide()
        }
      })

      this.dialog.show()
      this.dialog.el.addClass('imperavi-plugin-hyperlink')
      this.dialog.addButton('Remove', 'remove')
      this.build()
    },

    build: function() {
      //var textarea = $(document.createElement('textarea'))
      //this.dialog.setContent(textarea)
    }
  }
})(jQuery);