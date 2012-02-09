(function( $ ) {
  $.fn.ImperaviIframe = function(textarea, o) { this.initialize(textarea, o) }

  $.fn.ImperaviIframe.prototype = {
    textarea : null,
    wrapper  : null,
    el       : null,

    initialize: function(textarea, o) {
      this.textarea = textarea
      this.o        = o

      this.textarea.hide();

      this.build()
      this.populate()
      this.enable(true)
    },

    // Build Iframe object and stuff
    build: function() {
      this.wrapper = $(document.createElement('div'))
        .addClass('imperavi')
        .insertAfter(this.textarea)

      this.el = $(document.createElement('iframe'))
        .appendTo(this.wrapper)
        .css({ width : this.textarea.outerWidth(), height : this.textarea.outerHeight() })
    },

    populate: function() {
      html = '<!DOCTYPE html>'
      html += '<head><meta charset="utf-8" />'
      //html += '<link rel="stylesheet" href="/assets/wysiwyg.css?body=1" />'
      //html += '<script src="/assets/mootools.js?body=1"></script>'
      html += '</head><html><body>' + this.textarea.val()
      html += '</body></html>'

      this.doc().open();
      this.doc().write(html);
      this.doc().close();   
    },

    enableObjects: function() {
      if (!$.browser.mozilla) return;
      
      //this.doc().execCommand('styleWithCSS', false, false)
      //this.doc().execCommand('enableObjectResizing', false, false)
      //this.doc().execCommand('enableInlineTableEditing', false, false)
    },
    
    observe: function() {
      
    },

    enable: function(status) {
      // Located here for Chrome support
      this.doc().designMode = status ? 'on' : 'off';

      this.el.load($.proxy(function() {
        this.enableObjects();
        this.observe();
      }, this));
    },

    doc: function() {
      var i = this.el.get(0)
      if (i.contentDocument) return i.contentDocument
      if (i.contentWindow)   return i.contentWindow.document

      return i.document
    }
  }
})(jQuery);