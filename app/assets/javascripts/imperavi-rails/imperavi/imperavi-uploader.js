 // TODO Use https://github.com/cmlenz/jquery-iframe-transport instead of this
(function( $ ) {
  $.fn.ImperaviUploader = function(o) { this.initialize(o) }

  $.fn.ImperaviUploader.prototype = {
    o    : null,
    form : null,

    initialize: function(o) { },

    // Send request via post
    post: function(content) {
      this.buildForm()
      this.cleanup()
      this.populate(content)

      var form = this.form.addClass("loading");

      $.ajax(form.prop("action"), {
        files    : form.find(":file"),
        iframe   : true,
        dataType : "json"
      }).always(function() {
        form.removeClass("loading");
      }).done(function(data) {
        /*
        $.each(data.files, function(idx, file) {
          $("<li><b></b> (<span class='size'></span>, <span class='mime'></span>)</li>")
            .find("b").text(file.filename).end()
            .find(".size").text(formatSize(file.length)).end()
            .find(".mime").text(file.mime).end()
            .appendTo("#filelist");
        });
        */

        //form.find(":file").val("");
        alert(data)
      });
    }

    // Build form
    buildForm: function() {
      if (!this.form) return;

      this.form = $(document.createElement('form'))
        .attr('enctype', 'application/x-www-form-urlencoded')
        .attr('method', 'post')
        .attr('action', action)
        .attr('target', target)
        .appendTo($('body'))
        .hide()
    },

    // Populate form with data
    populate: function(content) {
      for (var x in content) {
        $(document.createElement('input'))
          .attr('type', 'hidden')
          .attr('name', x)
          .attr('value', content[x])
          .appendTo(this.form)
      }
    },

    // Remove all form elements
    cleanup: function() {
      while (this.form.firstChild){
        this.form.removeChild(this.form.firstChild);
      }
    }
  }
})(jQuery);