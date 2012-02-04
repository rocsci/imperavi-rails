(function( $ ) {
  $.fn.imperavi = function(options) {
    // Create some defaults, extending them with any options that were provided
    var o = $.extend({
      language : 'ru',
    }, options)

    // Main object
    $.fn.Imperavi = function(el) { this.initialize(el) }

    $.fn.Imperavi.prototype = {
      textarea : null,
      iframe   : null,
      toolbar  : null,
      overlay  : null,
      resizer  : null,

      // Initialize imperavi
      initialize: function(el) {
        this.textarea = $(el)
        this.build()
        this.autosave()
      },

      build: function() {
         // Create overlay
         this.overlay = new $.fn.ImperaviOverlay(o)

         // Create iframe
         this.iframe  = new $.fn.ImperaviIframe(this.textarea, o)

         // Create toolbar
         this.toolbar = new $.fn.ImperaviToolbar(this.iframe, o)

         // Create editor resizer
         this.resizer = new $.fn.ImperaviIframeResizer(this.iframe, o)
      },

      autosave: function() {
        // TODO: implement
      }
    }

    // Apply imperavi for each selected element
    return this.each(function() {
      new $.fn.Imperavi(this)
    })
  }
})(jQuery);