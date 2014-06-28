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



var sObject = "object", sDaylight = "daylight", sString = "string", sArray = "array", sNodeList = "nodelist", sElementList = "elementlist";

"Boolean Number String Text Function Array Date RegExp Object Error Window NodeList HTMLCollection".split(" ").forEach(function(name, index, arr) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
});

//reference to jQuery type
var _checkType = function(obj) {
	var type = typeof obj;
	return obj==null ? obj+"" : type === "object" ? obj instanceof _Element ? "element" : obj.elementlist || class2type[toString.call(obj)] || "object" : type;	
}

var _concat = function(arr) {
	var a = [];
	var l = arr.length;
	var t = daylight.type(arr);
	if(t === "nodelist") {
		a =  Array.prototype.slice.call(arr);
		return a;
	}
	
	var type, i;
	for(i = 0; i < l; ++i) {
		type = _checkType(arr[i]);
		if(type === "array")
			a = a.concat(arr[i]);
		else if(type === "nodelist")
			a = a.concat(Array.prototype.slice.call(arr[i]));
		else
			a.push(arr[i]);
	}
	return a;
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

	return this;
}
ElementListPrototype.elementlist = sElementList;

NodeListPrototype.push = NodeListPrototype.add = function(e) {
	var a = new ElementList(this);
	a.add(e);
	return a;
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

daylight.type = _checkType;
prototype.size = function() {
	return this.length;
}
prototype.extend = daylight.extend = function() {
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
	
	return target;
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



//array
//@{array.js}


//agent
//@{agent/agent.js}
//@{agent/browser.js}


//string
//@{string/camelCase.js}

//tree
//@{tree/parent.js}
//@{tree/child.js}

//get
//@{get.js}

//element
//@{element/element.js}
//@{element/parse.js}

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
//@{event/event.js}

//dimension
//@{dimension/dimension.js}
//@{dimension/position.js}


//html, value, text, insertion
//@{insertion.js}
//@{val.js}


//template
//@{template/template.js}
//@{template/engine.js}


//@{ajax/ajax.js}


//@{extend.js}

})(window);
