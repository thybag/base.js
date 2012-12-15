 /**
 * Base provides a set of simple but often useful javaScript functions.
 * @author Carl Saggs
 * @version 0.6.2 Alpha
 * @source https://github.com/thybag/base.js
 *
 * @module Base.animation for animation methods
 */
(function(){
	/**
	 * classMatch
	 * Does this node have a class contained the the provided array
	 * @param node DOM Node
	 * @param validArray Array of Class Names
	 */
	this.classMatch = function(node,validArray){
		//Helper method for Jsnip
		for(var v=0;v<validArray.length;v++){
				if(this.hasClass(node,validArray[v])) return validArray[v];
		}
	}
	/**
	 * addClass
	 * add's a CSS class to a DOM node.
	 * @param node DOM Node
	 * @param nclass Name of class to apply
	 */
	this.addClass = function(node,nclass){
		if(!this.hasClass(node,nclass)){
			node.className = node.className+' '+nclass;
		}
	}
	/**
	 * removeClass
	 * removes a CSS class to a DOM node.
	 * @param node DOM Node
	 * @param nclass Name of class to remove
	 */
	this.removeClass = function(node,nclass){
		node.className = node.className.replace(new RegExp('(^|\\s)'+nclass+'(\\s|$)'),'');
		return;
	}
	/**
	 * hasClass
	 * Checks if a DOM node has a particular Class
	 * @param node DOM Node
	 * @param nclass Name of class to apply
	 * @return boolean
	 */
	this.hasClass = function(node, nclass){
		return (node.className.match(new RegExp('(^|\\s)'+nclass+'(\\s|$)')) != null);
	}
	/**
	 * prepend
	 * Add's one DOM node to the start of another.
	 * @param node DOM Node to add
	 * @param parent DOM Node to place first node in to
	 */
	this.prepend = function(node,parent){
		parent.insertBefore(node,parent.firstChild);
	}
	/**
	 * Remove
	 * Remove a node from the DOM
	 * @param node DOM Node to remove
	 * @return Copy of the removed node.
	 */
	this.remove = function(node){
		node.parentNode.removeChild(node);
	}
	/**
	 * Rotate
	 * Rotates a Node to a given angle
	 * @param node DOM Node
	 * @param rotation int 
	 */
	this.rotate = function(node,rotation){
		//This is just here becuse there are so many of em.
		node.style.MozTransform="rotate("+rotation+"deg)";
		node.style.WebkitTransform="rotate("+rotation+"deg)";
		node.style.OTransform="rotate("+rotation+"deg)";
		node.style.msTransform="rotate("+rotation+"deg)";
		node.style.Transform="rotate("+rotation+"deg)";
	}
	/**
	 * ajaxGet
	 * Untested and currently not in use.
	 * @param path to open
	 * @param callback fucntion
	 */
	this.ajaxGet = function(location,callback){
		try {var xmlhttp = window.XMLHttpRequest?new XMLHttpRequest(): new ActiveXObject("Microsoft.XMLHTTP");}  catch (e) { }
			xmlhttp.onreadystatechange = function(){
				if ((xmlhttp.readyState == 4) && (xmlhttp.status == 200)) {
					callback(xmlhttp.responseText);
				}
			}
			xmlhttp.open("GET", location, true);
			//Add standard AJAX header.
			xmlhttp.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
			xmlhttp.send(null);
	}
	/**
	 * ajaxGetJSON
	 * Gets a JSON file from the server and returns a JSON object
	 * @param path to JSON file.
	 * @param callback fucntion
	 */
	this.ajaxGetJSON = function(location,callback){
		var cback = callback;
		this.ajaxGet(location, function(json){
			if(JSON){
				var parsed = JSON.parse(json);
				cback(parsed);
			}
			//Fallback is disabled by default for securty reasons.
			//cback(eval('('+json+')'));
		});
	}
	/**
	 * Base.animate provides a set animation functions to the Jsnip Library
	 * @author Carl Saggs
	 * @version 0.3 Alpha
	 */
	this.animate = new function(){
		/**
		 * fadeIn
		 * Fade DOM node in.
		 * @param node DOM node
		 * @param callback function (optional)
		 * @param speed Animation Speed
		 */
		this.fadeIn = function(node, callback, speed){
		
			//Calcuate animation speed
			if(!speed){speed=275;}
			var incr  = 1/(speed/20); //Speed
			
			var cur_op = 0;
			node.style.opacity = 0;
			node.style.filter = 'alpha(opacity=0)';
			node.style.display = '';//Use deafult element style
			var interval = setInterval(function(){
				cur_op += incr;
				node.style.opacity = cur_op;
				node.style.filter = 'alpha(opacity='+(cur_op*100)+')';
				if((cur_op+incr) >= 1){
					//ensure fade was completed
					node.style.opacity = 1;
					node.style.filter = 'alpha(opacity=100)';
					
					clearInterval(interval);
					//Call callback function is one was provided
					if(callback !=null)	callback();
				}
			}, 20);
		}
		/**
		 * fadeOut
		 * Fade DOM node out.
		 * @param node DOM node
		 * @param callback function (optional)
		 * @param speed Animation Speed
		 */
		this.fadeOut = function(node, callback, speed){

			//Calcuate animation speed
			if(!speed){speed=275;}
			var incr  = 1/(speed/20); //Speed
		
			var cur_op = 1;
			node.style.opacity = 1;
			//IE
			node.style.filter = 'alpha(opacity=100)';
			var interval = setInterval(function(){
				cur_op -= incr;
				node.style.opacity = cur_op;
				node.style.filter = 'alpha(opacity='+(cur_op*100)+')';
				if((cur_op+incr) <= 0){
					//ensure fade was completed
					node.style.display = 'none';
					node.style.opacity = 1;
					node.style.filter = 'alpha(opacity=100)';
					
					clearInterval(interval);
					
					//Call callback function is one was provided
					if(callback !=null)	callback();
				}
			}, 20);
		}
		/**
		 * slideDown
		 * slide DOM node down
		 * @param node DOM node
		 * @param callback function (optional)
		 * @param time int (optional)
		 */
		this.slideDown = function(node,callback,time){
			node.style.display = 'block';
			node.parentNode.style.overflow = 'hidden';
			var cur_margin = -node.offsetHeight;
			//Auto timing (if none is provided)
			if(time == null){
				time = 24;
				if(node.offsetHeight < 100)time = 10;
				//if(node.offsetHeight < 50)time = 5;
			}
			var incr = parseInt(-cur_margin)/time;
			
			node.style.marginBottom = cur_margin+'px';
			var interval = setInterval(function(){
				cur_margin += incr;
				node.style.marginBottom = cur_margin+'px';
				if((cur_margin+incr) >= 0){
					//ensure fade was completed
					node.style.marginBottom = 0+'px';
					
					clearInterval(interval);
					
					//Call callback function is one was provided
					if(callback !=null)	callback();
				}
			}, 20);
			
		}
		/**
		 * slideUp
		 * slide DOM node up
		 * @param node DOM node
		 * @param callback function (optional)
		 * @param time int (optional)
		 */
		this.slideUp = function(node,callback,time){
			
			node.parentNode.style.overflow = 'hidden';
			var cur_margin = 0;
			var box_height = -node.offsetHeight;
			//Auto timing (if none is provided)
			if(time == null){
				time = 24;
				if(node.offsetHeight < 100)time = 10;
				//if(node.offsetHeight < 50)time = 5;
			}
			
			var incr = parseInt(-box_height)/time;
			//node.style.marginBottom = 0+'px';
			var interval = setInterval(function(){
				cur_margin -= incr;
				node.style.marginBottom = cur_margin+'px';
				if((cur_margin-incr) <= box_height){
					node.style.display = 'none';
					//ensure fade was completed
					node.style.marginBottom = 0+'px';
					
					clearInterval(interval);
					
					//Call callback function is one was provided
					if(callback !=null)	callback();
				}
			}, 20);
		}
		/**
		 * scrollTo
		 * Scroll to a given position in a node. (Y axis only)
		 * @param node DOM node
		 * @param distance from top pixels
		 * @param callback function (optional)
		 */
		
		this.scrollTo = function(node, position, callback){
			//Get current scroll position
			var toScroll = node.scrollY || node.pageYOffset;
			var direction = 'up';
			//Catch IE7 if node is window
			if(isNaN(toScroll) && node==window){toScroll=document.documentElement.scrollTop;}
			//get Scroll Distance needed
			toScroll = toScroll-position;
			//Figure out direction and invert distance to scroll for downwards direction
			if(toScroll < 0){toScroll = -toScroll;  direction ='down';}
			
			//Work out timeings
			time=18;
			inc = toScroll/time;
			
			//Animate
			var interval = setInterval(function(){
				//Incriment counter
				toScroll -=inc;
				
				//Depending on direction we are scrolling work out next position
				if(direction=='up'){
					node.scrollTo(0,toScroll+position);
				}else{
					node.scrollTo(0,(-toScroll)+position);
				}
				//If we have no more distance to scroll, run completion conditions
				if(toScroll <= 0 || isNaN(toScroll)){
					node.scrollTo(0,position);
					clearInterval(interval);
					if(callback !=null)	callback();
				}
			},20);
			
		}
	}
	/**
	* createNode
	* Create a DOM node
	* @param nodeType Type of Node to create
	* @param jsonAttributes JSON object describing tag features
	* @param attach Node to place the new node in. (does nothing if not set)
	*/
	this.createNode = function(nodeType,jsonAttributes,attach){
			//Create node of type
			var node = document.createElement(nodeType);
			//Attach attributes passed
			for(var attr in jsonAttributes){
				node.setAttribute(attr,jsonAttributes[attr]);
			}
			//Append if required
			if(attach !=null && attach !== undefined){
			
				if(attach.nodeType==1){
					attach.appendChild(node);
				}else{
					this.byId(attach).appendChild(node);
				}
			}
			//IE7 force redraw?
			node.className = node.getAttribute("class");

			return node;
	}
	/**
	 * Get pixel position of a DOM Element relative
	 * to the document itself.
	 * @param node
	 * @return x,y coords object.
	 */
	this.getCoord = function(node){
	
		var my_x = node.offsetLeft;
		var my_y = node.offsetTop ;
		
		//Ugly hack to stop IE7 getting offset width and heigh added (since it seems to get it wrong)
		//IE8 gets included, but suffers no noticable side effects
		if(!(document.all && typeof document.addEventListener != 'function')){
			my_x += node.offsetWidth; 
			my_y += node.offsetHeight;
		}
		//If it has offsetParent, add em up to get the objects full position.
		if (node.offsetParent) {
			temp = node;
			while(temp = temp.offsetParent){
				my_x +=temp.offsetLeft;
				my_y +=temp.offsetTop;
			}
		}
		return {x: my_x, y: my_y};
	
	}
	/**
	 * get viewPort width
	 * @return width
	 */
	this.getBrowserWidth = function(){
		return window.innerWidth || document.documentElement.clientWidth ;
	}
	
	/**
	 * get viewPort height
	 * @return width
	 */
	this.getBrowserHeight= function(){
		return window.innerHeight || document.documentElement.clientHeight ;
	}
	
	/**
	 * get full document Size
	 * @return Object { width,height }
	 */
	this.getDocumentSize = function(){
		return {
			height:(document.height !== undefined) ? document.height : document.body.offsetHeight,
			width: (document.width !== undefined) ? document.width : document.body.offsetWidth
		}
	}
	
	/**
	 * get coords of center of viewport
	 * @return Object { x,y }
	 */
	this.getCenterCoord = function(){
		//Work out Y offset;
		yoffset = window.pageYOffset || document.documentElement.scrollTop;
		
		return {
			x: (this.getBrowserWidth()/2),
			y: (this.getBrowserHeight()/2) + yoffset
		}
	}
	
	/**
	* Get nodes using CSS selectors.
	* @param query CSS Selectors
	* @param within Node to search. If not provided uses document.
	* @return NodeList
	*/
	this.select = function(query, within){
		if(typeof within == 'undefined') within = document;
		return within.querySelectorAll(query);
	}
	
	//Short Hand Function
	this.byId = function(id){
		return document.getElementById(id);
	}
	/**
	* Onload
	* Calls provided function once the page has loaded
	* @param callback function
	*/
	this.onLoad = function(callback){
		this.addEvent(window,'load',callback);
	}
	/**
	 * AddEvent
	 * Connect function call to event (Only really here to add IE compatability)
	 * @param Node to attach event too
	 * @param event to listen for
	 * @param function to run when event takes place
	 */
	this.addEvent = function(obj, event, callback){
		if(window.addEventListener){
				//Browsers that don't suck
				obj.addEventListener(event, callback, false);
		}else{
				//IE8/7
				obj.attachEvent('on'+event, callback);
		}
	}

	/**
	 * triggerEvent
	 * Fire an event on a given object
	 *
	 * @param node. Objects to fire event on
	 * @return event_name. type of event
	 */
	this.triggerEvent = function(obj, event_name){
		if (document.createEvent) {
			//Good browsers
			var evt = document.createEvent("HTMLEvents");
    		evt.initEvent(event_name, true, true);
    		obj.dispatchEvent(evt);
		}else{
			//old IE versions
			var evt = document.createEventObject();
    		evt.eventType = 'on'+ event_name;
    		obj.fireEvent(evt.eventType, evt);
		}
	}

	/**
	 * Base.log - Logging method
	 * Will only work in browsers that include a console.
	 * @param msg Message to log
	 */
	this.log = function(msg){
		if(console) if(console.log) console.log(+msg);
	}
	
	//Add base to global scope
	window.base = this;
}).call({});