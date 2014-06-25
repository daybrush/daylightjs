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

var daylight = window.$o = function(obj, element) {
	var type = _checkType(obj);
	switch(type) {
	case "string":
		return $o.query(obj, element);
	case "nodelist":
		return obj;
	case "element":
	case "htmlcollection":
		return new ElementList(obj);
	default:
		throw new Error("Not Available : " + type);
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
daylight.extend = function(target, object) {
	for(var key in object) {
		if(target.hasOwnProperty(key))
			continue;
			
		target[key] = object[key];
	}
}
daylight.extend(daylight, {
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
daylight.extend(daylight, {
	searchByQuery: this.query,
	searchByClass: this.class,
	searchById: this.id,
	searchByName: this.name
	
});
//define
//define 관련 함수들 모음
daylight.extend(daylight, {
	//해당 함수를 선언합니다.
	define : function(object, name, func) {
		var type = typeof object;
		if(type === "object" && object.__proto__)
			object.__proto__[name] = func;
		else if(daylight.index(["function", "object"], type) != -1 && object.prototype)
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
		var typeName = this.type(name);
		if(typeName === "string")
			window[name] = o;
	},
	//자바나 C++에서의 overload 구현.
	overload: function() {
		var args = arguments;
		var methods = {};
		for(var i = 0; i < args.length; ++i) {
			var obj = args[i];
			var type = this.type(obj);
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
				
				
			var arr = daylight.map(args2, function(value) {var type = daylight.type(value);
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
daylight.extend(daylight, {
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
	}
});

//each, has, map, filter
prototype.each = function(callback) {
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
prototype.has = function(obj, isContainMine) {
	
}


//attributes
prototype.setAttribute = function(name, value) {
	this.each(function(obj) {
		obj.setAttribute? obj.setAttribute(name, value) : obj[name] = value;
	});
	
	return this;
}
prototype.getAttribute = function(name) {
	var o = this[0];
	if(typeof o !== "object")	
		return;
		
	return  o.getAttribute ? o.getAttribute(name) : o[name];
}

prototype.attr = function(name, value) {
	var length = arguments.length;
	if(length >= 2)
		return prototype.setAttribute(name, value);
	
	if(length !== 1)
		return;

	return prototype.getAttribute(name);
}
daylight.extend(daylight, {
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

		
		for(var i = 0; i < length; ++i) {
			var eClass = arr[i];
			if(eClass === className)
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
prototype.addClass = function() {
	
}
prototype.removeClass = function() {
	
}
prototype.toggleClass = function() {
	
}
prototype.getClass = function() {
	
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
prototype.on = function(key, func, type) {
	if(func) {
		this.forEach(function(ele) {
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
"scroll load dblclick click mousedown mousemove mouseup mouseleave focus keydown keypress keyup select selectstart resize".split(" ").forEach(function(name, index, arr) {
	if(typeof name !== "string")
		return;
		
	prototype[name] = function(func) {
		this.on(name, func);
		return this;
	}
});

daylight.extend(daylight, {
	wheel: function(func) {
		this.on("DOMMouseScroll", func);
		this.on("mousewheel", func);
	},
	ready: function(func) {
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

	}
})


var window = window.window;
daylight.extend(prototype, {
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

//dimension



daylight.extend(prototype, {
	before : function(e) {
		var is_element = daylight.isElement(e);//type 검사
		if(!is_element && _type(e) != sDaylight) {
			this.insertHTML("beforebegin", e); 
			return this;
		}
		_addDomEach(this, e, function(target, element) {
			if(daylight.isElement(target) && target.parentNode)
				target.parentNode.insertBefore(element, target);
		});
		return this;
	},
	prepend : function(e) {
		var is_element = daylight.isElement(e);//type 검사
		if(!is_element && _type(e) != sDaylight) {
			this.insertHTML("afterbegin", e);
			return this;
		}
		_addDomEach(this, e, function(target, element) {
			if(daylight.isElement(target))
				target.insertBefore(element, target.firstChild);
		});
		return this;
	},
	append : function(obj) {
		var is_element = daylight.isElement(obj);//type 검사
		if(!is_element && _type(obj) != sDaylight) {
			this.insertHTML("beforeend", obj);
			return this;
		}
		_addDomEach(this, obj, function(target, element) {
			if(daylight.isElement(target))
				target.appendChild(element);
		});
		return this;
		
	},
	after : function(e) {
		var is_element = daylight.isElement(e);//type 검사
		if(!is_element && _type(e) != sDaylight) {
			this.insertHTML("afterend", e);
			return this;
		}
		_addDomEach(this, e, function(target, element) {
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

		if(this.o[0] === undefined)
			return;
		return this.o[0].innerHTML;
	},
	text : function(value) {
		if(!(value === undefined)) {
			this.each(function() {
				this.innerText = value;
			});
			return this;
		}
		if(this.o[0] === undefined)
			return;
		return this.o[0].innerText;
	},
	ohtml: function(value) {
		if(!(value === undefined)) {
			this.each(function() {
				this.outerHTML = value;
			});
		}
		if(this.o[0] === undefined)
			return;
		return this.o[0].outerHTML;
	}
});

/**
* @func : daylight.template(object, template)
* @param : object(Array, Object), template(String, Daylight)
* @return : html(String)
*/
daylight.template = function(obj, template) {
	var type = this.type(obj);
	var templateType = this.type(template);
	
	if(templateType === sDaylight)
		template = template.ohtml();//html 형태로 변환
		
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
				if(value === undefined)
					value = "";
				template = daylight.replace("{" + k + "}", value, template);//{key} => value
			}
		}
		//console.log(template);
		return template;
	} else {
		//배열이나 Dictionary 형태가 아닌 다른 것들은 키를 1로 하고 value로 바꿔준다.
		return daylight.replace("{1}", obj, template);//{1} => value
	}
	return "";
}



prototype.template = function(o, t) {
	this.html(daylight.template(o, t));
	return this;
}





daylight.extend(NodeListPrototype, prototype);
daylight.extend(ElementListPrototype, prototype);

})(window);
