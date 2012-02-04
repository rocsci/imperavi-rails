(function( $ ) {
  $.fn.ImperaviToolbar = function(iframe, o) {
    var o = $.extend({
      onButtonClick : function(button) {},
    }, o)

    this.initialize(iframe, o)
  }
  
  $.fn.ImperaviToolbar.prototype = {
    iframe : null,
    el     : null,

    initialize: function(iframe, o) {
      this.iframe = iframe
      this.o      = o
      this.x      = $.fn.ImperaviToolbarDefault // TODO make it pretty
      this.l      = $.fn.ImperaviLanguages.ru // TODO make it pretty

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
      var li   = $(document.createElement('li')).addClass('button-' + name)
      var a    = $(document.createElement('a'))
        .attr('href', 'javascript:;')
        .attr('rel', name)
        .attr('title', title)
        .appendTo(li)
        // This executes a custom callback on button click
        .click($.proxy(function(){ this.o.onButtonClick.call(this, a) }, this))

      var span = $(document.createElement('span'))
        .html(caption)
        .appendTo(a);

      return li.append(a)
    },

    addDropdown: function(name, items) {
      var button = this.addButton(name, this.l[name].name, null)
      var ul     = $(document.createElement('ul'))

      button.addClass('has-dropdown')

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