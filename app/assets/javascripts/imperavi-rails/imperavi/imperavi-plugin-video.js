(function( $ ) {
  $.fn.ImperaviPluginVideo = function(o) { this.initialize(o) }

  $.fn.ImperaviPluginVideo.prototype = {
    initialize: function(o) {
      this.o = o

      this.build()
    },

    build: function() {
      alert('video plugin')
    }
  }
})(jQuery);