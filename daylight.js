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


	daylight.serachQuery = daylight.query = function(query, element) {
		element = element || document;
		return element.querySelectorAll(query);
	};
	daylight.serachClass = daylight.class = function(className, element) {
		element = element || document;
		return element.getElementsByClassName(className);
	}
	daylight.seachId = daylight.id = function(id) {
		return new ElementList(document.getElementById(id));
	}
	daylight.searchName = daylight.name = function(name, element) {
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
	daylight.extedn(daylight, {
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

	daylight.extend(NodeListPrototype, prototype);
	
	
	
})(window);
