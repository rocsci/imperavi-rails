(function( $ ) {
  $.fn.ImperaviPluginVideo = function(o) { this.initialize(o) }

  $.fn.ImperaviPluginVideo.prototype = {
    initialize: function(o) {
      this.o = o
      
      this.dialog = new $.fn.ImperaviDialog({
        title  : 'Insert video',
        width  : 600,
        height : 300,
        onOkay : function() {
          alert(this.el.find('textarea').val())
          this.hide()
        }
      })

      this.dialog.show()
      this.dialog.el.addClass('imperavi-plugin-video')
      this.build()
    },

    build: function() {
      var textarea = $(document.createElement('textarea'))
      this.dialog.setContent(textarea)
    }
  }
})(jQuery);