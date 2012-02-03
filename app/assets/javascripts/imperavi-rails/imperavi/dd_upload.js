/*
	Plugin Drag and drop Upload v1.0.0
	http://imperavi.com/ 
	Copyright 2011, Imperavi Ltd.
*/
(function($){
	
	// Initialization	
	$.fn.dragupload = function(options)
	{		
		return this.each(function() {
			var obj = new Construct(this, options);
			obj.init();
		});
	};
	
	// Options and variables	
	function Construct(el, options) {
		this.opts = $.extend({
			url: false,
			success: false,
			maxfilesize: 10485760, // 10MB
			preview: false,
			text: RLANG.drop_file_here,
			atext: RLANG.or_choose
		}, options);
		
		this.$el = $(el);
	};

	// Functionality
	Construct.prototype = {
		init: function()
		{	
			if (!$.browser.opera && !$.browser.msie) 
			{	
				this.droparea = $('<div class="redactor_droparea"></div>');
				this.dropareabox = $('<div class="redactor_dropareabox">' + this.opts.text + '</div>');	
				this.dropalternative = $('<div class="redactor_dropalternative">' + this.opts.atext + '</div>');
				
				this.droparea.append(this.dropareabox);	
				
				this.$el.before(this.droparea);	
				this.$el.before(this.dropalternative);	
				
				
				// drag over
				this.dropareabox.bind('dragover', function() { return this.ondrag(); }.bind2(this));
				
				// drag leave
				this.dropareabox.bind('dragleave', function() { return this.ondragleave(); }.bind2(this));	
				
				
				// drop
			    this.dropareabox.get(0).ondrop = function(event) {
			        event.preventDefault();
			        
			        this.dropareabox.removeClass('hover').addClass('drop');
			        
			        var file = event.dataTransfer.files[0];
			  		var fd = new FormData();

	 				fd.append('file', file); 
	 				
					$.ajax({
					    url: this.opts.url,
					    data: fd,
					    //xhr: provider,
					    cache: false,
					    contentType: false,
					    processData: false,
					    type: 'POST',
					    success: function(data)
					    {
					    	if (this.opts.success !== false) this.opts.success(data);

					    	if (this.opts.preview === true) this.dropareabox.html(data);
					    	//else this.dropareabox.text(this.opts.success_text);
					    
					    }.bind2(this)
					});		   
			        
			  
			    }.bind2(this);				
			}
		},
		ondrag: function()
		{
			this.dropareabox.addClass('hover');
			return false;
		},
		ondragleave: function()
		{
			this.dropareabox.removeClass('hover'); 
			return false;
		}
	};

	
})(jQuery);