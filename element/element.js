daylight.extend({
	createElement: function(name, object) {
		var element = document.createElement(name);
		
		for(var attr in object) {
			if(typeof object[attr] === "undefined")
				continue;
				
			element.setAttribute(attr, object[attr]);	
		}
		return element;
	},
	jsonToElement: function(json) {
		
	}
});