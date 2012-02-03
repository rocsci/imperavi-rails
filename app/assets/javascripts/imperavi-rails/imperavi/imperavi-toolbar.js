(function( $ ) {
  $.fn.ImperaviToolbar = function(iframe, o) { this.initialize(iframe, o) }
  
  $.fn.ImperaviToolbar.prototype = {
    iframe : null,
    el     : null,

    initialize: function(iframe, o) {
      this.iframe = iframe
      this.o      = o

      this.build()
    },

    // Build Iframe object
    build: function() {
      this.el = $(document.createElement('ul'))
        .insertBefore(this.iframe.el);

      this.el.append(this.addButton('html', 'Show HTML source'))

      // Dropdowns
      this.el.append(this.addDropdown('styles', 'Styles'))
      this.el.append(this.addDropdown('format', 'Format text'))
      this.el.append(this.addDropdown('lists', 'Insert lists'))

      this.el.append(this.addButton('image', 'Insert image'))

      // Dropdown for table
      this.el.append(this.addDropdown('table', 'Insert table'))

      this.el.append(this.addButton('video', 'Insert video'))
      this.el.append(this.addButton('file', 'Insert link to file'))

      // Dropdown for link
      this.el.append(this.addDropdown('link', 'Insert link'))
    },

    // TODO: DRY addButton and addDropdownItem
    addButton: function(name, title) {
      var li = $(document.createElement('li')).addClass('button-' + name)
      var a  = $(document.createElement('a'))
        .attr('title', title)
        .attr('href', 'javascript:;')
        .appendTo(li)

      return li.append(a)
    },

    addDropdownItem: function(name, title) {
      var li = $(document.createElement('li')).addClass('button-' + name)
      var a  = $(document.createElement('a'))
        .attr('href', 'javascript:;')
        .html(title)
        .appendTo(li)

      return li.append(a)
    },

    addDropdown: function(name, title) {
      var button = this.addButton(name, title)
      var ul     = $(document.createElement('ul'))
      var items  = [
        { 'name' : 'item', 'title' : 'Item 1' },
        { 'name' : 'item', 'title' : 'Item 2' },
        { 'name' : 'item', 'title' : 'Item 3' },
        { 'name' : 'item', 'title' : 'Item 4' }
      ]

      $.each(items, $.proxy(function(i, item) {
        ul.append( this.addDropdownItem(item.name, item.title) )
      }, this));

      return button.append(ul)
    }
  }
})(jQuery);