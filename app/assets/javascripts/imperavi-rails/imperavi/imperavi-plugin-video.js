(function( $ ) {
  $.fn.ImperaviPluginVideo = function(o) { this.initialize(o) }

  $.fn.ImperaviPluginVideo.prototype = {
    initialize: function(o) {
      this.o = o

      this.build()
    },

    build: function() {
      this.dialog = new $.fn.ImperaviDialog
      this.dialog.show()
      //alert($.fn.ImperaviOptions().language)
    }
  }
})(jQuery);