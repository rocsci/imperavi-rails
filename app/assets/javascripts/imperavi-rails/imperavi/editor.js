(function( $ ) {

  //////////////////////////////////////////////////////////////////////////////////////////////
  // Build and interact with iframe
  function ImperaviIframe(textarea, o) { this.initialize(textarea, o) }
  ImperaviIframe.prototype = {
    textarea : null,
    wrapper  : null,
    iframe   : null,

    initialize: function(textarea, o) {
      this.textarea = textarea
      this.o        = o

      this.build()
      this.populate()
    },

    // Build Iframe object and stuff
    build: function() {
      this.wrapper = $(document.createElement('div'))
        .addClass('imperavi')
        .insertAfter(this.textarea)

      this.iframe = $(document.createElement('iframe'))
        .appendTo(this.wrapper)
        .css({ width : this.textarea.outerWidth(), height : this.textarea.outerHeight() })
//this.frame = $('<iframe frameborder="0" marginheight="0" marginwidth="0" vspace="0" hspace="0" scrolling="auto"
//  id="imp_redactor_frame_' + this.frameID + '" style="height: ' + this.height + ';" class="imp_redactor_frame"></iframe>');
/*        
    .html(text)
    .appendTo($("#myDiv")) //main div
    .click(function(){
        $(this).remove();
    })
    .hide()
    .slideToggle(300)
    .delay(2500)
    .slideToggle(300)
    .queue(function() {
        $(this).remove();
    });
*/
    },

    populate: function() {
      html = '<!DOCTYPE html>'
      html += '<head><meta charset="utf-8" />'
      //html += '<link rel="stylesheet" href="/assets/wysiwyg.css?body=1" />'
      //html += '<script src="/assets/mootools.js?body=1"></script>'
      html += '</head><html class="content"><body>' + this.textarea.val()
      html += '</body></html>'

      this.doc().open();
      this.doc().write(html);
      this.doc().close();   
    },

    // Look at http://www.bennadel.com/blog/1592-Getting-IFRAME-Window-And-Then-Document-References-With-contentWindow.htm
    doc: function() {
      return this.iframe.contentDocument || this.iframe.contentWindow.document
    }
  }

  //////////////////////////////////////////////////////////////////////////////////////////////
  // Build and interact with toolbar
  function ImperaviToolbar(iframe, o) { this.initialize(iframe, o) }
  ImperaviToolbar.prototype = {
    iframe  : null,
    toolbar : null,

    initialize: function(iframe, o) {
      this.iframe = iframe
      this.o      = o

      this.build()
    },

    // Build Iframe object
    build: function() {
      this.toolbar = null
    }
  }

  //////////////////////////////////////////////////////////////////////////////////////////////
  // Imperavi plugin start here
  $.fn.imperavi = function(options) {
    // Create some defaults, extending them with any options that were provided
    var o = $.extend({
      'location' : 'top',
    }, options)

    // Main object
    function Imperavi(el) { this.initialize(el) }
    Imperavi.prototype = {
      textarea : null,
      iframe   : null,
      toolbar  : null,
      overlay  : null,
      resizer  : null,

      // Initialize imperavi
      initialize: function(el) {
        this.textarea = $(el)
        this.build()
        this.autosave()
      },

      build: function() {
         // Create overlay
         //this.overlay = new ImperaviOverlay(o)

         // Create iframe
         this.iframe  = new ImperaviIframe(this.textarea, o)

         // Create toolbar
         this.toolbar = new ImperaviToolbar(this.iframe, o)

         // Create editor resizer
         //this.resizer = new ImperaviResizer(this.iframe, o)
      },

      autosave: function() {
        // TODO: implement
      }
    }

    // Apply imperavi for each selected element
    return this.each(function() {
      new Imperavi(this)
    })
  }
})(jQuery);