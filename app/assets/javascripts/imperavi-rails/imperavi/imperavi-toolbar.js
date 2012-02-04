(function( $ ) {
  $.fn.ImperaviToolbar = function(iframe, o) { this.initialize(iframe, o) }
  
  $.fn.ImperaviToolbar.prototype = {
    iframe : null,
    el     : null,

    initialize: function(iframe, o) {
      this.iframe = iframe
      this.o      = o
      this.x      = $.fn.ImperaviToolbarDefault
      this.l      = $.fn.ImperaviLanguages.ru
      
      this.build()
    },

    // Build Toolbar object
    build: function() {
      this.el = $(document.createElement('ul'))
        .insertBefore(this.iframe.el);

      $.each(this.x, $.proxy(function(key, value) {
        // Buttons with dropdown
        if (typeof value == 'object') {
          this.el.append(this.addDropdown(key, value))
        } else if (typeof value == 'boolean' && value == true) {
          var title = typeof this.l[key] == 'object' ? this.l[key].name : this.l[key]
          this.el.append(this.addButton(key, title, null))
        }
      }, this));
    },

    addButton: function(name, title, caption) {
      var li = $(document.createElement('li')).addClass('button-' + name)
      var a  = $(document.createElement('a'))
        .attr('href', 'javascript:;')
        .attr('rel', name)
        .appendTo(li);

        a.attr('title', title)
        a.html(caption)

      return li.append(a)
    },

    addDropdown: function(name, items) {
      var button = this.addButton(name, this.l[name].name, null)
      var ul     = $(document.createElement('ul'))

      // Add dropdown items
      $.each(items, $.proxy(function(key, value) {
        if (typeof value == 'object') {
          var separator = true

          $.each(value, $.proxy(function(key2, value2) {
            if (value2 == true) {
              var item = this.addButton(key2, null, this.l[name][key][key2])
              if (separator) item.addClass('separator')

              ul.append(item)
              separator = false
            }
          }, this));
        } else if (typeof value == 'boolean' && value == true) {
          ul.append( this.addButton(key, null, this.l[name][key]) )
        }
      }, this));

      return button.append(ul)
    }
  }
})(jQuery);