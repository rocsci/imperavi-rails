(function( $ ) {
  $.fn.ImperaviPluginImage = function(o) { this.initialize(o) }

  $.fn.ImperaviPluginImage.prototype = {
    initialize: function(o) {
      this.o = o
      
      this.dialog = new $.fn.ImperaviDialog({
        title  : 'Insert image',
        width  : 800,
        height : 600,
        onRemove : function() {
          alert('fuck yeah!')
          this.hide()
        },
        onOkay : function() {
          this.hide()
        }
      })

      this.dialog.show()
      this.dialog.el.addClass('imperavi-plugin-image')
      this.build()
    },

    build: function() {
      // Add 'remove' button
      this.removeButton = this.dialog.addButton('Remove', 'remove')
      this.removeButton.hide();

      // Create tabs and content for tabs
      this.tabsArea = this.buildTabsArea()

      this.uploadTab = this.buildTab('Upload image', this.buildUploadTabContent())
        .appendTo(this.tabsArea)
        .addClass('current')

      this.pickTab = this.buildTab('Pick image', this.buildPickTabContent())
        .appendTo(this.tabsArea)
        
      this.dialog.setContent(this.tabsArea)
      this.switchTabs();
    },

    // Build tabs container
    buildTabsArea: function() {
      var article = $(document.createElement('article'))
        .addClass('imperavi-tabs')

      return article
    },

    // Add another one tab
    buildTab: function(title, content) {
      var section = $(document.createElement('section'))
      var heading = $(document.createElement('h3'))
        .html(title)
        .addClass('imperavi-tab')
        .appendTo(section)

      var content = $(document.createElement('div'))
        .appendTo(section)
        .html(content)

      return section
    },

    // Switch between tabs
    switchTabs: function() {
      var currentTab = this.uploadTab
      
      this.tabsArea.on('click', '.imperavi-tab', function(e){
        e.preventDefault();
        
        if (currentTab.length) {
          currentTab.removeClass('current')
        }

        currentTab = $(this).closest('section').addClass('current')
      })
    },

    buildPickTabContent: function() {
      
    },

    buildUploadTabContent: function() {
      // Create wrapper
      var wrapper = $(document.createElement('div'))
        .attr('id', 'upload-wrapper')

      // Create place for thumbnail
      var thumbnail = $(document.createElement('figure'))
        .addClass('thumbnail')
        .appendTo(wrapper)

      var caption = $(document.createElement('span'))
        .html('No image yet')
        .appendTo(thumbnail)

      // Create form
      var form = $(document.createElement('form'))
        .attr('enctype', 'application/x-www-form-urlencoded')
        .attr('method', 'post')
        .attr('action', '/imperavi/upload')
        .appendTo(wrapper)

      // Choose image from disk
      var imageLocal = this.buildInput('Choose image from disk', 'image', 'file')
      .appendTo(form)

      // Image url
      var imageUrl = this.buildInput('or specify link to image', 'image-url', 'text')
        .appendTo(wrapper)

      // Image position
      var imagePos = this.buildPositionSelect().appendTo(wrapper)

      // Submit form
      form.on("change", ":file", function() {
        thumbnail.addClass("loading");

        $.ajax(form.prop("action"), {
          files    : form.find(":file"),
          iframe   : true,
          dataType : "json"
        }).always(function() {
          thumbnail.removeClass("loading");
        }).done(function(data) {
          thumbnail.empty()

          $(document.createElement('img'))
            .attr('src', data.file)
            .attr('width',  300)
            .attr('height', 340)
            .appendTo(thumbnail)
        });
      });

      return wrapper
    },

    buildInput: function(title, name, type) {
      var wrapper = $(document.createElement('div'))
        .addClass('field')

      var label = $(document.createElement('label'))
        .attr('for', name)
        .html(title)
        .appendTo(wrapper)

      var url = $(document.createElement('input'))
        .attr('type', type)
        .attr('name', name)
        .attr('id', name)
        .appendTo(wrapper)

      return wrapper
    },

    buildPositionSelect: function() {
      var wrapper = $(document.createElement('div'))
        .addClass('field')

      var label = $(document.createElement('label'))
        .attr('for', 'image-position')
        .html('Image position')
        .appendTo(wrapper)

      var select = $(document.createElement('select'))
        .attr('id', 'image-position')
        .attr('name', 'image-position')
        .appendTo(wrapper)

      // Create select options
      var options = {
        none  : 'None',
        left  : 'To left',
        right : 'To right'
      }

      $.each(options, function(value, caption) {
        var option = $(document.createElement('option'))
          .attr('value', value)
          .html(caption)
          .appendTo(select)

        if (value == 'left') option.attr('selected', true)
      })

      return wrapper
    }
  }
})(jQuery);