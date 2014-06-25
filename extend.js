daylight.extend({
	searchByQuery: this.query,
	searchByClass: this.class,
	searchById: this.id,
	searchByName: this.name,
	type: _checkType,
	checkType: _checkType
});

prototype.extend({
	isEmpty: this.empty
});
daylight.extend(true, NodeListPrototype, prototype);
daylight.extend(true, ElementListPrototype, prototype);