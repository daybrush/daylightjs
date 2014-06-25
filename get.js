prototype.extend({
	index: function(object) {
		var type = daylight.type(object);
		if(type === sDaylight)
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
			return this;
			
		var length = this.length;	
		if(length === 0)
			return;
			
		while(index < 0) {index = length + index;}
		while(index >= this.length) {index = index - length;}
		
		return this[index];
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
	},
	empty: function() {
		return (this.length === 0);
	}
});