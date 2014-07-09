
var _touch = function(e) {
	var te = {};
	if (e.touches) {
		te.changes = e.changedTouches;
		te.touches = e.touches;
		te.length = te.touches.length;
	}
	return te;
}, _pos = function (e, bGetOffset) {
	var body = document.body;
	var documentElement = document.documentElement;
	var left = body.scrollLeft || documentElement.scrollLeft;
	var top = body.scrollTop || documentElement.scrollTop;
	
	var pos = {
		clientX : e.clientX,
		clientY : e.clientY,
		pageX   : e.pageX,
		pageY   : e.pageY,
		layerX  : e.offsetX || e.layerX,
		layerY  : e.offsetY || e.layerY, //ie6 layerY
		screenX : e.screenX,
		screenY : e.screenY
	};
	return pos;
}, _touchOne = function(e) {

	if (e.touches) {
		var xy = (e.type === "touchend") ? _pos(e.changedTouches[0]) : _pos(e.touches[0]);
		return xy;
	}
	return {};
}


/*
	reference to jindo.$Event
*/
daylight.Event = daylight.$Event = function(e) {
	var callee = arguments.callee;
	if (e instanceof callee) return e;
	if (!(this instanceof callee)) return new callee(e);
	
	if(e === undefined) e = window.event;
	var element = e.target || e.srcElement;


	if (element.nodeType == 3) //Text
		element = element.parentNode;
		
			
	var currentElement = e.currentTarget || element;
	
	this.target = this.element = element;
	this.currentElement = currentElement;
	this.type = e.type;
	this._event = e;
}
var eventPrototype = daylight.$Event.prototype
eventPrototype.preventDefualt = function() {
	this._event.preventDefault();
}
eventPrototype.pos = function(bGetOffset) {
	return _pos(this._event, bGetOffset);
}
eventPrototype.mouse = function(bGetOffset) {
	return _pos(this._event, bGetOffset);
}
eventPrototype.touch = function(e) {
	return _touch(this._event);
}
eventPrototype.cross = function(e) {
	return daylight.$E.cross(this._event);
}

//reference to jindo.desktop.all.ns.js => jindo.$Event.prototype.key
eventPrototype.key = function() {
	var e = this._event;
	var keyCode = e.keyCode || e.charCode;
	var ret   = {
		keyCode		: keyCode,
		alt			: e.altKey,
		ctrl		: e.ctrlKey,
		meta		: e.metaKey,
		shift		: e.shiftKey,
		up			: (keyCode == 38),
		down		: (keyCode == 40),
		left		: (keyCode == 37),
		right		: (keyCode == 39),
		enter		: (keyCode == 13),	
		space		: (keyCode == 32),	
		esc			: (keyCode == 27),
		command		: (keyCode == 91),
		character	: String.fromCharCode(keyCode)
	};
	if(ret.up)
		ret.character = "up";
	else if(ret.down)
		ret.character = "down";
	else if(ret.left)
		ret.character = "left";
	else if(ret.right)
		ret.character = "right";
	else if(ret.space)
		ret.character = "space";
		
	switch(keyCode) {
	case 187: ret.character = "=";break;
	case 189: ret.character = "-";break;
	case 222: ret.character = "'";break;
	}
	return ret;
};

daylight.$E = {
	pos : function(e) {return _pos(e); },
	touch : function(e) {return _touch(e);},
	cross : function(e) {
		var is_touch = e.touches !== undefined;
		var pos = {};
		if(is_touch) pos = _touchOne(e);
		else pos = _pos(e);
		
		pos.is_touch = is_touch;
		return pos;
		
	}
}
