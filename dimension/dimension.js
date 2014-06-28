prototype.extend({
	dimension : function(type) {
		var sType = daylight.type(type);
		var name;
		if(sType === "number")
			name = type === 1 ? "width" : "height";
		else name = type;
		
		
		var element = this.get(0);
		if(!element)
			return 0;
		
		var offset_parent = element.offsetParent;
		var element_styles = _style(offset_parent);
		var dimension = _curCssHook(offset_parent, name, element_styles);
		return dimension;
		
	},
	
	style : function(name) {
		var o = this.get(0);
		if(!daylight.isElement(o))
			return;
		
		return o.style[name];
	}
});

//demension 관련 함수들  width, height, innerWidth, innerHeight, outerWidth, outerHeight
daylight.each(["Width", "Height"], function(name) {
	if(typeof name !== "string")
		return;
		
	
	var lowerName = name.toLowerCase();
	var requestComponent = name === "Width" ? ["left", "right"] : ["top", "bottom"];
	prototype[lowerName] = function() {
		if(this[lowerName] > 0)
			return this[lowerName];
			
		var currentStyle = this.style();
		var o = this.get(0);
		var dimension = 0;
		
		if(!o)
			return;
			
		if(o["client" + name] > 0) {
			dimension = o["client" + name];
		
		var cssHooks = _style(o);
		
		dimension -= parseFloat(_curCss(o, "padding-" + requestComponent[0], cssHooks));
		
		dimension -= parseFloat(_curCss(o, "padding-" + requestComponent[1], cssHooks));
			
			return dimension;
		}
		var dimension = o["offset" + name];
		var cssHooks = _style(o);
		dimension -= parseFloat(_curCss(o, "padding-" + requestComponent[0], cssHooks));
		dimension -= parseFloat(_curCss(o, "padding-" + requestComponent[1], cssHooks));
		dimension -= parseFloat(_curCss(o, "border-" + requestComponent[0] + "-width", cssHooks));
		dimension -= parseFloat(_curCss(o, "border-" + requestComponent[1] + "-width", cssHooks));

		return dimension;
	}
	prototype["inner" + name] = function() {
		var o = this.get(0);
		
		if(!o)
			return;

		if(o["inner" + name] > 0)
			return o["inner" + name]

		//if(o["client" + name] > 0)
		//	return o["client" + name]



		var dimension = o["offset" + name];
		var cssHooks = _style(o);
		dimension -= parseFloat(_curCss(o, "border-" + requestComponent[0] + "-width", cssHooks));
		dimension -= parseFloat(_curCss(o, "border-" + requestComponent[1] + "-width", cssHooks));
		
		return dimension;
	}
	prototype["outer" + name] = function(bInlcudeMargin) {
		var currentStyle = this.style();
		var o = this.get(0);

		if(!o)
			return;


		var dimension = o["offset" + name] || o["outer" + name];
		
		if(bInlcudeMargin) {
			var cssHooks = _style(o);
			dimension += parseFloat(_curCss(o, "margin-" + requestComponent[0], cssHooks)) + parseFloat(_curCss(o, "margin-" + requestComponent[1], cssHooks));
		}
		return dimension;
	}
	prototype["scroll" + name] = function(bInlcudeMargin) {
		//var currentStyle = this.style();
		var o = this.get(0);

		if(!o)
			return;


		var dimension = o["scroll" + name];
		
		return dimension;
	}
});