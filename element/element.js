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
		
	},
	//내용을 복사합니다.
	clone: function(node, dataAndEvent, deepDataAndEvent) {
		var n = node.cloneNode();
		n.innerHTML = node.innerHTML;
		return n;
	}
});