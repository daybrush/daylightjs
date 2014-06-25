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