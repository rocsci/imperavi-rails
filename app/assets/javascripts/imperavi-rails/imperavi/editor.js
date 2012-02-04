(function( $ ) {
  $.fn.imperavi = function(options) {
    // Create some defaults, extending them with any options that were provided
    var o = $.extend({
      language  : 'ru',
      resizer   : $.fn.ImperaviIframeResizer,
      overlay   : $.fn.ImperaviOverlay,
      iframe    : $.fn.ImperaviIframe,
      toolbar   : $.fn.ImperaviToolbar,
      delegator : $.fn.ImperaviActionDelegator
    }, options)

    // Main object
    $.fn.Imperavi = function(el) { this.initialize(el) }

    $.fn.Imperavi.prototype = {
      textarea  : null,
      iframe    : null,
      toolbar   : null,
      overlay   : null,
      resizer   : null,
      delegator : null,

      // Initialize imperavi
      initialize: function(el) {
        this.textarea = $(el)
        this.build()
        this.autosave()
      },

      build: function() {
         // Delegate action to another object
         this.delegator = new o.delegator

         // Create overlay
         this.overlay = new o.overlay(o)

         // Create iframe
         this.iframe  = new o.iframe(this.textarea, o)

         // Create editor resizer
         this.resizer = new o.resizer(this.iframe, o)

         // Create toolbar
         this.toolbar = new o.toolbar(this.iframe, {
           onButtonClick : $.proxy(function(button) {
              this.delegator.delegateButtonClick(button, this.iframe, this.overlay)
           }, this)
         })
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