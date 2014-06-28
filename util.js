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
		if(type === sArray || type === sNodeList || type === sElementList) {
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
		if(type === sArray || type === sNodeList || type === sElementList) {
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