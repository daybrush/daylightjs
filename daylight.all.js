(function() {
	var StringPrototype = String.prototype;
	StringPrototype.trim = StringPrototype.trim || function(){
		return this.replace(/(^\s*)|(\s*$)/gi, "");
	}
	StringPrototype.ltrim = function(){
		return this.replace( /^\s+/, "" );
	}
	StringPrototype.rtrim = function(){
		return this.replace( /\s+$/, "" );
	}
	StringPrototype.startsWith = function (str){
	    return this.indexOf(str) == 0;
	 };
	StringPrototype.replaceAll = function(from, to) {
		if(!this)
			return "";
		return this.split(from).join(to);
	}
	StringPrototype.toUpperFirst = function() {
		return this.substring(0,1).toUpperCase() + this.substring(1);
	}
	var ArrayPrototype = Array.prototype;
	ArrayPrototype.indexOf = ArrayPrototype.indexOf || function (element) {
		var length = this.length;
		
		for(var i = 0; i < length; ++i) {
			if(this[i] === element)
				return i;
		}		
		return -1;
	}
	ArrayPrototype.forEach = ArrayPrototype.forEach || function (func) {
		var length = this.length;
		
		for(var i = 0; i < length; ++i) {
			func.call(this[i], this[i], i, this);
		}		
		return this;
	}
/*
	ArrayPrototype.remove = ArrayPrototype.remove || function(member) {
		var index = this.indexOf(member);
		if (index > -1) {
			this.splice(index, 1);
		}
		return this;
	}
*/
	Object.keys = Object.keys || (function () {
		'use strict';
		var hasOwnProperty = Object.prototype.hasOwnProperty,
		    hasDontEnumBug = !({toString: null}).propertyIsEnumerable('toString'),
		    dontEnums = [
		      'toString',
		      'toLocaleString',
		      'valueOf',
		      'hasOwnProperty',
		      'isPrototypeOf',
		      'propertyIsEnumerable',
		      'constructor'
		    ],
		    dontEnumsLength = dontEnums.length;
		
		return function (obj) {
		  if (typeof obj !== 'object' && (typeof obj !== 'function' || obj === null)) {
		    throw new TypeError('Object.keys called on non-object');
		  }
		
		  var result = [], prop, i;
		
		  for (prop in obj) {
		    if (hasOwnProperty.call(obj, prop)) {
		      result.push(prop);
		    }
		  }
		
		  if (hasDontEnumBug) {
		    for (i = 0; i < dontEnumsLength; i++) {
		      if (hasOwnProperty.call(obj, dontEnums[i])) {
		        result.push(dontEnums[i]);
		      }
		    }
		  }
		  return result;
		};
	}());
	
})();
(function(window) {


var document = window.document || document;
var docElem = document.documentElement;

var NodeListPrototype = document.childNodes.__proto__;
var HTMLCollectionPrototype = docElem.children && docElem.children.__proto__ || {};
var prototype = [];
var class2type = {};
var toString = class2type.toString;
var hasOwn = class2type.hasOwnProperty;
var navigator = window.navigator || navigator;
var userAgent = navigator.userAgent;
var _Element = window.HTMLElement || window.Element;
var _arr = [];
var _push = _arr.push;


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
var ElementListPrototype = NodeListPrototype.__proto__ = HTMLCollectionPrototype.__proto__ = ElementList.prototype = prototype;
ElementListPrototype.push = ElementListPrototype.add = function(o) {
	if(!daylight.isList(o))
		o = [o];
	_push.apply(this, o);

	return this;
}
ElementListPrototype.elementlist = sElementList;

HTMLCollectionPrototype.push = HTMLCollectionPrototype.add = NodeListPrototype.push = NodeListPrototype.add = function(e) {
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
	case "elementlist":
		return obj;
	case "element":
	case "htmlcollection":
		
	default:
		return new ElementList(obj);
		//throw new Error("Not Available : " + type);
	}	

};

daylight.type = _checkType;
prototype.daylight = sDaylight;
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

//data
/*
 * reference to daylight data
 */
var expando = "daylight" + Date.now(), uuid = 0, windowData = {};

daylight.extend({
	cache: {},

	data: function( elem, name, data ) {
		elem = elem == window ?
			windowData :
			elem;

		var id = elem[ expando ];

		// Compute a unique ID for the element
		if ( !id )
			id = elem[ expando ] = ++uuid;

		// Only generate the data cache if we're
		// trying to access or manipulate it
		if ( name && !daylight.cache[ id ] )
			daylight.cache[ id ] = {};

		// Prevent overriding the named cache with undefined values
		if ( data !== undefined )
			daylight.cache[ id ][ name ] = data;

		// Return the named cache data, or the ID for the element
		return name ?
			daylight.cache[ id ][ name ] :
			id;
	},

	removeData: function( elem, name ) {
		elem = elem == window ?
			windowData :
			elem;

		var id = elem[ expando ];

		// If we want to remove a specific section of the element's data
		if ( name ) {
			if ( daylight.cache[ id ] ) {
				// Remove the section of cache data
				delete daylight.cache[ id ][ name ];

				// If we've removed all the data, remove the element's cache
				name = "";

				for ( name in daylight.cache[ id ] )
					break;

				if ( !name )
					daylight.removeData( elem );
			}

		// Otherwise, we want to remove all of the element's data
		} else {
			// Clean up the element expando
			try {
				delete elem[ expando ];
			} catch(e){
				// IE has trouble directly removing the expando
				// but it's ok with using removeAttribute
				if ( elem.removeAttribute )
					elem.removeAttribute( expando );
			}

			// Completely remove the data cache
			delete daylight.cache[ id ];
		}
	}
});

prototype.extend({
	data: function( key, value ){
		var parts = key.split(".");
		parts[1] = parts[1] ? "." + parts[1] : "";

		if ( value === undefined ) {
			data = daylight.data( this[0], key );
			return data;
			
		} else
			return this.each(function(){
				daylight.data( this, key, value );
			});
	},

	removeData: function( key ){
		return this.each(function(){
			daylight.removeData( this, key );
		});
	}
});

//array
daylight.extend({
	merge: function(result, data) {
		var length = result.length;
		var length2 = data.length;
		for(var i = 0 ; i < length2; ++i)
			result[length++] = data[i];
		
		return result;
	},
	makeArray: function(arr) {
		var result = [];
		this.merge(result, arr);
		
		return result;
	},
	//해당 index를 보여줍니다.
	index: function(arr, object) {
		var type = _checkType(arr);
		
		//indexOf라는 함수가 index와 같다.
		if(arr.indexOf)
			return arr.indexOf(object);
		
		if(type === "object") {
			//key value 쌍을 이루는 plainObject 일 것이다.
			for(var key in arr) {
				if(arr[key] === object)
					return key;
			}
			return "";
		} else {
			var length = arr.length;
			
			for(var i = 0; i < length; ++i) {
				if(arr[i] === object)
					return i;
			}
			//못찾으면 -1을 반환.
			return -1;
		}
	}
});

prototype.extend({
	toArray: function() {
		return daylight.makeArray(this);	
	}
});


//agent
var _navigator = daylight._navigator = window.navigator || navigator;
var _userAgent = daylight._userAgent = navigator.userAgent;


//reference to jindo.js jindo._p_._j_ag
daylight._AGENT_IS_IE = /(MSIE|Trident)/.test(daylight._userAgent);
daylight._AGENT_IS_FF = daylight._userAgent.indexOf("Firefox") > -1;
daylight._AGENT_IS_OP = daylight._userAgent.indexOf("Opera") > -1;
daylight._AGENT_IS_SP = daylight._userAgent.indexOf("Safari") > -1;
daylight._AGENT_IS_SF = daylight._userAgent.indexOf("Apple") > -1;
daylight._AGENT_IS_CH = daylight._userAgent.indexOf("Chrome") > -1;
daylight._AGENT_IS_WK = daylight._userAgent.indexOf("WebKit") > -1;
daylight._AGENT_IS_MO = /(iPad|Mobile|Android|Nokia|webOS|BlackBerry|Opera Mini)/.test(daylight._userAgent);

daylight.agent = {};
daylight.agent.isMobile = daylight._AGENT_IS_MO;


/**


@desc 브라우저 목록과 모바일 인지 아닌지 보여준다.
*/
// reference to jindo.desktop.all.js jindo.$Agent.prototype.navigator
daylight.browser = function() {
	var ver = -1,
		name = "",
		u = _userAgent || "",
		info = {},
		v = _navigator.vendor || "";
		
	function f(browser, userAgent) {
		return ((userAgent || "").indexOf(browser) > -1);
	}
	function hasBrowser(browser) {
		return (u.indexOf(browser) > -1);
	}
	info.webkit = f("WebKit", u);
	info.opera = (window.opera !== undefined) || f("Opera", u);
	info.ie = !info.opera && (f("MSIE", u)||f("Trident", u));
	info.chrome = info.webkit && f("Chrome", u);
	info.safari = info.webkit && !info.chrome && f("Apple", v);
	info.firefox = f("Firefox", u);
	info.mozilla = f("Gecko", u) && !info.safari && !info.chrome && !info.firefox && !info.ie;
	info.camino = f("Camino", v);
	info.netscape = f("Netscape", u);
	info.omniweb = f("OmniWeb", u);
	info.icab = f("iCab", v);
	info.konqueror = f("KDE", v);
	info.mobile = (f("Mobile", u) || f("Android", u) || f("Nokia", u) || f("webOS", u) || f("Opera Mini", u) || f("BlackBerry", u) || (f("Windows", u) && f("PPC", u)) || f("Smartphone", u) || f("IEMobile", u)) && !f("iPad", u);
	info.msafari = ((!f("IEMobile", u) && f("Mobile", u)) || (f("iPad", u) && f("Safari", u))) && !info.chrome;
	info.mopera = f("Opera Mini", u);
	info.mie = f("PPC", u) || f("Smartphone", u) || f("IEMobile", u);
	
	
	try{
		var nativeVersion = -1;
		var dm = document.documentMode;
		if(info.ie){
			if(dm > 0){
				ver = dm;
				if(u.match(/(?:Trident)\/([0-9.]+)/)){
					var nTridentNum = parseFloat(RegExp.$1, 10);
					
					if(nTridentNum > 3){
						nativeVersion = nTridentNum + 4;
					}
				}else{
					nativeVersion = ver;
				}
			}else{
				nativeVersion = ver = u.match(/(?:MSIE) ([0-9.]+)/)[1];
			}
		}else if(info.safari || info.msafari){
			ver = parseFloat(u.match(/Safari\/([0-9.]+)/)[1]);
			
			if(ver === 100){
				ver = 1.1;
			}else{
				if(u.match(/Version\/([0-9.]+)/)){
					ver = RegExp.$1;
				}else{
					ver = [1.0, 1.2, -1, 1.3, 2.0, 3.0][Math.floor(ver / 100)];
				}
			}
		}else if(info.mopera){
			ver = u.match(/(?:Opera\sMini)\/([0-9.]+)/)[1];
		}else if(info.firefox||info.opera||info.omniweb){
			ver = u.match(/(?:Firefox|Opera|OmniWeb)\/([0-9.]+)/)[1];
		}else if(info.mozilla){
			ver = u.match(/rv:([0-9.]+)/)[1];
		}else if(info.icab){
			ver = u.match(/iCab[ \/]([0-9.]+)/)[1];
		}else if(info.chrome){
			ver = u.match(/Chrome[ \/]([0-9.]+)/)[1];
		}
		
		info.version = parseFloat(ver);
		info.nativeVersion = parseFloat(nativeVersion);
		
		if(isNaN(info.version)){
			info.version = -1;
		}
	}catch(e){
		info.version = -1;
	}
	
	
	return info;
		
}



//string
/*String 관련 함수*/
daylight.extend({
/**
* @method
* @name daylight.isPlainObject
*
* @param {String} from 바뀔문자
* @param {String} to 바꿀문자
* @param {String} target 문자열
*
* @retruns {String} 바뀐 문자를 리턴
* @desc from이 들어간 문자를 to로 전부 바꿔준다.
*/	
replace: function(from, to, str) {
	if(!str)
		return "";
	return str.split(from).join(to);
},
/**
* @method
* @name daylight.repeat
*
* @param {String} 반복할 문자
* @param {Number} 반복 횟수
*
* @retruns {String} 반복한 문자
* @desc 반복 횟수만큼 문자를 반복한다.
*/	
repeat: function(str, num) {
	var sWord = "";
	for(var i = 0; i < num; ++i) {
		sWord += daylight.replace("{count}", i + 1, str);
	}
	return sWord;
}
});
daylight.camelCase = function(str) {
	return str.replace(/-+(.)?/g, 
		function(a,b){
			return b?b.toUpperCase():""
	});
}

//tree
//parent
prototype.extend({
	parent: function(object) {
		var arr = new ElementList();
		var type = daylight.type(object);
		var parentObjects = type === sString ? daylight(object).o : [];
	
		if(type === "number") {
			this.each(function(v) {
				if(!daylight.isElement(v))
					return;
				var i = object;
				while(--i >= 0 && (v = v.parentNode)) {}
				
				if(!v)
					return;
	
				arr.add(v);
			});
		} else {
			this.each(function(v) {
				if(!daylight.isElement(v))
					return;
	
				var a = v.parentNode;
				if(a)
					arr.add(a);
			});
		}
		return arr;
	},
	offsetParent: function() {
		return this.map(function() {
			var offsetParent = this.offsetParent || docElem;

			while ( offsetParent && ( !daylight.nodeName( offsetParent, "html" ) && offsetParent.style && offsetParent.style.position === "static" ) ) {
				offsetParent = offsetParent.offsetParent;
			}

			return offsetParent || docElem;
		});
	}
});
//child
prototype.extend({
	find: function(query) {
		if(this.length === 1) {
			return this[0].querySelectorAll(query);
		}
		var list = new ElementList();
	
		this.each(function(element, index) {
			var elements = element.querySelectorAll(query);
			elements.each(function(element, index) {
				list.add(element);				
			});
		});
		return list;
	},
	children: function() {
		var o = new ElementList();
		this.each(function(v) {
			if(!daylight.isElement(v))
				return;
				
			var a = this.children;
			var l = a.length;
			for(var i = 0; i < l; ++i)
				o.add(a[i]);
		});
		return o;
	},
	prev: function(nCount) {
		nCount = nCount ? nCount : 1;
		var arr = new ElementList();
		var length = this.length;
		this.each(function(e) {

			if(!daylight.isElement(e))
				return;
				
			if(e.previousElementSibling)
				while((e = e.previousElementSibling) != null && ( --nCount != 0)) {}
			else
				while((e = e.previousSibling) != null && ((e.nodeType === 1 && --nCount != 0) || e.nodeType !== 1)) {}
	
			if(!e)
				return;
				
			if(nCount > 0)
				return;
				
			arr.add(e);
		});
		return arr;
	},
	next : function(nCount) {
		nCount = nCount ? nCount : 1;
		
		var arr = new ElementList();
		var length = this.length;
		this.each(function(e) {
			if(!daylight.isElement(e))
				return;
				
			if(e.previousElementSibling)
				while((e = e.nextElementSibling) != null && ( --nCount != 0)) {}
			else
				while((e = e.nextSibling) !== null &&( (e.nodeType === 1 && --nCount != 0) || e.nodeType !== 1)) {}
			if(!e)
				return;
				
			if(nCount > 0)
				return;
				
			arr.add(e);
		});
		return arr;
	}
});

//get
prototype.extend({
	index: function(object) {
		var type = daylight.type(object);
		if(daylight.isDaylightType(type))
			object = object.get(0);
		
		var length = this.length;
		for(var i = 0; i <length; ++i) {
			if(this.get(i) === object)
				return i;
		}
		return -1;
	},
	size: function() {
		return this.length;
	},
	get: function(index) {
		if(index === undefined)
			return this.getOriginal();
			
		var length = this.length;	
		if(length === 0)
			return;
			
		while(index < 0) {index = length + index;}
		while(index >= this.length) {index = index - length;}
		
		return this[index];
	},
	eq: function(index) {
		return daylight(this.get(index));
	},
	getOriginal: function() {
		var type = daylight.type(this);
		if(type === "nodelist")
			return this;
			
		return this.toArray();
	},
	first : function() {
		if(this.length === 0)
			return;
		
		return daylight(this.get(0));
	},
	last: function() {
		if(this.length === 0)
			return;
			
		return daylight(this.get(-1));
	}
});

//element
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
//parse
daylight.extend({
/**
* @method
* @name daylight.parseJSON
*
* @param {String} json
* @retruns {Object} JSON
* @desc 텍스트 형식으로 된 JSON이 Object로 바꿔준다.
*/
	parseJSON : function(text) {
		try {
			//이미 object라면 바꿔줄 필요가 없다.
			if(typeof text === "object")
				return text;
			
			return JSON.parse(text);
		} catch (e) {
			//JSON형식이 아니라면 에러...
			return {};
		}
	},
	/**
	* @method
	* @name daylight.parseHTML
	*
	* @param {String} html
	* @retruns {Element List} Elements
	* @desc 텍스트 형식으로 된 html이 HTML List로 바꿔준다.
	*/
	parseHTML: function(text) {
		var p = document.createElement("p");
		p.innerHTML = text;
		//var arr = _concat(p.childNodes);
		return p.childNodes;
	}

});

//define
//define 관련 함수들 모음
daylight.extend({
	//해당 함수를 선언합니다.
	define : function(object, name, func) {
		var type = typeof object;
		if(type === "object" && object.__proto__)
			object.__proto__[name] = func;
		else if(["function", "object"].indexOf(type) != -1 && object.prototype)
			object.prototype[name] = func;
		else if(type === "object")
			object[name] = func;
		else
			throw new Error("함수 만들기 실패  : " + name);
	},
/**
* @method
* @name daylight.defineGetterSetter
*
* @example
* //define this.setCount(??); this.getCount();
* daylgiht.defineGetterSetter(this, "count");
* @param {Object} 적용할 대상
* @retruns {string} name
* @desc GetterSetter함수를 만듭니다.
*/
	defineGetterSetter :function(object, name) {
		this.defineGetter(object, name);
		this.defineSetter(object, name);
	},
	defineGetter : function(object, name, func) {
		if(!func)
			func = function(name){return function() {return this[name];}}(name);
			
		if(name.indexOf("is_") != -1) {
			name = name.replace("is_", "");
			name = "is" + name.charAt(0).toUpperCase() + name.substr(1, name.lengh);
		} else {
			name =  "get" + name.charAt(0).toUpperCase() + name.substr(1, name.length);	
		}
		this.define(object, name, func);
	},
	defineSetter : function(object, name, func) {
		if(!func)
			func = function(name){return function(value) {this[name] = value; return this;}}(name);
			
		name =  "set" + name.charAt(0).toUpperCase() + name.substr(1, name.length);	
		this.define(object, name, func);
	}
	//전역변수를 만듭니다.
	,defineGlobal: function(name, o) {
		var typeName = _checkType(name);
		if(typeName === "string")
			window[name] = o;
	},
	//자바나 C++에서의 overload 구현.
	overload: function() {
		var args = arguments;
		var methods = {};
		for(var i = 0; i < args.length; ++i) {
			var obj = args[i];
			var type = _checkType(obj);
			if(type === "function") {//function일 때 인자의 갯수로 구분.
				methods[obj.length] = obj;	
			} else if(type === "object") {//오브젝트 이면 인자의 타입으로 구분
				for(var param in obj) {
					methods[param] = obj[param];
				}
			}
		}
		return function() {
			var args2 = arguments;
			if(methods[args2.length])//인자의 갯수가 있는지 확인
				return methods[args2.length].apply(this, args2);
				
				
			var arr = daylight.map(args2, function(value) {var type = _checkType(value);
						return type === "object" && value.constructor.name.toLowerCase() || type;
					});//인자의 타입을 가져옴
			var param = arr.join(",");
			if(methods[param])
				return methods[param].apply(this, args2);
			
			
			// error;
			return;
		};
	},
	noConflict: function() {
		//test
		return this;
	}
});



//is함수
daylight.extend({
/**
* @method
* @name daylight.nodeName
*
* @param {element} Element
* @param {element} compareElement
* @retruns {String|Boolean} element의 노드이름을 보여주거나 2번째 인자가 들어오면 비교해서 같으면 true 틀리면 false를 리턴한다.
* @desc element의 노드이름을 보여주거나 2번째 인자가 들어오면 비교해서 같으면 true 틀리면 false를 리턴한다.
*/
	nodeName : function(element, compare) {
		var nodeName = element.nodeName;
		var type = typeof element;
		if(compare !== undefined) {
			if(type === "object")//비교 대상이 있으면 비교값을 리턴 true, false;
				return nodeName === compare.nodeName;
			else
				return nodeName === compare;
		}
		return nodeName;//비교 대상이 없으면 노드 이름만 반환.
	},
	/**
* @func : daylight.isNode(Node)
* @description : 해당 객체가 Node인지 확인
* @param : Node
* @return : Boolean(노드이면 true 아니면 false)
*/
	isNode : function(o) {
		if(typeof o !== "object")
			return false;
			
		if(o instanceof _Node)
			return true;
			
		return false;
	},
/**
* @method
* @name daylight.isElement
*
* @description : 해당 객체가 Element인지 확인
* @param : Element
* @return : Boolean(Element이면 true 아니면 false)
*/
/**
* @param {*} All
* @retruns {Boolean} if All is Element, True 
* @desc element인지 검사한다.
*/
	isElement : function(o) {
		if(!o)
			return false;
		
		//nodeType 이 1이면 HTMLElement이다.
		if(o.nodeType === 1)
			return true;
	
		return false;
	},
/**
* @method
* @name daylight.isFunction
*
* @param {*} All
* @retruns {Boolean} if All is Function, True 
* @desc Function인지 검사한다.
*/
	isFunction : function(o) {
		return typeof o === "function";
	},
/**
* @method
* @name daylight.isPlainObject
*
* @param {*} All
* @retruns {Boolean} if All is PlainObject, True 
* @desc PlainObject인지 검사한다.
*/	
	isPlainObject: function(n) {
		if(!n)
			return false;
		//PlainObject의 생성자는 Object이다???
		if(n.constructor === Object)
			return true;
	},
	/**
	* @method
	* @name daylight.isList
	*
	* @param {*} obj
	* @retruns {Boolean} if obj is List, True 
	* @desc List인지 검사한다.
	*/
	isList: function(obj) {
		var type = daylight.type(obj);
		return this.isListType(type);
	},
	isListType: function(type) {
		return type === "array" || type === "nodelist" || type === "elementlist" || type === "htmlcollection";
	},
	isDaylight: function(obj) {
		var type = _checkType(obj);
		return this.isDaylightType(type);
	},
	isDaylightType: function(type) {
		if(type === "daylight")
			return true;
			
		if(type === "nodelist")
			return true;
		if(type === "elementlist")
			return true;
		if(type === "htmlcollection")
			return true;
		return false;
	}
});
prototype.extend({
	nodeName: function() {
		return daylight.nodeName(this.get(0));
	},
	empty: function() {
		return (this.length === 0);
	}
})


//each, has, map, filter
//util
daylight.extend({
	replace: function(from, to, str) {
		return str.split(from).join(to);
	}
});
daylight.extend({
	//각각의 요소에 대해 콜백함수를 실행시킨다.
	each: function(arr, callback) {
		var type = _checkType(arr, true);
		//배열 또는 nodelist인 경우
		if(daylight.isListType(type)) {
			var length = arr.length;
			for(var i = 0; i < length; ++i) {
				callback.call(arr[i], arr[i], i, arr);//i == index, arr
			}
		} else if(type === sObject) {
			for(var i in arr) 
				callback.call(arr[i], arr[i], i, arr);
		} else if(type === sDaylight) {
				arr.each(callback);
		}
		
		return arr;
	},
	map: function(arr, callback) {
		var arr2 = [];
		var type = _checkType(arr, true);
		//배열 또는 nodelist인 경우
		if(daylight.isListType(type)) {
			var length = arr.length;
			for(var i = 0; i < length; ++i)
				arr2[arr2.length] = callback.call(arr[i], arr[i], i, arr);
		} else if(type === sObject) {
			for(var i in arr) 
				arr2[arr2.length] = callback.call(arr[i], arr[i], i, arr);
		} else if(type === sDaylight) {
				return arr.map(callback);
		}
		
		return arr2;
	},
	//해당 object를 갖고 있는지 확인 selector도 가능 true / false
	has : function(element, object, isContainParent) {
		var is_element = daylight.isElement(object) && daylight.isElement(element);
		var is_selector = (typeof object === sString);
		return is_element && daylight.contains(element, object, isContainParent) ||	
				is_selector && daylight.contains(element, element.querySelector(object));
	
	},
	//해당 object를 갖고 있는지 확인 element만 가능
	contains : function(parent, node, isContainParent) {
		return (isContainParent && parent === node || parent !== node )&& parent.contains(node);
	}
});
prototype.extend({
	/*
		$().filter(function(object, index, arr) {
			return true이면 arr 추가 false이면 arr 추가 X
		
		return 값은 $(arr)
	*/
	filter : function(func) {
		var type = _checkType(func);
		var objects = this;
		var length = this.length;
		var arr = new ElementList();
		
		switch(type) {
		case "function":
			for(var i = 0; i < length; ++i) {
				var o = objects[i];
				var a = func.call(o, o, i, objects);
				if(a) arr.add(o);
			}
			return arr;
		}
		
		return arr;
	},
	/*
		selector 또는 element를 갖고 있는 지 확인 isContaintParent가 true이면 그게 자신인지 까지 확인
		
	*/
	has: function(selector, isContainParent) {
		if(daylight.isElement(selector)) {
			return this.filter(function() {
				return daylight.contains(this, selector, isContainParent);
			});
		} else if(typeof selector === "string"){
			return this.filter(function() {
				return daylight.contains(this, this.querySelector(selector));
			});		
		}
		return new ElementList();
	},
	/*
		검색한 element에서 가져오고 싶은 값을 arr으로 반환
		
	*/
	map: function(func) {	
		var objects = this;
		var length = this.length;
		var arr = new ElementList();
		for(var i = 0; i < length; ++i)
			arr.add(func.call(objects[i], objects[i], i, objects));
		
		return arr;
	},
	/*
		각각의 element에 대해 일을 수행한다.
		인자 (object, index, array)
		
	*/
	each: function(callback) {
		var objects = this;
		var length = this.length;
		for(var i = 0; i < length; ++i) {
			var object = objects[i];
			callback.call(object, object, i, objects);
		}
		return this;
	},
	equals: function(object) {
		var type = _checkType(object);
		if(object === undefined)
			return;
		if(type === "element" && this.length === 1 && object === this.get(0)) {
			return true;
		} else if(this.length === object.length) {
			var arr, length;
			if(type === sDaylight)
				arr = object.o;
			else if(type === sArray || type === sNodeList || type === sElementList)
				arr = object;
			else
				arr = object;
			//HTMLCollection
	
			length = arr.length;
			for(var i = 0; i < length; ++i) {
				if(this.index(arr[i]) === -1)
					return false;
	
			}
			return true;
		}
		return false;
	}
});
prototype.equal = prototype.equals;


//attributes
prototype.setAttribute = function(name, value) {
	this.each(function(obj) {
		obj.setAttribute? obj.setAttribute(name, value) : obj[name] = value;
	});
	
	return this;
}
prototype.getAttribute = function(name) {
	var o = this.get(0) || "";
	return  o.getAttribute ? o.getAttribute(name) : o[name];
}

prototype.attr = function(name, value) {
	var length = arguments.length;
	if(length >= 2)
		return this.setAttribute(name, value);
	
	if(length !== 1)
		return;

	return this.getAttribute(name);
}
daylight.extend({
	/**
	* @func : daylight.removeClass(Element, className)
	* @description : 클래스를 삭제를 합니다.
	* @func : daylight.removeClass(Element, className, Boolean(ignore Checking Element))
	* @description : 클래스를 삭제를 합니다. (3번째 인자가 true로 들어오면 첫번째 인자가 Element인지 검사를 하는 코드를 무시합니다.)
	* @param : element(삭제할 element), className : 삭제할 클래스 이름, ignoreCheck : element의 검사를 무시할 수 있다.(중복 체크)
	* @return : Boolean(삭제 체크)
	*/
	removeClass : function(element, className, ignoreCheck) {
		if(!ignoreCheck && !daylight.isElement(element))
			return false;
			
		var name = element.className;
		var arr = name.split(" ");
		var length = arr.length;
		var afterClassName = "";

		var classNames = className.split(" ");
		
		for(var i = 0; i < length; ++i) {
			var eClass = arr[i];
			if(classNames.indexOf(eClass) != -1)
				continue;
			afterClassName += afterClassName ? " " + eClass : eClass
		}
		element.className = afterClassName;
		
		return true;
	},
	/**
	* @func : daylight.hasClass(Element, className)
	* @description : 클래스를 가지고 있는지 확인
	* @param : Element(찾을 element), className : 찾을 클래스 이름
	* @return : Boolean(가지고 있는지 체크)
	*/
	hasClass : function(element, className) {

		if(!daylight.isElement(element))
			return false;
			
		var name = element.className;
		var arr = name.split(" ");
		var length = arr.length;
		for(var i = 0; i < length; ++i) {
			if(arr[i] === className)
				return true;
		}
		return false;
	}, 
	/**
	* @func : daylight.addClass(Element, className)
	* @param : element(추가할 element), className(추가할 클래스 이름)
	* @return : Boolean(추가되었는지 체크)
	*/
	addClass : function(element, className) {
		if(daylight.hasClass(element, className))
			return false;
	
		if(element.className === "")
			element.className = className;
		else
			element.className += " " + className;
			
		return true;
	},
	toggleClass : function(element, className, className2) {
		if(!element)
			return false;
		var is_add = daylight.addClass(element, className);
		if(!is_add) {
			//className이 이미 있다. -> className 제거
			daylight.removeClass(element, className, true);
			
			//className2가 없다. -> className2 추가.
			if(className2)
				daylight.addClass(element, className2);
				
			return false;
		} else if(className2) {
			//className이 추가되었다. className2이 있다.
			daylight.removeClass(element, className2, true);
		}
		return true;
	}
});
daylight.extend(true, prototype, {
	getClass : function() {
		var obj = this.get(0);
		//var type = daylight.type(obj);
		if(obj instanceof _Element) {
			return obj.className.split(" ");
		}
		return [];
	},
	addClass : function(className) {
		this.each(function(e, index) {
			daylight.addClass(e, className);
		});
		return this;
	},
	hasClass : function(className, index) {
		if(!index)
			index = 0;
		if(!this.length)
			return false;
		
		return daylight.hasClass(this.get(index), className);
	},
	/*
		클래스가 있으면 제거 없으면 추가한다.
		
		className이 있으면 className 제거 , className2 추가
		className2가 있으면 className2제거, className 추가
		
	*/
	toggleClass : function(className, className2) {
		//var obj = this;
		if(this.length === 0)
			return;
		
		//if(this.size === 1)
		//	return daylight.toggleClass(this.o[0], className, className2);
			
		this.each(function(e, index) {
			daylight.toggleClass(e, className, className2);
		});
		return this;
	},
	removeClass : function(className) {
		//var reg = new RegExp('(\\s|^)'+className+'(\\s|$)');
		this.each(function(element) {
			daylight.removeClass(element, className);
		});
		
		return this;
	}
});

var _style = function(element, name) {
	if(!element)
		return;
		
	if(arguments.length === 1)
		return window.getComputedStyle && window.getComputedStyle(element) || element.currentStyle || element.style;
	if(arguments.length === 2)
		return window.getComputedStyle && window.getComputedStyle(element)[name] || element.currentStyle && element.currentStyle[name] || element.style[name];
}

var _curCss = function(element, name, pre_styles) {
	if(!element || !name)
		return;
	//pre_styles
	//element에 대해 미리 정의한 style들의 모음.
	name = daylight.camelCase(name);
	
	var style = pre_styles && pre_styles[name] || _style(element, name) || "";


	//한 스타일 속성  style.length - 1 = 문자 끝자리가 %
	
	if(style && style.match(/^(\-?[0-9\.]+)\%$/) != null) {
		var percentage = parseFloat(style);
	
		//false Nan까지 고려
		if(percentage == 0)
			return 0 + "px";

		var offset_parent = element.offsetParent || element.parentNode;
			
		var element_styles = _style(offset_parent);
		var dimension = _curCssHook(offset_parent, name, element_styles);
		

		//%로 된 css 속성을 절대값 pixel로 바꿔준다. 크롬은 알아서 픽셀로 바꿔준다.
		return percentage * dimension / 100 + "px";
	}
	
	return style;
}
var _checkBorder = function(border) {
	switch(border) {
	case "thick":
		return "6px";
	case "medium":
		return "4px";
	case "thin":
		return "2px";
	}
	return border;
}
var _dimensionCssHook = function(element, component, pre_styles) {

	var border_left = _curCss(element, "border-"+component[0]+"-width", pre_styles);
	var border_right = _curCss(element, "border-"+component[1]+"-width", pre_styles);

	var border_left_display = _curCss(element, "border-"+component[0], pre_styles);
	var border_right_display = _curCss(element, "border-"+component[1], pre_styles);

	var padding_left = _curCss(element, "padding-"+component[0], pre_styles);
	var padding_right = _curCss(element, "padding-"+component[1], pre_styles);
	
	//NaN과 같은 잘못된 숫자나 그런 것들 고려
	border_left = border_left_display == 0? 0 : _checkBorder(border_left);
	border_right = border_right_display == 0? 0 :_checkBorder(border_right);
	
	var inner = (component[0] === "left") ? $(element).innerWidth() : $(element).innerHeight();
	var dimension = inner - parseFloat(border_left) - parseFloat(border_right) - parseFloat(padding_left) - parseFloat(padding_right);	

	return dimension;
}
var _curCssHook = function(element, name, pre_styles) {
	//content width에 따라 바뀔 수 있는 속성
	var lrtype = ["left", "right", "width", "margin-left", "margin-right", "padding-left", "padding-right"];
	//content height에 따라 바뀔 수 있는 속성
	var tbtype = ["top", "bottom", "height", "margin-top", "margin-bottom", "padding-top", "padding-bottom"];	
	
	

	if(lrtype.indexOf(name) !== -1) {
		var requestComponent = ["left", "right"];
		return _dimensionCssHook(element, requestComponent, pre_styles);
	} else if(tbtype.indexOf(name) !== -1) {
		var requestComponent = ["top", "bottom"];

		return _dimensionCssHook(element, requestComponent, pre_styles);
	} else if(name === "font-size") {

		return _curCss(element.offsetParent, name);
	}

	
	//%를 쓸 수 있는 css 속성이 있는지 확인할 수가 없다 ;;; 조사해보자 ㅠㅠ
	return 0;
}


/**
* @method
* @name daylight.css
*
* @param {Element} HTMLElement
* @param {String} CSS Property
* @retruns {string | undefined} value
* @desc CSS 속성을 가져오거나 CSS 속성에 대해 설정할 수 있다.
*/
daylight.css = function(element, name, value) {
	var type = this.type(name);
	if(type === "object") {
		daylight.each(name, function(value, key) {
			element.style[key] = value;
		});
		return;
	}
	name = daylight.camelCase(name);
	
	//set CSS value가 있으면 style을 정해준다.
	if(value !== undefined && typeof value != "boolean") {
		element.style[name] = value;
		return value;
	}
	//자동 parseFloat을 해준다.
	if(value === true) {
		var returnValue = parseFloat(_curCss(element, name));
		if(!returnValue)//returnValue가 NaN 일경우 returnValue == NaN이 false다 ㅠㅠㅠ NaN일 경우 비교문에서는 false로 나온다.. ㅠㅠㅠ
			return 0;//auto인 경우?
			
		return returnValue;
	}
	return _curCss(element, name);
}



/**
*
* @param {string} property 속성 이름
* @param {string} value 값
* @param {boolean} isNoObject 오브젝트인지 검사를 하는 부분을 제거한다. 기본값 false
* @return {this} 자기 자신
* @desc CSS 변경하거나 CSS값을 가져온다.
*/
prototype.css = function(name, value, isNoObject) {
	if(this.length === 0)
		return;
		
	if(name === undefined)
		return _style(this.get(0));

	if(!isNoObject) {
		var self = this;
		var type = daylight.type(name);
		if(type === "object") {
			//cssText를 이용한 방법
			this.each(function() {
				var element = this;
				var style = element.style;
				var cssText = "";

				var length  = style.length;
				for(var i = 0; i < length; ++i) {
					if(name[style[i]] === 0 || name[style[i]])
						continue;
					name[style[i]] = style[style[i]];
				}
				var property;
				for(property in name) {
					cssText += property + ": " + name[property] +";";
				}
				element.style.cssText = cssText;
			});
			//daylight.each(name, function(value, key) {
			//	self.css(key, value, true);
			//});
			return this;
		}
	}
	name = daylight.camelCase(name);
	if(value !== undefined) {
		this.forEach(function(e) {
			e.style[name] = value;
		});
		return this;
	}
	var e0 = this.get(0);
	if(e0 === undefined)
		return;
		
	return daylight.css(e0, name);
}



//event
	
var _isIeCustomEvent = !document.createEvent && !!document.createEventObject;
var _customEvents = {};



daylight.initEvent = function(name, extra) {
	var e;
	if(_isIeCustomEvent) {
		e = document.createEventObject();
		e.type = name;
		e.eventType = name;
	} else {
		e = document.createEvent("Event");
		e.initEvent(name, true, true);
	}
	for(var key in extra)
		e[key] = extra[key];
	
	return e;
}
daylight.triggerCustomEvent = function(element, name, extra) {
	//중복 제거하기 test
	var e = daylight.initEvent(name);

	if(!_customEvents.hasOwnProperty(name))
		return;
		
	var event_trigger_info = _customEvents[name];
	for(var i =0, length = event_trigger_info.length; i < length; ++i) {
		var event_info = event_trigger_info[i];
		var has = daylight.has(event_info.element, element, true);
		if(has) {
			//함수로 빼기. test
			e.srcElement = e.target = element;
			e.currentTarget = event_info.element;
			
			event_info.handler.call(event_info.element, e);
		}
	}
	return;
}
daylight.trigger = function(element, key, extra) {
	var returnValue = false;
	var e = daylight.initEvent(key, extra);

	if(element.dispatchEvent) {
		returnValue = element.dispatchEvent(e);
		//console.log(returnValue);
	} else if(element.fireEvent) {
		if(_isIeCustomEvent) {
			//mouseEvent의 버블링 해야겠다 ㅠㅠ
			returnValue = daylight.triggerCustomEvent(element, key, extra);
		}else {
			returnValue = element.fireEvent("on" + key, e);
		}
	} else if(element[key]) {
		returnValue = element[key](e);
	} else if(element["on" +key]) {
		returnValue = element["on" +key](e);
	}
	
	return returnValue;
}

prototype.trigger = function(key, extra) {
	this.each(function(element) {
		daylight.trigger(element, key, extra);
	});
	return this;	
};
prototype.bind = prototype.on = function(key, func, type) {
	if(func) {
		this.each(function(ele) {
			if(ele.addEventListener){
				ele.addEventListener(key, func);    
			} else if(ele.attachEvent){ // IE < 9 :(
			    ele.attachEvent("on" + key, function(e){ func.call(ele, e )});
				if(_isIeCustomEvent) {
					if(!_customEvents[key])
						_customEvents[key] = [];
					_customEvents[key].push({element: ele, handler: func, bubble: type=== undefined? true : !type, capture: !!type});
				}
			} else{
				ele["on" + key] = handler;
			}
		});
	} else {
		this.trigger(key);
	}
	return this;
};


"scroll load dblclick click mousedown mouseover mousemove mouseup mouseleave focus keydown keypress keyup select selectstart resize".split(" ").forEach(function(name, index, arr) {
	if(typeof name !== "string")
		return;

	prototype[name] = function(func) {
		this.on(name, func);
		return this;
	}
});

daylight.extend(true, prototype, {
	dragEvent: function(e, dragDistance, dataTransfer, dragObject) {
		//console.log(e.constructor);
		var extra = {};
		extra = e;
		extra.dragInfo = dragDistance;
		extra.dragElement = event.dragObject = dragObject;
		extra.stx = dragDistance.stx;
		extra.sty = dragDistance.sty;
		extra.dragX = dragDistance.x;
		event.dragY = dragDistance.y;
		extra.dx = dragDistance.dx;
		extra.dy = dragDistance.dy;
		extra.daylight = true;
		extra.is_touch = dragDistance.is_touch;
		extra.transfer = dataTransfer;
		return extra;
	},
	dr1ag: function(dragFunc) {
		var dragObject = null;
		var is_drag = false;
		var is_move = false;
		var dragDistance = {x : 0, y : 0};
		var dataTransfer = {
			data: {},
			dragInfo: {x:0, y:0, is_append: false, dragElement: null},
			setDragElement: function(element, x, y) {
				var dragInfo = this.dragInfo;
				dragInfo.dragElement = element.cloneNode(true);
				dragInfo.x = x || 0;
				dragInfo.x = y || 0;
				dragInfo.dragElement.style.cssText += "position:fixed;opacity:0.5;-webkit-opacity:0.5;-moz-opacity:0.5;z-index:20;";
				dragInfo.dragElement.className += " day-ghost-element";
				dragInfo.is_append = false;
			},
			setDragImage: function(element, x, y) {
				this.setDragElement(element, x, y);
				
			},
			setData: function(name, value) {
				this.data[name] = value;
			},
			getData: function(name) {
				return this.data[name];
			}
		};
		var prePosition = null;
		var self = this;
		var bObject = daylight.isPlainObject(dragFunc);
		var bFunction = daylight.isFunction(dragFunc);
		var bScreenPosition = false;
		var bStopProgation = bObject && dragFunc.stopProgation;
		var pos = {x:"pageX", y:"pageY"};
		
	
		var mouseDown = function(e) {
			if(e.type === "touchstart") {
				var touches = e.touches;
				if(touche.length > 1) {
					if(is_move === false) {
						is_drag = false;
					}
				}
			}
			prePosition = daylight.$E.cross(e);
			dragDistance = {stx :prePosition[pos.x], sty : prePosition[pos.y], x : 0, y : 0, dx:0, dy:0, is_touch:prePosition.is_touch, is_drag: false};
			
			dataTransfer.data = {};
			dataTransfer.dragInfo = {x:0, y:0, is_append: false, dragElement: null};
			
			dragObject = e.target || e.srcElement;
			
			is_drag = true;
			is_move = false;
			
			var extra = self.dragEvent(e, dragDistance, dataTransfer, dragObject);
			var returnValue = daylight.trigger(this, "dragstart", extra);
	
			if(returnValue === false) {
				if(e.preventDefault) e.preventDefault();
				e.returnValue = false;
			}
		};
		var mouseMove = function(e) {
			if(!is_drag)
				return;
			is_move = true;
			var position = daylight.$E.cross(e);
			
			dragDistance.dx = position[pos.x] - prePosition[pos.x];
			dragDistance.dy = position[pos.y] - prePosition[pos.y];
			dragDistance.x = position[pos.x] - dragDistance.stx;
			dragDistance.y = position[pos.y] - dragDistance.sty;
	
			prePosition = position;
			
			dragDistance.is_drag = true;
			
			var dragInfo = dataTransfer.dragInfo;
			var dataTransferDragElement = dragInfo.dragElement;
			if(dataTransferDragElement) {
				console.log("draggable");
				var dragElementX = position[pos.x] + dragInfo.x;
				var dragElementY = position[pos.y] + dragInfo.y;
				if(!dragInfo.is_append) {
					dragInfo.is_append = true;
					this.appendChild(dataTransferDragElement);
					console.log("append");
				}
				dataTransferDragElement.style.cssText += "left:" + dragElementX +"px;top:"+dragElementY+"px;";
			}

			var extra = self.dragEvent(e, dragDistance, dataTransfer, dragObject);
			var returnValue = daylight.trigger(this, "drag", extra);
			
			
			if(returnValue === false) {
				if(e.preventDefault) e.preventDefault();
				e.returnValue = false;
			}
		};
		var mouseUp = function(e) {
			if(!is_drag)
				return;
			
			var dragInfo = dataTransfer.dragInfo;
			var dataTransferDragElement = dragInfo.dragElement;
			if(dataTransferDragElement) {
				if(dragInfo.is_append) {
					this.removeChild(dataTransferDragElement);
				}
				dragInfo.dragElement = null;
			}
			is_drag = false;
			
			var extra = self.dragEvent(e, dragDistance, dataTransfer, dragObject);
			var returnValue = daylight.trigger(this, "dragend", extra);
				
				
			dragObject = null;
		}
		var mouseLeave = function(e) {
			if(!is_drag)
				return;
			
			
			if(daylight(this).has(e.target, true).size() === 0) {
				mouseUp.call(this, e);
				console.log("mouseleave");
			}
		}
		var mouseOut = function(e) {
			if(!is_drag)
				return;
			

			var target = e.toElement || e.target;


			if(daylight(this).has(target, true).size() === 0) {
				
				mouseUp.call(this, e);
				console.log("mouseOut");
			}
		}
		this.on("mousedown", mouseDown);
		this.on("mousemove", mouseMove);
		this.on("mouseup", mouseUp);
		this.on("mouseleave", mouseLeave);
		this.on("mouseout", mouseOut);		
		this.on("dragcancel", function(e) {
			//var event = self.dragEvent("drag", e, dragDistance, dragObject);
			is_drag = false;
			dragObject = null;
		});
		
		if(!bObject || bObject && !dragFunc.isOnlyMouse) {
			this.on("touchstart", mouseDown);
			this.on("touchmove", mouseMove);
			this.on("touchend", mouseUp);
		}
		
		return this;
	},
	draggable: function(dragFunc) {
		var dragObject = null;
		var is_drag = false;
		var is_move = false;
		var dragDistance = {x : 0, y : 0};
		var dataTransfer = {
			data: {},
			dragInfo: {x:0, y:0, is_append: false, dragElement: null},
			setDragElement: function(element, x, y) {
				var dragInfo = this.dragInfo;
				dragInfo.dragElement = element.cloneNode(true);
				dragInfo.x = x || 0;
				dragInfo.x = y || 0;
				dragInfo.dragElement.style.cssText += "position:fixed;opacity:0.5;-webkit-opacity:0.5;-moz-opacity:0.5;z-index:20;";
				dragInfo.dragElement.className += " day-ghost-element";
				dragInfo.is_append = false;
			},
			setDragImage: function(element, x, y) {
				this.setDragElement(element, x, y);
				
			},
			setData: function(name, value) {
				this.data[name] = value;
			},
			getData: function(name) {
				return this.data[name];
			}
			
		};
		var prePosition = null;
		var self = this;
		var bObject = daylight.isPlainObject(dragFunc);
		var bFunction = daylight.isFunction(dragFunc);
		var bScreenPosition = false;
		var bStopProgation = bObject && dragFunc.stopProgation;
		var pos = {x:"pageX", y:"pageY"};
		
	
		var mouseDown = function(e) {
			if(e.type === "touchstart") {
				var touches = e.touches;
				if(touche.length > 1) {
					if(is_move === false) {
						is_drag = false;
					}
				}
			}
			prePosition = daylight.$E.cross(e);
			dragDistance = {stx :prePosition[pos.x], sty : prePosition[pos.y], x : 0, y : 0, dx:0, dy:0, is_touch:prePosition.is_touch, is_drag: false};
			
			dataTransfer.data = {};
			dataTransfer.dragInfo = {x:0, y:0, is_append: false, dragElement: null};
			
			dragObject = e.target || e.srcElement;
			
			is_drag = true;
			is_move = false;
			
			var extra = self.dragEvent(e, dragDistance, dataTransfer, dragObject);
			var returnValue = daylight.trigger(this, "dragstart", extra);
	
			if(returnValue === false) {
				if(e.preventDefault) e.preventDefault();
				e.returnValue = false;
			}
		};
		var mouseMove = function(e) {
			if(!is_drag)
				return;
			is_move = true;
			var position = daylight.$E.cross(e);
			
			dragDistance.dx = position[pos.x] - prePosition[pos.x];
			dragDistance.dy = position[pos.y] - prePosition[pos.y];
			dragDistance.x = position[pos.x] - dragDistance.stx;
			dragDistance.y = position[pos.y] - dragDistance.sty;
	
			prePosition = position;
			
			dragDistance.is_drag = true;
			
			var dragInfo = dataTransfer.dragInfo;
			var dataTransferDragElement = dragInfo.dragElement;
			if(dataTransferDragElement) {
				console.log("draggable");
				var dragElementX = position[pos.x] + dragInfo.x;
				var dragElementY = position[pos.y] + dragInfo.y;
				if(!dragInfo.is_append) {
					dragInfo.is_append = true;
					this.appendChild(dataTransferDragElement);
					console.log("append");
				}
				dataTransferDragElement.style.cssText += "left:" + dragElementX +"px;top:"+dragElementY+"px;";
			}

			var extra = self.dragEvent(e, dragDistance, dataTransfer, dragObject);
			var returnValue = daylight.trigger(this, "drag", extra);
			
			
			if(returnValue === false) {
				if(e.preventDefault) e.preventDefault();
				e.returnValue = false;
			}
		};
		var mouseUp = function(e) {
			if(!is_drag)
				return;
			
			var dragInfo = dataTransfer.dragInfo;
			var dataTransferDragElement = dragInfo.dragElement;
			if(dataTransferDragElement) {
				if(dragInfo.is_append) {
					this.removeChild(dataTransferDragElement);
				}
				dragInfo.dragElement = null;
			}
			is_drag = false;
			
			var extra = self.dragEvent(e, dragDistance, dataTransfer, dragObject);
			var returnValue = daylight.trigger(this, "dragend", extra);
				
				
			dragObject = null;
		}
		var mouseLeave = function(e) {
			if(!is_drag)
				return;
			
			
			if(daylight(this).has(e.target, true).size() === 0) {
				mouseUp.call(this, e);
				console.log("mouseleave");
			}
		}
		var mouseOut = function(e) {
			if(!is_drag)
				return;
			

			var target = e.toElement || e.target;


			if(daylight(this).has(target, true).size() === 0) {
				
				mouseUp.call(this, e);
				console.log("mouseOut");
			}
		}
		this.on("mousedown", mouseDown);
		this.on("mousemove", mouseMove);
		this.on("mouseup", mouseUp);
		this.on("mouseleave", mouseLeave);
		this.on("mouseout", mouseOut);		
		this.on("dragcancel", function(e) {
			//var event = self.dragEvent("drag", e, dragDistance, dragObject);
			is_drag = false;
			dragObject = null;
		});
		
		if(!bObject || bObject && !dragFunc.isOnlyMouse) {
			this.on("touchstart", mouseDown);
			this.on("touchmove", mouseMove);
			this.on("touchend", mouseUp);
		}
		
		return this;
	}
});

var window = window.window;
daylight.extend(true, prototype, {
	visible: function(obj) {
		var obj = obj || {top:"0%", left:"0%", width:"100%", height: "100%"};
		var top = obj.top || "0%";
		var left = obj.left || "0%";
		var width = obj.width || "100%";
		var height = obj.height || "100%";
		
		this.each(function(e) {
			var self = this;
			var is_visible = false;
			var dlElement = daylight(this);
			
			dlElement.on("scroll", function(e) {
				var screen = obj;
				
				var windowWidth = window.innerWidth;
				var windowHeight = window.innerHeight;
				
				var width = dlElement.outerWidth();
				var height = dlElement.outerHeight();
				var rect = window.getBoundingClientRect(self);
				
				var top = rect.top;
				var left = rect.left;
				
				var screenX = parseFloat(screen.left);
				var	screenY = parseFloat(screen.top);
				var screenX2 = screenX + parseFloat(screen.width);
				var screenY2 = screenY + parseFloat(screen.height);

				//visible 영역에 들어오면
				if(!is_visible) {
					is_visible = true;
					daylight.trigger(this, "visible");
				} 
				
				//visible 영역에 들어오지 않았을 때
				if(is_visible) {
					is_visible = false;
					daylight.trigger(this, "invisible");
				} 					
			});
		});
	}	
})

var _touch = function(e) {
	var te = {};
	if (e.touches) {
		te.changes = e.changedTouches;
		te.touches = e.touches;
		te.length = te.touches.length;
	}
	return te;
}, _pos = function (e, bGetOffset) {
	var body = document.body;
	var documentElement = document.documentElement;
	var left = body.scrollLeft || documentElement.scrollLeft;
	var top = body.scrollTop || documentElement.scrollTop;
	
	var pos = {
		clientX : e.clientX,
		clientY : e.clientY,
		pageX   : e.pageX,
		pageY   : e.pageY,
		layerX  : e.offsetX || e.layerX,
		layerY  : e.offsetY || e.layerY, //ie6 layerY
		screenX : e.screenX,
		screenY : e.screenY
	};
	return pos;
}, _touchOne = function(e) {

	if (e.touches) {
		var xy = (e.type === "touchend") ? _pos(e.changedTouches[0]) : _pos(e.touches[0]);
		return xy;
	}
	return {};
}


/*
	reference to jindo.$Event
*/
daylight.Event = daylight.$Event = function(e) {
	var callee = arguments.callee;
	if (e instanceof callee) return e;
	if (!(this instanceof callee)) return new callee(e);
	
	if(e === undefined) e = window.event;
	var element = e.target || e.srcElement;


	if (element.nodeType == 3) //Text
		element = element.parentNode;
		
			
	var currentElement = e.currentTarget || element;
	
	this.target = this.element = element;
	this.currentElement = currentElement;
	this.type = e.type;
	this._event = e;
}
var eventPrototype = daylight.$Event.prototype
eventPrototype.preventDefualt = function() {
	this._event.preventDefault();
}
eventPrototype.pos = function(bGetOffset) {
	return _pos(this._event, bGetOffset);
}
eventPrototype.mouse = function(bGetOffset) {
	return _pos(this._event, bGetOffset);
}
eventPrototype.touch = function(e) {
	return _touch(this._event);
}
eventPrototype.cross = function(e) {
	return daylight.$E.cross(this._event);
}

//reference to jindo.desktop.all.ns.js => jindo.$Event.prototype.key
eventPrototype.key = function() {
	var e = this._event;
	var keyCode = e.keyCode || e.charCode;
	var ret   = {
		keyCode		: keyCode,
		alt			: e.altKey,
		ctrl		: e.ctrlKey,
		meta		: e.metaKey,
		shift		: e.shiftKey,
		up			: (keyCode == 38),
		down		: (keyCode == 40),
		left		: (keyCode == 37),
		right		: (keyCode == 39),
		enter		: (keyCode == 13),	
		space		: (keyCode == 32),	
		esc			: (keyCode == 27),
		command		: (keyCode == 91),
		character	: String.fromCharCode(keyCode)
	};
	if(ret.up)
		ret.character = "up";
	else if(ret.down)
		ret.character = "down";
	else if(ret.left)
		ret.character = "left";
	else if(ret.right)
		ret.character = "right";
	else if(ret.space)
		ret.character = "space";
		
	switch(keyCode) {
	case 187: ret.character = "=";break;
	case 189: ret.character = "-";break;
	case 222: ret.character = "'";break;
	}
	return ret;
};

daylight.$E = {
	pos : function(e) {return _pos(e); },
	touch : function(e) {return _touch(e);},
	cross : function(e) {
		var is_touch = e.touches !== undefined;
		var pos = {};
		if(is_touch) pos = _touchOne(e);
		else pos = _pos(e);
		
		pos.is_touch = is_touch;
		return pos;
		
	}
}


"scroll load dblclick click mousedown mouseover mousemove mouseup mouseleave focus keydown keypress keyup select selectstart resize".split(" ").forEach(function(name, index, arr) {
	if(typeof name !== "string")
		return;
		
	prototype[name] = function(func) {
		this.on(name, func);
		return this;
	}
});

prototype.extend({
	wheel: function(func) {
		this.on("DOMMouseScroll", func);
		this.on("mousewheel", func);
	}
});
prototype.ready = function(func) {
	function listener(e) {
		if (e && e.readyState  || this.readyState === "interactive") {
			func.call(this, e);
		}
	};
	this.each(function() {
		if(this.readyState === "interactive" || this.readyState === "complete")
			listener({readyState : "interactive"});
	});
	
	this.on("readystatechange", listener);

};

//dimension
prototype.extend({
	dimension : function(type) {
		var sType = daylight.type(type);
		var name;
		if(sType === "number")
			name = type === 1 ? "width" : "height";
		else name = type;
		
		
		var element = this.get(0);
		if(!element)
			return 0;
		
		var offset_parent = element.offsetParent;
		var element_styles = _style(offset_parent);
		var dimension = _curCssHook(offset_parent, name, element_styles);
		return dimension;
		
	},
	
	style : function(name) {
		var o = this.get(0);
		if(!daylight.isElement(o))
			return;
		
		return o.style[name];
	}
});

//demension 관련 함수들  width, height, innerWidth, innerHeight, outerWidth, outerHeight
daylight.each(["Width", "Height"], function(name) {
	if(typeof name !== "string")
		return;
		
	
	var lowerName = name.toLowerCase();
	var requestComponent = name === "Width" ? ["left", "right"] : ["top", "bottom"];
	prototype[lowerName] = function() {
		if(this[lowerName] > 0)
			return this[lowerName];
			
		var currentStyle = this.style();
		var o = this.get(0);
		var dimension = 0;
		
		if(!o)
			return;
			
		if(o["client" + name] > 0) {
			dimension = o["client" + name];
		
		var cssHooks = _style(o);
		
		dimension -= parseFloat(_curCss(o, "padding-" + requestComponent[0], cssHooks));
		
		dimension -= parseFloat(_curCss(o, "padding-" + requestComponent[1], cssHooks));
			
			return dimension;
		}
		var dimension = o["offset" + name];
		var cssHooks = _style(o);
		dimension -= parseFloat(_curCss(o, "padding-" + requestComponent[0], cssHooks));
		dimension -= parseFloat(_curCss(o, "padding-" + requestComponent[1], cssHooks));
		dimension -= parseFloat(_curCss(o, "border-" + requestComponent[0] + "-width", cssHooks));
		dimension -= parseFloat(_curCss(o, "border-" + requestComponent[1] + "-width", cssHooks));

		return dimension;
	}
	prototype["inner" + name] = function() {
		var o = this.get(0);
		
		if(!o)
			return;

		if(o["inner" + name] > 0)
			return o["inner" + name]

		//if(o["client" + name] > 0)
		//	return o["client" + name]



		var dimension = o["offset" + name];
		var cssHooks = _style(o);
		dimension -= parseFloat(_curCss(o, "border-" + requestComponent[0] + "-width", cssHooks));
		dimension -= parseFloat(_curCss(o, "border-" + requestComponent[1] + "-width", cssHooks));
		
		return dimension;
	}
	prototype["outer" + name] = function(bInlcudeMargin) {
		var currentStyle = this.style();
		var o = this.get(0);

		if(!o)
			return;


		var dimension = o["offset" + name] || o["outer" + name];
		
		if(bInlcudeMargin) {
			var cssHooks = _style(o);
			dimension += parseFloat(_curCss(o, "margin-" + requestComponent[0], cssHooks)) + parseFloat(_curCss(o, "margin-" + requestComponent[1], cssHooks));
		}
		return dimension;
	}
	prototype["scroll" + name] = function(bInlcudeMargin) {
		//var currentStyle = this.style();
		var o = this.get(0);

		if(!o)
			return;


		var dimension = o["scroll" + name];
		
		return dimension;
	}
});
prototype.extend({
	position: function() {
		//margin padding을 무시한 위치

		var offsetParent, offset,
			elem = this.get(0);
			parentOffset = { top: 0, left: 0 };


		// Fixed elements are offset from window (parentOffset = {top:0, left: 0}, because it is its only offset parent
		if ( _curCss(elem, "position") === "fixed" ) {
			offset = elem.getBoundingClientRect();
		} else {
			offsetParent = this.offsetParent();
			offset = this.offset();
			var elOffset = offsetParent.get(0);
			if(!elOffset)
				return;

			if ( !daylight.nodeName(elOffset, "html" ) ) {
				parentOffset = offsetParent.offset();
		
			}
			// Add offsetParent borders
			parentOffset.top += _curCss(elOffset, "borderTop") == 0 ? 0 : daylight.css(elOffset, "borderTopWidth", true );
			parentOffset.left +=  _curCss(elOffset, "borderLeft") == 0 ? 0 : daylight.css(elOffset, "borderLeftWidth", true );
			//parentOffset.top -= daylight.css( offsetParent.o[0], "paddingTop", true );
			//parentOffset.left -= daylight.css( offsetParent.o[0], "paddingLeft", true );
			parentOffset.top -= daylight.css(elOffset, "marginTop", true );
			parentOffset.left -= daylight.css(elOffset, "marginLeft", true );			
			//console.log(daylight.css( offsetParent.o[0], "marginTop"));
		}

		return {
			top: offset.top - parentOffset.top - daylight.css( elem, "marginTop", true ),
			left: offset.left - parentOffset.left - daylight.css( elem, "marginLeft", true )
		};

	}
	//reference to jQuery offset
	,offset: function() {
		//contents의 위치
		var element = this.get(0);
		var box = { top: 0, left: 0 };
		if(!element)
			return box;
		
		var win = window;
		var doc = document;
		var docElem = docElem = doc.documentElement;
		if(element.getBoundingClientRect)
			box = element.getBoundingClientRect();

		return {
			top: box.top + (win.pageYOffset || 0) - (docElem.clientTop || 0),
			left: box.left + (win.pageXOffset || 0) - (docElem.clientLeft || 0)
		};
	}
});
daylight.each(["Top", "Left"], function(name) {
	var funcName = "scroll" + name;
	prototype[funcName] = function(value) {
		if(typeof value !== "undefined") {
			this.each(function(e) {
				
				e[funcName] = value;
				if(e === document.body) {
					docElem[funcName] = value;
				}
			});
			return this;
		} else {
			if(!daylight.isElement(this.get(0)))
				return;
				
			return this.get(0)[funcName] || docElem[funcName];
		}
	}
});




//html, value, text, insertion
daylight.clone = function(node, dataAndEvent, deepDataAndEvent) {
	var n = node.cloneNode();
	n.innerHTML = node.innerHTML;
	return n;
}
var _textToElement = function(text) {
	var e = document.createElement("div");
	e.innerHTML = text;
	return e;
}
var _addDomEach = function(dlObject, element, callback) {
	if(dlObject.length === 0)
		return;
		
	var t = _checkType(element, true);
	var e;
	switch(t) {
	case "string":
	case "number":
		e = _textToElement(element).childNodes;
		break;
	case "daylight":
		e = element.o;
		break;
	case sElementList:
	case "nodelist":
	case "array":
		e = element;
		break;
	case "element":
		e = [element];
	}
	
	if(e === undefined)
		return;
	
	var length = e.length;
	//1개만 있을 경우 원본을 추가한다. 원본이 추가될 경우 원래 있던 곳은 자동으로 삭제 된다.
	if(dlObject.length === 1) {
		var self = dlObject.get(0);
		for(var i = 0; i < length; ++i) {
			if(self === e[i])
				continue;
			
			callback.call(self, self, e[i]);
		}
		
	} else {
		//복사한 element를 추가한다.
		dlObject.each(function(self, index) {
			for(var i = 0; i < length; ++i) {
				if(self === e[i])//자기 자신에 자신을 추가 할 수 없다.
					continue;
				callback.call(self, self, daylight.clone(e[i]));
			}
		});
		//이제 다 추가하고 원래 있던 건 지운다.
		for(var i = 0; i < length; ++i) {
			var parent = e[i].parentNode;
			if(!parent)
				continue;
			
			parent.removeChild(e[i]);
		}
	}
}
prototype.extend({
	before : function(obj) {
		var is_element = daylight.isElement(obj);//type 검사
		if(!is_element) {
			var type = _checkType(obj);
			if(type === "string" || type === "boolean" || type === "number") {
				this.insertHTML("beforebegin", obj); 
				return this;
			}
		}
		_addDomEach(this,obj, function(target, element) {
			if(daylight.isElement(target) && target.parentNode)
				target.parentNode.insertBefore(element, target);
		});
		return this;
	},
	prepend : function(obj) {
		var is_element = daylight.isElement(obj);//type 검사
		if(!is_element) {
			var type = _checkType(obj);
			if(type === "string" || type === "boolean" || type === "number") {
				this.insertHTML("afterbegin", obj);
				return this;
			}
		}
		_addDomEach(this, obj, function(target, element) {
			if(daylight.isElement(target))
				target.insertBefore(element, target.firstChild);
		});
		return this;
	},
	append : function(obj) {
		var is_element = daylight.isElement(obj);//type 검사
		if(!is_element) {
			var type = _checkType(obj);
			if(type === "string" || type === "boolean" || type === "number") {
				this.insertHTML("beforeend", obj);
				return this;
			}
		}
		_addDomEach(this, obj, function(target, element) {
			if(daylight.isElement(target))
				target.appendChild(element);
		});
		return this;
		
	},
	after : function(obj) {
		var is_element = daylight.isElement(obj);//type 검사
		if(!is_element) {
			var type = _checkType(obj);
			if(type === "string" || type === "boolean" || type === "number") {
				this.insertHTML("afterend", obj);
				return this;
			}
		}
		_addDomEach(this, obj, function(target, element) {
			if(daylight.isElement(target) && target.parentNode)
				target.parentNode.insertBefore(element,  target.nextSibling );
		});
		return this;
	},
	insertHTML : function(position, html) {//html 삽입하는 함수
		this.each(function(element) {			
			element.insertAdjacentHTML(position, html);
		});
		return this;
	},
	html: function(value) {
		if(!(value === undefined)) {
			this.each(function() {
				this.innerHTML = value;
			});
		}
		if(this.length === 0)
			return "";
			
		var target = this.get(0);
		if(target === undefined)
			return;
		return target.innerHTML;
	},
	text : function(value) {
		if(!(value === undefined)) {
			this.each(function() {
				this.innerText = value;
			});
			return this;
		}
		var target = this.get(0);
		if(target === undefined)
			return;
		return target.innerText;
	},
	ohtml: function(value) {
		if(!(value === undefined)) {
			this.each(function() {
				thisuterHTML = value;
			});
		}
		var target = this.get(0);
		if(target === undefined)
			return;
		return target.outerHTML;
	}
});
daylight.extend(true, prototype, {
	removeChild : function(element) {
		var size = this.length;
		for(var i = 0; i < size; ++i) {
			try {
				this.get(i).removeChild(element);
			} catch(e) {
			}
		}
		return this;
	},
	remove : function(selector) {
		var type = _checkType(selector, true);
		if(type === "undefined") {
			this.each(function(element) {
				var parent = element.parentNode;
				if(!parent)
					return;
				try {
					parent.removeChild(element);
				} catch(e) {}
			});
		} else if(type === "element") {
			this.removeChild(selector);
		} else if(type === sString){
			this.each(function(element) {
				var a = element.querySelectorAll(selector);
				var length = a.length;
				for(var i = 0; i < length; ++i) {
					try {
						element.removeChild(a[i]);
					} catch(e) {
						console.log(e);
					}
				}
			});
		}
		return this;
	}
});
var _value = {
	//SELECT 태그에 해당하는 함수
	select : {
		get : function(element) {
			var result = [];
			var options = element && element.options;
			var opt;
			length=options.length
			for (var i=0; i < length; ++i) {
				opt = options[i];
				
				if (opt.selected)
					result[result.length] = (opt.value || opt.text);
			}
			return result.length > 1 ? result : result[0];
		},
		set : function(element, key) {
			var options = element && element.options;			
			if(!options)
				return;
			
			var result = [];
			var type = daylight.type(key);
			var length = options.length;
			if(!length)
				return;
			//isSelected => X
			switch(type) {
			case "number":
				for(var i = 0; i < length; ++i) {
					var opt = options[i];
					opt.selected = false;
				}
				options[key].selected = true;
				break;
			case "string":
				for(var i = 0; i < length; ++i) {
					var opt = options[i];
					var value = (opt.value || opt.text);
					opt.selected = value === key;
				}
				break;
			case "array":
				for(var i = 0; i < length; ++i) {
					var opt = options[i];
					var value = (opt.value || opt.text);
					opt.selected = (key.indexOf(value) >= 0);
				}
			}
		}
	},
	input : {
		get : function(element, is_value) {
			var type = element.type;
			if(!_value[type])
				return element.value;
			else
				return _value[type].get(element, is_value);
		},
		set : function(element, value) {
			var type = element.type;
			if(!_value[type])
				element.value = value;
			else
				_value[type].set(element, value);	
		}
	},
	textarea : {
		get : function(element) {
			return element.value || element.innerText;
		},
		set : function(element, key) {
			element.value = element.innerText = key;
		}
	},
	radio : {
		get : function(element, is_checked) {
			if(is_checked)
				return element.checked;
			return element.value;
	
		},
		set : function(element, key) {
			var type = daylight.type(key);
			if(type === "array")
				element.checked = !!(key.indexOf(element.value) >= 0); 
			else
				element.checked = (element.value === key);
		}		
	},
	checkbox : {
		get : function(element, is_checked) {
			if(is_checked)
				return element.checked;
			return element.value;
		},
		set : function(element, key) {
			var type = daylight.type(key);
			if(type === "array")
				element.checked = !!(key.indexOf(element.value) >= 0);
			else 
				element.checked = element.value === key;
		}
	}
	
};

prototype.extend({
	val: function(value) {
		if(!(value === undefined)) {
			this.each(function() {
				if(!daylight.isElement(this))
					return;
					
				var node = this.nodeName.toLowerCase();
				_value[node].set(this, value);
			});
			return this;
		}
		var element = this.get(0);
		if(!daylight.isElement(element))
			return;

		var node = element.nodeName.toLowerCase();
		return _value[node].get(element);
	}
});


//template
/**
* @func : daylight.template(object, template)
* @param : object(Array, Object), template(String, Daylight)
* @return : html(String)
*/
daylight.template = function(obj, template) {
	var type = _checkType(obj);
	var templateType = _checkType(template);
	
	if(templateType === sDaylight ||templateType === sNodeList)
		template = template.ohtml() || "";//html 형태로 변환
		
	if(type === sArray) {//배열이면 리스트 형태로 만든다.
		var contents = [];
		var length = obj.length;
		for(var i = 0; i < length; ++i) {
			var content = obj[i];
			contents[contents.length] = this.template(content, template);//배열의 요소를 다시 template을 만든다.
		}
		return contents.join(" ");
	} else if(type === sObject) {//배열의 요소를 분석해서 {key}를 바꿔준다.
		for(var k in obj) {
			var value = obj[k];
			if(this.type(value) === "array") {//만드는 중
				var regx = new RegExp('{' + k + '}((.|\n|\r)*?){/'+ k + '}', 'g');
				var list = template.match(regx);
				
				if(!list)
					continue;
				
				for(var i = 0; i < list.length; ++i) {
					var sub_template = list[i];
					sub_template = sub_template.replace("{" + k + "}", "");
					sub_template = sub_template.replace("{/" + k + "}", "");
					template = template.replace(list[i], daylight.template(value, sub_template) );//{key} => value
				}
				
			} else {
				if(typeof value === "undefined")
					value = "";
				template = template.replaceAll("{" + k + "}", value);//{key} => value
			}
		}
		//console.log(template);
		return template;
	} else {
		//배열이나 Dictionary 형태가 아닌 다른 것들은 키를 1로 하고 value로 바꿔준다.
		try {
		return template.replaceAll("{1}", obj);//{1} => value
		}
		catch(e) {
			console.error("?");	
		}
		
	}
	return "";
}



prototype.template = function(o, t) {
	this.html(daylight.template(o, t));
	return this;
};





daylight.extend({
	searchByQuery: daylight.query,
	searchByClass: daylight.class,
	searchById: daylight.id,
	searchByName: daylight.name,
	type: _checkType,
	checkType: _checkType
});

prototype.extend({
	isEmpty: prototype.empty,
	forEach: prototype.each
});


daylight.fn = prototype;

daylight.fn.extend =  function() {
	var length = arguments.length;
	var i = 0;
	var target = this;
	for(; i < length; ++i) {
		object = arguments[i];
		for(var key in object) {
			prototype[key] = object[key];
		}
	}
	
	return this;
}


})(window);


