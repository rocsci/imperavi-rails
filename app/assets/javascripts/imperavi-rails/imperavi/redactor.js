/*
	Redactor v7.2.0
	Updated 20.11.2011
	
	In English http://imperavi.com/
	In Russian http://imperavi.ru/	
 
	Copyright (c) 2009-2012, Imperavi Ltd.
	Dual licensed under the MIT or GPL Version 2 licenses.
	
	Usage: $('#content').redactor();	
*/

var isCtrl = false;
var redactorActive = false;

var $table = false;
var $tbody = false;
var $thead = false;
var $current_tr = false;
var $current_td = false;

var deviceAndroid = "android";
var uagent = navigator.userAgent.toLowerCase();

// detect iOS and Android
function isiOS()
{
    return ((navigator.platform.indexOf("iPhone") != -1) || (navigator.platform.indexOf("iPod") != -1) || (navigator.platform.indexOf("iPad") != -1));
}

function detectAndroid()
{
   if (uagent.search(deviceAndroid) > -1) return true;
   else return false;
}

function detectAndroidWebKit()
{
   if (detectAndroid())
   {
		if (uagent.search('webkit') > -1) return true;
		else return false;
   }
   else return false;
}

// redactor 
(function($){

	// Initialization	
	$.fn.redactor = function(options)
	{				
		if (isiOS() || detectAndroid() || detectAndroidWebKit()) return false;

		var obj = new Construct(this, options);	
		
		obj.init();
		
		return obj;
	};
	
	// Options and variables	
	function Construct(el, options) {
		this.opts = $.extend({	
			air                 : false,
			autosave            : false, // false or url
			interval            : 20,    // seconds
			resize              : true,
			visual              : true,
			focus               : false,
			autoclear           : true,
			removeClasses       : false,
			removeStyles        : true,
			convertLinks        : true,
			autoformat          : true,
			clearOnInit         : false,
			overlay             : true,  // modal overlay
			fileUploadCallback  : false, // callback function
			imageUploadCallback : false, // callback function
			
			// Paths to various handlers
			paths : {
				// Editor css
				stylesheets : ['/assets/imperavi-rails/imperavi/wym.css'],

				// Toolbar
				toolbar : '/imperavi/toolbar.js',

				// Interface translations
				language : '/imperavi/language.js',

				// Typograf
				typograf : '/imperavi/typograf',

				// Dialogs
				// TODO Add dialogs sizes
				dialogs : {
			        file      : '/imperavi/file?r',
				    fileEdit  : '/imperavi/file_edit',
				    image     : '/imperavi/image?r',
				    imageEdit : '/imperavi/image_edit',
				    link      : '/imperavi/link',
				    table     : '/imperavi/table',
				    video     : '/imperavi/video'
				},

				// Images
				images : {
					upload   : '/imperavi/images',
					download : '/imperavi/images/777',
					list     : '/imperavi/images.json'
				},

				// Files
				files : {
					upload   : '/imperavi/files',
					download : '/imperavi/files/777', // /tests/file_download.php?file=
					remove   : '/imperavi/files/777'  // /tests/file_delete.php?delete=
				}
			}
		}, options);
		
		this.$el = $(el);
	};

	// Functionality
	Construct.prototype = {
	
		init: function()
		{
			if (this.opts.air) this.opts.toolbar = 'air';
			
			// include lang and toolbar
			this.include();
					
			// sizes and id
	   		this.frameID = this.$el.attr('id');
	   		this.width = this.$el.css('width');
	   		this.height = this.$el.css('height'); 
	   		  		
	   		
	   		// modal overlay
	   		if ($('#redactor_imp_modal_overlay').size() == 0)
	   		{
		   		this.overlay = $('<div id="redactor_imp_modal_overlay" style="display: none;"></div>');
		   		$('body').prepend(this.overlay);
		   	}
	   		
	   		// create container
			this.box = $('<div id="imp_redactor_box_' + this.frameID + '" style="width: ' + this.width + ';" class="imp_redactor_box imp_redactor_box"></div>');
		
			// air box
			if (this.opts.air)
			{
				this.air = $('<div id="imp_redactor_air_' + this.frameID + '" class="redactor_air" style="display: none;"></div>');
			}

	 		// create iframe
			this.frame = $('<iframe frameborder="0" marginheight="0" marginwidth="0" vspace="0" hspace="0" scrolling="auto"  id="imp_redactor_frame_' + this.frameID + '" style="height: ' + this.height + ';" class="imp_redactor_frame"></iframe>');
	   	
			this.$el.hide();	
					   		   	
			// append box and frame
			$(this.box).insertAfter(this.$el).append(this.frame).append(this.$el);

 			// toolbar
 			if (this.opts.toolbar !== false) this.buildToolbar();

			// resizer
			if (this.opts.resize)
			{
				this.resizer = $('<div id="imp_redactor_resize' + this.frameID + '" class="imp_redactor_resize"><div></div></div>');
				$(this.box).append(this.resizer);
	
	           $(this.resizer).mousedown(function(e) { this.initResize(e) }.bind2(this));
			}
			
			// enable	
	   		this.enable(this.$el.val());

			$(this.doc).click(function() { this.hideAllDropDown() }.bind2(this));
			
			if (this.opts.autoclear)
			{
				$(this.doc).bind('paste', function(e)
				{ 
					 setTimeout(function () { this.clean(); }.bind2(this), 200);
				}.bind2(this));
			}

			// air enable
			this.enableAir();

			// doc events
			$(this.doc).keydown(function(e)
		    {
		        if (e.ctrlKey || e.metaKey) isCtrl = true;
		                
		        if (e.keyCode == 9) { this.execCommand('indent', false); return false; }
		        if (e.keyCode == 66 && isCtrl) { this.execCommand('bold', 'bold'); return false; }
		        if (e.keyCode == 73 && isCtrl) { this.execCommand('italic', 'italic'); return false; }			        
		        
		    }.bind2(this)).keyup(function(e)
		    {
				isCtrl = false;		
				
		        if (e.keyCode == 13)
		        {
			        $(this.doc).linkify();
			        return true;
		        }				
					        
				this.syncCode();	
					        	        
		    }.bind2(this));

			
			// autosave	
			if (this.opts.autosave)	
			{	
				setInterval(function()
				{
					var html = this.getHtml();
					$.post(this.opts.autosave, { data: html });

				}.bind2(this), this.opts.interval*1000);
				
			}		
			
			this.formSets();	

			// focus
			if (this.opts.focus) this.focus();   		 
		},
		
		/* 	
			API 
		*/
		setHtml: function(html)
		{
			this.doc.body.innerHTML = html;			
			this.docObserve();
		},
		getHtml: function()
		{
			return this.doc.body.innerHTML;
		},
		getCode: function(clear)
		{
			return this.$el.val();
		},			
		focus: function()
		{
			if ($.browser.msie) $(this.frame).load(function() { $(this).get(0).contentWindow.focus(); });
			else this.frame.get(0).contentWindow.focus();
		},	
		typo: function()
		{
			var html = this.getHtml();
			$.ajax({
				url: this.opts.paths.typograf,
				type: 'post',
				data: 'redactor=' + escape(encodeURIComponent(html)),
				success: function(data)
				{
					this.setHtml(data);
				}.bind2(this)
			});
		},	
		syncCode: function()
		{
			var html = this.getHtml();
			
			html = this.tidyUp(html);
			
			html = html.replace(/\%7B/gi, '{');
			html = html.replace(/\%7D/gi, '}');
	
			html = html.replace(/<hr class="redactor_cut">/gi, '<!--more-->');
			html = html.replace(/<hr class=redactor_cut>/gi, '<!--more-->');
	
			this.$el.val(html);
		},
		destroy: function()
		{
			var html = this.getCode();
			$(this.box).after(this.$el)
			this.box.remove();
			this.$el.val(html).show();
		},
		
		/*
			Include
		*/
		include: function()
		{
			// lang
			$('head').append(
				$('<script src="' + this.opts.paths.language + '"></script>')
			);
			
			// toolbar
			// @tanraya
			if (this.opts.toolbar !== false) {
			  $('head').append($('<script src="' + this.opts.paths.toolbar + '"></script>')); 		
			}
		},
		
		/* 	
			Enable 
		*/	
		enable: function(html)
		{				
	   		this.doc = this.contentDocumentFrame(this.frame);
	   		
			// flash replace
			html = html.replace(/\<object([\w\W]*?)\<\/object\>/gi, '<p class="redactor_video_box"><object$1</object></p>');	   		
	   		
	   		if (html == '')
	   		{
	   			if (this.opts.autoformat === true) 
	   			{
	   				if ($.browser.msie) html = "<p></p>";
		   			else html = "<p>&nbsp;</p>";
		   		}
	   		}
	   		
			this.redactorWrite(this.getRedactorDoc(html));
			
			if (this.opts.clearOnInit) this.clean();
					
			
			this.designMode();		
		},
		enableAir: function()
		{
			if (this.opts.air)
			{	
				$('#imp_redactor_air_' + this.frameID).hide();
				
				$(this.doc).bind('textselect', this.frameID, function(e)
				{
					var width = $('#imp_redactor_air_' + this.frameID).width();
					var width_area = $(this.frame).width();
					
					var diff = width_area - e.clientX;
					if (diff < width) e.clientX = e.clientX - width;
					
					$('#imp_redactor_air_' + this.frameID).css({ left: e.clientX + 'px', top: (e.clientY + 8) + 'px' }).show();
					
				}.bind2(this));
				
				$(this.doc).bind('textunselect', this.frameID, function()
				{
					$('#imp_redactor_air_' + this.frameID).hide();
					
				}.bind2(this)); 			
			}		
		},
		redactorWrite: function(html)
		{
			this.doc.open();
			this.doc.write(html);
			this.doc.close();		
		},
		getRedactorDoc: function(html)
		{		
			css = '';
			for (stylesheet in this.opts.paths.stylesheets)
			{
				css += '<link media="all" href="' + this.opts.paths.stylesheets[stylesheet] + '" rel="stylesheet">';
			}

	    	var frameHtml = '<!DOCTYPE html>\n';
			frameHtml += '<html><head>' + css + '</head><body>';
			frameHtml += html;
			frameHtml += '</body></html>';
			return frameHtml;
		},	
		contentDocumentFrame: function(frame)
		{	
			frame = frame.get(0);
	
			if (frame.contentDocument) return frame.contentDocument;
			else if (frame.contentWindow && frame.contentWindow.document) return frame.contentWindow.document;
			else if (frame.document) return frame.document;
			else return null;
		},
		designMode: function()
		{
			if (this.doc)
			{
				this.doc.designMode = 'on';
				this.frame.load(function()
				{ 				
					this.enableObjects();
					this.docObserve();			
	   				this.doc.designMode = 'on'; 
	   			}.bind2(this));
			}
		},
		enableObjects: function()
		{
	   		if ($.browser.mozilla)
   			{
				this.doc.execCommand("enableObjectResizing", false, "false");
				this.doc.execCommand("enableInlineTableEditing", false, "false");	   						
			}		
		},
		
	
		/*
			Observers
		*/		
		docObserve: function()
		{
			var body = $(this.doc).find('body');
			
			body.find('img').click(function(e) { this.imageEdit(e); }.bind2(this));
			body.find('table').click(function(e) { this.tableObserver(e); }.bind2(this));
			body.find('.redactor_file_link').click(function(e) { this.fileEdit(e); }.bind2(this));

		},		
				
		/*
			Format on submit form 
		*/
		formSets: function()
		{
			var oldOnsubmit = null;		
	
			var theForm = $(this.box).parents('form');
			if (theForm.length == 0) return false;
	
			oldOnsubmit = theForm.get(0).onsubmit;
	
			if (typeof theForm.get(0).onsubmit != "function")
			{
				theForm.get(0).onsubmit = function()
				{
	          		if (this.opts.visual)
					{
						this.syncCode();
						
						return true;
					}
				}.bind2(this)
			}
			else
			{
				theForm.get(0).onsubmit = function()
				{
	            	if (this.opts.visual)
					{
						this.syncCode();
	
						return oldOnsubmit();
					}
				}.bind2(this)
			}
	
			return true;
		},			
		
		/*
			Exec
		*/		
		execCommand: function(cmd, param)
		{		
			if (this.opts.visual && this.doc)
			{
    			try
	    		{
    				this.frame.get(0).contentWindow.focus();
					
	    			if (cmd == 'inserthtml' && $.browser.msie) this.doc.selection.createRange().pasteHTML(param);
	    			else   			
					{											
						this.doc.execCommand(cmd, false, param);
						
						if (param == "blockquote" || param == 'pre') this.doc.body.appendChild(this.doc.createElement("BR"));
					}
				}
				catch (e) { }
				
				this.syncCode();	
				
				if (this.opts.air) $('#imp_redactor_air_' + this.frameID).hide();		

			}
		},						
		
		/*
			Format and clean
		*/	
		
		clean: function()
		{
			var html = this.getHtml();

			if ($.browser.mozilla) html = this.convertSpan(html);			
			
			// strip tags
			html = html.replace(/<(?!\s*\/?(a|br|p|b|i|strong|em|table|tr|td|th|tbody|thead|tfoot|h2|h3|h4)\b)[^>]+>/ig,"");
			
			if (this.opts.removeStyles) html = html.replace(/ style=".*?"/g, ''); 
			if (this.opts.removeClasses) html = html.replace(/ class=".*?"/g, '');
			
			html = this.tidyUp(html);	
			
			this.setHtml(html);
			
			this.paragraphise();
			
			return html;
		},
		
		tidyUp: function (html)
		{
			// lowercase
			if ($.browser.msie) 
			{
				html = html.replace(/< *(\/ *)?(\w+)/g,function(w){return w.toLowerCase()});				
				html = html.replace(/ jQuery(.*?)=\"(.*?)\"/gi, '');
			}			
		
			if (this.opts.convertLinks) html = this.convertLinks(html);

			html = html.replace(/[\t]*/g, ''); 
			html = html.replace(/[\r\n]*/g, ''); 
			html = html.replace(/\n\s*\n/g, "\n"); 
			html = html.replace(/^[\s\n]*/, '');
			html = html.replace(/[\s\n]*$/, '');	

			var lb = '\r\n';
			var btags = ["<html","</html>","</head>","<title","</title>","<meta","<link","<style","</style>","</body>","<body","<head","<div","<p","<form","<fieldset","<label","</label>","<legend","</legend>","<object","</object>","<embed","</embed>","<select","</select>","<option","<option","<input","<textarea","</textarea>","</form>","</fieldset>","<br>","<br />","<hr","<pre","</pre>","<blockquote","</blockquote>","<ul","</ul>","<ol","</ol>","<li","<dl","</dl>","<dt","</dt>","<dd","</dd>","<\!--","<table","</table>","</thead>","<tbody","</tbody>","<caption","</caption>","<th","</th>","<tr","</tr>","<td","<script","</script>","<noscript","</noscript>"];
			for (i = 0; i < btags.length; ++i)
			{
				var bbb = btags[i];
				html = html.replace(new RegExp(bbb,'gi'),lb+bbb);
			}				
			
			// indenting
			html = html.replace(/<li/g, "\t<li");
			html = html.replace(/<tr/g, "\t<tr");
			html = html.replace(/<td/g, "\t\t<td");		
			html = html.replace(/<\/tr>/g, "\t</tr>");	
			
			// empty tags
			var btags = ["<pre></pre>","<blockquote></blockquote>","<ul></ul>","<ol></ol>","<li></li>","<table></table>","<tr></tr>","<span><span>", "<p>&nbsp;</p>", "<p></p>", "<p><br></p>", "<div></div>"];
			for (i = 0; i < btags.length; ++i)
			{
				var bbb = btags[i];
				html = html.replace(new RegExp(bbb,'gi'), "");
			}	
		
			return html;
		},
		
		convertLinks: function(html)
		{
			html = html.replace(/\<a(.*?)href="http:\/\/(.*?)"(.*?)>([\w\W]*?)\<\/a\>/gi, "<a$1href=\"rttp://$2\"$3>$4</a>");
			html = html.replace(/\<a(.*?)href="rttp:\/\/(.*?)"(.*?)>http:\/\/([\w\W]*?)\<\/a\>/gi, "<a$1href=\"rttp://$2\"$3>rttp:\/\/$4</a>");				

			//var url1 = /(^|>|\s)(www\..+?\..+?)(\s|<|$)/g;
			var url2 = /(^|>|\s)(((https?|ftp):\/\/|mailto:).+?)(\s|<|$)/g;

			//html = html.replace(url1, '$1<a href="http://$2">$2</a>$3')
			html = html.replace(url2, '$1<a href="$2">$2</a>$5');		

			html = html.replace(/\<a(.*?)href="rttp:\/\/(.*?)"(.*?)>([\w\W]*?)\<\/a\>/gi, "<a$1href=\"http://$2\"$3>$4</a>");
			html = html.replace(/\<a(.*?)href="http:\/\/(.*?)"(.*?)>rttp:\/\/([\w\W]*?)\<\/a\>/gi, "<a$1href=\"http://$2\"$3>http://$4</a>");
			
			return html;			
		},

		convertSpan: function(html)
		{
			html = html.replace(/\<span(.*?)style="font-weight: bold;"\>([\w\W]*?)\<\/span\>/gi, "<strong>$2</strong>");
			html = html.replace(/\<span(.*?)style="font-style: italic;"\>([\w\W]*?)\<\/span\>/gi, "<em>$2</em>");
			html = html.replace(/\<span(.*?)style="font-weight: bold; font-style: italic;"\>([\w\W]*?)\<\/span\>/gi, "<em><strong>$2</strong></em>");
			html = html.replace(/\<span(.*?)style="font-style: italic; font-weight: bold;"\>([\w\W]*?)\<\/span\>/gi, "<strong><em>$2</em></strong>");
	
			return html;
	  	},

		/*
			Paragraphise
		*/
		paragraphise: function()
		{

			if (this.opts.autoformat === false) return true;
			if (this.opts.visual)
			{
				var theBody = this.doc.body;
	
				/* Remove all text nodes containing just whitespace */
				for (var i = 0; i < theBody.childNodes.length; i++)
				{
					if (theBody.childNodes[i].nodeName.toLowerCase() == "#text" && theBody.childNodes[i].data.search(/^\s*$/) != -1)
					{
						theBody.removeChild(theBody.childNodes[i]);
						i--;
					}
				}
	
				var removedElements = new Array();
				for (var i = 0; i < theBody.childNodes.length; i++)
				{
					if (theBody.childNodes[i].nodeName.isInlineName())
					{
						removedElements.push(theBody.childNodes[i].cloneNode(true));
						theBody.removeChild(theBody.childNodes[i]);	
						i--;
					}
					else if (theBody.childNodes[i].nodeName.toLowerCase() == "br")
					{
						if (i + 1 < theBody.childNodes.length)
						{
							if (theBody.childNodes[i + 1].nodeName.toLowerCase() == "br")
							{
								while (i < theBody.childNodes.length && theBody.childNodes[i].nodeName.toLowerCase() == "br")
								{
									theBody.removeChild(theBody.childNodes[i]);
								}
	
								if (removedElements.length > 0)
								{
									this.insertNewParagraph(removedElements, theBody.childNodes[i]);
									removedElements = new Array();
								}
							}
							else if (!theBody.childNodes[i + 1].nodeName.isInlineName()) theBody.removeChild(theBody.childNodes[i]);
							else if (removedElements.length > 0)
							{
								removedElements.push(theBody.childNodes[i].cloneNode(true));	
								theBody.removeChild(theBody.childNodes[i]);
							}
							else theBody.removeChild(theBody.childNodes[i]);
							i--;
						}
						else theBody.removeChild(theBody.childNodes[i]);
					}
					else if (removedElements.length > 0)
					{
						this.insertNewParagraph(removedElements, theBody.childNodes[i]);
						removedElements = new Array();
					}
				}
	
				if (removedElements.length > 0) this.insertNewParagraph(removedElements);
			}
	
			return true;
		},
		insertNewParagraph: function(elementArray, succeedingElement)
		{
			var theBody = this.doc.getElementsByTagName("body")[0];
			var theParagraph = this.doc.createElement("p");
	
			for (var i = 0; i < elementArray.length; i++) theParagraph.appendChild(elementArray[i]);
	
			if (typeof(succeedingElement) != "undefined") theBody.insertBefore(theParagraph, succeedingElement);
			else theBody.appendChild(theParagraph);
	
			return true;
		},

		/*
			Selection
		*/			
		get_selection: function ()
		{
			if (this.frame.get(0).contentWindow.getSelection) return this.frame.get(0).contentWindow.getSelection();
			else if (this.frame.get(0).contentWindow.document.selection) return this.frame.contentWindow.get(0).document.selection.createRange();
		},				
		
		setCut: function()
		{
			this.execCommand('inserthtml', '<hr class="redactor_cut" />');
		},		
		
		/*
			Toggle
		*/
		toggle: function()
		{
			if (this.opts.visual)
			{
				this.addSelButton('html');
				
				var html = this.getHtml();
				
				html = this.tidyUp(html);
	
				html = html.replace(/\%7B/gi, '{');
				html = html.replace(/\%7D/gi, '}');
	
				// flash replace
				html = html.replace(/<p(.*?)class="redactor_video_box"(.*?)>([\w\W]*?)\<\/p>/gi, "$3");
		
				// files replace
				html = html.replace(/<a(.*?)rel="(.*?)"(.*?)class="redactor_file_link(.*?)"(.*?)>([\w\W]*?)\<\/a>/gi, "<a href=\"" + this.opts.paths.files.download +  "$2\" rel=\"$2\" class=\"redactor_file_link$4\">$6</a>");

				// cut replace	
				html = html.replace(/<hr class="redactor_cut"\/>/gi, '<!--more-->');
				html = html.replace(/<hr class=redactor_cut>/gi, '<!--more-->');
		
		
				this.frame.hide();
				this.$el.val(html);
				this.$el.show().focus();
	
				var height = this.$el.height();
				
				this.opts.visual = false;
			}
			else
			{
				this.removeSelButton('html');
				this.$el.hide();
	
				var html = this.$el.val();
				
				// cut replace
				html = html.replace(/<!--more-->/gi, '<hr class="redactor_cut"/>');
	
				// flash replace
				html = html.replace(/\<object([\w\W]*?)\<\/object\>/gi, '<p class="redactor_video_box"><object$1</object></p>');
	
				// files replace	
				html = html.replace(/<a(.*?)href="(.*?)"(.*?)rel="(.*?)"(.*?)class="redactor_file_link(.*?)">(.*?)<\/a>/gi, "<a href=\"javascript:void(null);\" rel=\"$4\" class=\"redactor_file_link$6\">$7</a>");

					
				this.opts.visual = true;
	
				this.setHtml(html);
				
				this.frame.show();
				this.focus();
			}
		},	
		
		
		/*
			Video
		*/
		showVideo: function()
		{
			redactorActive = this;
			this.modalInit(RLANG.video, this.opts.paths.dialogs.video, 600, 360, function()
			{
				$('#redactor_insert_video_area').focus();			
			});
		},	
		insertVideo: function()
		{
			var data = $('#redactor_insert_video_area').val();
			if (redactorActive.opts.visual) 
			{
				// iframe video
				if (data.search('iframe')) {}
				// flash
				else data = '<p class="redactor_video_box">' + data + '</p>';
			}
	
			redactorActive.execCommand('inserthtml', data);
			this.modalClose();
			
		},	

	
		
		/*
			File
		*/
		showFile: function()
		{
			redactorActive = this;
			
            var handler = function()
            {
            	// upload params
                var params = '';
                if (this.opts.fileUploadCallback) params = this.opts.fileUploadCallback();
                
                $('#redactor_file').dragupload(
                { 
                	url: this.opts.paths.files.upload + params, 
                	success: function(data)
	                {
		                this.fileUploadCallback(data);
		                
                	}.bind2(this)
                });
                
                this.uploadInit('redactor_file', { auto: true, url: this.opts.paths.files.upload + params, success: function(data) {
                    
                    this.fileUploadCallback(data);
                    
                }.bind2(this)  });                  
           

            }.bind2(this);
            
        
            redactorActive = this;
			this.modalInit(RLANG.file, this.opts.paths.dialogs.file, 500, 400, handler);
		},	
		fileUploadCallback: function(data)
		{
			redactorActive.frame.get(0).contentWindow.focus();
			redactorActive.execCommand('inserthtml', data);
			this.modalClose();	
			this.docObserve();		
		},	
		fileEdit: function(e)
		{
			var el = e.target;
			var file_id = $(el).attr('rel');
			
			var handler = function()
            {
				$('#file').val($(el).text());
				$('#redactorFileDeleteBtn').click(function()
				{
					this.fileDelete(el, file_id);					
				}.bind2(this));
				
				$('#redactorFileDownloadBtn').click(function()
				{				
					this.fileDownload(el, file_id);
				}.bind2(this));
			
			}.bind2(this);
			
			redactorActive = this;
			this.modalInit(RLANG.file, this.opts.paths.dialogs.fileEdit, 400, 200, handler);
		},
		fileDelete: function(el, file_id)
		{
			$(el).remove();
			$.get(this.opts.paths.files.remove + file_id);
			redactorActive.frame.get(0).contentWindow.focus();
			this.modalClose();				
		},
		fileDownload: function(el, file_id)
		{
			top.location.href = this.opts.paths.files.download + file_id;				
		},		

  		/*
            Table
        */
        showTable: function()
        {       
            redactorActive = this;
            this.modalInit(RLANG.table, this.opts.paths.dialogs.table, 360, 200);
        },
        insertTable: function()
        {           
            var rows = $('#redactor_table_rows').val();
            var columns = $('#redactor_table_columns').val();
            
            var table_box = $('<div></div>');
            
            var tableid = Math.floor(Math.random() * 99999);
            var table = $('<table id="table' + tableid + '"><tbody></tbody></table>');
            
            for (i = 0; i < rows; i++)
            {
            	var row = $('<tr></tr>')
            	for (z = 0; z < columns; z++)
            	{
            		var column = $('<td>&nbsp;</td>');
            		$(row).append(column);
            	}
            	$(table).append(row);
            }
            
            $(table_box).append(table);
            var html = $(table_box).html();
            if ($.browser.msie) html += '<p></p>';
 			else  html += '<p>&nbsp;</p>';           
                        
            redactorActive.execCommand('inserthtml', html);            
   			this.enableObjects();
            this.docObserve();          
            this.modalClose();
            
            $table = $(this.doc).find('body').find('#table' + tableid);
    
            
        },
		tableObserver: function(e)
		{
			$table = $(e.target).parents('table');

			$tbody = $(e.target).parents('tbody');
			$thead = $($table).find('thead');

			$current_td = $(e.target);
			$current_tr = $(e.target).parents('tr');
		},	
		deleteTable: function()
		{
			$($table).remove();
			$table = false;
		},
		deleteRow: function()
		{
			$($current_tr).remove();
		},
		deleteColumn: function()
		{
			var index = $($current_td).attr('cellIndex');
            
            $($table).find('tr').each(function()
            {   
                $(this).find('td').eq(index).remove();
            });     
		},	
      	addHead: function()
        {
            if ($($table).find('thead').size() != 0) this.deleteHead();
            else
            {
                var tr = $($table).find('tr').first().clone();
                tr.find('td').html('&nbsp;');
                $thead = $('<thead></thead>');
                $thead.append(tr);
                $($table).prepend($thead);
            }
        },      
        deleteHead: function()
        {
            $($thead).remove(); 
            $thead = false;   
        },  
		insertRowAbove: function()
		{
			this.insertRow('before');		
		},	        
		insertRowBelow: function()
		{
			this.insertRow('after');	
		},
		insertColumnLeft: function()
		{
			this.insertColumn('before');		
		},
		insertColumnRight: function()
		{
			this.insertColumn('after');
		},	
		insertRow: function(type)
		{
			var new_tr = $($current_tr).clone();
			new_tr.find('td').html('&nbsp;');
			if (type == 'after') $($current_tr).after(new_tr);		
			else $($current_tr).before(new_tr);		
		},
		insertColumn: function(type)			    
		{
            var index = $($current_td).attr('cellIndex');
            
			$($table).find('tr').each(function(i,s)
			{   
			    var current = $(s).find('td').eq(index);    
			    var td = current.clone();   
			    td.html('&nbsp;');
			    if (type == 'after') $(current).after(td);
			    else $(current).before(td);			    
			});			
		},
    
        /*
            Image
        */  
        imageEdit: function(e)
        {
            var handler = function()
            {
                var $el = $(e.target);
                var src = $el.attr('src');      
                $('#redactor_image_edit_src').attr('href', src);
                $('#redactor_image_edit_delete').click(function() { this.deleteImage(e.target);  }.bind2(this));
                $('#redactorSaveBtn').click(function() { this.imageSave(e.target);  }.bind2(this));

                $('#redactor_file_alt').val($el.attr('alt'));
                
                var float = $el.css('float');
                if (float == 'none') float = 0;
                
                $('#redactor_form_image_align').val(float);

            }.bind2(this);       
        
            redactorActive = this;      
            this.modalInit(RLANG.image, this.opts.paths.dialogs.imageEdit, 380, 290, handler);
        },
        imageSave: function(el)
        {
            $(el).attr('alt', $('#redactor_file_alt').val());
    
            var style = '';
            if ($('#redactor_form_image_align') != 0)
            {
                var float = $('#redactor_form_image_align').val();

                // @tanraya AddedClasses
                $(el).removeClass('img_left').removeClass('img_right')

                if (float == 'left')
                  $(el).addClass('img_left');
                else if (float == 'right')
                  $(el).addClass('img_right')
            }
            else $(el).css({ float: 'none', margin: '0' });

            this.modalClose();
        },
        deleteImage: function(el)
        {
            $(el).remove();
            this.modalClose();
        },      
        showImage: function()
        {
            this.spanid = Math.floor(Math.random() * 99999);
            if (jQuery.browser.msie)
            {
                this.execCommand('inserthtml', '<span id="span' + this.spanid + '"></span>');
            }

            var handler = function() {
            	if (this.opts.paths.images.list !== false) {
					$.getJSON(this.opts.paths.images.list, function(data) {
						  $.each(data, function(key, val) {
						  		var img = $('<img src="' + val.thumb + '" rel="' + val.image + '">');
						  		img.click(function() { redactorActive.imageSetThumb($(this).attr('rel')); });
								$('#redactor_image_box').append(img);
						  });
					});    
				} else {
					$('#redactor_tabs li').eq(0).remove();
					$('#redactor_tabs a').eq(1).addClass('redactor_tabs_act');
					$('#redactor_tabs1').hide();
					$('#redactor_tabs2').show();					
				}            

            	// upload params
                var params = '';
                if (this.opts.imageUploadCallback) var params = this.opts.imageUploadCallback();

                $('#redactor_file').dragupload({ 
                	url     : this.opts.paths.images.upload + params, 
                	success : function(data) {
		                this.imageUploadCallback(data);
                	}.bind2(this)
                });
  
                this.uploadInit('redactor_file', {
	                auto    : true,
	                url     : this.opts.paths.images.upload + params,
	                trigger : 'redactorUploadBtn',
	                success : function(data) {
                       this.imageUploadCallback(data);
                }.bind2(this)});
            }.bind2(this);
        
            redactorActive = this;
            this.modalInit(RLANG.image, this.opts.paths.dialogs.image, 570, 450, handler);
            
        },
        imageSetThumb: function(data)
        {
        	this._imageSet('<img alt="" src="' + data + '" />');
        },
        imageUploadCallback: function(data)
        {
            if ($('#redactor_file_link').val() != '') data = $('#redactor_file_link').val();

			this._imageSet(data);
    
        }, 
        _imageSet: function(html)             
        {
            redactorActive.frame.get(0).contentWindow.focus();
            
            if ($.browser.msie)
            {       
                $(redactorActive.doc.getElementById('span' + redactorActive.spanid)).after(html);
                $(redactorActive.doc.getElementById('span' + redactorActive.spanid)).remove();
            }   
            else
            {
                redactorActive.execCommand('inserthtml', html);
            }
    
            this.modalClose();
            this.docObserve();                   	
        },
        				
	
		/*
			Link
		*/				
		showLink: function()
		{
			redactorActive = this;

			var handler = function()
			{
				var sel = this.get_selection();
				if ($.browser.msie)
				{
						var temp = sel.htmlText.match(/href="(.*?)"/gi);
						if (temp != null)
						{
							temp = new String(temp);
							temp = temp.replace(/href="(.*?)"/gi, '$1');
						}

  					 	var text = sel.text;
						if (temp != null) var url = temp;
						else  var url = '';
						var title = '';
				}
				else
				{
					if (sel.anchorNode.parentNode.tagName == 'A')
					{
						var url = sel.anchorNode.parentNode.href;
						var text = sel.anchorNode.parentNode.text;
						var title = sel.anchorNode.parentNode.title;
						if (sel.toString() == '') this.insert_link_node = sel.anchorNode.parentNode

					}
					else
					{
					 	var text = sel.toString();
						var url = '';
						var title = '';
					}
				}

				$('#redactor_link_url').val(url).focus();
				$('#redactor_link_text').val(text);
				$('#redactor_link_title').val(title);	
						
			}.bind2(this);

			this.modalInit(RLANG.link, this.opts.paths.dialogs.link, 400, 300, handler);
	
		},	
		insertLink: function()
		{
			var value = $('#redactor_link_text').val();
			if (value == '') return true;
			
			var title = $('#redactor_link_title').val();
			if (title != '') title = ' title="' + $('#redactor_link_title').val() + '"';			
			
			if ($('#redactor_link_id_url').get(0).checked)  var mailto = '';
			else var mailto = 'mailto:';
			
			var a = '<a href="' + mailto + $('#redactor_link_url').val() + '"' + title +'>' + value + '</a> ';
	
			if (a)
			{
				if (this.insert_link_node)
				{
					$(this.insert_link_node).text(value);
					$(this.insert_link_node).attr('href', $('#redactor_link_url').val());
					
					var title = $('#redactor_link_title').val();
					if (title != '') $(this.insert_link_node).attr('title', title);
	
					this.modalClose();
				}
				else
				{
					redactorActive.frame.get(0).contentWindow.focus();
					redactorActive.execCommand('inserthtml', a);
				}
			}
			
			this.modalClose();
		},	
		

		/*
			Modal
		*/
		modalInit: function(title, url, width, height, handler, scroll)
		{
			if (this.opts.overlay) 
			{
				$('#redactor_imp_modal_overlay').show();
				$('#redactor_imp_modal_overlay').click(function() { this.modalClose(); }.bind2(this));
			}
			
			if ($('#redactor_imp_modal').size() == 0)
			{
				this.modal = $('<div id="redactor_imp_modal" style="display: none;"><div id="redactor_imp_modal_close"></div><div id="redactor_imp_modal_header"></div><div id="redactor_imp_modal_inner"></div></div>');
				$('body').append(this.modal);
			}
			
			$('#redactor_imp_modal_close').click(function() { this.modalClose(); }.bind2(this));
			$(document).keyup(function(e) { if( e.keyCode == 27) this.modalClose(); }.bind2(this));
			$(this.doc).keyup(function(e) { if( e.keyCode == 27) this.modalClose(); }.bind2(this));			

			$.ajax({
				url: url,
				success: function(data)
				{		
					// parse lang
					$.each(RLANG, function(i,s)
					{
						var re = new RegExp("%RLANG\." + i + "%","gi");
						data = data.replace(re, s);						
					});
					
					$('#redactor_imp_modal_inner').html(data);
					$('#redactor_imp_modal_header').html(title);
					
					if (height === false) theight = 'auto';
					else theight = height + 'px';
					
					$('#redactor_imp_modal').css({ width: width + 'px', height: theight, marginTop: '-' + height/2 + 'px', marginLeft: '-' + width/2 + 'px' }).fadeIn('fast');					

					if (scroll === true)
					{					
						$('#imp_redactor_table_box').height(height-$('#redactor_imp_modal_header').outerHeight()-130).css('overflow', 'auto');						
					}
					
					if (typeof(handler) == 'function') handler();
					
					
				}.bind2(this)
			});
		},
		modalClose: function()
		{

			$('#redactor_imp_modal_close').unbind('click', function() { this.modalClose(); }.bind2(this));
			$('#redactor_imp_modal').fadeOut('fast', function()
			{
				$('#redactor_imp_modal_inner').html('');			
				
				if (this.opts.overlay) 
				{
					$('#redactor_imp_modal_overlay').hide();		
					$('#redactor_imp_modal_overlay').unbind('click', function() { this.modalClose(); }.bind2(this));					
				}			
				
				$(document).unbind('keyup', function(e) { if( e.keyCode == 27) this.modalClose(); }.bind2(this));
				$(this.doc).unbind('keyup', function(e) { if( e.keyCode == 27) this.modalClose(); }.bind2(this));
				
			}.bind2(this));

		},
				
        /*
            Upload
        */  
        uploadInit: function(element, options)
        {
            /*
                Options
            */
            this.uploadOptions = {
                url: false,
                success: false,
                start: false,
                trigger: false,
                auto: false,
                input: false
            };
      
            $.extend(this.uploadOptions, options);
    
    
            // Test input or form                 
            if ($('#' + element).get(0).tagName == 'INPUT')
            {
                this.uploadOptions.input = $('#' + element);
                this.element = $($('#' + element).get(0).form);
            }
            else
            {
                this.element = $('#' + element);
            }
            
    
            this.element_action = this.element.attr('action');
    
            // Auto or trigger
            if (this.uploadOptions.auto)
            {
				$(this.uploadOptions.input).change(function()
				{
					this.element.submit(function(e) { return false; });
					this.uploadSubmit();
				}.bind2(this));

            }
            else if (this.uploadOptions.trigger)
            {
                $('#' + this.uploadOptions.trigger).click(function() { this.uploadSubmit(); }.bind2(this)); 
            }
        },
        uploadSubmit : function()
        {
            this.uploadForm(this.element, this.uploadFrame());
        },  
        uploadFrame : function()
        {
            this.id = 'f' + Math.floor(Math.random() * 99999);
        
            var d = document.createElement('div');
            var iframe = '<iframe style="display:none" src="about:blank" id="'+this.id+'" name="'+this.id+'"></iframe>';
            d.innerHTML = iframe;
            document.body.appendChild(d);
    
            // Start
            if (this.uploadOptions.start) this.uploadOptions.start();
    
            $('#' + this.id).load(function () { this.uploadLoaded() }.bind2(this));
    
            return this.id;
        },
        uploadForm : function(f, name)
        {
            if (this.uploadOptions.input)
            {
                var formId = 'redactorUploadForm' + this.id;
                var fileId = 'redactorUploadFile' + this.id;
                this.form = $('<form  action="' + this.uploadOptions.url + '" method="POST" target="' + name + '" name="' + formId + '" id="' + formId + '" enctype="multipart/form-data"></form>');    
    
                var oldElement = this.uploadOptions.input;
                var newElement = $(oldElement).clone();
                $(oldElement).attr('id', fileId);
                $(oldElement).before(newElement);
                $(oldElement).appendTo(this.form);
                $(this.form).css('position', 'absolute');
                $(this.form).css('top', '-2000px');
                $(this.form).css('left', '-2000px');
                $(this.form).appendTo('body');  
                
                this.form.submit();
            }
            else
            {
                f.attr('target', name);
                f.attr('method', 'POST');
                f.attr('enctype', 'multipart/form-data');       
                f.attr('action', this.uploadOptions.url);
    
                this.element.submit();
            }
    
        },
        uploadLoaded : function()
        {
            var i = $('#' + this.id);
            
            if (i.contentDocument) var d = i.contentDocument;
            else if (i.contentWindow) var d = i.contentWindow.document;
            else var d = window.frames[this.id].document;
            
            if (d.location.href == "about:blank") return true;
    
            // Success
            if (this.uploadOptions.success) this.uploadOptions.success(d.body.innerHTML);
    
            this.element.attr('action', this.element_action);
            this.element.attr('target', '');
            //this.element.unbind('submit');
            //if (this.uploadOptions.input) $(this.form).remove();
        },								
	
		/*
			Toolbar
		*/
		buildToolbar: function()
		{	
	   		this.toolbar = $('<ul id="imp_redactor_toolbar_' + this.frameID + '" class="imp_redactor_toolbar"></ul>');
	   		
	   		if (this.opts.air)
	   		{
	   			$(this.air).append(this.toolbar);
	   			this.box.prepend(this.air);
	   		}
			else $(this.box).prepend(this.toolbar);
				
		
			$.each(RTOOLBAR, 
	   			function (i, s)
	   			{
	   				if (s.name == 'separator')
	   				{
						var li = $('<li class="separator"></li>');
		   				$(this.toolbar).append(li);	   			
	   				}
	   				else
	   				{
	   			
						var a = $('<a href="javascript:void(null);" class="imp_btn imp_btn_' + s.name + '" title="' + s.title + '"></a>');
						
						if (typeof(s.func) == 'undefined') a.click(function() { this.execCommand(s.exec, s.name); }.bind2(this));
						else if (s.func != 'show') a.click(function(e) { this[s.func](e); }.bind2(this));
						
						var li = $('<li class="imp_li_btn imp_li_btn_' + s.name + '"></li>');
						$(li).append(a);   						   						
		   				$(this.toolbar).append(li);
	
						// build dropdown box
						if (s.name == 'backcolor' || s.name == 'fontcolor' || typeof(s.dropdown) != 'undefined')
						{
							var ul = $('<ul class="imp_redactor_drop_down imp_redactor_drop_down' + this.frameID + '" id="imp_redactor_drop_down' + this.frameID + '_' + s.name + '" style="display: none;"></ul>');
							if ($.browser.msie) ul.css({ borderLeft: '1px solid #ddd',  borderRight: '1px solid #ddd',  borderBottom: '1px solid #ddd' });
						}
	
						// build dropdown
						if (typeof(s.dropdown) != 'undefined')
						{
										
							$.each(s.dropdown,
		   						function (x, d)
								{
									if (typeof(d.style) == 'undefined') d.style = '';
									
									if (d.name == 'separator')
					   				{
										var ul_li = $('<li class="separator_drop"></li>');
										$(ul).append(ul_li);
						   			}
						   			else
						   			{
														
										var ul_li = $('<li></li>');
										var ul_li_a = $('<a href="javascript:void(null);" style="' + d.style + '">' + d.title + '</a>');
										$(ul_li).append(ul_li_a); 
										$(ul).append(ul_li);
										
										if (typeof(d.func) == 'undefined') $(ul_li_a).click(function() { this.execCommand(d.exec, d.name); }.bind2(this));
										else $(ul_li_a).click(function(e) { this[d.func](e); }.bind2(this));										
									}
									
								
									  									
								}.bind2(this)
							);
						}
						else a.mouseover(function() { this.hideAllDropDown() }.bind2(this));	
						
						// observing dropdown
						if (s.name == 'backcolor' || s.name == 'fontcolor' || typeof(s.dropdown) != 'undefined')
						{
							$('#imp_redactor_toolbar_' + this.frameID).after(ul);
			
							this.hdlHideDropDown = function(e) { this.hideDropDown(e, ul, s.name) }.bind2(this);
							this.hdlShowDropDown = function(e) { this.showDropDown(e, ul, s.name) }.bind2(this);
							this.hdlShowerDropDown = function(e) { this.showerDropDown(e, ul, s.name) }.bind2(this);   	
	
							a.click(this.hdlShowDropDown).mouseover(this.hdlShowerDropDown);  							
	
							$(document).click(this.hdlHideDropDown);							
						}
						
						
					}
	   			}.bind2(this)
	   		);		
		},
		
		/*
			DropDown
		*/
		showedDropDown: false,
		showDropDown: function(e, ul, name)
		{
		
			if (this.showedDropDown) this.hideAllDropDown();
			else
			{
				this.showedDropDown = true;
				this.showingDropDown(e, ul, name);
			}		
				
		},
		showingDropDown: function(e, ul, name)
		{
			this.hideAllDropDown();			 	
	   		this.addSelButton(name);
	   		
			var left = $('#imp_redactor_toolbar_' + this.frameID + ' li.imp_li_btn_' + name).position().left;
			$(ul).css('left', left + 'px').show();	   		
		},
		showerDropDown: function(e, ul, name)
		{
			if (this.showedDropDown) this.showingDropDown(e, ul, name);
		},
		hideAllDropDown: function()
		{
			$('#imp_redactor_toolbar_' + this.frameID + ' li.imp_li_btn').removeClass('act');
	   		$('ul.imp_redactor_drop_down' + this.frameID).hide();
		},
		hideDropDown: function(e, ul, name)
		{
			if (!$(e.target).parent().hasClass('act'))
			{
				this.showedDropDown = false;
				this.hideAllDropDown();
			}	

			$(document).unbind('click', this.hdlHideDropDown);
			$(this.doc).unbind('click', this.hdlHideDropDown);
			
		},
		addSelButton: function(name)
		{
			var element = $('#imp_redactor_toolbar_' + this.frameID + ' li.imp_li_btn_' + name);
			element.addClass('act');
		},
		removeSelButton: function(name)
		{
			var element = $('#imp_redactor_toolbar_' + this.frameID + ' li.imp_li_btn_' + name);
			element.removeClass('act');
		},	
		toggleSelButton: function(name)
		{
			$('#imp_redactor_toolbar_' + this.frameID + ' li.imp_li_btn_' + name).toggleClass('act');
		},
			
	
		/*
			Resizer
		*/
		initResize: function(e)
		{	
			if (e.preventDefault) e.preventDefault();
			else e.returnValue = false;
			
			this.splitter = e.target;
	
			if (this.opts.visual)
			{
				this.element_resize = this.frame;
				this.element_resize.get(0).style.visibility = 'hidden';
				this.element_resize_parent = this.$el;
			}
			else
			{
				this.element_resize = this.$el;
				this.element_resize_parent = this.frame;
			}
	
			this.stopResizeHdl = function (e) { this.stopResize(e) }.bind2(this);
			this.startResizeHdl = function (e) { this.startResize(e) }.bind2(this);
			this.resizeHdl =  function (e) { this.resize(e) }.bind2(this);
	
			$(document).mousedown(this.startResizeHdl);
			$(document).mouseup(this.stopResizeHdl);
			$(this.splitter).mouseup(this.stopResizeHdl);
	
			this.null_point = false;
			this.h_new = false;
			this.h = this.element_resize.height();
		},
		startResize: function()
		{
			$(document).mousemove(this.resizeHdl);
		},
		resize: function(e)
		{
			if (e.preventDefault) e.preventDefault();
			else e.returnValue = false;
			
			var y = e.pageY;
			if (this.null_point == false) this.null_point = y;
			if (this.h_new == false) this.h_new = this.element_resize.height();
	
			var s_new = (this.h_new + y - this.null_point) - 10;
	
			if (s_new <= 30) return true;
	
			if (s_new >= 0)
			{
				this.element_resize.get(0).style.height = s_new + 'px';
				this.element_resize_parent.get(0).style.height = s_new + 'px';
			}
		},
		stopResize: function(e)
		{
			$(document).unbind('mousemove', this.resizeHdl);
			$(document).unbind('mousedown', this.startResizeHdl);
			$(document).unbind('mouseup', this.stopResizeHdl);
			$(this.splitter).unbind('mouseup', this.stopResizeHdl);
			
			this.element_resize.get(0).style.visibility = 'visible';
		}
			
	};


	String.prototype.isInlineName = function()
	{
		var inlineList = new Array("#text", "a", "em", "font", "span", "strong", "u");
		var theName = this.toLowerCase();
		
		for (var i = 0; i < inlineList.length; i++)
		{
			if (theName == inlineList[i])
			{
				return true;
			}
		}
		
		return false;
	};
	

	// bind2
	Function.prototype.bind2 = function(object)
	{
	    var method = this; var oldArguments = $.makeArray(arguments).slice(1);
	    return function (argument)
	    {
	        if (argument == new Object) { method = null; oldArguments = null; }
	        else if (method == null) throw "Attempt to invoke destructed method reference.";
	        else { var newArguments = $.makeArray(arguments); return method.apply(object, oldArguments.concat(newArguments)); }
	    };
	};	
	
	
})(jQuery);

// redactor_tabs
function showRedactorTabs(el, index)
{
	$('#redactor_tabs a').removeClass('redactor_tabs_act');
	$(el).addClass('redactor_tabs_act');
	
	$('.redactor_tabs').hide();
	$('#redactor_tabs' + index).show();
}


// Define: Linkify plugin from stackoverflow
(function($){
     var url2 = /(^|&lt;|\s)(((https?|ftp):\/\/|mailto:).+?)(\s|&gt;|$)/g;

      linkifyThis = function () 
      {
			var childNodes = this.childNodes,
			i = childNodes.length;
			while(i--)
			{
				var n = childNodes[i];
				if (n.nodeType == 3) 
				{
					var html = n.nodeValue;
					if (html)
					{
						html = html.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(url2, '$1<a href="$2">$2</a>$5');
						$(n).after(html).remove();
					}
				}
				else if (n.nodeType == 1  &&  !/^(a|button|textarea)$/i.test(n.tagName)) linkifyThis.call(n);
			}
      };
	
	$.fn.linkify = function () 
	{
		this.each(linkifyThis);
	};

})(jQuery);


/* jQuery plugin textselect
 * version: 0.9
 * author: Josef Moravec, josef.moravec@gmail.com
 * updated: Imperavi 
 * 
 */
(function($){$.event.special.textselect={setup:function(data,namespaces)
{$(this).data("textselected",false);$(this).data("ttt",data);$(this).bind('mouseup',$.event.special.textselect.handler);},teardown:function(data)
{$(this).unbind('mouseup',$.event.special.textselect.handler);},handler:function(event)
{var data=$(this).data("ttt");var text=$.event.special.textselect.getSelectedText(data).toString();if(text!='')
{$(this).data("textselected",true);event.type="textselect";event.text=text;$.event.handle.apply(this,arguments);}},getSelectedText:function(data)
{var text='';var frame=$('#imp_redactor_frame_'+data).get(0);if(frame.contentWindow.getSelection)text=frame.contentWindow.getSelection();else if(frame.contentWindow.document.getSelection) text=frame.contentWindow.document.getSelection();else if(frame.contentWindow.document.selection)text=frame.contentWindow.document.selection.createRange().text;return text;}}
$.event.special.textunselect={setup:function(data,namespaces){$(this).data("rttt",data);$(this).data("textselected",false);$(this).bind('mouseup',$.event.special.textunselect.handler);$(this).bind('keyup',$.event.special.textunselect.handlerKey)},teardown:function(data){$(this).unbind('mouseup',$.event.special.textunselect.handler);},handler:function(event){if($(this).data("textselected")){var data=$(this).data("rttt");var text=$.event.special.textselect.getSelectedText(data).toString();if(text==''){$(this).data("textselected",false);event.type="textunselect";$.event.handle.apply(this,arguments);}}},handlerKey:function(event){if($(this).data("textselected")){var data=$(this).data("rttt");var text=$.event.special.textselect.getSelectedText(data).toString();if((event.keyCode=27)&&(text=='')){$(this).data("textselected",false);event.type="textunselect";$.event.handle.apply(this,arguments);}}}}})(jQuery);


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

/*
			success_text: 'Загрузка успешно завершена',
			progress_text: 'Загрузка',
			maxsize_error: 'Файл слишком большой'
*/

			
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
			        

/*
			        if (file.size > this.opts.maxfilesize) 
			        {
			            this.dropareabox.text(this.opts.maxsize_error).addClass('error');
			            return false;
			        }

			        var uploadProgress = function(e) 
			        { 
						var percent = parseInt(e.loaded / e.total * 100);
						this.dropareabox.text(this.opts.progress_text + ': ' + percent + '%');
						
			        }.bind2(this);

	
				   	var xhr = jQuery.ajaxSettings.xhr();
				    if (xhr.upload) xhr.upload.addEventListener('progress', uploadProgress, false);
				    var provider = function () { return xhr; };  
*/
	
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