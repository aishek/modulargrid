var ModularGrid={};ModularGrid.Utils={};ModularGrid.Utils={updateCSSHeight:function(a,b,c){if(a!==null){a.style.height=b;if(c){c();}}},getClientHeight:function(){var a=Math.max(document.documentElement.clientHeight,this.getDocumentBodyElement().offsetHeight);if(window.scrollMaxY){a=Math.max(a,window.scrollMaxY);}if(document.documentElement.scrollHeight){a=Math.max(a,document.documentElement.scrollHeight);}return a;},getClientWidth:function(){var a=document.documentElement.clientWidth;return a;},documentBodyElement:null,getDocumentBodyElement:function(){if(this.documentBodyElement==null){this.documentBodyElement=document.getElementsByTagName("body")[0];}return this.documentBodyElement;},createParams:function(c,d){var a={};for(var b in c){a[b]=c[b];}for(var b in d){a[b]=d[b];}return a;},defaultStyleValueParams:{display:"block",width:"100%",height:"100%",opacity:1,background:"transparent","float":"none",visibility:"visible",border:"0"},createStyleValue:function(f,d){var b=d||ModularGrid.Utils.defaultStyleValueParams;var e=ModularGrid.Utils.createParams(b,f);var a="";for(var c in e){if(e[c]||e[c]===0){a+=c+":"+e[c]+";";}if(e[c]=="opacity"){a+="-khtml-opacity:"+e[c]+";-moz-opacity:"+e[c]+";filter:progid:DXImageTransform.Microsoft.Alpha(opacity="+(e[c]*100)+");";}}return a;}};ModularGrid.Utils.EventProvider=function(a,c,b){this.eventName=a;this.prepareParams=c;this.target=b||"document";this.handlers=null;return this;};ModularGrid.Utils.EventProvider.prototype.genericHandler=function(c){var d=(this.prepareParams?this.prepareParams(c):c);for(var a=0,b=this.handlers.length;a<b;a++){this.handlers[a](d);}};ModularGrid.Utils.EventProvider.prototype.initHandlers=function(){this.handlers=[];var code=this.target+".on"+this.eventName.toLowerCase()+"=function(event){self.genericHandler(event);};";var self=this;eval(code);};ModularGrid.Utils.EventProvider.prototype.addHandler=function(a){if(this.handlers==null){this.initHandlers();}this.handlers[this.handlers.length]=a;};ModularGrid.Utils.EventSender=function(){this.handlers={};return this;};ModularGrid.Utils.EventSender.prototype.addHandler=function(a,b){if(!this.handlers[a]){this.handlers[a]=[];}this.handlers[a][this.handlers[a].length]=b;};ModularGrid.Utils.EventSender.prototype.occurEvent=function(a,e){var d=this.handlers[a];if(this.handlers[a]){for(var b=0,c=this.handlers[a].length;b<c;b++){this.handlers[a][b](e);}}};ModularGrid.Utils.CookieStore={setValue:function(a,b){ModularGrid.Utils.CookieStore.setCookie(a,b);},getValue:function(a){return ModularGrid.Utils.CookieStore.getCookie(a);},setCookie:function(c,d){var b=new Date(),a=new Date();a.setTime(b.getTime()+31536000000);document.cookie=c+"="+escape(d)+"; expires="+a;},getCookie:function(b){var d=" "+document.cookie;var c=" "+b+"=";var e=null;var f=0;var a=0;if(d.length>0){f=d.indexOf(c);if(f!=-1){f+=c.length;a=d.indexOf(";",f);if(a==-1){a=d.length;}e=unescape(d.substring(f,a));}}return(e);}};ModularGrid.Utils.StateChanger=function(c,b,a){c.addHandler(function(d){if(b(d)){a();}});return this;};ModularGrid.OpacityChanger={};ModularGrid.OpacityChanger.defaults={shouldStepUpOpacity:function(b){var a=!b.occured_in_form&&(b.shiftKey&&b.keyCode==221);return a;},shouldStepDownOpacity:function(b){var a=!b.occured_in_form&&(b.shiftKey&&b.keyCode==219);return a;},opacity:0.25,opacityStep:0.05};ModularGrid.OpacityChanger={params:null,eventSender:null,init:function(a){this.params=ModularGrid.Utils.createParams(this.defaults,a);this.eventSender=new ModularGrid.Utils.EventSender();},setOpacity:function(a){this.params.opacity=a;this.params.opacity=(this.params.opacity<0?0:this.params.opacity);this.params.opacity=(this.params.opacity>1?1:this.params.opacity);this.updateOpacity(this.params.opacity);return this.params.opacity;},stepDownOpacity:function(){return this.setOpacity(this.params.opacity-this.params.opacityStep);},stepUpOpacity:function(){return this.setOpacity(this.params.opacity+this.params.opacityStep);},updateOpacity:function(a){this.eventSender.occurEvent("opacityChanged",this.params.opacity);},changeElementOpacity:function(a){if(a){a.style.opacity=this.params.opacity;}}};ModularGrid.Image={};ModularGrid.Image.defaults={shouldToggleVisibility:function(b){var a=!b.occured_in_form&&(b.ctrlKey&&(b.character=="\\"||b.keyCode==28||b.keyCode==220));return a;},"z-index":255,centered:false,marginTop:0,marginLeft:"0px",marginRight:"0px",src:"",width:100,height:100};ModularGrid.Image={showing:false,parentElement:null,params:null,imgElement:null,eventSender:null,init:function(a){this.params=ModularGrid.Utils.createParams(this.defaults,a);this.eventSender=new ModularGrid.Utils.EventSender();},createParentElement:function(c){var b=document.createElement("div");var a={position:"absolute",left:"0",top:"0",width:"100%",height:c.height+"px",opacity:1,"z-index":c["z-index"]};b.setAttribute("style",ModularGrid.Utils.createStyleValue(a));b.appendChild(this.createImageDOM(c));ModularGrid.Utils.getDocumentBodyElement().appendChild(b);return b;},createImageDOM:function(d){var a={width:"auto",height:"auto",opacity:ModularGrid.OpacityChanger.params.opacity};var c={"padding-top":d.marginTop+"px",width:"auto",height:"auto"};if(d.centered){c["text-align"]="center";a.margin="0 auto";}else{c["padding-left"]=d.marginLeft,c["padding-right"]=d.marginRight;}var b=document.createElement("div");b.setAttribute("style",ModularGrid.Utils.createStyleValue(c));this.imgElement=document.createElement("img");this.imgElement.setAttribute("src",d.src);this.imgElement.setAttribute("width",d.width);this.imgElement.setAttribute("height",d.height);this.imgElement.setAttribute("style",ModularGrid.Utils.createStyleValue(a));b.appendChild(this.imgElement);return b;},opacityHandler:function(){ModularGrid.OpacityChanger.changeElementOpacity(ModularGrid.Image.imgElement);},toggleVisibility:function(){this.showing=!this.showing;this.eventSender.occurEvent("visibilityChanged",this.showing);if(this.showing&&this.parentElement==null){this.parentElement=this.createParentElement(this.params);}if(this.parentElement){this.parentElement.style.display=(this.showing?"block":"none");}}};ModularGrid.Guides={};ModularGrid.Guides.defaults={shouldToggleVisibility:function(b){var a=!b.occured_in_form&&(b.ctrlKey&&(b.character==";"||b.keyCode==186));return a;},lineStyle:"solid",lineColor:"#9dffff",lineWidth:"1px","z-index":255,items:[]};ModularGrid.Guides={showing:false,parentElement:null,params:null,eventSender:null,init:function(a){this.params=ModularGrid.Utils.createParams(this.defaults,a);this.eventSender=new ModularGrid.Utils.EventSender();},createParentElement:function(b){var a=document.createElement("div");var c=ModularGrid.Utils.createStyleValue({position:"absolute",left:"0",top:"0",height:ModularGrid.Utils.getClientHeight()+"px",width:"100%","text-align":"center","z-index":b["z-index"]});a.setAttribute("style",c);a.innerHTML=this.createGuidesHTML(b.items);ModularGrid.Utils.getDocumentBodyElement().appendChild(a);return a;},createGuidesHTML:function(b){var e="";if(b){var d,f,a=this.params.lineWidth+" "+this.params.lineStyle+" "+this.params.lineColor+" !important";for(var c=b.length;c--;){d=b[c];f={position:"absolute"};switch(d.type){case"center":f.width="100%";f.height="100%";var g={width:d.width,height:"100%",margin:"0 auto","border-left":a,"border-right":a};e+='<div style="'+ModularGrid.Utils.createStyleValue(f)+'"><div style="'+ModularGrid.Utils.createStyleValue(g)+'"></div></div>';break;case"vertical":f.width="0px";f.height="100%";if(d.left!=null){f.left=d.left;f["border-right"]=a;}if(d.right!=null){f.right=d.right;f["border-left"]=a;}e+='<div style="'+ModularGrid.Utils.createStyleValue(f)+'"></div>';break;case"horizontal":f.width="100%";f.height="0px";if(d.top!=null){f.top=d.top;f["border-bottom"]=a;}if(d.bottom!=null){f.bottom=d.bottom;f["border-top"]=a;}e+='<div style="'+ModularGrid.Utils.createStyleValue(f)+'"></div>';break;}}}return e;},toggleVisibility:function(){this.showing=!this.showing;this.eventSender.occurEvent("visibilityChanged",this.showing);if(this.showing&&this.parentElement==null){this.parentElement=this.createParentElement(this.params);}if(this.parentElement){this.parentElement.style.display=(this.showing?"block":"none");}}};ModularGrid.Grid={};ModularGrid.Grid.defaults={shouldToggleVerticalGridVisibility:function(b){var a=!b.occured_in_form&&(b.shiftKey&&b.character=="v");return a;},shouldToggleHorizontalGridVisibility:function(b){var a=!b.occured_in_form&&(b.shiftKey&&b.character=="h");return a;},shouldToggleFontGridVisibility:function(b){var a=!b.occured_in_form&&(b.shiftKey&&b.character=="f");return a;},shouldToggleVisibility:function(b){var a=!b.occured_in_form&&(b.ctrlKey&&(b.character=="'"||b.keyCode==222));return a;},"z-index":255,color:"#F00",centered:true,prependGutter:false,appendGutter:false,gutter:16,vDivisions:6,hDivisions:4,marginTop:0,marginLeft:"18px",marginRight:"18px",width:464,minWidth:464,maxWidth:null,lineHeight:16,lineStyle:"solid",lineWidth:"1px",lineColor:"#555"};ModularGrid.Grid={showing:false,fontGridShowing:false,fontGridParentElement:null,horizontalGridShowing:false,horizontalGridParentElement:null,verticalGridShowing:false,verticalGridParentElement:null,params:null,eventSender:null,init:function(a){this.params=ModularGrid.Utils.createParams(this.defaults,a);this.eventSender=new ModularGrid.Utils.EventSender();},createParentElement:function(b){var a=ModularGrid.Utils.getDocumentBodyElement();a.appendChild(this.createVerticalGridParentElement(b));a.appendChild(this.createHorizontalGridParentElement(b));a.appendChild(this.createFontGridParentElement(b));return a;},opacityHandler:function(){ModularGrid.OpacityChanger.changeElementOpacity(ModularGrid.Grid.fontGridParentElement);ModularGrid.OpacityChanger.changeElementOpacity(ModularGrid.Grid.verticalGridParentElement);ModularGrid.OpacityChanger.changeElementOpacity(ModularGrid.Grid.horizontalGridParentElement);},createVerticalGridParentElement:function(a){this.verticalGridParentElement=document.createElement("div");this.verticalGridParentElement.setAttribute("style",ModularGrid.Utils.createStyleValue({position:"absolute",left:"0",top:"0",display:"none",height:ModularGrid.Utils.getClientHeight()+"px",width:"100%",opacity:ModularGrid.OpacityChanger.params.opacity,"z-index":a["z-index"]}));this.updateVerticalGridContents();return this.verticalGridParentElement;},updateVerticalGridContents:function(){html=ModularGrid.Grid.createVerticalGridHTML(ModularGrid.Grid.params);ModularGrid.Grid.verticalGridParentElement.innerHTML=html;},createVerticalGridHTML:function(f){var j="";var k=(typeof(f.width)=="string"&&f.width.substr(f.width.length-1)=="%");var b=(k?f.minWidth:f.width);var h=f.vDivisions-1;(f.prependGutter?h++:null);(f.appendGutter?h++:null);var a=(f.gutter/b)*100;var e=(100-h*a)/f.vDivisions;var m=(f.prependGutter?a:0);var l={position:"relative","float":"left","margin-right":"-"+e+"%",width:e+"%",height:ModularGrid.Utils.getClientHeight()+"px",background:f.color,opacity:f.opacity};for(var g=f.vDivisions;g--;){l.left=m+"%";j+='<div style="'+ModularGrid.Utils.createStyleValue(l)+'"></div>';m+=a+e;}var d={width:(k?f.width:b+"px")};if(k){if(f.maxWidth){d["max-width"]=f.maxWidth+"px";}if(f.minWidth){d["min-width"]=f.minWidth+"px";}else{alert("Ошибка: не задан параметр minWidth\nСетка может отображаться некорректно\n\nЧтобы сетка отображалась корректно, задайте параметр minWidth");}}if(f.centered){var n={"text-align":"center"};d.margin="0 auto";j='<div style="'+ModularGrid.Utils.createStyleValue(n)+'"><div style="'+ModularGrid.Utils.createStyleValue(d)+'">'+j+"</div></div>";}else{j='<div style="'+ModularGrid.Utils.createStyleValue(d)+'">'+j+"</div>";}var c={width:"auto",padding:"0 "+f.marginRight+" 0 "+f.marginLeft};j='<div style="'+ModularGrid.Utils.createStyleValue(c)+'">'+j+"</div>";return j;},createHorizontalGridParentElement:function(a){this.horizontalGridParentElement=document.createElement("div");var b=ModularGrid.Utils.createStyleValue({position:"absolute",left:"0",top:"0",display:"none",height:ModularGrid.Utils.getClientHeight()+"px",width:"100%",opacity:ModularGrid.OpacityChanger.params.opacity,"z-index":a["z-index"]});this.horizontalGridParentElement.setAttribute("style",b);this.updateHorizontalGridContents();return this.horizontalGridParentElement;},updateHorizontalGridContents:function(){html=ModularGrid.Grid.createHorizontalGridHTML(ModularGrid.Grid.params);ModularGrid.Grid.horizontalGridParentElement.innerHTML=html;},createHorizontalGridHTML:function(g){var d="";var a=ModularGrid.Utils.getClientHeight();var h=g.marginTop;var c=0;var b=g.hDivisions+1;var f=g.lineHeight*g.hDivisions;var e={position:"absolute",width:"auto",left:g.marginLeft,right:g.marginRight,height:f+"px",background:g.color,opacity:g.opacity};while(h<a){if(c==0&&(h+f)<a){e.top=h+"px";d+='<div style="'+ModularGrid.Utils.createStyleValue(e)+'"></div>';}h+=g.lineHeight;c++;if(c==b){c=0;}}return d;},createFontGridParentElement:function(a){this.fontGridParentElement=document.createElement("div");var b=ModularGrid.Utils.createStyleValue({position:"absolute",left:"0",top:"0",display:"none",height:ModularGrid.Utils.getClientHeight()+"px",width:"100%",opacity:ModularGrid.OpacityChanger.params.opacity,"z-index":a["z-index"]});this.fontGridParentElement.setAttribute("style",b);this.updateFontGridContents();return this.fontGridParentElement;},updateFontGridContents:function(){html=ModularGrid.Grid.createFontGridHTML(ModularGrid.Grid.params);ModularGrid.Grid.fontGridParentElement.innerHTML=html;},createFontGridHTML:function(d){var c="";var a=ModularGrid.Utils.getClientHeight();var e=d.marginTop+d.lineHeight;var b={position:"absolute",height:0,opacity:d.opacity,"border-bottom":d.lineWidth+" "+d.lineStyle+" "+d.lineColor+" !important"};while(e<a){b.top=(e+"px");c+='<div style="'+ModularGrid.Utils.createStyleValue(b)+'"></div>';e+=d.lineHeight;}return c;},toggleVisibility:function(){this.showing=!this.showing;this.fontGridShowing=this.showing;this.eventSender.occurEvent("fontVisibilityChanged",this.fontGridShowing);this.horizontalGridShowing=this.showing;this.eventSender.occurEvent("horizontalVisibilityChanged",this.horizontalGridShowing);this.verticalGridShowing=this.showing;this.eventSender.occurEvent("verticalVisibilityChanged",this.verticalGridShowing);this.eventSender.occurEvent("visibilityChanged",this.showing);this.updateFontGridVisibility();this.updateHorizontalGridVisibility();this.updateVerticalGridVisibility();},updateFontGridVisibility:function(){if(this.fontGridShowing&&this.fontGridParentElement==null){this.createParentElement(this.params);}if(this.fontGridParentElement){this.fontGridParentElement.style.display=(this.fontGridShowing?"block":"none");}},updateHorizontalGridVisibility:function(){if(this.horizontalGridShowing&&this.horizontalGridParentElement==null){this.createParentElement(this.params);}if(this.horizontalGridParentElement){this.horizontalGridParentElement.style.display=(this.horizontalGridShowing?"block":"none");}},updateVerticalGridVisibility:function(){if(this.verticalGridShowing&&this.verticalGridParentElement==null){this.createParentElement(this.params);}if(this.verticalGridParentElement){this.verticalGridParentElement.style.display=(this.verticalGridShowing?"block":"none");}},toggleHorizontalGridVisibility:function(a){this.horizontalGridShowing=!this.horizontalGridShowing;if(!a){this.eventSender.occurEvent("horizontalVisibilityChanged",this.horizontalGridShowing);}this.updateShowing(a);this.updateHorizontalGridVisibility();},toggleVerticalGridVisibility:function(a){this.verticalGridShowing=!this.verticalGridShowing;if(!a){this.eventSender.occurEvent("verticalVisibilityChanged",this.verticalGridShowing);}this.updateShowing(a);this.updateVerticalGridVisibility();},toggleFontGridVisibility:function(a){this.fontGridShowing=!this.fontGridShowing;if(!a){this.eventSender.occurEvent("fontVisibilityChanged",this.fontGridShowing);}this.updateShowing(a);this.updateFontGridVisibility();},updateShowing:function(a){this.showing=this.fontGridShowing||this.horizontalGridShowing||this.verticalGridShowing;if(!a){this.eventSender.occurEvent("visibilityChanged",this.showing);}}};ModularGrid.Resizer={};ModularGrid.Resizer.defaults={shouldToggleSize:function(b){var a=!b.occured_in_form&&(b.shiftKey&&b.character=="r");return a;},changeTitle:true,sizes:[]};ModularGrid.Resizer={params:null,sizes:null,currentSizeIndex:null,title:null,eventSender:null,detectDefaultSize:function(){var a=null;if(typeof(window.innerWidth)=="number"&&typeof(window.innerHeight)=="number"){a={width:window.innerWidth,height:window.innerHeight};}else{if(document.documentElement&&(document.documentElement.clientWidth||document.documentElement.clientHeight)){a={width:document.documentElement.clientWidth,height:document.documentElement.clientHeight};}else{if(document.body&&(document.body.clientWidth||document.body.clientHeight)){a={width:document.body.clientWidth,height:document.body.clientHeight};}}}return a;},getDefaultSize:function(){return this.sizes[0];},getCurrentSize:function(){return this.sizes[this.currentSizeIndex];},init:function(g,c){this.params=ModularGrid.Utils.createParams(this.defaults,g);this.eventSender=new ModularGrid.Utils.EventSender();var f=this.detectDefaultSize();if(f){var e=[f],a=this.params.sizes;if(a.length){for(var b=0,d=a.length;b<d;b++){e[e.length]=a[b];}}else{if(c.params.minWidth){e[e.length]={width:c.params.minWidth};}}if(e.length>1){if(this.params.changeTitle){this.title=document.title;}this.sizes=e;this.currentSizeIndex=0;}}},sizeTitle:function(d){var b,f=this.sizes[d],c=this.sizes[0];if(f.title){b=f.title;}else{var e=(f.width?f.width:c.width);var a=(f.height?f.height:c.height);b=e+"×"+a;}return b;},selectSize:function(a){this.currentSizeIndex=a;this.applySize();},toggleSize:function(){if(this.currentSizeIndex!=null){this.currentSizeIndex++;this.currentSizeIndex=(this.currentSizeIndex==this.sizes.length?0:this.currentSizeIndex);this.applySize();}},applySize:function(){var c=(this.getCurrentSize().width?this.getCurrentSize().width:this.getDefaultSize().width);var a=(this.getCurrentSize().height?this.getCurrentSize().height:this.getDefaultSize().height);window.resizeTo(c,a);if(this.params.changeTitle){var b=(this.currentSizeIndex?this.title+" ("+c+"×"+a+")":this.title);if(this.getCurrentSize().title){b=this.getCurrentSize().title;}document.title=b;}this.eventSender.occurEvent("sizeChanged",this.currentSizeIndex);}};ModularGrid.GUI={params:null,togglerElement:null,paneElement:null,paneShowing:true,checkboxes:{},init:function(a){this.params=ModularGrid.Utils.createParams(this.defaults,a);},create:function(){this.createToggler();this.createPane();},createToggler:function(){var b=this;b.togglerElement=document.createElement("button");b.togglerElement.innerHTML=b.params.toggler.label;var a=ModularGrid.Utils.createStyleValue(b.params.toggler.style,{});b.togglerElement.setAttribute("style",a);ModularGrid.Utils.getDocumentBodyElement().appendChild(b.togglerElement);b.togglerElement.onclick=function(){b.paneShowing=!b.paneShowing;b.paneElement.style.display=(b.paneShowing?"block":"none");};},createPaneCheckboxItemHTML:function(e,b,d){var a=d||"";var c='<div style="width:auto;'+a+'">';c+='<input type="checkbox" id="'+e+'">';c+='<label for="'+e+'">&nbsp;'+b+"</label>";c+="</div>";return c;},createPane:function(){var b=this;b.paneElement=document.createElement("div");var c=b.params.pane.style;var a=ModularGrid.Utils.createStyleValue(c,{});b.paneElement.setAttribute("style",a);var g={},e="";g.guides=b.generateId()+"guides";e+=b.createPaneCheckboxItemHTML(g.guides,b.params.pane.labels.guides);g.grid=b.generateId()+"grid";e+=b.createPaneCheckboxItemHTML(g.grid,b.params.pane.labels.grid.all,"margin:1em 0 0");g.font_grid=b.generateId()+"fontgrid";e+=b.createPaneCheckboxItemHTML(g.font_grid,b.params.pane.labels.grid.font,"padding:0 0 0 1em");g.vertical_grid=b.generateId()+"verticalgrid";e+=b.createPaneCheckboxItemHTML(g.vertical_grid,b.params.pane.labels.grid.vertical,"padding:0 0 0 1em");g.horizontal_grid=b.generateId()+"horizontalgrid";e+=b.createPaneCheckboxItemHTML(g.horizontal_grid,b.params.pane.labels.grid.horizontal,"padding:0 0 1em 1em");g.image=b.generateId()+"image";e+=b.createPaneCheckboxItemHTML(g.image,b.params.pane.labels.image,"margin:0 0 1em");if(ModularGrid.Resizer.sizes.length){e+='<div style="width:auto">';g.sizes=b.generateId()+"sizes";e+='<select size="1" id="'+g.sizes+'"><option>'+this.params.pane.labels.size+"</option></select>";e+="</div>";}e+='<div style="width:auto;margin:1em 0 0">';g.opacity_down=b.generateId()+"opacitydown";g.opacity_up=b.generateId()+"opacityup";g.opacity_value=b.generateId()+"opacityvalue";if(b.params.pane.labels.opacity){e+=b.params.pane.labels.opacity+"<br>";}e+='<button id="'+g.opacity_down+'">-</button>&nbsp;';e+='<span id="'+g.opacity_value+'">'+ModularGrid.OpacityChanger.params.opacity.toFixed(2)+"</span>";e+='&nbsp;<button id="'+g.opacity_up+'">+</button>';e+="</div>";b.paneElement.innerHTML=e;ModularGrid.Utils.getDocumentBodyElement().appendChild(this.paneElement);b.checkboxes.guides=document.getElementById(g.guides);if(b.checkboxes.guides){b.checkboxes.guides.onclick=function(){ModularGrid.Guides.toggleVisibility();};ModularGrid.Guides.eventSender.addHandler("visibilityChanged",function(i){b.checkboxes.guides.checked=i;});}b.checkboxes.grid=document.getElementById(g.grid);if(b.checkboxes.grid){b.checkboxes.grid.onclick=function(){ModularGrid.Grid.toggleVisibility();};ModularGrid.Grid.eventSender.addHandler("visibilityChanged",function(i){b.checkboxes.grid.checked=i;});}b.checkboxes.font_grid=document.getElementById(g.font_grid);if(b.checkboxes.font_grid){b.checkboxes.font_grid.onclick=function(){ModularGrid.Grid.toggleFontGridVisibility();};ModularGrid.Grid.eventSender.addHandler("fontVisibilityChanged",function(i){b.checkboxes.font_grid.checked=i;});}b.checkboxes.vertical_grid=document.getElementById(g.vertical_grid);if(b.checkboxes.vertical_grid){b.checkboxes.vertical_grid.onclick=function(){ModularGrid.Grid.toggleVerticalGridVisibility();};ModularGrid.Grid.eventSender.addHandler("verticalVisibilityChanged",function(i){b.checkboxes.vertical_grid.checked=i;});}b.checkboxes.horizontal_grid=document.getElementById(g.horizontal_grid);if(b.checkboxes.horizontal_grid){b.checkboxes.horizontal_grid.onclick=function(){ModularGrid.Grid.toggleHorizontalGridVisibility();};ModularGrid.Grid.eventSender.addHandler("horizontalVisibilityChanged",function(i){b.checkboxes.horizontal_grid.checked=i;});}b.checkboxes.image=document.getElementById(g.image);if(b.checkboxes.image){b.checkboxes.image.onclick=function(){ModularGrid.Image.toggleVisibility();};ModularGrid.Image.eventSender.addHandler("visibilityChanged",function(i){b.checkboxes.image.checked=i;});}b.checkboxes.sizes=document.getElementById(g.sizes);if(b.checkboxes.sizes){var f="";for(var d=0,h=ModularGrid.Resizer.sizes.length;d<h;d++){f+="<option>"+ModularGrid.Resizer.sizeTitle(d)+"</option>";}b.checkboxes.sizes.innerHTML+=f;b.checkboxes.sizes.onchange=function(){ModularGrid.Resizer.selectSize(b.checkboxes.sizes.selectedIndex-1);};ModularGrid.Resizer.eventSender.addHandler("sizeChanged",function(i){b.checkboxes.sizes.selectedIndex=i+1;});}b.checkboxes.opacity_value=document.getElementById(g.opacity_value);if(b.checkboxes.opacity_value){ModularGrid.OpacityChanger.eventSender.addHandler("opacityChanged",function(i){b.checkboxes.opacity_value.innerHTML=i.toFixed(2);});}b.checkboxes.opacity_up=document.getElementById(g.opacity_up);if(b.checkboxes.opacity_up){b.checkboxes.opacity_up.onclick=function(){ModularGrid.OpacityChanger.stepUpOpacity();};}b.checkboxes.opacity_down=document.getElementById(g.opacity_down);if(b.checkboxes.opacity_down){b.checkboxes.opacity_down.onclick=function(){ModularGrid.OpacityChanger.stepDownOpacity();};}},generateId:function(){var b="_mdg",a=new Date();a=b+a.getTime();return a;}};ModularGrid.GUI.defaults={toggler:{style:{position:"absolute",right:"10px",top:"10px","z-index":1000},label:"Настройки сетки"},pane:{style:{position:"absolute",right:"10px",top:"35px",width:"auto",height:"auto",margin:"0",padding:"7px 5px",background:"#FFF",border:"2px solid #CCC","z-index":1000},labels:{guides:'гайды <span style="color:#555;font-size:80%;margin-left:0.75em">Ctrl + ;</span>',size:"выберите размер (Shift + r)",grid:{all:'сетка <span style="color:#555;font-size:80%;margin-left:0.75em">Ctrl + \'</span>',font:'шрифтовая <span style="color:#555;font-size:80%;margin-left:0.75em">Shift + f</span>',vertical:'вертикальная <span style="color:#555;font-size:80%;margin-left:0.75em">Shift + v</span>',horizontal:'горизонтальная <span style="color:#555;font-size:80%;margin-left:0.75em">Shift + h</span>'},image:'изображение-макет <span style="color:#555;font-size:80%;margin-left:0.75em">Ctrl + \\</span>',opacity:"прозрачность"}}};ModularGrid.keyDownEventProvider=null;ModularGrid.resizeEventProvider=null;ModularGrid.getResizeEventProvider=function(){if(this.resizeEventProvider==null){this.resizeEventProvider=new ModularGrid.Utils.EventProvider("resize",function(a){return{event:a};},"window");}return this.resizeEventProvider;};ModularGrid.getKeyDownEventProvider=function(){if(this.keyDownEventProvider==null){this.keyDownEventProvider=new ModularGrid.Utils.EventProvider("keydown",function(c){var b=(c||window.event);var e=(b.keyCode?b.keyCode:(b.which?b.which:b.keyChar));var d=String.fromCharCode(e).toLowerCase();var f={"`":"~","1":"!","2":"@","3":"#","4":"$","5":"%","6":"^","7":"&","8":"*","9":"(","0":")","-":"_","=":"+",";":":","'":'"',",":"<",".":">","/":"?","\\":"|"};if(b.shiftKey&&f[d]){d=f[d];}var a=(b.target?b.target:b.srcElement);if(a&&a.nodeType==3){a=a.parentNode;}var g=(a&&(a.tagName=="INPUT"||a.tagName=="TEXTAREA"));return{occured_in_form:g,character:d,keyCode:e,altKey:b.altKey,shiftKey:b.shiftKey,ctrlKey:b.ctrlKey,event:b};});}return this.keyDownEventProvider;};ModularGrid.init=function(f){var m=this;var k=ModularGrid.Utils.CookieStore;this.OpacityChanger.init(f.opacity);var i=new ModularGrid.Utils.StateChanger(this.getKeyDownEventProvider(),this.OpacityChanger.params.shouldStepUpOpacity,function(){m.OpacityChanger.stepUpOpacity();});var j=new ModularGrid.Utils.StateChanger(this.getKeyDownEventProvider(),this.OpacityChanger.params.shouldStepDownOpacity,function(){m.OpacityChanger.stepDownOpacity();});this.OpacityChanger.eventSender.addHandler("opacityChanged",function(n){k.setValue("o",n);});this.Image.init(f.image);this.OpacityChanger.eventSender.addHandler("opacityChanged",this.Image.opacityHandler);var b=new ModularGrid.Utils.StateChanger(this.getKeyDownEventProvider(),this.Image.params.shouldToggleVisibility,function(){m.Image.toggleVisibility();});m.Guides.init(f.guides);var g=new ModularGrid.Utils.StateChanger(m.getKeyDownEventProvider(),m.Guides.params.shouldToggleVisibility,function(){m.Guides.toggleVisibility();});m.Guides.eventSender.addHandler("visibilityChanged",function(n){k.setValue("g",n);});this.Grid.init(f.grid);this.OpacityChanger.eventSender.addHandler("opacityChanged",this.Grid.opacityHandler);var a=new ModularGrid.Utils.StateChanger(this.getKeyDownEventProvider(),this.Grid.params.shouldToggleVisibility,function(){m.Grid.toggleVisibility();});m.Grid.eventSender.addHandler("visibilityChanged",function(n){k.setValue("v",m.Grid.verticalGridShowing);k.setValue("h",m.Grid.horizontalGridShowing);k.setValue("f",m.Grid.fontGridShowing);});var e=new ModularGrid.Utils.StateChanger(this.getKeyDownEventProvider(),this.Grid.params.shouldToggleFontGridVisibility,function(){m.Grid.toggleFontGridVisibility();});m.Grid.eventSender.addHandler("fontVisibilityChanged",function(n){k.setValue("f",m.Grid.fontGridShowing);});var d=new ModularGrid.Utils.StateChanger(this.getKeyDownEventProvider(),this.Grid.params.shouldToggleHorizontalGridVisibility,function(){m.Grid.toggleHorizontalGridVisibility();});m.Grid.eventSender.addHandler("horizontalVisibilityChanged",function(n){k.setValue("h",m.Grid.horizontalGridShowing);});var h=new ModularGrid.Utils.StateChanger(this.getKeyDownEventProvider(),this.Grid.params.shouldToggleVerticalGridVisibility,function(){m.Grid.toggleVerticalGridVisibility();});m.Grid.eventSender.addHandler("verticalVisibilityChanged",function(n){k.setValue("v",m.Grid.verticalGridShowing);});m.Resizer.init(f.resizer,m.Grid);var l=new ModularGrid.Utils.StateChanger(m.getKeyDownEventProvider(),m.Resizer.params.shouldToggleSize,function(){m.Resizer.toggleSize();});ModularGrid.getResizeEventProvider().addHandler(function(o){var n=ModularGrid.Utils.getClientHeight()+"px";ModularGrid.Utils.updateCSSHeight(ModularGrid.Grid.horizontalGridParentElement,n,ModularGrid.Grid.updateHorizontalGridContents);ModularGrid.Utils.updateCSSHeight(ModularGrid.Grid.fontGridParentElement,n,ModularGrid.Grid.updateFontGridContents);ModularGrid.Utils.updateCSSHeight(ModularGrid.Grid.verticalGridParentElement,n,ModularGrid.Grid.updateVerticalGridContents);ModularGrid.Utils.updateCSSHeight(ModularGrid.Guides.parentElement,n);});m.GUI.init(f.gui);m.GUI.create();if(k.getValue("i")=="true"){m.Image.toggleVisibility();}var c=parseFloat(k.getValue("o"));if(!isNaN(c)){m.OpacityChanger.setOpacity(c);}if(k.getValue("g")=="true"){m.Guides.toggleVisibility();}if(k.getValue("v")=="true"){m.Grid.toggleVerticalGridVisibility(true);}if(k.getValue("h")=="true"){m.Grid.toggleHorizontalGridVisibility(true);}if(k.getValue("f")=="true"){m.Grid.toggleFontGridVisibility(true);}m.Grid.updateShowing(true);};/** @include "index.js" */