(function(daylight) {
	var template = daylight.template;
	var dEval = window.eval;
	var compile = {};
	compile.notEndTag = ["var", "set", "include", "js"];
	compile.tag = function(text) {
		var copy = text =  text.replace(/(<(\/|.)?(var|foreach|block|if|elseif|else|for|set|include|template|js)(?:"[^"]*"['"]*|'[^']*'['"]*|[^'">])*>)/g, "$1 ");
		var tagReg = /(<(\/|.)?(var|foreach|block|for|if|elseif|else|set|include|template|js)((?:"[^"]*"['"]*|'[^']*'['"]*|[^'">])*)>)((.|\n|\r)[^\<]*)/g;
		var attributeReg = /([^\s=]+)\s*=\s*(\"([^\"]*?)\"|\'([^\']*?)\')/g;
		var notEndTag = this.notEndTag;
		var grade = 0;
		var variable = {};
		var depth = 0;
		var result2, result;
		while(result = tagReg.exec(copy)) {
			var sNode = result[1];
			var sEnd = result[2] || "";
			var nodeName = result[3];
			var sAttributes = result[4];
			var sText = result[5];
			var aAttributes = {};

			while(result2 = attributeReg.exec(sAttributes)) {
				//console.log(result2);
				aAttributes[result2[1]] = typeof result2[3] !== "undefined" ? result2[3] : result2[4];
			}
	
			//inner HTML
			aAttributes["template-data-text"] = sText.replace(" ", ""); 

			if(sEnd === "/" ) {
				if(notEndTag.indexOf(nodeName) != -1)
					text = text.replace(sNode +" ", "");
				else
					text = text.replace(sNode +" ", "{/" + nodeName+"}");
			} else {
				var sAttribute = "";
				var sNodeType = nodeName +"Block";
				if(this.tag.sets[sNodeType]) {
					sAttribute = " " + this.tag.sets[sNodeType](grade, variable, aAttributes);
				}
				if(notEndTag.indexOf(nodeName) != -1)
					text = text.replace(result[0], "{"+nodeName+sAttribute+"}");
				else
					text = text.replace(sNode +" ", "{"+nodeName+sAttribute+"}");
			}
		}
		return text;
	}
	var tagsets = compile.tag.sets = {};
	tagsets.setBlock = function(grade, variable, attributes) {
		var value = attributes["value"] || attributes["template-data-text"];
		var name = attributes["name"];
		return name + "=" + value;
	}
	tagsets.foreachBlock = function(grade, variable, attributes) {
		var items =attributes["items"];// compile.replaceVariableName(grade, variable, );
		var name = attributes["var"];
		var key = attributes["key"] || "_";
		return key + " to " + name + " in " + items;
	}
	
	tagsets.varBlock = function(grade, variable, attributes) {
		var name = attributes["name"] || attributes["template-data-text"];
		//name = compile.replaceVariableName(grade, variable, name);
		return  name;
	}
	tagsets.ifBlock = tagsets.elseifBlock = function(grade, variable, attributes) {
		var cond = attributes["cond"];
		//cond = compile.replaceVariableName(grade, variable, cond, true);
		return  cond;
	}
	tagsets.jsBlock = function(grade, variable, attributes) {
		//cond = compile.replaceVariableName(grade, variable, cond, true);
		return attributes["template-data-text"];
	}
	tagsets.forBlock = function(grade, variable, attributes) {
		//for i=1 to 4 add 1
		var name = attributes["var"];
		var from = attributes["from"];
		var to = attributes["to"];
		var addition = attributes["add"] || attributes["addition"] || 1;
		return  name + " = " + from + " to " + to + " add " + addition;
	}
	tagsets.templateBlock = function(grade, variable, attributes) {
		//for i=1 to 4 add 1
		var name = attributes["name"];
		var args = attributes["args"];
		return name +" " + args;
	}
	tagsets.includeBlock = function(grade, variable, attributes) {
		//for i=1 to 4 add 1
		var name = attributes["name"];
		var args = attributes["args"];
		if(args)
			return name + " " + args;
		else
			return name;
	}
	compile.brace = function(text) {
		var token = "-%daylightT%-&@-";
		var splitter = /(\{[\s\S]*?\})/g;
			var copy = text;
		var grade = 0, nodeName;
		var replaceText = "";
		var grade = 0;
		var is_eval;
		var _grade;
		
		//console.log(text.replace(splitter, token+"$1"+token).split(token));
		var divisionText = text.replace(/\n/g, "\\n");
		divisionText = divisionText.replace(splitter, token+"$1"+token).split(token);
		var length = divisionText.length;
		
		return (function(texts) {
			//console.log(texts);
			var code = [];
			var length = texts.length;
			var result;
	
	
			var text;
			var vars = {};
			var braceReg = /({(\/|.)?(var|foreach|block|for|if|elseif|else|set|\=|include|template|js)\s?([\s\S]*?)\})/mg;
			
			code.push("(function(args) {");
			code.push("args = args || {};");
			code.push("with (args) {");
			code.push("var window = null;");
			code.push("var texts = [];");
			code.push("var text = \"\";");
			
			for(var i = 0; i < length; i += 2) {
				text = texts[i + 0].replace(/\"/g, "\\\"");
				if(text !== "")
					code.push("texts.push(\"" + text +"\");");
	
				if(!texts[i + 1])
					continue;
					
				texts[i + 1].replace(braceReg, function() {
					var result = arguments;	
					var sEnd;
					var func;
					
					sEnd = result[2];
					if(sEnd) {
						func = bracesets[result[3] + "BlockEnd"];
						if(func)
							func(code, result[4]);
						else
							code.push("}");
					} else {
						func = bracesets[result[3] + "Block"];
						if(func)
							func(code, result[4]);
					}
				});
			}
			code.push("return texts.join(\"\");");
			code.push("};");
			code.push("});");
			var codeText = code.join("\n");
			
			
			//console.log(codeText);
			return compile.ev(codeText);
			
			
		})(divisionText);
	
	};
	compile.ev = function(codeText) {
		try {
			return dEval(codeText).bind({});
		} catch(e) {
			console.error(codeText);
			throw e;
		}
	};
	var bracesets = compile.brace.sets = {};
	bracesets.foreachBlock = function(code, attr) {
		//{foreach key to item in items]
		var items = attr.split(/\s(to|in)\s/);
		var length = items.length;
		var _key = "", _item, _items;
		if(length === 3) { //not key
			_key = "";
			_item = items[0];
			_items = items[2];
		} else if(length === 5) {
			_key = ", " + items[0];
			_item = items[2];
			_items = items[4];
		} else {
			throw new Error("Syntax Error: foreach");
		}
		code.push("daylight.each(" + _items + ", function(" + _item + _key + ") {");
		//code.push("var " + items[0] + " = " + items[1] + "[key];");
	};
	bracesets.foreachBlockEnd = function(code, attr) {
		code.push("});");
	};
	bracesets.forBlock = function(code, attr) {
		//{for i = 1 to 4 add 1}
		
		var items = attr.split(/\s?(to|=|add)\s?/g);
		var length = items.length;
		if(length !== 7 && length !== 5)
			throw new Error("Syntax Error : for");
			
		var _var = items[0];
		var from = items[2] || 0;
		var to = items[4] || 0;
		var add = items[6] || 1;
		var t = "for(var " + _var + "=" + from + ";" + from + "<=" + to + "&&" + _var + "<=" + to +"||" + from + ">" + to + "&&" + _var + ">=" + to + ";" + _var + "+=" + add +") {"
		code.push(t);
	}
	bracesets.ifBlock = function(code, attr) {
		code.push("if(" +attr+ ") {");
	}
	bracesets.jsBlock = function(code, attr) {
		code.push(attr);
	}
	bracesets.elseifBlock = function(code, attr) {
		code.push("} else if(" +attr+ ") {");
	}
	bracesets.elseBlock = function(code, attr) {
		code.push("} else {");
	}	
	bracesets.varBlock = function(code, attr) {
		code.push("texts.push(" + attr + ");");
	}
	bracesets.setBlock = function(code, attr) {
		code.push("var " + attr +";");
	}
	bracesets.varBlock = function(code, attr) {
		code.push("texts.push(" + attr +");");
	}
	bracesets["=Block"] = function(code, attr) {
		code.push("texts.push(" + attr +");");
	}
	bracesets.templateBlock = function(code, attr) {
		var prefixTemplate = "$T$E";
		//{template name arg1,arg2,arg3}
		var items = (/(\S+)\s?([\s\S]*)?/mg).exec(attr);
		
		var name = items[1];
		var args = items[2] || "";
		code.push("function " + prefixTemplate + name +"("+ args +") {");
		code.push("var texts = [];");
	}
	bracesets.templateBlockEnd = function(code) {
		code.push("return texts.join(\"\");");
		code.push("}");
	}
	bracesets.includeBlock = function(code, attr) {
		var items = (/(\S+)\s?([\s\S]*)?/mg).exec(attr);
		if(!items)
			throw new Error("Syntax Error : include Error not has name");//문법 고치기
		
		var name = items[1];
		var args = items[2] || "";
		var prefixTemplate = "$T$E";
		code.push("if(typeof " + prefixTemplate + name + " === \"function\") {")
		code.push("texts.push(" + prefixTemplate + name+"(" + args + "));");
		code.push("}");
	}
	bracesets.includeBlockEnd = function(code, attr) {
	}
	daylight.templateEngine = function(info, txt) {
		if(arguments.length === 1) {
			txt = info;
			info = {};
		}
		if(!txt)
			return;
		var xml;
		if(daylight.isDaylight(txt)) {
			xml = txt.html();
		} else if(daylight.isElement(txt)) {
			xml = txt.innerHTML;
		} else {
			xml = txt;
		}
		
		info = info || {};
	
		var variable = {};
		variable.info = info;
		//xml = template.global(info, xml);
		xml = compile.tag(xml);
		var func = compile.brace(xml);
		var type = daylight.type(info);
		xml = "";
		if(type === "array") {
			var length = info.length;
			for(var i = 0; i < length; ++i) {
				xml += func(info[i]);
			}
		} else {
			xml = func(info);
		}
		return xml;
	}
	

	daylight.template.loadURL = function(url, callback) {
		function _response(text) {
			var template = new daylight.$TemplateEngine(text);
			callback(template);
		}
		daylight.ajax(url).done(function(txt, req) {	
			_response(req.responseText);
		}).fail(function(req) {
			if(!req.responseText)
				return;
			
			_response(req.responseText);
		});
	};
	daylight.$TemplateEngine = function TemplateEngine(html) {
		this.html = html;
		this._html = html;
	}
	daylight.$TemplateEngine.prototype.compileTag = function() {
		this.html = compile.tag(this.html);
		
		return this;
	}
	daylight.$TemplateEngine.prototype.compile = function() {
		this.func = compile.brace(this.html);
		
		return this;
	}
	daylight.$TemplateEngine.prototype.process = function(info) {
		if(!this.func)
			this.compile();
		
		var result = "";
		try {
			//info._obj = function() {return {};};
			result = this.func(info);
		} catch(e) {
			console.log(this.html);
			throw e;
		}
		
		return result;
	};
	
	
	daylight.fn.extend({
		templateEngine: function(info, html) {
			this.html(daylight.templateEngine(info, html));
			return this;
		},
		setTemplateEngine: function(_templateEngine) {
			this._templateEngine = _templateEngine;
			return this;
		},
		compile: function(html) {
			html = html || this.html();
			var _templateEngine = this._templateEngine;
			if(!_templateEngine) {
				_templateEngine = this._templateEngine = new daylight.$TemplateEngine(html);
				_templateEngine.compileTag();
				_tamplateEngine.compile();
			} else {
				if(_templateEngine._html !== html) {
					_templateEngine.html = _templateEngine._html = html;
					_templateEngine.compileTag();
					_tamplateEngine.compile();
				}
			}
			return this;
		},
		process: function(info, html) {

			var _templateEngine = this._templateEngine;
			if(!_templateEngine) {
				_templateEngine = this._templateEngine = new daylight.$TemplateEngine(this.html());
				_templateEngine.compileTag();
			}
			this.html(_templateEngine.process(info));
			
			return this;
		}
	});
	String.prototype.process = function(info) {
		if(!this.func)
			this.func = compile.brace(this);
			
		return this.func(info);
	}
})(daylight);

