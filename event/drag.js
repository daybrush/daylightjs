daylight.extend(true, prototype, {
	dragEvent: function(e, dragDistance, dragObject) {
		//console.log(e.constructor);
		var extra = {};
		extra = e;
		extra.dragInfo = dragDistance;
		extra.dragElement = event.dragObject = dragObject;
		extra.stx = dragDistance.stx;
		extra.sty = dragDistance.sty;
		extra.dragX = dragDistance.x;
		event.dragY = dragDistance.y;
		extra.dx = dragDistance.dx;
		extra.dy = dragDistance.dy;
		extra.daylight = true;
		extra.is_touch = dragDistance.is_touch;
		
	
		return extra;
	},
	drag: function(dragFunc) {
		var dragObject = null;
		var is_drag = false;
		var is_move = false;
		var dragDistance = {x : 0, y : 0};
		var prePosition = null;
		var self = this;
		var bObject = daylight.isPlainObject(dragFunc);
		var bFunction = daylight.isFunction(dragFunc);
		var bScreenPosition = false;
		var bStopProgation = bObject && dragFunc.stopProgation;
		var pos;
		
	
		var mouseDown = function(e) {
			if(e.type === "touchstart") {
				var touches = e.touches;
				if(touche.length > 1) {
					if(is_move === false) {
						is_drag = false;
					}
				}
			}
			prePosition = daylight.$E.cross(e);
			isScreenPosition = prePosition.screenX !== undefined;
			pos = bScreenPosition ? {x:"screenX", y:"screenY"} : {x:"pageX", y:"pageY"};
			dragDistance = {stx :prePosition[pos.x], sty : prePosition[pos.y], x : 0, y : 0, dx:0, dy:0, is_touch:prePosition.is_touch, is_drag: false};
			dragObject = e.target || e.srcElement;
			
			is_drag = true;
			is_move = false;
			
			var extra = self.dragEvent(e, dragDistance, dragObject);
			var returnValue = daylight.trigger(this, "dragstart", extra);
	
			if(returnValue === false) {
				if(e.preventDefault) e.preventDefault();
				e.returnValue = false;
			}
		};
		var mouseMove = function(e) {
			if(!is_drag)
				return;
			is_move = true;
			var position = daylight.$E.cross(e);
			
			dragDistance.dx = position[pos.x] - prePosition[pos.x];
			dragDistance.dy = position[pos.y] - prePosition[pos.y];
			dragDistance.x = position[pos.x] - dragDistance.stx;
			dragDistance.y = position[pos.y] - dragDistance.sty;
	
			prePosition = position;
			
			dragDistance.is_drag = true;
			
			
			var extra = self.dragEvent(e, dragDistance, dragObject);
			var returnValue = daylight.trigger(this, "drag", extra);
			
			
			if(returnValue === false) {
				if(e.preventDefault) e.preventDefault();
				e.returnValue = false;
			}
		};
		var mouseUp = function(e) {
			if(!is_drag)
				return;
			
	
			is_drag = false;
			
			var extra = self.dragEvent(e, dragDistance, dragObject);
			var returnValue = daylight.trigger(this, "dragend", extra);
				
				
			dragObject = null;
		}
		var mouseLeave = function(e) {
			if(!is_drag)
				return;
			
			
			if(daylight(this).has(e.target, true).size() === 0) {
				mouseUp.call(this, e);
				console.log("mouseleave");
			}
		}
		this.on("mousedown", mouseDown);
		this.on("mousemove", mouseMove);
		this.on("mouseup", mouseUp);
		this.on("mouseleave", mouseLeave);
		
		this.on("dragcancel", function(e) {
			//var event = self.dragEvent("drag", e, dragDistance, dragObject);
			is_drag = false;
			dragObject = null;
		});
		
		if(!bObject || bObject && !dragFunc.isOnlyMouse) {
			this.on("touchstart", mouseDown);
			this.on("touchmove", mouseMove);
			this.on("touchend", mouseUp);
		}
		
		return this;
	}
});