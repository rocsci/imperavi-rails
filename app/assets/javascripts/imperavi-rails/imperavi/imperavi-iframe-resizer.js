(function( $ ) {
  $.fn.ImperaviIframeResizer = function(iframe, o) { this.initialize(iframe, o) }
  
  $.fn.ImperaviIframeResizer.prototype = {
    iframe : null,

    initialize: function(iframe, o) {
      this.iframe = iframe
      this.o      = o

      this.build()
    },

    build: function() {
      
    }
  }
})(jQuery);