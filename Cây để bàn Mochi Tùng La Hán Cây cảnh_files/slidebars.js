var slidebars=function(){var canvas=$('[canvas]'),offCanvas={},initialized=false,registered=false,sides=['top','right','bottom','left'],styles=['reveal','push','overlay'],registerSlidebar=function(id,side,style,element){if(offCanvas.hasOwnProperty(id)){throw"Error attempting to register Slidebar, a Slidebar with ID '"+id+"' already exists.";}
offCanvas[id]={'id':id,'side':side,'style':style,'element':element,'active':false};},getAnimationProperties=function(id){var elements=$(),amount='0px, 0px',duration=parseFloat(offCanvas[id].element.css('transitionDuration'),10)*1000;if(offCanvas[id].style==='reveal'||offCanvas[id].style==='push'){elements=elements.add(canvas);}
if(offCanvas[id].style==='push'||offCanvas[id].style==='overlay'){elements=elements.add(offCanvas[id].element);}
if(offCanvas[id].active){if(offCanvas[id].side==='top'){amount='0px, '+offCanvas[id].element.css('height');}else if(offCanvas[id].side==='right'){amount='-'+offCanvas[id].element.css('width')+', 0px';}else if(offCanvas[id].side==='bottom'){amount='0px, -'+offCanvas[id].element.css('height');}else if(offCanvas[id].side==='left'){amount=offCanvas[id].element.css('width')+', 0px';}}
return{'elements':elements,'amount':amount,'duration':duration};};this.init=function(callback){if(initialized){throw'You have already initialized Slidebars.';}
if(!registered){$('[off-canvas]').each(function(){var parameters=$(this).attr('off-canvas').split(' ',3);if(parameters[0]&&sides.indexOf(parameters[1])!==-1&&styles.indexOf(parameters[2])!==-1){registerSlidebar(parameters[0],parameters[1],parameters[2],$(this));}else{throw"Error attempting to register Slidebar, please specifiy a valid space separated 'id side style'.";}});registered=true;}
initialized=true;this.css();$(events).trigger('init');if(typeof callback==='function'){callback();}};this.exit=function(callback){if(!initialized){throw'You need to initialize Slidebars first.';}
var exit=function(){initialized=false;$(events).trigger('exit');if(typeof callback==='function'){callback();}};if(this.active('slidebar')){this.close(exit);}else{exit();}};this.css=function(callback){if(!initialized){throw'You need to initialize Slidebars first.';}
for(var id in offCanvas){if(offCanvas.hasOwnProperty(id)){var offset;if(offCanvas[id].side==='top'||offCanvas[id].side==='bottom'){offset=offCanvas[id].element.css('height');}else{offset=offCanvas[id].element.css('width');}
if(offCanvas[id].style==='push'||offCanvas[id].style==='overlay'){offCanvas[id].element.css('margin-'+offCanvas[id].side,'-'+offset);}}}
if(this.active('slidebar')){this.open(this.active('slidebar'));}
$(events).trigger('css');if(typeof callback==='function'){callback();}};this.open=function(id,callback){if(!initialized){throw'You need to initialize Slidebars first.';}
if(!id){throw"Error trying to open Slidebar, you must specify an ID.";}
if(!offCanvas.hasOwnProperty(id)){throw"Error trying to open Slidebar, there is no Slidebar with ID '"+id+"'.";}
var open=function(){offCanvas[id].active=true;offCanvas[id].element.css('display','block');$(events).trigger('opening',[offCanvas[id].id]);var animationProperties=getAnimationProperties(id);animationProperties.elements.css({'transition-duration':animationProperties.duration+'ms','transform':'translate('+animationProperties.amount+')'});setTimeout(function(){$(events).trigger('opened',[offCanvas[id].id]);if(typeof callback==='function'){callback();}},animationProperties.duration);};if(this.active('slidebar')&&this.active('slidebar')!==id){this.close(open);}else{open();}};this.close=function(id,callback){if(typeof id==='function'){callback=id;id=null;}
if(!initialized){throw'You need to initialize Slidebars first.';}
if(id&&!offCanvas.hasOwnProperty(id)){throw"Error trying to close Slidebar, there is no Slidebar with ID '"+id+"'.";}
if(!id){for(var key in offCanvas){if(offCanvas.hasOwnProperty(key)){if(offCanvas[key].active){id=key;break;}}}}
if(id&&offCanvas[id].active){offCanvas[id].active=false;$(events).trigger('closing',[offCanvas[id].id]);var animationProperties=getAnimationProperties(id);animationProperties.elements.css('transform','');setTimeout(function(){animationProperties.elements.css('transition-duration','');offCanvas[id].element.css('display','none');$(events).trigger('closed',[offCanvas[id].id]);if(typeof callback==='function'){callback();}},animationProperties.duration);}};this.toggle=function(id,callback){if(!initialized){throw'You need to initialize Slidebars first.';}
if(!id){throw"Error trying to toggle Slidebar, you must specify an ID.";}
if(!offCanvas.hasOwnProperty(id)){throw"Error trying to toggle Slidebar, there is no Slidebar with ID '"+id+"'.";}
if(offCanvas[id].active){this.close(id,function(){if(typeof callback==='function'){callback();}});}else{this.open(id,function(){if(typeof callback==='function'){callback();}});}};this.active=function(query,callback){if(typeof query==='function'){callback=query;query=null;}
var active=false;if(!query){active=initialized;}else
if(query==='slidebar'){if(!initialized){throw'You need to initialize Slidebars first.';}
for(var id in offCanvas){if(offCanvas.hasOwnProperty(id)){if(offCanvas[id].active){active=offCanvas[id].id;break;}}}}else
{if(!initialized){throw'You need to initialize Slidebars first.';}
if(!offCanvas.hasOwnProperty(query)){throw"Error retrieving state of Slidebar, there is no Slidebar with ID '"+query+"'.";}
active=offCanvas[query].active;}
if(typeof callback==='function'){callback();}
return active;};this.create=function(id,side,style,content,callback){if(typeof content==='function'){callback=content;content=null;}
if(!initialized){throw'You need to initialize Slidebars first.';}
if(id&&sides.indexOf(side)!==-1&&styles.indexOf(style)!==-1){if(offCanvas.hasOwnProperty(id)){throw"Error attempting to create Slidebar, a Slidebar with ID '"+id+"' already exists.";}
$('<div id="'+id+'" off-canvas="'+id+' '+side+' '+style+'"></div>').appendTo('body');if(content){$('#'+id).html(content);}
registerSlidebar(id,side,style,$('#'+id));this.css();$(events).trigger('created',[offCanvas[id].id]);if(typeof callback==='function'){callback();}}else{throw"Error attempting to create Slidebar, please specifiy a valid space separated 'id side style'.";}};this.destroy=function(id,callback){if(!initialized){throw'You need to initialize Slidebars first.';}
if(!id){throw"Error trying to destroy Slidebar, you must specify an ID.";}
if(!offCanvas.hasOwnProperty(id)){throw"Error trying to destroy Slidebar, there is no Slidebar with ID '"+id+"'.";}
var destroy=function(){$(events).trigger('destroyed',[offCanvas[id].id]);offCanvas[id].element.remove();delete offCanvas[id];if(typeof callback==='function'){callback();}};if(offCanvas[id].active){this.close(id,destroy);}else{destroy();}};this.events={};var events=this.events;};