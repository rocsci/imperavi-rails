(function( $ ) {
  $.fn.ImperaviIframeResizer = function(iframe, o) { this.initialize(iframe, o) }
  
  $.fn.ImperaviIframeResizer.prototype = {
    iframe : null,
    el     : null,

    initialize: function(iframe, o) {
      this.iframe = iframe
      this.o      = o

      this.build()
    },

    build: function() {
      this.el = $(document.createElement('div'))
        .addClass('imperavi-resizer')
        .insertAfter(this.iframe.el)

      this.el.append($(document.createElement('div')))
    }
  }
})(jQuery);