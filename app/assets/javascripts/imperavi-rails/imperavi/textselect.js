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

