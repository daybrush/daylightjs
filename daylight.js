(function(window) {

	var document = document || window.document;
	var NodeListPrototype = document.childNodes.__proto__;
	var prototype = {};
	var class2type = {};
	var toString = class2type.toString;
	var _Element = window.HTMLElement || window.Element;
	
	"Boolean Number String Text Function Array Date RegExp Object Error Window NodeList HTMLCollection".split(" ").forEach(function(name, index, arr) {
		class2type[ "[object " + name + "]" ] = name.toLowerCase();
	});
	
	//reference to jQuery type
	var _checkType = function(t) {
		var type = typeof obj;
		return obj==null ? obj+"" : type === "object" ? obj instanceof _Element ? "element" : obj.daylight || class2type[toString.call(obj)] || "object" : type;	
	}
	
	var ElementList = function ElementList(arr) {
		this.length = 0;
		if(!arr)
			return;
		
		var type = _checkType(obj);
		if(type !== "nodelist" && type !== "array") {
			this[0]	= arr;
			this.length = 1;
			return;
		}
						
		var length = arr.length;
		for(var i = 0; i < length; ++i) {
			this[i] = arr[i];
		}
		this.length = length;
	};
	var ElementListPrototype = ElementList.prototype = [];
	ElementListPrototype.push = ElementListPrototype.add = function(e) {
		var length = this.length;
		this[length++] = e;
		this.length = length;
	}
	
	
	
	var daylight = window.$o = function(obj, element) {
		var type = _checkType(obj);
		switch(type) {
		case "string":
			return $o.query(obj, element);
		case "nodelist":
			return obj;
		case "htmlcollection":
			return new ElementList(obj);
		default:
			throw new Error("Not Available");
		}	
	
	};
	
	prototype.each = prototype.forEach = function(callback) {
		var self = this;
		var length = self.length;
		for(var i = 0; i < length; ++i) {
			callback.call(self[i], self[i], i, self);
		}
	}
	prototype.map = function(callback) {
		var length = this.length;
		var arr = [];
		var l = 0;
		for(var i = 0; i < length; ++i) {
			arr[l++] = callback.call(this[i], this[i], i, this);
		}
		return arr;
	}
	prototype.attr = function() {
	}
	
	prototype.css = function() {
		
	}
	prototype.addClass = function() {
		
	}
	prototype.removeClass = function() {
		
	}
	prototype.hasClass = function() {
		
	}
	prototype.size = function() {
		return this.length;
	}
	prototype.has = function(obj, isContainMine) {
		
	}
	prototype.find = function(query) {
		var list = new ElementList();
		return this.each(function(element, index) {
			var elements = element.querySelectorAll(query);
			elements.each(function(element, index) {
				list.add(element);				
			});
		});
		return list;
	}


	daylight.query = function(query, element) {
		element = element || document;
		return element.querySelectorAll(query);
	};
	daylight.class = function(className, element) {
		element = element || document;
		return element.getElementsByClassName(className);
	}
	daylight.id = function(id) {
		return new ElementList(document.getElementById(id));
	}
	daylight.name = function(name, element) {
		element = element || document;
		return element.getElementsByTagName(name);
	}
	
	
	daylight.extend = function(target, object) {
		for(var key in object) {
			if(target.hasOwnProperty(key))
				continue;
				
			target[key] = object[key];
		}
	}
	daylight.extend(NodeListPrototype, prototype);
	
	
	
})(window);