(function(daylight) {
})(daylight);
(function(daylight) {
	/*
	Setting
	autoSend(자동으로 보내기) : true
	async(비동기) : true
	Method : GET
	type : auto
	
	var a = $.ajax("http://daybrush.com/yk/board/daylightJS/test/json.php");
	json.php는 content-type이  application/json => json형태의 데이터로 보여준다.
	
	*/
	
	//test private 
	//interface  init, send, statechange
	var _ajaxFunc = {
		"ajax" : {
			//초기화
			init : function(ajax) {
				var target = new XMLHttpRequest();
				target.open(ajax.option.method, ajax.url, ajax.option.async);
				ajax.target = target;
			},
			//보내기
			send : function(ajax) {
				var request = ajax.target;
				if(ajax.option.method === "POST" && typeof ajax.param === "string" &&  ajax.param !== "") {
					var length = ajax.param.split("&").length;
					request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
					//console.log(ajax.param.length);
					//request.setRequestHeader("Content-Length", ajax.param.length);
				} else {
				}
				request.send(ajax.param);
			},
			//해당 정보를 가져온다.
			_get : function(ajax, request) {
				var contentType = request.getResponseHeader("content-type");
				switch(ajax.option.type) {
				case "auto":
					//JSON형태로 변환.
					if(contentType === "application/json")
						return daylight.parseJSON(request.responseText);
					
					//나머지는 그냥 텍스트로
					if(!request.responseXML)
						return request.responseText;
			
				case "xml":
					//XML이면 responseXML 노드 형태로 되어있다.
					if(request.responseXML)
						return request.responseXML;
					break;
				case "text":
					return request.responseText;
					break;
				case "json":
					return daylight.parseJSON(request.responseText);
				}	
				
				return request.responseText;
			},
			statechange : function(ajax) {
				var request = ajax.target;
				var self = this;
				//state변경
				request.onreadystatechange = function () {
					if (request.readyState == 4) {
						//200이 정상
						if(request.status == 200) {
							//done함수 있을 경우.
							if(ajax.func.done) {
								var value = self._get(ajax, request);
								ajax._done(value, request);
							}
						} else {
							ajax._fail(request);
						}
						ajax._always(request);
					}
				};
				request.timeout = 5000;
				request.ontimeout = function() {
					ajax._timeout(request);
				}
			}
		},
		"script" : {
			init : function(ajax) {
				var head = document.getElementsByTagName("head")[0];
				var script = document.createElement("script");
				script.type = "text/javascript";
				ajax.target = script;
			},
			send : function(ajax) {
				setTimeout(function() {
					var script = ajax.target;
					if(ajax.option.type === "jsonp") {
						daylight.defineGlobal(ajax.callbackName, function(data) {
							ajax._done(data, script);
							ajax._always(script);
							
							window[ajax.callbackName] = undefined;
							script.parentNode.removeChild(script);
							delete window[ajax.callbackName];
						});
					}
					var e = daylight("head, body").o[0];
					if(e) e.appendChild(script);
					script.src = ajax.url;			
				}, 1);
	
			},
			get : function() {
			},
			statechange : function(ajax) {
				var script = ajax.target;
				var self = this;
				//state변경
				script.onreadystatechange = function () {
					//loading
					//interactive
					//loaded
					//complete
					if(this.status == "loaded") {
					} 
				};
				script.onerror = function() {
					ajax._fail(script);
					ajax._always(script);
				};
				script.onload = function() {
					if(ajax.option.type != "jsonp") {
						ajax._done(script.innerHTML, script);
						ajax._always(script);
					}
				};
			}
			
		}
	};
	daylight.ajax = function(url, option) {
		var cl = arguments.callee;
		if (!(this instanceof cl)) return new cl(url, option);
	
		//옵션 초기화
		this.option = {
			autoSend : this.autoSend,
			method : this.method,
			type : this.type,
			async : this.async
		};
		this.url = url;
		//콜백함수 초기화.
		this.func = {
			done : null,
			always : null,
			fail : null,
			timeout : null,
			beforeSend : null
		}
	
		//옵션이 있는지 없는지 검사.
		if(option) {
			for(var k in option) {
				//func에 해당하는 옵션이 들어오면 func에 넣는다.
				this.func[k] === undefined? this.option[k] = option[k]: this.func[k] = option[k];
			}
		}
		this.option.method = this.option.method.toUpperCase(); 
		option = this.option;
		
		var type = option.type === "jsonp"? "script" : "ajax";//|| option.type==="script" 
		var ajaxFunc = this.ajaxFunc = _ajaxFunc[type];//해당하는 ajax 인터페이스를 가져온다.
		
		//타입에 맞게 parameter랑 url을 바꿔준다.
		this.setParameter(option.data);	
		
		ajaxFunc.init(this);//초기화.
		
		
		ajaxFunc.statechange(this);//콜백함수 설정.
	
		//ajax함수를 부르는 순간 보낼 것인가 안 보낼 것인가 결정.
		if(option.autoSend)
			this.send();
		
	}
	daylight.ajax.prototype.extend = daylight.extend;
	daylight.ajax.prototype.autoSend = true;
	daylight.ajax.prototype.method = "GET";
	daylight.ajax.prototype.type = "auto";
	daylight.ajax.prototype.async = true;
	
	
	//callback함수 모음.
	daylight.ajax.prototype.extend({
		beforeSend : function(func) {
			this.func.beforeSend = func;
			return true;
		},
		//결과가 정상적으로 완료되면 부르는 함수
		done : function(func) {
			this.func.done = func;
			return this;
		},
		//요청시간이 오바되면 부르는 함수
		timeout : function(func) {
			this.func.timeout = func;
			return this;
		},
		//요청실패하면 부르는 함수
		fail : function(func) {
			this.func.fail = func;
			return this;
		},
		//실패하든 말든 부르는 함수
		always : function(func) {
			this.func.always = func;
			return this;
		}
	});
	//콜백함수 호출하는 함수
	daylight.ajax.prototype.extend({
		_done : function(value, target) {
		
			if(this.func.done)
				this.func.done.call(target, value, target);
		},
		_fail : function(target) {
			if(this.func.fail)
				this.func.fail.call(target, target);
		},
		_timeout : function(target) {
			if(this.func.timeout)
				this.func.timeout.call(target, target);
		},
		_always : function(target) {
			if(this.func.always)
				this.func.always.call(target, target);
		}
	});
	
	daylight.ajax.prototype.get = function() {
		return this._get(this.request);
	}
	daylight.ajax.prototype.send = function() {
		if(this.func.beforeSend)
			this.func.beforeSend(this.target);
			
		this.ajaxFunc.send(this);
		
		return this;
	}
	
	//parameter관련 함수들
	daylight.ajax.prototype.extend({
		setParameter : function(data) {
	
			if(!data)
				this.param = "";
			else if(typeof data === "string")
				this.param = data;
			else if(daylight.isPlainObject(data))
				this.param = this.objectToParam(data, this.option.method);
			else if(window.FormData && data.constructor == FormData)
				this.param = data;
			else
				;//생각해 보겠음...
				
			if(this.option.type === "jsonp") {
				this.setJSONP();
				this.url += "&" + this.param;
				return;
			} else if(this.option.method === "GET") {
				var prefix = (this.url.indexOf("?") != -1) ? "&"  : "?" ;
				this.url += prefix + this.param;
			}
			
		},
		objectToParam : function(data, method) {
			var param = "";
			for (var key in data) {
			    if (param != "")
			        param += "&";
		
			    param += key + "=" + ((method=== "POST") ? encodeURI(data[key]) : data[key]);
			}
			return param;
		}
	});
	//jsonp 처리 관련.
	daylight.ajax.prototype.extend({
		setJSONP : function() {
			this.callbackName = "daylight" + parseInt(Math.random() * 1000000000);
			var prefix = (this.url.indexOf("?") != -1) ? "&"  : "?" ;
			var callback = "callback=" + this.callbackName;
	
			this.url += prefix + callback;
		}
	});

})(daylight);
(function(daylight) {
	var Draggable = window.Draggable = function(object) {
		var self = this;
		var pos = {x:"pageX", y:"pageY"};
		this._dragstart = null;
		this._drag = null;
		this._dragend = null;
		
		
		
		this._is_drag = null;
		this._prePosition = null;
		this._dragDistance = null
		this._dragElement = null;
		
		
		this.object = object;
		this._dataTransfer = {
			data: {},
			dragInfo: {x:0, y:0, is_append: false, ghostElement: null, appendTarget: null},
			setDragElement: function(element, x, y, target) {
				var dragInfo = this.dragInfo;
				dragInfo.ghostElement = element.cloneNode(true);
				dragInfo.x = x || 0;
				dragInfo.y = y || 0;
				dragInfo.ghostElement.style.cssText += "position:fixed;opacity:0.5;-webkit-opacity:0.5;-moz-opacity:0.5;z-index:20;";
				dragInfo.ghostElement.className += " day-ghost-image";
				dragInfo.is_append = false;
				dragInfo.appendTarget = target;
			},
			setDragImage: function(element, x, y, target) {
				this.setDragElement(element, x, y, target);	
			},
			setData: function(name, value) {
				this.data[name] = value;
			},
			getData: function(name) {
				return this.data[name];
			}
		};
	
		
		var mousedown = function(e) {
			if(self._is_drag)
				return;
			
	
			var prePosition = self._prePosition = daylight.$E.cross(e);
			self._dragDistance = {stx :prePosition["pageX"], sty : prePosition["pageY"], x: 0, y : 0, dx:0, dy:0, is_touch:prePosition.is_touch, is_drag: false};
			self._dragElement = e.target || e.srcElement;
			self.dragInit();
	
			self._is_drag = true;
			
			self.setInfo(e);

			if(self._dragstart)
				self._dragstart.call(this, e,  self._dataTransfer.data);
	
		}
		var mousemove = function(e) {
			if(!self._is_drag)
				return;
				
			var position = daylight.$E.cross(e);
			var dragDistance = self._dragDistance;
			dragDistance.dx = position[pos.x] - self._prePosition[pos.x];
			dragDistance.dy = position[pos.y] - self._prePosition[pos.y];
			dragDistance.x = position[pos.x] - dragDistance.stx;
			dragDistance.y = position[pos.y] - dragDistance.sty;
			self._prePosition = position;
			dragDistance.is_drag = true;
			var dragInfo = self._dataTransfer.dragInfo;
			var ghostElement = dragInfo.ghostElement;
			if(ghostElement) {
				var ghostElementX = position[pos.x] + dragInfo.x;
				var ghostElementY = position[pos.y] + dragInfo.y;
				if(!dragInfo.is_append) {
					dragInfo.is_append = true;
					if(dragInfo.appendTarget)
						dragInfo.appendTarget.appendChild(ghostElement);
					else
						daylight(self._dragElement).after(ghostElement);
				}
				ghostElement.style.cssText += "left:" + ghostElementX +"px;top:"+ghostElementY+"px;";
			}
			self.setInfo(e);

			if(self._drag)
				self._drag.call(this, e,  self._dataTransfer.data);
		}
		var mouseup = function(e) {
			if(!self._is_drag)
				return;
				
			var dragInfo = self._dataTransfer.dragInfo;
			var ghostElement = dragInfo.ghostElement;
			if(ghostElement) {
				if(dragInfo.is_append) {
					if(dragInfo.appendTarget)
						dragInfo.appendTarget.removeChild(ghostElement);
					else
						daylight(ghostElement).remove();
				}
				dragInfo.ghostElement = null;
			}
			self.setInfo(e);
			
			self._is_drag = false;		
			self._dragElement = null;
			self._dragDistance = null
			self._dragElement = null;
			
			
			if(self._dragend)
				self._dragend.call(this, e, self._dataTransfer.data);

			dragInfo.data = null;
		}
		var mouseleave = function(e) {
			if(!self._is_drag)
				return;
				
				
			if(daylight(this).has(e.target, true).size() === 0) {
				mouseup.call(this, e, self._dataTransfer.data);
				//console.log("mouseleave");
			}
				
		}
		var mouseout = function(e) {
			if(!self._is_drag)
				return;
			
	
			var target = e.toElement || e.target;
	
	
			if(daylight(this).has(target, true).size() === 0) {
				
				mouseup.call(this, e);
				//console.log("mouseOut");
			}
				
		}
		object.on("mousedown", mousedown);
		object.on("mousemove", mousemove);
		object.on("mouseup", mouseup);
		object.on("mouseleave", mouseleave);
		object.on("mouseout", mouseout);		
		
		object.on("dragcancel", function(e) {
			console.log("dragcancel");
			self._is_drag = false;
			self._dragElement = null;
			self._dragDistance = null
			self._dragElement = null;
			self._dataTransfer.dragInfo.data = null;
		});
		
		
		object.on("touchstart", mousedown);
		object.on("touchmove", mousemove);
		object.on("touchend", mouseup);
	}
	
	Draggable.prototype.setInfo = function(e) {
		var dragDistance = this._dragDistance;
		e.transfer = this._dataTransfer;
		e.dragElement = this._dragElement;
		e.stx = dragDistance.stx;
		e.sty = dragDistance.sty;
		e.dragX = dragDistance.x;
		e.dragY = dragDistance.y;
		e.dx = dragDistance.dx;
		e.dy = dragDistance.dy;
		e.daylight = true;
		e.is_touch = dragDistance.is_touch;
	}
	Draggable.prototype.dragInit = function() {
		this._dataTransfer.data = {};
		this._dataTransfer.dragInfo = {x:0, y:0, is_append: false, ghostElement: null, appendTarget: null};
	}
	Draggable.prototype.dragstart = function(func) {
		this._dragstart = func;
	}
	Draggable.prototype.drag = function(func) {
		this._drag = func;
	}
	Draggable.prototype.dragend = function(func) {
		this._dragend = func;	
	}
})(daylight);