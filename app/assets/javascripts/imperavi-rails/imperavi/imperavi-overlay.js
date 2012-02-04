(function( $ ) {
  $.fn.ImperaviOverlay = function(o) { this.initialize(o) }

  $.fn.ImperaviOverlay.prototype = {
    el : null,

    initialize: function(o) {
      this.o = o
    },

    build: function() {
      if (this.el) return;

      this.el = $(document.createElement('div'))
        .attr('id', 'imperavi-overlay')
        .appendTo($('body'));
    },

    show: function() {
      this.build()
      this.el.show()
    },

    hide: function() {
      this.el.hide()
    }
  }
})(jQuery);