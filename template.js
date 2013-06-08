 /**
 * TPL provides an ultra light weight, super simple method for quickly doing HTML templating in javascript.
 * @author Carl Saggs
 * @version 0.3
 * @source https://github.com/thybag/base.js
 */
 (function(){

	/**
	 * template
	 * Template a HTML string by replacing {attributes} with the corisponding value in a js Object.
	 * @param String (Raw HTML or ID of template node)
	 * @param JS Object
	 * @return NodeList|Node
	 */
	this.template = function(tpl, data){
		//Find out if ID was provided by attempting to find template node by ID  
		var el = document.getElementById(tpl);
		// If result is null, assume was passwed raw HTML template
		if(el !== null) tpl = el.innerHTML;
		//transform result in to DOM node(s)
		var tmp = document.createElement("div");
		tmp.innerHTML = replaceAttr(tpl,data);
		var results = tmp.children;
		//if only one node, return as individual result
		if(tmp.children.length===1)results = tmp.children[0];

		return results;
	}

	/**
	 * replaceAttr
	 * Replace all {attribute} with the corisponding value in a js Object.
	 * @param String (raw HTML)
	 * @return String (raw HTML)
	 * @scope private
	 */
	var replaceAttr = function(tpl, data, prefix){
		//Foreach data value
		for(var i in data){
			//Used for higher depth items
			var accessor = i;
			if(typeof prefix !== 'undefined') i = prefix+'.'+i
			//If object, recusivly call self, else template value.
			if(typeof data[i] === 'object'){
				tpl = this.replaceAttr(tpl, data[i], i);
			}else{
				tpl = tpl.replace(new RegExp('{'+i+'}','g'), data[accessor]);
			}
		}
		//return templated HTML
		return tpl;
	}

	//Add tpl to global scope
	window.tpl = this;

	// If jQuery is defined, enable tpl as a jquery plugin.
	//
	// Examples: 
	//
	//		$('#my_tpl').tpl({"name":"test"}).appendTo("body");
	// 		var hello = $("<div>Hello {name}").tpl({"name":"test"});
	//
	if(typeof $ !== 'undefined'){
		$.fn.tpl = function(options){
			var templated = $();
			$(this).each(function(){ 
				if($(this).is('script')){
					// If loading from template data from a script tag, template it, then remove each element from the script 
					// element and add it to the results nodelist
					$( tpl.template($(this).prop('innerHTML'), options) ).each(function(){ templated.push(this); });
				}else{
					// Else just template each element and add it to the nodelist
					templated.push( tpl.template($(this).prop('outerHTML'), options)); 
				} 
			});
			return templated;
		}
	}
	
}).call({});