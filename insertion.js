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
		_addDomEach(this,obje, function(target, element) {
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