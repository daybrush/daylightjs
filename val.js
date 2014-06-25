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