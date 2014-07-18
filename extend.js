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
