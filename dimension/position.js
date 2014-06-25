prototype.extend({
	position: function() {
		//margin padding을 무시한 위치

		var offsetParent, offset,
			elem = this.get(0);
			parentOffset = { top: 0, left: 0 };


		// Fixed elements are offset from window (parentOffset = {top:0, left: 0}, because it is its only offset parent
		if ( _curCss(elem, "position") === "fixed" ) {
			offset = elem.getBoundingClientRect();
		} else {
			offsetParent = this.offsetParent();
			offset = this.offset();
			var elOffset = offsetParent.get(0);
			if(!elOffset)
				return;

			if ( !daylight.nodeName(elOffset, "html" ) ) {
				parentOffset = offsetParent.offset();
		
			}
			// Add offsetParent borders
			parentOffset.top += _curCss(elOffset, "borderTop") == 0 ? 0 : daylight.css(elOffset, "borderTopWidth", true );
			parentOffset.left +=  _curCss(elOffset, "borderLeft") == 0 ? 0 : daylight.css(elOffset, "borderLeftWidth", true );
			//parentOffset.top -= daylight.css( offsetParent.o[0], "paddingTop", true );
			//parentOffset.left -= daylight.css( offsetParent.o[0], "paddingLeft", true );
			parentOffset.top -= daylight.css(elOffset, "marginTop", true );
			parentOffset.left -= daylight.css(elOffset, "marginLeft", true );			
			//console.log(daylight.css( offsetParent.o[0], "marginTop"));
		}

		return {
			top: offset.top - parentOffset.top - daylight.css( elem, "marginTop", true ),
			left: offset.left - parentOffset.left - daylight.css( elem, "marginLeft", true )
		};

	}
	//reference to jQuery offset
	,offset: function() {
		//contents의 위치
		var element = this.get(0);
		var box = { top: 0, left: 0 };
		if(!element)
			return box;
		
		var win = window;
		var doc = document;
		var docElem = docElem = doc.documentElement;
		if(element.getBoundingClientRect)
			box = element.getBoundingClientRect();

		return {
			top: box.top + (win.pageYOffset || 0) - (docElem.clientTop || 0),
			left: box.left + (win.pageXOffset || 0) - (docElem.clientLeft || 0)
		};
	}
});
