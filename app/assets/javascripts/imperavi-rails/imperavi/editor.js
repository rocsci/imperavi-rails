(function( $ ) {
  $.fn.imperavi = function(o) {
    // Editor options
    var o = $.extend({
      locale    : 'ru', // TODO replace with $.fn.ImperaviLanguage
      resizer   : $.fn.ImperaviIframeResizer,
      dialog    : $.fn.ImperaviDialog,
      overlay   : $.fn.ImperaviOverlay,
      iframe    : $.fn.ImperaviIframe,
      toolbar   : $.fn.ImperaviToolbar,
      delegator : $.fn.ImperaviActionDelegator,
      options : {
        dialog : {
          title  : 'Default title',
          width  : 500,
          height : 300
        }
      }
    }, o)

    // Global options
    $.fn.ImperaviOptions = function() { return o }

    // Main object
    $.fn.Imperavi = function(el) { this.initialize(el) }

    $.fn.Imperavi.prototype = {
      textarea  : null,
      iframe    : null,
      toolbar   : null,
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

         // Create iframe
         this.iframe  = new o.iframe(this.textarea, o)

         // Create editor resizer
         this.resizer = new o.resizer(this.iframe, o)

         // Create toolbar
         this.toolbar = new o.toolbar(this.iframe, {
           onButtonClick : $.proxy(function(button) {
              this.delegator.delegateButtonClick(button, this.iframe)
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