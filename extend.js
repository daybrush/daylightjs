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
daylight.extend(true, NodeListPrototype, prototype);
daylight.extend(true, ElementListPrototype, prototype);