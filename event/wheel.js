
"scroll load dblclick click mousedown mouseover mousemove mouseup mouseleave focus keydown keypress keyup select selectstart resize".split(" ").forEach(function(name, index, arr) {
	if(typeof name !== "string")
		return;
		
	prototype[name] = function(func) {
		this.on(name, func);
		return this;
	}
});

prototype.extend({
	wheel: function(func) {
		this.on("DOMMouseScroll", func);
		this.on("mousewheel", func);
	}
});