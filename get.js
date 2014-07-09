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