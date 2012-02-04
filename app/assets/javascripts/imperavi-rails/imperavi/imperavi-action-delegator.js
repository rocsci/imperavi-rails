(function( $ ) {
  $.fn.ImperaviActionDelegator = function(o) { this.initialize() }

  $.fn.ImperaviActionDelegator.prototype = {
    initialize: function() {},

    delegateButtonClick: function(button, iframe, overlay) {
      switch (button.attr('rel')) {
        case 'indent':
        case 'outdent':
          alert('yay!')
        break;
        case 'video':
          new $.fn.ImperaviPluginVideo
        break;
      }
    }
  }
})(jQuery);