/**
 * Настройки.
 *
 * Любые настройки ниже - настройки по-умолчанию, вы можете удалить их,
 * если они вам не нужны.
 */
ModularGrid.init(
	{
		// настройки гайдов
		guides: {
			/**
			 * Функция вызывается каждый раз при нажатии клавиш в браузере.
			 * @param {Object} params информация о нажатой комбинации клавиш (params.ctrlKey, params.altKey, params.keyCode)
			 * @return {Boolean} true, если нужно показать/скрыть направляющие
			 */
			shouldToggleVisibility:
				function (params) {
					// Ctrl + ;
					var result = !params.occured_in_form && (params.ctrlKey && (params.character == ';' || params.keyCode == 186));
					return result;
				},

			/**
			 * Стиль линий-направляющих.
			 * Значения аналогичны значениям CSS-свойства border-style.
			 * @type String
			 */
			lineStyle: 'solid',
			/**
			 * Цвет линий-направляющих.
			 * Значения аналогичны значениям CSS-свойства border-color.
			 * @type String
			 */
			lineColor: '#9dffff',
			/**
			 * Толщина линий-направляющих.
			 * Значения аналогичны значениям CSS-свойства border-width.
			 * @type String
			 */
			lineWidth: '1px',

			/**
			 * значения CSS-свойства z-index HTML-контейнера всех направляющих
			 * @type Number
			 */
			'z-index': 255,

			/**
			 * Массив настроек направляющих (задается в формате items:[{настройки-1},{настройки-2},...,{настройки-N}]).
			 * @type Array
			 */
			items: [
				{
					/**
					 * Две центрированные направляющие
					 *
					 * Ширина задается параметром width (значения аналогичны значениям CSS-свойства width),
					 * две направляющие рисуются слева и справа от центрированной области заданной ширины.
					 */
					type: 'center',
					width: '600px'
				},
				{
					/**
					 * Одна вертикальная направляющая
					 *
					 * Можно задать либо отступ от левого края рабочей области браузера параметром left,
					 * либо отступ от правого края рабочей области браузера параметром right.
					 * Значения параметров аналогичны значениям CSS-свойства left.
					 */
					type: 'vertical',
					left: '33%'
				},
				{
					/**
					 * Одна горизонтальная направляющая
					 *
					 * Можно задать либо отступ от верхнего края рабочей области браузера параметром top,
					 * либо отступ от нижнего края рабочей области браузера параметром bottom.
					 * Значения параметров аналогичны значениям CSS-свойства top.
					 */
					type: 'horizontal',
					top: '48px'
				}
			]
		},

		grid: {
			/**
			 * Функция вызывается каждый раз при нажатии клавиш в браузере.
			 * @param {Object} params информация о нажатой комбинации клавиш (params.ctrlKey, params.altKey, params.keyCode)
			 * @return {Boolean} true, если нужно показать/скрыть вертикальную сетку
			 */
			shouldToggleVerticalGridVisibility:
				function (params) {
					// Shift + v
					var result = !params.occured_in_form && (params.shiftKey && params.character == 'v' );
					return result;
				},

			/**
			 * Функция вызывается каждый раз при нажатии клавиш в браузере.
			 * @param {Object} params информация о нажатой комбинации клавиш (params.ctrlKey, params.altKey, params.keyCode)
			 * @return {Boolean} true, если нужно показать/скрыть горизонтальную сетку
			 */
			shouldToggleHorizontalGridVisibility:
				function (params) {
					// Shift + h
					var result = !params.occured_in_form && (params.shiftKey && params.character == 'h' );
					return result;
				},

			/**
			 * Функция вызывается каждый раз при нажатии клавиш в браузере.
			 * @param {Object} params информация о нажатой комбинации клавиш (params.ctrlKey, params.altKey, params.keyCode)
			 * @return {Boolean} true, если нужно показать/скыть шрифтовую сетку
			 */
			shouldToggleFontGridVisibility:
				function (params) {
					// Shift + f
					var result = !params.occured_in_form && (params.shiftKey && params.character == 'f' );
					return result;
				},

			/**
			 * Функция вызывается каждый раз при нажатии клавиш в браузере.
			 * @param {Object} params информация о нажатой комбинации клавиш (params.ctrlKey, params.altKey, params.keyCode)
			 * @return {Boolean} true, если нужно показать/скрыть сетку целиком
			 */
			shouldToggleVisibility:
				function (params) {
					// Ctrl + '
					// скрывает если хотя бы один из элементов сетки показан (шрифтовая, колонки или строки)
					var result = !params.occured_in_form && (params.ctrlKey && (params.character == "'" || params.keyCode == 222));
					return result;
				},

			'z-index': 255,

			/**
			 * Цвет фона колонок и строк модульной сетки.
			 * Цвет линий шрифтовой сетки задаётся отдельно.
			 * @see lineColor
			 * @type String
			 */
			color: "#F00",

			/**
			 * Центрировать ли сетку
			 * @type Boolean
			 */
			centered: true,

			prependGutter: false,
			appendGutter: false,

			gutter: 16,

			/**
			 * Количество вертикальных модулей (столбцов сетки)
			 * @see lineHeight
			 * @type Number
			 */
			vDivisions: 3,

			/**
			 * Высота строки модульной сетки в строках модульной сетки.
			 * @see lineHeight
			 * @type Number
			 */
			hDivisions: 3,

			/**
			 * Отступ от верхнего края рабочей области браузера до шрифтовой и горизонтальной сетки в пикселах.
			 * @type Number
			 */
			marginTop: 0,
			/**
			 * Отступ от левого края рабочей области браузера до сетки.
			 * Значения аналогичны значениям CSS-свойства margin-left
			 * @type Number
			 */
			marginLeft: '0px',
			/**
			 * Отступ от правого края рабочей области браузера до сетки.
			 * Значения аналогичны значениям CSS-свойства margin-right
			 * @type Number
			 */
			marginRight: '0px',

			/**
			 * Ширина контейнера с сеткой.
			 * Для резиновой сетки задавать как '100%' и обязательно указывать minWidth
			 * Для сетки с фиксированной шириной указывать только число, например 640 для ширины 640 пикселов
			 * @type Number
			 */
			width: 600,
			/**
			 * Минимальная ширина контейнера с сеткой.
			 * Указывать только число, например 640 для ширины 640 пикселов
			 * @type Number
			 */
			minWidth: null,
			/**
			 * Максимальная ширина контейнера с сеткой.
			 * Указывать только число, например 1240 для ширины 1240 пикселов
			 * @type Number
			 */
			maxWidth: null,

			/**
			 * Высота строки в пикселах.
			 * Используется для рисования шрифтовой сетки.
			 * Сама линия сетки начинает рисоваться на (lineHeight + 1) пикселе
			 * @type Number
			 */
			lineHeight: 16,

			// стиль линий шрифтовой сетки
			/**
			 * Стиль линий шрифтовой сетки.
			 * Значения аналогичны значениям CSS-свойства border-style
			 * @type String
			 */
			lineStyle: 'solid',
			/**
			 * Толщина линий шрифтовой сетки.
			 * Значения аналогичны значениям CSS-свойства border-width
			 * @type String
			 */
			lineWidth: '1px',
			/**
			 * Цвет линий шрифтовой сетки.
			 * Значения аналогичны значениям CSS-свойства border-color
			 * @type String
			 */
			lineColor: "#555"
		},

		resizer: {
			/**
			 * Функция вызывается каждый раз при нажатии клавиш в браузере.
			 * @param {Object} params информация о нажатой комбинации клавиш (params.ctrlKey, params.altKey, params.keyCode)
			 * @return {Boolean} true, если нужно изменить размер на следующий из заданных
			 */
			shouldToggleSize:
				function (params) {
					// Shift + r
					var result = !params.occured_in_form && (params.shiftKey && params.character == 'r');
					return result;
				},

			/**
			 * Нужно ли в title окна указывать разрешение
			 * @type Boolean
			 */
			changeTitle: true,

			sizes:
				[
					{
						width: 640,
						height: 480
					},
					{
						width: 800,
						height: 600
					},
					{
						width: 1024,
						height: 768
					},
					{
						width: 1280,
						height: 1024
					}
				]
		},

		// настройки макета-изображения
		image: {
			/**
			 * Функция вызывается каждый раз при нажатии клавиш в браузере.
			 * @param {Object} params информация о нажатой комбинации клавиш (params.ctrlKey, params.altKey, params.keyCode)
			 * @return {Boolean} true, если нужно показать/скрыть изображение
			 */
			shouldToggleVisibility:
				function (params) {
					// Ctrl + \
					var result = !params.occured_in_form && (params.ctrlKey && (params.character == '\\' || params.keyCode == 28 || params.keyCode == 220));
					return result;
				},

			/**
			 * Значения CSS-свойства z-index HTML-контейнера изображения
			 * @type Number
			 */
			'z-index': 255,

			/**
			 * Начальное значение прозрачности изображения от 0 до 1 (0 - абсолютно прозрачное, 1 - абсолютно непрозрачное)
			 * @type Number
			 */
			opacity: 0.85,
			/**
			 * Шаг изменения значения прозрачности для изображения от 0 до 1
			 * @type Number
			 */
			opacityStep: 0.05,

			/**
			 * Центрировать ли изображение относительно ширины рабочей области браузера
			 * @type Boolean
			 */
			centered: true,

			/**
			 * Отступ от верхнего края рабочей области браузера до изображения в пикселах
			 * @type Number
			 */
			marginTop: 100,
			/**
			 * Отступ от левого края рабочей области браузера до изображения.
			 * Возможные значения аналогичны значениям CSS-свойства margin-left
			 * @type Number
			 */
			marginLeft: '0px',
			/**
			 * Отступ от правого края рабочей области браузера до изображения.
			 * Возможные значения аналогичны значениям CSS-свойства margin-left
			 * @type Number
			 */
			marginRight: '0px',

			/**
			 * URL файла изображения
			 * @type String
			 */
			src: 'design.png',

			/**
			 * Ширина изображения в пикселах
			 * @type Number
			 */
			width: 300,
			/**
			 * Высота изображения в пикселах
			 * @type Number
			 */
			height: 356
		},

		opacity: {
			/**
			 * Функция вызывается каждый раз при нажатии клавиш в браузере.
			 * @param {Object} params информация о нажатой комбинации клавиш (params.ctrlKey, params.altKey, params.keyCode)
			 * @return {Boolean} true, если нужно сделать изображение менее прозрачным на opacityStep процентов
			 */
			shouldStepUpOpacity:
				function (params) {
					// Shift + ]
					var result = !params.occured_in_form && (params.shiftKey && params.keyCode == 221);
					return result;
				},
			/**
			 * Функция вызывается каждый раз при нажатии клавиш в браузере.
			 * @param {Object} params информация о нажатой комбинации клавиш (params.ctrlKey, params.altKey, params.keyCode)
			 * @return {Boolean} true, если нужно сделать изображение более прозрачным на opacityStep процентов
			 */
			shouldStepDownOpacity:
				function (params) {
					// Shift + [
					var result = !params.occured_in_form && (params.shiftKey && params.keyCode == 219);
					return result;
				},

			/**
			 * Начальное значение прозрачности изображения от 0 до 1 (0 - абсолютно прозрачное, 1 - абсолютно непрозрачное)
			 * @type Number
			 */
			opacity: 0.25,
			/**
			 * Шаг изменения значения прозрачности для изображения от 0 до 1
			 * @type Number
			 */
			opacityStep: 0.05
		},

		gui: {
			toggler: {
				style: {
					position: "absolute",
					right: '10px',
					top: '10px',
					'z-index': 1000
				},

				label: "Настройки сетки"
			},

			pane: {
				style: {
					position: "absolute",
					right: '10px',
					top: '35px',

					width: 'auto',
					height: 'auto',

					margin: '0',
					padding: '7px 5px',

					background: '#FFF',
					border: '2px solid #CCC',

					'z-index': 1000
				},

				labels: {
					guides: 'гайды <span style="color:#555;font-size:80%;margin-left:0.75em">Ctrl + ;</span>',
					size: 'выберите размер (Shift + r)',
					grid: {
						all: 'сетка <span style="color:#555;font-size:80%;margin-left:0.75em">Ctrl + \'</span>',
						font: 'шрифтовая <span style="color:#555;font-size:80%;margin-left:0.75em">Shift + f</span>',
						vertical: 'вертикальная <span style="color:#555;font-size:80%;margin-left:0.75em">Shift + v</span>',
						horizontal: 'горизонтальная <span style="color:#555;font-size:80%;margin-left:0.75em">Shift + h</span>'
					},
					image: 'изображение-макет <span style="color:#555;font-size:80%;margin-left:0.75em">Ctrl + \</span>',
					opacity: 'прозрачность'
				}
			}
		}

	}
);