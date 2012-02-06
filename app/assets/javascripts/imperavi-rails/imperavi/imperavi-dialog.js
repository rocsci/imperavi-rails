// TODO: add custom events
// - onShow
// - onClose
// - onBuilt
// - onContentLoaded
// - onOkay
// - onCancel

(function( $ ) {
  $.fn.ImperaviDialog = function(o) {
    var o = $.extend({
      onOkay   : function()  { this.hide() },
      onCancel : function()  { this.hide() },
      onClose  : function(e) { this.close(e) },
      onBuilt  : function()  {},
      onLoad   : function()  {}
    }, o)

    this.initialize(o)
  }

  $.fn.ImperaviDialog.prototype = {
    el      : null,
    o       : null,
    overlay : null,

    initialize: function(o) {
      // Retrieve user options passed to imperavi
      this.o = $.extend($.fn.ImperaviOptions().options.dialog, o)
    },

    build: function() {
      // Build dialog just once
      if (this.el) return;

      // Create overlay
      this.overlay = new $.fn.ImperaviOverlay()

      // Dialog window
      this.el = $(document.createElement('div'))
        .attr('id', 'imperavi-dialog')
        .appendTo($('body'));

      this.container = $(document.createElement('div'))
        .attr('id', 'imperavi-dialog-container')
        .appendTo(this.el);

      // Close button
      this.closeBtn = $(document.createElement('a'))
        .attr('href', 'javascript:;')
        .html('&times;')
        .attr('id', 'imperavi-dialog-close')
        .appendTo(this.container);
      
      // Dialog title
      this.title = $(document.createElement('h1'))
        .attr('id', 'imperavi-dialog-title')
        .appendTo(this.container);

      // Dialog content
      this.article = $(document.createElement('article'))
        .attr('id', 'imperavi-dialog-content')
        .appendTo(this.container);

      // Buttons panel
      this.buttons_wrapper = $(document.createElement('div'))
        .attr('id', 'imperavi-dialog-buttons-wrapper')
        .appendTo(this.container);

      this.buttons = $(document.createElement('div'))
        .attr('id', 'imperavi-dialog-buttons')
        .appendTo(this.buttons_wrapper);

      this.okay_button   = this.addButton('Okay', 'okay')
      this.cancel_button = this.addButton('Cancel', 'cancel')

      // Set default size
      this.setSize(this.o.width, this.o.height)
      
      // Set default title
      this.setTitle(this.o.title)

      this.o.onBuilt.call(this)
    },

    addButton: function(caption, name) {
      var callbackName = 'on' + name.charAt(0).toUpperCase() + name.slice(1)

      return $(document.createElement('a'))
        .attr('id', 'imperavi-dialog-' + name)
        .attr('href', 'javascript:;')
        .html(caption)
        .click($.proxy(function(){ this.o[callbackName].call(this) }, this))
        .appendTo(this.buttons);
    },

    addEvents: function() {
      var onCloseCallback = $.proxy(function(e){ this.o.onClose.call(this, e) }, this)

      $(document).keyup(function(e) { onCloseCallback(e) })
      this.closeBtn.click(function(e) { onCloseCallback(e) })
      this.overlay.el.click(function(e) { onCloseCallback(e) })
    },

    removeEvents: function() {
      var onCloseCallback = $.proxy(function(e){ this.o.onClose.call(this, e) }, this)

      $(document).unbind('keyup', onCloseCallback)
      this.closeBtn.unbind('click', onCloseCallback)
      this.overlay.el.unbind('click', onCloseCallback)
    },

    setSize: function(width, height) {
      this.el.css({
        width      : width + 'px',
        height     : height + 'px',
        marginTop  : '-' + height / 2 + 'px',
        marginLeft : '-' + width / 2 + 'px'
      }).fadeIn('fast');

      this.container.css({
        width      : width + 'px',
        height     : height + 'px',
      })
    },

    setTitle: function(title) {
      this.title.html(title)
    },

    setContent: function(content) {
      this.article.html(content)
    },

    // TODO Load content via ajax
    loadContent: function(url) {
      this.setContent('')
      this.o.onLoad.call(this)
    },

    cleanUp: function() {
      this.removeEvents()
      this.setContent('')
      this.setTitle('')
    },

    show: function() {
      this.build()
      this.overlay.show()
      this.el.show()
      this.addEvents()
    },

    hide: function() {
      this.el.hide()
      this.overlay.hide()
      this.cleanUp()
    },

    close: function(e) {
      if (e.keyCode == 27 || e.type == 'click')
        this.hide()
    }
  }
})(jQuery);