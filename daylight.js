//@{polyfill.js}
(function(window) {

var document = window.document || document;
var NodeListPrototype = document.childNodes.__proto__;
var prototype = {};
var class2type = {};
var toString = class2type.toString;
var hasOwn = class2type.hasOwnProperty;
var navigator = window.navigator || navigator;
var userAgent = navigator.userAgent;

var _Element = window.HTMLElement || window.Element;

var sObject = "object", sDaylight = "daylight", sString = "string", sArray = "array", sNodeList = "nodelist";

"Boolean Number String Text Function Array Date RegExp Object Error Window NodeList HTMLCollection".split(" ").forEach(function(name, index, arr) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
});

//reference to jQuery type
var _checkType = function(obj) {
	var type = typeof obj;
	return obj==null ? obj+"" : type === "object" ? obj instanceof _Element ? "element" : obj.daylight || class2type[toString.call(obj)] || "object" : type;	
}

var ElementList = function ElementList(arr) {
	this.length = 0;
	if(!arr)
		return;
	
	var type = _checkType(arr);
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

var daylight = window.daylight = window.$ = window.$o = function(obj, element) {
	var type = _checkType(obj);
	switch(type) {
	case "string":
		return $o.query(obj, element);
	case "nodelist":
		return obj;
	case "element":
	case "htmlcollection":
		
	default:
		return new ElementList(obj);
		//throw new Error("Not Available : " + type);
	}	

};
prototype.size = function() {
	return this.length;
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
daylight.extend = function() {
	var length = arguments.length;
	var i = 0;
	var target = this;
	var type = _checkType(arguments[0]);
	if(type === "boolean") {
		target = arguments[1];
		i = 2;
	}
	for(; i < length; ++i) {
		object = arguments[i];
		for(var key in object) {
			if(target.hasOwnProperty(key))
				continue;
			
			target[key] = object[key];
		}
	}
}
daylight.extend({
	query: function(query, element) {
		element = element || document;
		return element.querySelectorAll(query);
	},
	class: function(className, element) {
		element = element || document;
		return element.getElementsByClassName(className);
	},
	id: function(id) {
		return new ElementList(document.getElementById(id));
	},
	name: function(name, element) {
		element = element || document;
		return element.getElementsByTagName(name);
	}
});
daylight.extend({
	searchByQuery: this.query,
	searchByClass: this.class,
	searchById: this.id,
	searchByName: this.name,
	type: _checkType
	
});
//define
//@{define.js}


//is함수
//@{check.js}

//each, has, map, filter
//@{util.js}


//attributes
//@{attributes/attribute.js}
//@{attributes/classes.js}
//@{css/css.js}


//event
//@{event/trigger.js}
//@{event/on.js}
//@{event/event.js}
//@{event/drag.js}
//@{event/visible.js}

//dimension
//@{dimension/dimension.js}
//@{dimension/position.js}

//@{insertion.js}

//@{template/template.js}




//@{extend.js}

})(window);
