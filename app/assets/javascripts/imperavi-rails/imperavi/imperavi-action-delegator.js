(function( $ ) {
  $.fn.ImperaviActionDelegator = function(o) { this.initialize() }

  $.fn.ImperaviActionDelegator.prototype = {
    initialize: function() {},

    delegateButtonClick: function(button, iframe) {
      switch (button.attr('rel')) {
        case 'indent':
        case 'outdent':
          alert('yay!')
        break;
        case 'video':
          new $.fn.ImperaviPluginVideo
        break;
        case 'image':
          new $.fn.ImperaviPluginImage
        break;
        case 'hyperlink':
          new $.fn.ImperaviPluginHyperlink
        break;
        case 'file':
          new $.fn.ImperaviPluginFile
        break;
        default:
          return button
        break;
      }
    }
  }
})(jQuery);