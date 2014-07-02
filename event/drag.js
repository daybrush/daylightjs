daylight.extend(true, prototype, {
	dragEvent: function(e, dragDistance, dataTransfer, dragObject) {
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
		extra.transfer = dataTransfer;
		return extra;
	},
	dr1ag: function(dragFunc) {
		var dragObject = null;
		var is_drag = false;
		var is_move = false;
		var dragDistance = {x : 0, y : 0};
		var dataTransfer = {
			data: {},
			dragInfo: {x:0, y:0, is_append: false, dragElement: null},
			setDragElement: function(element, x, y) {
				var dragInfo = this.dragInfo;
				dragInfo.dragElement = element.cloneNode(true);
				dragInfo.x = x || 0;
				dragInfo.x = y || 0;
				dragInfo.dragElement.style.cssText += "position:fixed;opacity:0.5;-webkit-opacity:0.5;-moz-opacity:0.5;z-index:20;";
				dragInfo.dragElement.className += " day-ghost-element";
				dragInfo.is_append = false;
			},
			setDragImage: function(element, x, y) {
				this.setDragElement(element, x, y);
				
			},
			setData: function(name, value) {
				this.data[name] = value;
			},
			getData: function(name) {
				return this.data[name];
			}
		};
		var prePosition = null;
		var self = this;
		var bObject = daylight.isPlainObject(dragFunc);
		var bFunction = daylight.isFunction(dragFunc);
		var bScreenPosition = false;
		var bStopProgation = bObject && dragFunc.stopProgation;
		var pos = {x:"pageX", y:"pageY"};
		
	
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
			dragDistance = {stx :prePosition[pos.x], sty : prePosition[pos.y], x : 0, y : 0, dx:0, dy:0, is_touch:prePosition.is_touch, is_drag: false};
			
			dataTransfer.data = {};
			dataTransfer.dragInfo = {x:0, y:0, is_append: false, dragElement: null};
			
			dragObject = e.target || e.srcElement;
			
			is_drag = true;
			is_move = false;
			
			var extra = self.dragEvent(e, dragDistance, dataTransfer, dragObject);
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
			
			var dragInfo = dataTransfer.dragInfo;
			var dataTransferDragElement = dragInfo.dragElement;
			if(dataTransferDragElement) {
				console.log("draggable");
				var dragElementX = position[pos.x] + dragInfo.x;
				var dragElementY = position[pos.y] + dragInfo.y;
				if(!dragInfo.is_append) {
					dragInfo.is_append = true;
					this.appendChild(dataTransferDragElement);
					console.log("append");
				}
				dataTransferDragElement.style.cssText += "left:" + dragElementX +"px;top:"+dragElementY+"px;";
			}

			var extra = self.dragEvent(e, dragDistance, dataTransfer, dragObject);
			var returnValue = daylight.trigger(this, "drag", extra);
			
			
			if(returnValue === false) {
				if(e.preventDefault) e.preventDefault();
				e.returnValue = false;
			}
		};
		var mouseUp = function(e) {
			if(!is_drag)
				return;
			
			var dragInfo = dataTransfer.dragInfo;
			var dataTransferDragElement = dragInfo.dragElement;
			if(dataTransferDragElement) {
				if(dragInfo.is_append) {
					this.removeChild(dataTransferDragElement);
				}
				dragInfo.dragElement = null;
			}
			is_drag = false;
			
			var extra = self.dragEvent(e, dragDistance, dataTransfer, dragObject);
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
		var mouseOut = function(e) {
			if(!is_drag)
				return;
			

			var target = e.toElement || e.target;


			if(daylight(this).has(target, true).size() === 0) {
				
				mouseUp.call(this, e);
				console.log("mouseOut");
			}
		}
		this.on("mousedown", mouseDown);
		this.on("mousemove", mouseMove);
		this.on("mouseup", mouseUp);
		this.on("mouseleave", mouseLeave);
		this.on("mouseout", mouseOut);		
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
	},
	draggable: function(dragFunc) {
		var dragObject = null;
		var is_drag = false;
		var is_move = false;
		var dragDistance = {x : 0, y : 0};
		var dataTransfer = {
			data: {},
			dragInfo: {x:0, y:0, is_append: false, dragElement: null},
			setDragElement: function(element, x, y) {
				var dragInfo = this.dragInfo;
				dragInfo.dragElement = element.cloneNode(true);
				dragInfo.x = x || 0;
				dragInfo.x = y || 0;
				dragInfo.dragElement.style.cssText += "position:fixed;opacity:0.5;-webkit-opacity:0.5;-moz-opacity:0.5;z-index:20;";
				dragInfo.dragElement.className += " day-ghost-element";
				dragInfo.is_append = false;
			},
			setDragImage: function(element, x, y) {
				this.setDragElement(element, x, y);
				
			},
			setData: function(name, value) {
				this.data[name] = value;
			},
			getData: function(name) {
				return this.data[name];
			}
			
		};
		var prePosition = null;
		var self = this;
		var bObject = daylight.isPlainObject(dragFunc);
		var bFunction = daylight.isFunction(dragFunc);
		var bScreenPosition = false;
		var bStopProgation = bObject && dragFunc.stopProgation;
		var pos = {x:"pageX", y:"pageY"};
		
	
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
			dragDistance = {stx :prePosition[pos.x], sty : prePosition[pos.y], x : 0, y : 0, dx:0, dy:0, is_touch:prePosition.is_touch, is_drag: false};
			
			dataTransfer.data = {};
			dataTransfer.dragInfo = {x:0, y:0, is_append: false, dragElement: null};
			
			dragObject = e.target || e.srcElement;
			
			is_drag = true;
			is_move = false;
			
			var extra = self.dragEvent(e, dragDistance, dataTransfer, dragObject);
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
			
			var dragInfo = dataTransfer.dragInfo;
			var dataTransferDragElement = dragInfo.dragElement;
			if(dataTransferDragElement) {
				console.log("draggable");
				var dragElementX = position[pos.x] + dragInfo.x;
				var dragElementY = position[pos.y] + dragInfo.y;
				if(!dragInfo.is_append) {
					dragInfo.is_append = true;
					this.appendChild(dataTransferDragElement);
					console.log("append");
				}
				dataTransferDragElement.style.cssText += "left:" + dragElementX +"px;top:"+dragElementY+"px;";
			}

			var extra = self.dragEvent(e, dragDistance, dataTransfer, dragObject);
			var returnValue = daylight.trigger(this, "drag", extra);
			
			
			if(returnValue === false) {
				if(e.preventDefault) e.preventDefault();
				e.returnValue = false;
			}
		};
		var mouseUp = function(e) {
			if(!is_drag)
				return;
			
			var dragInfo = dataTransfer.dragInfo;
			var dataTransferDragElement = dragInfo.dragElement;
			if(dataTransferDragElement) {
				if(dragInfo.is_append) {
					this.removeChild(dataTransferDragElement);
				}
				dragInfo.dragElement = null;
			}
			is_drag = false;
			
			var extra = self.dragEvent(e, dragDistance, dataTransfer, dragObject);
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
		var mouseOut = function(e) {
			if(!is_drag)
				return;
			

			var target = e.toElement || e.target;


			if(daylight(this).has(target, true).size() === 0) {
				
				mouseUp.call(this, e);
				console.log("mouseOut");
			}
		}
		this.on("mousedown", mouseDown);
		this.on("mousemove", mouseMove);
		this.on("mouseup", mouseUp);
		this.on("mouseleave", mouseLeave);
		this.on("mouseout", mouseOut);		
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