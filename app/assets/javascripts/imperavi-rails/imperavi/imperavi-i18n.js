 // Internationalization
(function( $ ) {
  $.fn.ImperaviI18n = function(o) {
    var o = $.extend({
      locale : 'en'
    }, o)
    
	this.initialize(o)
  }

  $.fn.ImperaviI18n.prototype = {
    o       : null,
    locales : null,

    initialize: function(o) {
      this.o = $.extend({ locale : $.fn.ImperaviOptions().options.locale }, o)
      this.locales = $.fn.ImperaviLanguages[this.o.locale]
    },

    t: function(key) {
      
    }
  }
})(jQuery);