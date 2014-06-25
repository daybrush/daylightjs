prototype.each = function(callback) {
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
prototype.has = function(obj, isContainMine) {
	
}