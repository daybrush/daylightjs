prototype.ready = function(func) {
	function listener(e) {
		if (e && e.readyState  || this.readyState === "interactive") {
			func.call(this, e);
		}
	};
	this.each(function() {
		if(this.readyState === "interactive" || this.readyState === "complete")
			listener({readyState : "interactive"});
	});
	
	this.on("readystatechange", listener);

};