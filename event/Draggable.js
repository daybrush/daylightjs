(function(daylight) {
	var Draggable = window.Draggable = function(object) {
		var self = this;
		var pos = {x:"pageX", y:"pageY"};
		this._dragstart = null;
		this._drag = null;
		this._dragend = null;
		
		
		
		this._is_drag = null;
		this._prePosition = null;
		this._dragDistance = null
		this._dragElement = null;
		
		
		this.object = object;
		this._dataTransfer = {
			data: {},
			dragInfo: {x:0, y:0, is_append: false, ghostElement: null},
			setDragElement: function(element, x, y) {
				var dragInfo = this.dragInfo;
				dragInfo.ghostElement = element.cloneNode(true);
				dragInfo.x = x || 0;
				dragInfo.y = y || 0;
			
				dragInfo.ghostElement.style.cssText += "position:fixed;opacity:0.5;-webkit-opacity:0.5;-moz-opacity:0.5;z-index:20;";
				dragInfo.ghostElement.className += " day-ghost-image";
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
	
		
		var mousedown = function(e) {
			if(self._is_drag)
				return;
			
	
			var prePosition = self._prePosition = daylight.$E.cross(e);
			self._dragDistance = {stx :prePosition["pageX"], sty : prePosition["pageY"], x: 0, y : 0, dx:0, dy:0, is_touch:prePosition.is_touch, is_drag: false};
			self._dragElement = e.target || e.srcElement;
			self.dragInit();
	
			self._is_drag = true;
			
			self.setInfo(e);
			//console.log("DRAGGABLE dragstart", e);
			if(self._dragstart)
				self._dragstart.call(this, e,  self._dataTransfer.data);
	
		}
		var mousemove = function(e) {
			if(!self._is_drag)
				return;
				
			var position = daylight.$E.cross(e);
			var dragDistance = self._dragDistance;
			dragDistance.dx = position[pos.x] - self._prePosition[pos.x];
			dragDistance.dy = position[pos.y] - self._prePosition[pos.y];
			dragDistance.x = position[pos.x] - dragDistance.stx;
			dragDistance.y = position[pos.y] - dragDistance.sty;
			self._prePosition = position;
			dragDistance.is_drag = true;
			var dragInfo = self._dataTransfer.dragInfo;
			var ghostElement = dragInfo.ghostElement;
			if(ghostElement) {
				var ghostElementX = position[pos.x] + dragInfo.x;
				var ghostElementY = position[pos.y] + dragInfo.y;
				if(!dragInfo.is_append) {
					dragInfo.is_append = true;
					self._dragElement.appendChild(ghostElement);
					//console.log("append");
				}
				ghostElement.style.cssText += "left:" + ghostElementX +"px;top:"+ghostElementY+"px;";
			}
			self.setInfo(e);
			if(self._drag)
				self._drag.call(this, e,  self._dataTransfer.data);	
		}
		var mouseup = function(e) {
			if(!self._is_drag)
				return;
				
			var dragInfo = self._dataTransfer.dragInfo;
			var ghostElement = dragInfo.ghostElement;
			if(ghostElement) {
				if(dragInfo.is_append) {
					self._dragElement.removeChild(ghostElement);
				}
				dragInfo.ghostElement = null;
			}
			self.setInfo(e);

			if(self._dragend)
				self._dragend.call(this, e, self._dataTransfer.data);
				
			self._is_drag = false;		
			self._dragElement = null;
			self._dragDistance = null
			self._dragElement = null;
			
		}
		var mouseleave = function(e) {
			if(!self._is_drag)
				return;
				
				
			if(daylight(this).has(e.target, true).size() === 0) {
				mouseup.call(this, e, self._dataTransfer.data);
				//console.log("mouseleave");
			}
				
		}
		var mouseout = function(e) {
			if(!self._is_drag)
				return;
			
	
			var target = e.toElement || e.target;
	
	
			if(daylight(this).has(target, true).size() === 0) {
				
				mouseup.call(this, e);
				//console.log("mouseOut");
			}
				
		}
		object.on("mousedown", mousedown);
		object.on("mousemove", mousemove);
		object.on("mouseup", mouseup);
		object.on("mouseleave", mouseleave);
		object.on("mouseout", mouseout);		
		
		object.on("dragcancel", function(e) {
			mouseup.call(this, e);
		});
		
		
		object.on("touchstart", mousedown);
		object.on("touchmove", mousemove);
		object.on("touchend", mouseup);
	}
	
	Draggable.prototype.setInfo = function(e) {
		var dragDistance = this._dragDistance;
		e.transfer = this._dataTransfer;
		e.dragElement = this._dragElement;
		e.stx = dragDistance.stx;
		e.sty = dragDistance.sty;
		e.dragX = dragDistance.x;
		e.dragY = dragDistance.y;
		e.dx = dragDistance.dx;
		e.dy = dragDistance.dy;
		e.daylight = true;
		e.is_touch = dragDistance.is_touch;
	}
	Draggable.prototype.dragInit = function() {
		this._dataTransfer.data = {};
		this._dataTransfer.dragInfo = {x:0, y:0, is_append: false, ghostElement: null};
	}
	Draggable.prototype.dragstart = function(func) {
		this._dragstart = func;
	}
	Draggable.prototype.drag = function(func) {
		this._drag = func;
	}
	Draggable.prototype.dragend = function(func) {
		this._dragend = func;	
	}
})(daylight);